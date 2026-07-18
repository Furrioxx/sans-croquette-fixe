/**
 * Creates realistic local data for a product demonstration.
 * Usage from the repository root:
 *   node Backend/scripts/seed-dashboard-data.js [cat-sheet-count]
 */
const path = require("path");
const fs = require("fs");
const os = require("os");

process.chdir(path.resolve(__dirname, ".."));

const { compileStrapi, createStrapi } = require("@strapi/core");

const UID = {
  cat: "api::cat.cat",
  mood: "api::cat-mood.cat-mood",
  sheet: "api::cat-sheet.cat-sheet",
  price: "api::tarification.tarification",
  request: "api::adoption-request.adoption-request",
  absence: "api::absence.absence",
  conversation: "api::chat-conversation.chat-conversation",
  message: "api::chat-message.chat-message",
  user: "plugin::users-permissions.user",
  role: "plugin::users-permissions.role",
};

const PASSWORD = "Refuge2026!";
const DAY = 24 * 60 * 60 * 1000;
const NAMES = [
  "Moka",
  "Plume",
  "Pixel",
  "Nala",
  "Simba",
  "Praline",
  "Nuage",
  "Olive",
  "Biscuit",
  "Luna",
  "Salem",
  "Cannelle",
  "Milo",
  "Ziggy",
  "Chaussette",
  "Pistache",
];
const MOODS = ["Calme", "Joueur", "Affectueux", "Curieux", "Sociable"];
const CAT_STATUSES = [
  "en_refuge",
  "en_famille_accueil",
  "en_refuge",
  "en_soins",
  "adopte",
];
const REQUEST_STATUSES = ["pending", "in_review", "approved", "rejected"];
const IMAGE_EXTENSIONS = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const CAT_DESCRIPTIONS = [
  "Très proche des humains, {cats} apprécie les moments calmes et vient volontiers chercher des caresses.",
  "Curieux et joueur, {cats} s'adapte rapidement à un nouvel environnement lorsqu'on lui laisse le temps d'explorer.",
  "Plutôt discret au premier contact, {cats} révèle un tempérament très affectueux une fois en confiance.",
  "Habitué à la vie en intérieur, {cats} recherche un foyer paisible avec des espaces en hauteur.",
  "Sociable et plein d'énergie, {cats} aime participer à la vie de la maison et jouer plusieurs fois par jour.",
  "D'un naturel doux, {cats} conviendrait à une famille disponible et attentive à son rythme.",
];
const MEDICAL_HISTORIES = [
  "Bilan vétérinaire à jour, aucun traitement en cours.",
  "Vaccination annuelle réalisée et traitement antiparasitaire à jour.",
  "Petite sensibilité digestive stabilisée avec une alimentation adaptée.",
  "Contrôle dentaire effectué récemment, sans anomalie particulière.",
  "Convalescence terminée après une infection respiratoire légère.",
];
const APPLICANTS = [
  [
    "Léa",
    "Dubois",
    "12 rue des Lilas",
    "75012",
    "Paris",
    "0612457830",
    "Architecte",
  ],
  [
    "Hugo",
    "Moreau",
    "8 avenue Jean-Jaurès",
    "92120",
    "Montrouge",
    "0678942156",
    "Développeur web",
  ],
  [
    "Inès",
    "Petit",
    "24 rue Pasteur",
    "94200",
    "Ivry-sur-Seine",
    "0623187495",
    "Enseignante",
  ],
  [
    "Lucas",
    "Bernard",
    "5 allée des Tilleuls",
    "93100",
    "Montreuil",
    "0657291843",
    "Infirmier",
  ],
  [
    "Chloé",
    "Robert",
    "31 boulevard Voltaire",
    "75011",
    "Paris",
    "0638175429",
    "Graphiste",
  ],
  [
    "Mehdi",
    "Richard",
    "17 rue Victor-Hugo",
    "94120",
    "Fontenay-sous-Bois",
    "0692457138",
    "Comptable",
  ],
  [
    "Manon",
    "Durand",
    "3 place de la Mairie",
    "94300",
    "Vincennes",
    "0641839275",
    "Libraire",
  ],
  [
    "Antoine",
    "Leroy",
    "46 rue du Parc",
    "94160",
    "Saint-Mandé",
    "0687314259",
    "Kinésithérapeute",
  ],
  [
    "Sarah",
    "Michel",
    "9 quai de la Marne",
    "75019",
    "Paris",
    "0619384752",
    "Cheffe de projet",
  ],
  [
    "Gabriel",
    "Simon",
    "22 avenue de la République",
    "94700",
    "Maisons-Alfort",
    "0673158492",
    "Photographe",
  ],
  [
    "Emma",
    "Laurent",
    "14 rue des Écoles",
    "75005",
    "Paris",
    "0629473815",
    "Journaliste",
  ],
  [
    "Nathan",
    "Roux",
    "6 impasse des Acacias",
    "94410",
    "Saint-Maurice",
    "0651847392",
    "Technicien son",
  ],
];
const ADDITIONAL_NOTES = [
  "Je souhaite prendre le temps de faire une adaptation progressive et respecter les habitudes du chat.",
  "Une pièce calme pourra être aménagée pour les premiers jours à la maison.",
  "Je travaille en partie depuis mon domicile et serai très présent pendant la période d'adaptation.",
  "Toute la famille a réfléchi à cette adoption et partage la responsabilité des soins.",
  "J'ai déjà vécu avec des chats et je connais les besoins liés à leur santé et à leur alimentation.",
];
const ABSENCE_REASONS = [
  "Congés annuels",
  "Déplacement familial",
  "Formation professionnelle",
  "Rendez-vous médical",
  "Week-end prolongé",
  "Indisponibilité personnelle",
];
const CONVERSATION_MESSAGES = [
  "Bonjour, pourriez-vous me préciser comment se passe son quotidien en famille d'accueil ?",
  "Bonjour, savez-vous s'il est à l'aise avec les enfants et les environnements animés ?",
  "Je souhaiterais organiser une première rencontre. Quelles seraient vos disponibilités cette semaine ?",
  "Pouvez-vous me confirmer si son suivi vétérinaire et ses vaccins sont à jour ?",
  "Nous avons déjà un chat à la maison. Pensez-vous qu'une cohabitation progressive serait adaptée ?",
  "Je vis en appartement avec un balcon sécurisé. Ce cadre de vie pourrait-il lui convenir ?",
  "Merci pour sa fiche très complète. J'aimerais échanger avec son référent avant de déposer ma demande.",
  "Bonjour, est-ce qu'il apprécie de rester seul quelques heures pendant la journée ?",
];

