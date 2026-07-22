import type { Core } from "@strapi/strapi";
import { canUserManageAbsences } from "../../../utils/absence-delegation";
import { getAuthorizedCatSheetDocumentIds } from "../../../utils/adoption-request";

type DashboardRole = "Admin" | "Volunteer";
type AuthUser = { id: number };
type Filters = Record<string, unknown>;

const CAT_UID = "api::cat.cat" as any;
const CAT_SHEET_UID = "api::cat-sheet.cat-sheet" as any;
const ADOPTION_REQUEST_UID = "api::adoption-request.adoption-request" as any;
const CONVERSATION_UID = "api::chat-conversation.chat-conversation" as any;
const ABSENCE_UID = "api::absence.absence" as any;
const BLOG_POST_UID = "api::blog-post.blog-post" as any;

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const TREND_DAYS = 30;
const ACTIVE_CONVERSATION_DAYS = 7;
const OVERDUE_REQUEST_DAYS = 7;
const UPCOMING_ABSENCE_DAYS = 30;
const PRIORITY_ABSENCE_DAYS = 14;
const MAX_LIST_ITEMS = 6;

const parisDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Paris",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const getParisDateKey = (value: string | number | Date) =>
  parisDateFormatter.format(new Date(value));

const getTrendDateKeys = (now: Date) =>
  Array.from({ length: TREND_DAYS }, (_, index) =>
    getParisDateKey(now.getTime() - (TREND_DAYS - index - 1) * DAY_IN_MS),
  );

const withCatSheetScope = (
  filters: Filters,
  catSheetDocumentIds: string[] | null,
): Filters => {
  if (catSheetDocumentIds === null) {
    return filters;
  }

  return {
    ...filters,
    catSheet: {
      documentId: {
        $in: catSheetDocumentIds,
      },
    },
  };
};

const getCatCounts = async (
  strapi: Core.Strapi,
  catSheetDocumentIds: string[] | null,
) => {
  if (catSheetDocumentIds === null) {
    const [total, refuge, foster, inCare, adopted] = await Promise.all([
      strapi.documents(CAT_UID).count({}),
      strapi
        .documents(CAT_UID)
        .count({ filters: { catStatus: { $eq: "en_refuge" } } }),
      strapi
        .documents(CAT_UID)
        .count({ filters: { catStatus: { $eq: "en_famille_accueil" } } }),
      strapi
        .documents(CAT_UID)
        .count({ filters: { catStatus: { $eq: "en_soins" } } }),
      strapi
        .documents(CAT_UID)
        .count({ filters: { catStatus: { $eq: "adopte" } } }),
    ]);

    return {
      total,
      adoptable: refuge + foster,
      refuge,
      foster,
      inCare,
      adopted,
    };
  }

  if (catSheetDocumentIds.length === 0) {
    return {
      total: 0,
      adoptable: 0,
      refuge: 0,
      foster: 0,
      inCare: 0,
      adopted: 0,
    };
  }

  const sheets = await strapi.documents(CAT_SHEET_UID).findMany({
    filters: { documentId: { $in: catSheetDocumentIds } },
    fields: ["documentId"],
    populate: {
      cats: {
        fields: ["documentId", "catStatus"],
      },
    },
    pagination: { page: 1, pageSize: 1000 },
  });

  const catsByDocumentId = new Map<string, any>();
  sheets.forEach((sheet: any) => {
    (sheet.cats ?? []).forEach((cat: any) =>
      catsByDocumentId.set(cat.documentId, cat),
    );
  });

  const cats = Array.from(catsByDocumentId.values());
  const countStatus = (status: string) =>
    cats.filter((cat) => cat.catStatus === status).length;
  const refuge = countStatus("en_refuge");
  const foster = countStatus("en_famille_accueil");

  return {
    total: cats.length,
    adoptable: refuge + foster,
    refuge,
    foster,
    inCare: countStatus("en_soins"),
    adopted: countStatus("adopte"),
  };
};