function isoFromNow(days, hour = 10) {
  const date = new Date(Date.now() + days * DAY);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
}

function dateYearsAgo(years, extraDays = 0) {
  const date = new Date();
  date.setFullYear(date.getFullYear() - years);
  date.setDate(date.getDate() - extraDays);
  return date.toISOString().slice(0, 10);
}

function emailPart(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

async function publish(strapi, uid, documentId) {
  await strapi.documents(uid).publish({ documentId });
}

async function downloadCatPhoto(catName, uniqueKey) {
  const response = await fetch(
    `https://cataas.com/cat?type=medium&width=900&height=700&_=${uniqueKey}`,
    { signal: AbortSignal.timeout(20_000) },
  );
  if (!response.ok) {
    throw new Error(`CATAAS returned HTTP ${response.status}.`);
  }

  const mimeType = response.headers.get("content-type")?.split(";")[0];
  const extension = IMAGE_EXTENSIONS[mimeType];
  if (!extension) {
    throw new Error(`Unsupported cat photo format: ${mimeType ?? "unknown"}.`);
  }

  const fileName = `${emailPart(catName)}-${uniqueKey}.${extension}`;
  const filePath = path.join(os.tmpdir(), fileName);
  fs.writeFileSync(filePath, Buffer.from(await response.arrayBuffer()));

  return { filePath, fileName, mimeType };
}

async function uploadCatPhoto(strapi, catName, uniqueKey) {
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    let downloaded;
    try {
      downloaded = await downloadCatPhoto(
        catName,
        `${uniqueKey}-${attempt}-${Date.now()}`,
      );
      const stats = fs.statSync(downloaded.filePath);
      const [uploaded] = await strapi
        .plugin("upload")
        .service("upload")
        .upload({
          data: {
            fileInfo: {
              name: `Photo de ${catName}`,
              alternativeText: `${catName}, chat proposé à l'adoption`,
              caption: `Portrait de ${catName}`,
            },
          },
          files: {
            filepath: downloaded.filePath,
            originalFilename: downloaded.fileName,
            mimetype: downloaded.mimeType,
            size: stats.size,
          },
        });
      return uploaded.id;
    } catch (error) {
      lastError = error;
    } finally {
      if (downloaded?.filePath && fs.existsSync(downloaded.filePath)) {
        fs.unlinkSync(downloaded.filePath);
      }
    }
  }

  throw new Error(`Unable to retrieve a photo for ${catName}.`, {
    cause: lastError,
  });
}

async function getRoles(strapi) {
  const roles = await strapi.db.query(UID.role).findMany({
    where: { name: { $in: ["Admin", "Volunteer", "User"] } },
  });
  const rolesByName = new Map(roles.map((role) => [role.name, role]));
  const missing = ["Admin", "Volunteer", "User"].filter(
    (name) => !rolesByName.has(name),
  );

  if (missing.length) {
    throw new Error(
      `Missing Strapi roles: ${missing.join(", ")}. Create them before running this script.`,
    );
  }

  return rolesByName;
}

async function ensureUser(strapi, roles, definition) {
  const userService = strapi.plugin("users-permissions").service("user");
  const existing = await strapi.db.query(UID.user).findOne({
    where: { email: definition.email },
  });
  const data = {
    username: definition.username,
    email: definition.email,
    password: PASSWORD,
    provider: "local",
    confirmed: true,
    blocked: false,
    role: roles.get(definition.role).id,
  };

  return existing ? userService.edit(existing.id, data) : userService.add(data);
}

async function ensureUsers(strapi, roles) {
  const definitions = [
    ["sophie.laurent", "sophie.laurent@demo-scf.fr", "Admin"],
    ["camille.bernard", "camille.bernard@demo-scf.fr", "Volunteer"],
    ["nicolas.roux", "nicolas.roux@demo-scf.fr", "Volunteer"],
    ["lea.dubois", "lea.dubois@demo-scf.fr", "User"],
    ["hugo.moreau", "hugo.moreau@demo-scf.fr", "User"],
    ["ines.petit", "ines.petit@demo-scf.fr", "User"],
  ];
  const users = [];

  for (const [username, email, role] of definitions) {
    users.push(await ensureUser(strapi, roles, { username, email, role }));
  }

  return {
    admin: users[0],
    volunteers: users.slice(1, 3),
    adopters: users.slice(3),
  };
}

async function ensureMoods(strapi) {
  const existing = await strapi.documents(UID.mood).findMany({
    filters: { name: { $in: MOODS } },
    pagination: { page: 1, pageSize: MOODS.length },
  });
  const moodsByName = new Map(existing.map((mood) => [mood.name, mood]));

  for (const name of MOODS) {
    if (moodsByName.has(name)) continue;
    const mood = await strapi.documents(UID.mood).create({ data: { name } });
    await publish(strapi, UID.mood, mood.documentId);
    moodsByName.set(name, mood);
  }

  return MOODS.map((name) => moodsByName.get(name).documentId);
}

async function createCat(strapi, index, status, moodIds) {
  const name = NAMES[index % NAMES.length];
  const cat = await strapi.documents(UID.cat).create({
    data: {
      name,
      birthDate: dateYearsAgo((index % 11) + 1, index * 7),
      gender: ["female", "male", "not_determined"][index % 3],
      identified: index % 4 !== 0,
      vaccinated: index % 5 !== 0,
      sterilized: index % 3 !== 0,
      decontaminate: true,
      dogFriendly: ["yes", "no", "unknown"][index % 3],
      catFriendly: ["yes", "unknown", "no"][index % 3],
      childFriendly: ["unknown", "yes", "no"][index % 3],
      catStatus: status,
      trappingDate: dateYearsAgo(0, 30 + index * 4),
      medicalHistory: MEDICAL_HISTORIES[index % MEDICAL_HISTORIES.length],
      cat_moods: {
        connect: [
          { documentId: moodIds[index % moodIds.length] },
          { documentId: moodIds[(index + 1) % moodIds.length] },
        ],
      },
    },
  });
  await publish(strapi, UID.cat, cat.documentId);
  return cat;
}