const getRequestSummary = async (
  strapi: Core.Strapi,
  catSheetDocumentIds: string[] | null,
  now: Date,
) => {
  if (catSheetDocumentIds?.length === 0) {
    return {
      counts: { total: 0, pending: 0, inReview: 0, overdue: 0 },
      trend: getTrendDateKeys(now).map((date) => ({ date, submitted: 0 })),
      priorityRequests: [],
      recentRequests: [],
    };
  }

  const scopeFilters = (filters: Filters) =>
    withCatSheetScope(filters, catSheetDocumentIds);
  const overdueBefore = new Date(
    now.getTime() - OVERDUE_REQUEST_DAYS * DAY_IN_MS,
  ).toISOString();
  const trendSince = new Date(
    now.getTime() - (TREND_DAYS + 1) * DAY_IN_MS,
  ).toISOString();

  const [
    total,
    pending,
    inReview,
    overdue,
    trendRequests,
    priorityRequests,
    recentRequests,
  ] = await Promise.all([
    strapi
      .documents(ADOPTION_REQUEST_UID)
      .count({ filters: scopeFilters({}) as any }),
    strapi.documents(ADOPTION_REQUEST_UID).count({
      filters: scopeFilters({ processingStatus: { $eq: "pending" } }) as any,
    }),
    strapi.documents(ADOPTION_REQUEST_UID).count({
      filters: scopeFilters({ processingStatus: { $eq: "in_review" } }) as any,
    }),
    strapi.documents(ADOPTION_REQUEST_UID).count({
      filters: scopeFilters({
        processingStatus: { $eq: "pending" },
        createdAt: { $lte: overdueBefore },
      }) as any,
    }),
    strapi.documents(ADOPTION_REQUEST_UID).findMany({
      filters: scopeFilters({ createdAt: { $gte: trendSince } }) as any,
      fields: ["createdAt"],
      pagination: { page: 1, pageSize: 10000 },
    }),
    strapi.documents(ADOPTION_REQUEST_UID).findMany({
      filters: scopeFilters({
        processingStatus: { $in: ["pending", "in_review"] },
      }) as any,
      fields: ["documentId", "animalName", "processingStatus", "createdAt"],
      populate: {
        catSheet: {
          fields: ["documentId"],
          populate: { cats: { fields: ["name"] } },
        },
      },
      sort: ["createdAt:asc"],
      pagination: { page: 1, pageSize: MAX_LIST_ITEMS },
    }),
    strapi.documents(ADOPTION_REQUEST_UID).findMany({
      filters: scopeFilters({}) as any,
      fields: ["documentId", "animalName", "processingStatus", "createdAt"],
      populate: {
        catSheet: {
          fields: ["documentId"],
          populate: {
            cats: { fields: ["name"] },
            linkedVolunteer: { fields: ["username"] },
          },
        },
      },
      sort: ["createdAt:desc"],
      pagination: { page: 1, pageSize: 5 },
    }),
  ]);

  const trendCounts = new Map<string, number>();
  (trendRequests as any[]).forEach((request) => {
    const date = getParisDateKey(request.createdAt);
    trendCounts.set(date, (trendCounts.get(date) ?? 0) + 1);
  });

  const getCatNames = (request: any): string[] =>
    (request.catSheet?.cats ?? []).map((cat: any) => cat.name).filter(Boolean);

  return {
    counts: { total, pending, inReview, overdue },
    trend: getTrendDateKeys(now).map((date) => ({
      date,
      submitted: trendCounts.get(date) ?? 0,
    })),
    priorityRequests: (priorityRequests as any[]).map((request) => ({
      type: "adoption_request" as const,
      documentId: request.documentId,
      catNames: getCatNames(request),
      fallbackAnimalName: request.animalName,
      status: request.processingStatus,
      createdAt: request.createdAt,
      overdue:
        request.processingStatus === "pending" &&
        request.createdAt <= overdueBefore,
    })),
    recentRequests: (recentRequests as any[]).map((request) => ({
      documentId: request.documentId,
      catNames: getCatNames(request),
      fallbackAnimalName: request.animalName,
      status: request.processingStatus,
      createdAt: request.createdAt,
      linkedVolunteerName: request.catSheet?.linkedVolunteer?.username ?? null,
    })),
  };
};

const getConversationSummary = async (
  strapi: Core.Strapi,
  catSheetDocumentIds: string[] | null,
  now: Date,
) => {
  if (catSheetDocumentIds?.length === 0) {
    return { total: 0, activeLast7Days: 0 };
  }

  const activeSince = new Date(
    now.getTime() - ACTIVE_CONVERSATION_DAYS * DAY_IN_MS,
  ).toISOString();
  const [total, activeLast7Days] = await Promise.all([
    strapi.documents(CONVERSATION_UID).count({
      filters: withCatSheetScope({}, catSheetDocumentIds) as any,
    }),
    strapi.documents(CONVERSATION_UID).count({
      filters: withCatSheetScope(
        { lastMessageAt: { $gte: activeSince } },
        catSheetDocumentIds,
      ) as any,
    }),
  ]);

  return { total, activeLast7Days };
};