async function createSheets(strapi, count, volunteers, moodIds) {
  const sheets = [];
  let catIndex = 0;

  for (let index = 0; index < count; index += 1) {
    const isDuo = index % 5 === 0;
    const status = CAT_STATUSES[index % CAT_STATUSES.length];
    const cats = [];

    for (let position = 0; position < (isDuo ? 2 : 1); position += 1) {
      cats.push(await createCat(strapi, catIndex, status, moodIds));
      catIndex += 1;
    }

    const imageIds = [];
    for (const [position, cat] of cats.entries()) {
      imageIds.push(
        await uploadCatPhoto(strapi, cat.name, `${index + 1}-${position + 1}`),
      );
    }

    const price = await strapi.documents(UID.price).create({
      data: {
        label: isDuo ? "Adoption en duo" : "Adoption individuelle",
        price: isDuo ? 240 : 140,
      },
    });
    await publish(strapi, UID.price, price.documentId);

    const linkedVolunteer = volunteers[index % volunteers.length];
    const backupVolunteer =
      index % 3 === 0 ? null : volunteers[(index + 1) % volunteers.length];
    const sheet = await strapi.documents(UID.sheet).create({
      data: {
        isDuo,
        cats: {
          connect: cats.map((cat) => ({ documentId: cat.documentId })),
        },
        linkedVolunteer: { id: linkedVolunteer.id },
        backupVolunteer: backupVolunteer ? { id: backupVolunteer.id } : null,
        tarification: { documentId: price.documentId },
        images: imageIds,
        description: CAT_DESCRIPTIONS[index % CAT_DESCRIPTIONS.length].replace(
          "{cats}",
          cats.map((cat) => cat.name).join(" et "),
        ),
      },
    });
    await publish(strapi, UID.sheet, sheet.documentId);

    const relatedSheet = await strapi.documents(UID.sheet).findOne({
      documentId: sheet.documentId,
      status: "draft",
      fields: ["documentId"],
      populate: {
        cats: { fields: ["documentId", "name"] },
        linkedVolunteer: { fields: ["username"] },
        tarification: { fields: ["documentId", "label"] },
        images: { fields: ["name", "url"] },
      },
    });
    if (
      !relatedSheet ||
      relatedSheet.cats?.length !== cats.length ||
      relatedSheet.images?.length !== imageIds.length ||
      !relatedSheet.linkedVolunteer ||
      !relatedSheet.tarification
    ) {
      throw new Error(
        `Cat sheet ${sheet.documentId} was created without all required relations.`,
      );
    }

    sheets.push({ sheet, cats, imageIds });
  }

  return sheets;
}

function requestData(index, target, adopterId) {
  const applicant = APPLICANTS[index % APPLICANTS.length];
  const [
    firstName,
    lastName,
    streetAddress,
    postalCode,
    city,
    phone,
    profession,
  ] = applicant;

  return {
    agreementAccepted: true,
    animalName: target.cats.map((cat) => cat.name).join(" & "),
    firstName,
    lastName,
    birthDate: dateYearsAgo(25 + (index % 25)),
    streetAddress,
    postalCode,
    city,
    phone,
    email: `${emailPart(firstName)}.${emailPart(lastName)}@demo-scf.fr`,
    householdComposition: index % 2 === 0 ? "couple" : "seul",
    hasChildren: index % 3 === 0,
    childrenCount: index % 3 === 0 ? 1 : 0,
    childrenAges: index % 3 === 0 ? "8 ans" : null,
    householdAgreement: true,
    isEmployed: true,
    profession,
    workSchedule:
      index % 3 === 0
        ? "Télétravail deux jours par semaine"
        : "Horaires de journée",
    aloneTimePerDay: index % 3 === 0 ? "3 heures" : "6 heures",
    housingType: index % 2 === 0 ? "appartement" : "maison",
    housingArea: `${45 + index} m²`,
    animalLivingSpace: "interieur",
    environmentType: "ville",
    nearBusyRoad: "non",
    canGoOutside: "non",
    windowsSecured: "oui",
    plansToSecureWindows: true,
    hasGarden: "non",
    hasBalconyOrTerrace: "non",
    hasOtherAnimals: index % 4 === 0,
    otherAnimalsDetails: index % 4 === 0 ? "Un chat adulte" : null,
    otherAnimalsSterilized: index % 4 === 0 ? "oui" : "non_applicable",
    additionalNotes: ADDITIONAL_NOTES[index % ADDITIONAL_NOTES.length],
    responsibilityCommitmentAccepted: true,
    processingStatus: REQUEST_STATUSES[index % REQUEST_STATUSES.length],
    catSheet: { documentId: target.sheet.documentId },
    submittedBy: { id: adopterId },
  };
}