const getAbsenceSummary = async (
  strapi: Core.Strapi,
  user: AuthUser,
  now: Date,
) => {
  const { canManage } = await canUserManageAbsences(strapi, user);
  const nowIso = now.toISOString();
  const upcomingUntil = new Date(
    now.getTime() + UPCOMING_ABSENCE_DAYS * DAY_IN_MS,
  ).toISOString();
  const priorityUntil = new Date(
    now.getTime() + PRIORITY_ABSENCE_DAYS * DAY_IN_MS,
  ).toISOString();

  const ownFilter = { user: { id: { $eq: user.id } } };
  const volunteerFilter = { user: { role: { name: { $eq: "Volunteer" } } } };
  const [pendingApproval, priorityAbsences, activeToday, upcomingMine] =
    await Promise.all([
      canManage
        ? strapi.documents(ABSENCE_UID).count({
            filters: {
              absence_status: { $eq: "pending" },
              ...volunteerFilter,
            } as any,
          })
        : Promise.resolve(0),
      canManage
        ? strapi.documents(ABSENCE_UID).findMany({
            filters: {
              absence_status: { $eq: "pending" },
              startDate: { $lte: priorityUntil },
              ...volunteerFilter,
            } as any,
            fields: ["documentId", "startDate", "endDate"],
            populate: { user: { fields: ["username"] } },
            sort: ["startDate:asc"],
            pagination: { page: 1, pageSize: MAX_LIST_ITEMS },
          })
        : Promise.resolve([]),
      strapi.documents(ABSENCE_UID).count({
        filters: {
          ...(canManage ? {} : ownFilter),
          absence_status: { $eq: "approved" },
          startDate: { $lte: nowIso },
          endDate: { $gte: nowIso },
        } as any,
      }),
      strapi.documents(ABSENCE_UID).count({
        filters: {
          ...ownFilter,
          absence_status: { $ne: "rejected" },
          startDate: { $gt: nowIso, $lte: upcomingUntil },
        } as any,
      }),
    ]);

  return {
    canManage,
    counts: {
      pendingApproval,
      activeToday,
      upcomingMine,
    },
    priorities: (priorityAbsences as any[]).map((absence) => ({
      type: "absence" as const,
      documentId: absence.documentId,
      volunteerName: absence.user?.username ?? null,
      startDate: absence.startDate,
      endDate: absence.endDate,
    })),
  };
};

const getTeamSummary = async (strapi: Core.Strapi) => {
  const users = strapi.db.query("plugin::users-permissions.user");
  const [activeVolunteers, adopters, blockedUsers] = await Promise.all([
    users.count({
      where: { role: { name: "Volunteer" }, confirmed: true, blocked: false },
    }),
    users.count({ where: { role: { name: "User" } } }),
    users.count({ where: { blocked: true } }),
  ]);

  return { activeVolunteers, adopters, blockedUsers };
};

const getContentHealth = async (strapi: Core.Strapi) => {
  const [
    blogPostDrafts,
    publishedBlogPosts,
    totalBlogPosts,
    catSheetsWithoutMedia,
    catSheetsWithoutBackup,
  ] = await Promise.all([
    strapi.documents(BLOG_POST_UID).count({ status: "draft" }),
    strapi.documents(BLOG_POST_UID).count({ status: "published" }),
    strapi.documents(BLOG_POST_UID).count({}),
    strapi
      .documents(CAT_SHEET_UID)
      .count({ filters: { images: { $null: true } } as any }),
    strapi
      .documents(CAT_SHEET_UID)
      .count({ filters: { backupVolunteer: { $null: true } } as any }),
  ]);

  return {
    draftBlogPosts: Math.max(0, blogPostDrafts - publishedBlogPosts),
    publishedBlogPosts,
    totalBlogPosts,
    catSheetsWithoutMedia,
    catSheetsWithoutBackup,
  };
};

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async getSummary(user: AuthUser, roleName: DashboardRole) {
    const now = new Date();
    const catSheetDocumentIds =
      roleName === "Admin"
        ? null
        : await getAuthorizedCatSheetDocumentIds(strapi, user);

    const [cats, requests, conversations, absences, team, contentHealth] =
      await Promise.all([
        getCatCounts(strapi, catSheetDocumentIds),
        getRequestSummary(strapi, catSheetDocumentIds, now),
        getConversationSummary(strapi, catSheetDocumentIds, now),
        getAbsenceSummary(strapi, user, now),
        roleName === "Admin" ? getTeamSummary(strapi) : Promise.resolve(null),
        roleName === "Admin" ? getContentHealth(strapi) : Promise.resolve(null),
      ]);

    const priorities = [...requests.priorityRequests, ...absences.priorities]
      .sort((left, right) => {
        if (left.type === "adoption_request" && left.overdue) return -1;
        if (right.type === "adoption_request" && right.overdue) return 1;
        const leftDate =
          left.type === "adoption_request" ? left.createdAt : left.startDate;
        const rightDate =
          right.type === "adoption_request" ? right.createdAt : right.startDate;
        return new Date(leftDate).getTime() - new Date(rightDate).getTime();
      })
      .slice(0, MAX_LIST_ITEMS);

    return {
      generatedAt: now.toISOString(),
      scope: roleName === "Admin" ? "global" : "assigned",
      capabilities: {
        canViewTeamStats: roleName === "Admin",
        canManageAbsences: absences.canManage,
      },
      cats,
      adoptionRequests: requests.counts,
      conversations,
      absences: absences.counts,
      team,
      contentHealth,
      requestTrend: requests.trend,
      priorities,
      recentRequests: requests.recentRequests,
    };
  },
});