async function createRequests(strapi, sheets, adopters) {
  const total = sheets.length * 2;

  for (let index = 0; index < total; index += 1) {
    const target = sheets[index % sheets.length];
    const request = await strapi.documents(UID.request).create({
      data: requestData(index, target, adopters[index % adopters.length].id),
    });
    await publish(strapi, UID.request, request.documentId);

    const relatedRequest = await strapi.documents(UID.request).findOne({
      documentId: request.documentId,
      status: "draft",
      fields: ["documentId"],
      populate: { catSheet: { fields: ["documentId"] } },
    });
    if (relatedRequest?.catSheet?.documentId !== target.sheet.documentId) {
      throw new Error(
        `Adoption request ${request.documentId} was created without its cat sheet relation.`,
      );
    }

    // Backdate only the draft read by the dashboard to exercise trends/overdue states.
    await strapi.db.query(UID.request).update({
      where: { id: request.id },
      data: { createdAt: isoFromNow(-((index * 3) % 30)) },
    });
  }

  return total;
}

async function createAbsences(strapi, volunteers) {
  const definitions = [
    [0, -1, 3, "approved"],
    [0, 5, 8, "pending"],
    [1, 12, 15, "pending"],
    [1, 20, 25, "approved"],
    [0, 32, 36, "pending"],
    [1, -15, -12, "rejected"],
  ];

  for (const [
    index,
    [volunteer, start, end, status],
  ] of definitions.entries()) {
    const absence = await strapi.documents(UID.absence).create({
      data: {
        startDate: isoFromNow(start, 8),
        endDate: isoFromNow(end, 18),
        reason: ABSENCE_REASONS[index % ABSENCE_REASONS.length],
        absence_status: status,
        user: { id: volunteers[volunteer].id },
      },
    });
    await publish(strapi, UID.absence, absence.documentId);
  }

  return definitions.length;
}

async function createConversations(strapi, sheets, adopters) {
  const total = Math.min(8, sheets.length);

  for (let index = 0; index < total; index += 1) {
    const target = sheets[index];
    const adopter = adopters[index % adopters.length];
    const conversation = await strapi.documents(UID.conversation).create({
      data: {
        catSheet: { documentId: target.sheet.documentId },
        requester: { id: adopter.id },
        lastMessageAt: isoFromNow(-(index * 2)),
      },
    });
    await strapi.documents(UID.message).create({
      data: {
        conversation: { documentId: conversation.documentId },
        author: { id: adopter.id },
        content: `${CONVERSATION_MESSAGES[index]} Le message concerne ${target.cats[0].name}.`,
      },
    });
  }

  return total;
}

async function main() {
  const count = Number(process.argv[2] ?? 12);
  if (!Number.isInteger(count) || count < 1 || count > 100) {
    throw new Error("Cat-sheet count must be an integer between 1 and 100.");
  }

  const context = await compileStrapi();
  const app = await createStrapi(context).load();

  try {
    const roles = await getRoles(app);
    const users = await ensureUsers(app, roles);
    const moodIds = await ensureMoods(app);
    const sheets = await createSheets(app, count, users.volunteers, moodIds);
    const requests = await createRequests(app, sheets, users.adopters);
    const absences = await createAbsences(app, users.volunteers);
    const conversations = await createConversations(
      app,
      sheets,
      users.adopters,
    );

    console.log("\nDemo data created successfully:");
    console.log(
      `- ${sheets.reduce((sum, item) => sum + item.cats.length, 0)} cats`,
    );
    console.log(`- ${sheets.length} cat sheets`);
    console.log(
      `- ${sheets.reduce((sum, item) => sum + item.imageIds.length, 0)} real cat photos`,
    );
    console.log(`- ${requests} adoption requests`);
    console.log(`- ${absences} absences`);
    console.log(`- ${conversations} conversations`);
    console.log("- Cat sheet and adoption request relations verified");
    console.log("\nDemo accounts, all using the same password:");
    console.log(`- Admin: sophie.laurent@demo-scf.fr / ${PASSWORD}`);
    console.log(`- Volunteer: camille.bernard@demo-scf.fr / ${PASSWORD}`);
    console.log(`- Adopter: lea.dubois@demo-scf.fr / ${PASSWORD}`);
    console.log("\nA new run reuses accounts and adds another data set.");
  } finally {
    await app.destroy();
  }
}

main().catch((error) => {
  console.error("Demo data creation failed:", error);
  process.exitCode = 1;
});
