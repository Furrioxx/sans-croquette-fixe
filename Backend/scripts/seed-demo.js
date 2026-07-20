/**
 * Idempotent, realistic demo seed for the whole Sans Croquette Fixe project.
 *
 * Run from Backend/ with: npm run seed:demo
 * Existing demo records are updated instead of duplicated.
 * Cat and article pictures come from the existing CATAAS catalogue.
 */
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

process.chdir(path.resolve(__dirname, ".."));

const { compileStrapi, createStrapi } = require("@strapi/core");

const PASSWORD = "Refuge2026!";
const DAY = 24 * 60 * 60 * 1000;
const SHEET_COUNT = 30;

const UID = {
  role: "plugin::users-permissions.role",
  user: "plugin::users-permissions.user",
  file: "plugin::upload.file",
  mood: "api::cat-mood.cat-mood",
  cat: "api::cat.cat",
  sheet: "api::cat-sheet.cat-sheet",
  price: "api::tarification.tarification",
  category: "api::blog-category.blog-category",
  post: "api::blog-post.blog-post",
  request: "api::adoption-request.adoption-request",
  absence: "api::absence.absence",
  delegation: "api::absence-delegation.absence-delegation",
  conversation: "api::chat-conversation.chat-conversation",
  message: "api::chat-message.chat-message",
};

const ROLE_DEFINITIONS = [
  ["Admin", "admin", "Administrateurs du site"],
  ["Volunteer", "volunteer", "Bénévoles de l'association"],
  ["User", "user", "Adoptants inscrits"],
];

const USER_DEFINITIONS = [
  ["Sophie Laurent", "sophie.laurent@demo-scf.fr", "Admin", true, false],
  ["Camille Bernard", "camille.bernard@demo-scf.fr", "Volunteer", true, false],
  ["Nicolas Roux", "nicolas.roux@demo-scf.fr", "Volunteer", true, false],
  ["Anaïs Martin", "anais.martin@demo-scf.fr", "Volunteer", true, false],
  ["Léa Dubois", "lea.dubois@demo-scf.fr", "User", true, false],
  ["Hugo Moreau", "hugo.moreau@demo-scf.fr", "User", false, false],
  ["Inès Petit", "ines.petit@demo-scf.fr", "User", true, false],
  ["Mehdi Richard", "mehdi.richard@demo-scf.fr", "User", false, false],
  ["Chloé Robert", "chloe.robert@demo-scf.fr", "User", true, false],
  ["Compte archivé", "archive@demo-scf.fr", "User", false, true],
];

const MOODS = [
  "Affectueux",
  "Calme",
  "Câlin",
  "Craintif",
  "Curieux",
  "Indépendant",
  "Joueur",
  "Sociable",
];

const TARIFFS = [
  { label: "Adoption chaton (moins de 8 mois)", price: 180 },
  { label: "Adoption chat adulte", price: 150 },
  { label: "Adoption duo inséparable", price: 250 },
];

const CAT_NAMES = [
  "Moka", "Plume", "Pixel", "Nala", "Simba", "Praline", "Nuage", "Olive",
  "Biscuit", "Luna", "Salem", "Cannelle", "Milo", "Ziggy", "Chaussette",
  "Pistache", "Nova", "Gaston", "Ruby", "Marcel", "Iris", "Pablo", "Miette",
  "Sésame", "Colette", "Orion", "Joséphine", "Tao", "Suzette", "Roméo",
  "Violette", "Achille", "Poppy", "Léon", "Agathe", "Ulysse",
];

const STATUSES = [
  "en_refuge", "en_refuge", "en_famille_accueil", "en_refuge", "adopte",
  "en_famille_accueil", "en_soins", "en_refuge", "en_refuge", "adopte",
  "en_famille_accueil", "en_refuge", "en_soins", "en_refuge", "adopte",
  "en_famille_accueil", "en_refuge", "perdu", "en_refuge", "adopte",
  "en_famille_accueil", "en_soins", "en_refuge", "en_refuge", "adopte",
  "en_famille_accueil", "decede", "en_refuge", "en_soins", "en_refuge",
];

const DUO_SHEET_INDEXES = new Set([4, 9, 14, 19, 24, 29]);
const TEMPERAMENTS = [
  "très proche des humains et toujours partant pour une séance de câlins",
  "joueur, curieux et particulièrement amateur de balles en mousse",
  "réservé au premier contact, puis très tendre une fois en confiance",
  "paisible et observateur, avec un faible pour les siestes au soleil",
  "sociable et facile à vivre, même lorsqu'il découvre un nouvel environnement",
  "indépendant mais heureux de retrouver ses humains en fin de journée",
];
const IDEAL_HOMES = [
  "un appartement sécurisé avec des espaces en hauteur",
  "un foyer calme qui respectera son temps d'adaptation",
  "une famille présente et disponible pour jouer chaque jour",
  "une maison sans accès libre à la rue pendant les premières semaines",
  "un foyer connaissant déjà les besoins des chats",
];
const MEDICAL_NOTES = [
  "Bilan vétérinaire complet réalisé, vaccins et antiparasitaires à jour.",
  "Identifié par puce électronique, contrôle dentaire sans anomalie.",
  "Petite sensibilité digestive stabilisée avec une alimentation adaptée.",
  "Convalescence terminée après un léger coryza, aucun traitement en cours.",
  "Suivi vétérinaire à jour, aucun antécédent médical particulier.",
];

const BLOG_CATEGORIES = [
  { name: "Conseils adoption", slug: "conseils-adoption" },
  { name: "Vie du refuge", slug: "vie-du-refuge" },
  { name: "Santé & bien-être", slug: "sante-bien-etre" },
];

const BLOG_POSTS = [
  {
    title: "Préparer l'arrivée d'un chat adopté : notre checklist",
    slug: "preparer-arrivee-chat-adopte-checklist",
    category: "conseils-adoption",
    excerpt: "Pièce refuge, litière, alimentation et premiers contacts : les bons gestes pour une arrivée sereine.",
    content: `L'arrivée dans un nouveau foyer est un grand changement pour un chat. Avant le jour J, préparez une pièce calme avec une litière éloignée des gamelles, une cachette accessible, un couchage et un griffoir. Cette base rassurante lui permettra d'observer son nouvel environnement sans être sollicité en permanence.\n\nPendant les premiers jours, laissez-le venir à son rythme. Parlez doucement, asseyez-vous à distance et évitez de le porter. Un chat caché n'est pas forcément malheureux : il prend simplement le temps de vérifier que le lieu est sûr. Conservez dans un premier temps l'alimentation indiquée par sa famille d'accueil afin de limiter le stress digestif.\n\nSi d'autres animaux vivent déjà chez vous, organisez des présentations progressives. Commencez par échanger les odeurs, puis permettez des rencontres courtes avec une possibilité de repli pour chacun. Enfin, pensez à sécuriser fenêtres, balcon et accès extérieur avant son arrivée. Votre bénévole référent reste disponible pour vous accompagner pendant toute cette période d'adaptation.`,
    seoTitle: "Préparer l'arrivée d'un chat adopté | Sans Croquette Fixe",
    seoDescription: "La checklist complète du refuge pour accueillir un chat adopté dans de bonnes conditions.",
    isFeatured: true,
    imageTags: "carrier,home,cozy",
  },
  {
    title: "Familles d'accueil : un maillon essentiel du refuge",
    slug: "familles-accueil-maillon-essentiel-refuge",
    category: "vie-du-refuge",
    excerpt: "Accueillir temporairement un chat libère une place au refuge et révèle sa vraie personnalité.",
    content: `Une famille d'accueil héberge temporairement un chat qui ne peut pas encore rejoindre sa famille définitive. Elle offre un cadre quotidien rassurant aux chatons trop jeunes, aux adultes en convalescence ou aux chats qui supportent difficilement la vie en collectivité.\n\nLe refuge fournit l'accompagnement nécessaire et reste responsable du suivi vétérinaire. La famille observe les habitudes du chat, ses ententes et ses besoins. Ces informations rendent ensuite sa fiche d'adoption beaucoup plus précise et facilitent une rencontre adaptée avec les futurs adoptants.\n\nIl n'est pas nécessaire de disposer d'une grande maison. Une pièce sécurisée, du temps et de la patience suffisent souvent. La durée de l'accueil est définie ensemble selon vos disponibilités. Chaque accueil est une place libérée pour un autre animal en urgence et une chance supplémentaire de réussir une adoption durable.`,
    seoTitle: "Devenir famille d'accueil pour chats",
    seoDescription: "Découvrez le rôle concret des familles d'accueil et la manière dont le refuge vous accompagne.",
    isFeatured: false,
    imageTags: "couch,relaxed,home",
  },
  {
    title: "Canicule : protéger son chat pendant les fortes chaleurs",
    slug: "canicule-proteger-chat-fortes-chaleurs",
    category: "sante-bien-etre",
    excerpt: "Hydratation, fraîcheur et signes d'alerte : les réflexes utiles lorsque le thermomètre grimpe.",
    content: `Les chats tolèrent généralement mieux la chaleur que nous, mais ils peuvent eux aussi souffrir d'un coup de chaleur. Multipliez les points d'eau fraîche dans le logement et renouvelez-les plusieurs fois par jour. Une fontaine peut encourager les chats qui boivent peu.\n\nFermez volets et rideaux aux heures les plus chaudes, aérez tôt le matin et laissez l'animal choisir les surfaces fraîches. Vous pouvez passer un gant légèrement humide sur ses pattes et son pelage, sans jamais l'obliger. Les jeux intenses et les déplacements sont à éviter en milieu de journée.\n\nUne respiration bouche ouverte, une grande faiblesse, des vomissements ou des muqueuses très rouges sont des signaux d'urgence. Placez alors le chat dans un endroit frais, humidifiez-le progressivement avec de l'eau tempérée et contactez immédiatement un vétérinaire. Ne le plongez jamais dans de l'eau glacée.`,
    seoTitle: "Canicule et chat : conseils et signes d'alerte",
    seoDescription: "Les conseils du refuge pour garder son chat au frais et reconnaître rapidement un coup de chaleur.",
    isFeatured: false,
    imageTags: "summer,window,water",
  },
];

const APPLICANTS = [
  ["Léa", "Dubois", "12 rue des Lilas", "75012", "Paris", "06 12 45 78 30", "Architecte"],
  ["Hugo", "Moreau", "8 avenue Jean-Jaurès", "92120", "Montrouge", "06 78 94 21 56", "Développeur web"],
  ["Inès", "Petit", "24 rue Pasteur", "94200", "Ivry-sur-Seine", "06 23 18 74 95", "Enseignante"],
  ["Lucas", "Bernard", "5 allée des Tilleuls", "93100", "Montreuil", "06 57 29 18 43", "Infirmier"],
  ["Chloé", "Robert", "31 boulevard Voltaire", "75011", "Paris", "06 38 17 54 29", "Graphiste"],
  ["Mehdi", "Richard", "17 rue Victor-Hugo", "94120", "Fontenay-sous-Bois", "06 92 45 71 38", "Comptable"],
  ["Manon", "Durand", "3 place de la Mairie", "94300", "Vincennes", "06 41 83 92 75", "Libraire"],
  ["Antoine", "Leroy", "46 rue du Parc", "94160", "Saint-Mandé", "06 87 31 42 59", "Kinésithérapeute"],
  ["Sarah", "Michel", "9 quai de la Marne", "75019", "Paris", "06 19 38 47 52", "Cheffe de projet"],
  ["Gabriel", "Simon", "22 avenue de la République", "94700", "Maisons-Alfort", "06 73 15 84 92", "Photographe"],
  ["Emma", "Laurent", "14 rue des Écoles", "75005", "Paris", "06 29 47 38 15", "Journaliste"],
  ["Nathan", "Roux", "6 impasse des Acacias", "94410", "Saint-Maurice", "06 51 84 73 92", "Technicien son"],
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

function slugPart(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.|\.$/g, "");
}

async function publish(strapi, uid, documentId) {
  await strapi.documents(uid).publish({ documentId });
}

async function findDraft(strapi, uid, filters) {
  const records = await strapi.documents(uid).findMany({
    status: "draft",
    filters,
    pagination: { page: 1, pageSize: 1 },
  });
  return records[0] ?? null;
}

async function upsertPublished(strapi, uid, filters, data) {
  const existing = await findDraft(strapi, uid, filters);
  const record = existing
    ? await strapi.documents(uid).update({ documentId: existing.documentId, data })
    : await strapi.documents(uid).create({ data });
  await publish(strapi, uid, record.documentId);
  return record;
}

async function upsertPlain(strapi, uid, filters, data) {
  const records = await strapi.documents(uid).findMany({
    filters,
    pagination: { page: 1, pageSize: 1 },
  });
  return records[0]
    ? strapi.documents(uid).update({ documentId: records[0].documentId, data })
    : strapi.documents(uid).create({ data });
}

async function ensureRoles(strapi) {
  const roleService = strapi.plugin("users-permissions").service("role");
  for (const [name, type, description] of ROLE_DEFINITIONS) {
    const existing = await strapi.db.query(UID.role).findOne({ where: { name } });
    if (!existing) {
      await roleService.createRole({ name, type, description, permissions: {} });
    }
  }
  const roles = await strapi.db.query(UID.role).findMany({
    where: { name: { $in: ROLE_DEFINITIONS.map(([name]) => name) } },
  });
  return new Map(roles.map((role) => [role.name, role]));
}

async function ensureUsers(strapi, roles) {
  const userService = strapi.plugin("users-permissions").service("user");
  const users = new Map();
  for (const [username, email, roleName, newsletterOptIn, blocked] of USER_DEFINITIONS) {
    const existing = await strapi.db.query(UID.user).findOne({ where: { email } });
    const data = {
      username,
      email,
      password: PASSWORD,
      provider: "local",
      confirmed: true,
      blocked,
      newsletterOptIn,
      role: roles.get(roleName).id,
    };
    const user = existing ? await userService.edit(existing.id, data) : await userService.add(data);
    users.set(email, user);
  }
  return {
    admin: users.get("sophie.laurent@demo-scf.fr"),
    volunteers: ["camille.bernard@demo-scf.fr", "nicolas.roux@demo-scf.fr", "anais.martin@demo-scf.fr"].map((email) => users.get(email)),
    adopters: ["lea.dubois@demo-scf.fr", "hugo.moreau@demo-scf.fr", "ines.petit@demo-scf.fr", "mehdi.richard@demo-scf.fr", "chloe.robert@demo-scf.fr"].map((email) => users.get(email)),
  };
}

async function ensureMoods(strapi) {
  const result = new Map();
  for (const name of MOODS) {
    const mood = await upsertPublished(strapi, UID.mood, { name: { $eq: name } }, { name });
    result.set(name, mood);
  }
  return result;
}

async function ensureTariffs(strapi) {
  const result = new Map();
  for (const tariff of TARIFFS) {
    const record = await upsertPublished(strapi, UID.price, { label: { $eq: tariff.label } }, tariff);
    result.set(tariff.label, record);
  }
  return result;
}

const FORBIDDEN_IMAGE_TAGS = new Set(["gif", "meme", "nsfw", "nazi", "hitler", "hilter", "gun", "suicide", "photoshop", "cartoon", "low quality", "lowres", "blurry"]);

async function fetchCatCatalogue(tags, minimum, skip = 0) {
  const query = new URLSearchParams({ limit: "250", skip: String(skip) });
  if (tags) query.set("tags", tags);
  const response = await fetch(`https://cataas.com/api/cats?${query}`, { signal: AbortSignal.timeout(30_000) });
  if (!response.ok) throw new Error(`CATAAS catalogue returned HTTP ${response.status}.`);
  const records = await response.json();
  const unique = new Map();
  for (const item of records) {
    const id = item.id ?? item._id;
    const itemTags = (item.tags ?? []).map((tag) => String(tag).toLowerCase());
    if (!id || item.mimetype !== "image/jpeg" || itemTags.some((tag) => FORBIDDEN_IMAGE_TAGS.has(tag))) continue;
    unique.set(id, { id, tags: itemTags });
  }
  const result = [...unique.values()].sort((left, right) => left.id.localeCompare(right.id));
  if (result.length < minimum) throw new Error(`CATAAS catalogue only returned ${result.length} usable photos (expected ${minimum}).`);
  return result;
}

async function getImagePools() {
  const catalogue = await fetchCatCatalogue(null, 70, 0);
  const duoTags = new Set(["2cats", "twocats", "two cats", "duo", "couple", "pair", "siblings", "friends", "multiple"]);
  const taggedDuos = catalogue.filter((item) => item.tags.some((tag) => duoTags.has(tag)));
  const duo = [...taggedDuos];
  for (const item of catalogue) {
    if (duo.length >= 6) break;
    if (!duo.some((candidate) => candidate.id === item.id)) duo.push(item);
  }
  const duoIds = new Set(duo.slice(0, 6).map((item) => item.id));
  const remaining = catalogue.filter((item) => !duoIds.has(item.id));
  const general = remaining.slice(0, 30);
  const article = remaining.slice(30, 33);
  if (general.length !== 30 || article.length !== 3) {
    throw new Error("CATAAS catalogue does not contain enough distinct photos for the demo.");
  }
  return { general, duo: duo.slice(0, 6), article };
}

async function downloadPhoto(id, fileName) {
  const response = await fetch(`https://cataas.com/cat/${id}?width=1200&height=900&position=center`, { signal: AbortSignal.timeout(30_000) });
  if (!response.ok) throw new Error(`CATAAS image ${id} returned HTTP ${response.status}.`);
  const mimeType = response.headers.get("content-type")?.split(";")[0];
  if (mimeType !== "image/jpeg") throw new Error(`CATAAS image ${id} returned ${mimeType ?? "an unknown format"}.`);
  const filePath = path.join(os.tmpdir(), `${Date.now()}-${fileName}`);
  fs.writeFileSync(filePath, Buffer.from(await response.arrayBuffer()));
  return filePath;
}

async function ensureMedia(strapi, { fileName, alternativeText, caption, source }) {
  const existing = await strapi.db.query(UID.file).findOne({ where: { name: fileName } });
  if (existing) return existing;
  const filePath = await downloadPhoto(source.id, fileName);
  try {
    const stats = fs.statSync(filePath);
    const [uploaded] = await strapi.plugin("upload").service("upload").upload({
      data: { fileInfo: { name: fileName, alternativeText, caption: `${caption} Source CATAAS : ${source.id}.` } },
      files: { filepath: filePath, originalFilename: fileName, mimetype: "image/jpeg", size: stats.size },
    });
    return uploaded;
  } finally {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
}

function catData(catIndex, sheetIndex, status, moods) {
  const kitten = catIndex % 7 === 0;
  const age = kitten ? 0 : (catIndex % 12) + 1;
  const moodNames = [MOODS[catIndex % MOODS.length], MOODS[(catIndex + 2) % MOODS.length]];
  return {
    name: CAT_NAMES[catIndex],
    birthDate: kitten ? dateYearsAgo(0, 120 + catIndex) : dateYearsAgo(age, catIndex * 5),
    gender: ["female", "male", "not_determined"][catIndex % 3],
    identified: status !== "perdu" && catIndex % 6 !== 0,
    vaccinated: !["en_soins", "perdu"].includes(status) && catIndex % 5 !== 0,
    sterilized: !kitten && catIndex % 4 !== 0,
    decontaminate: status !== "perdu",
    dogFriendly: ["yes", "unknown", "no"][catIndex % 3],
    catFriendly: ["yes", "yes", "unknown", "no"][catIndex % 4],
    childFriendly: ["unknown", "yes", "no", "yes"][catIndex % 4],
    catStatus: status,
    trappingDate: dateYearsAgo(0, 25 + sheetIndex * 9),
    medicalHistory: MEDICAL_NOTES[catIndex % MEDICAL_NOTES.length],
    cat_moods: { connect: moodNames.map((name) => ({ documentId: moods.get(name).documentId })) },
  };
}

async function ensureCatsAndSheets(strapi, users, moods, tariffs, pools) {
  const sheets = [];
  let catIndex = 0;
  let generalImageIndex = 0;
  let duoImageIndex = 0;
  for (let sheetIndex = 0; sheetIndex < SHEET_COUNT; sheetIndex += 1) {
    const isDuo = DUO_SHEET_INDEXES.has(sheetIndex);
    const status = STATUSES[sheetIndex];
    const cats = [];
    for (let position = 0; position < (isDuo ? 2 : 1); position += 1) {
      const name = CAT_NAMES[catIndex];
      cats.push(await upsertPublished(strapi, UID.cat, { name: { $eq: name } }, catData(catIndex, sheetIndex, status, moods)));
      catIndex += 1;
    }
    const source = isDuo ? pools.duo[duoImageIndex++] : pools.general[generalImageIndex++];
    const names = cats.map((cat) => cat.name).join(" et ");
    const media = await ensureMedia(strapi, {
      fileName: `scf-demo-fiche-${String(sheetIndex + 1).padStart(2, "0")}.jpg`,
      alternativeText: `${names}, ${isDuo ? "chats proposés" : "chat proposé"} à l'adoption`,
      caption: `Photo de démonstration pour la fiche de ${names}.`,
      source,
    });
    const linkedVolunteer = users.volunteers[sheetIndex % users.volunteers.length];
    const backupVolunteer = users.volunteers[(sheetIndex + 1) % users.volunteers.length];
    const tariff = isDuo
      ? tariffs.get("Adoption duo inséparable")
      : tariffs.get(cats.some((cat) => new Date(cat.birthDate) > new Date(Date.now() - 244 * DAY)) ? "Adoption chaton (moins de 8 mois)" : "Adoption chat adulte");
    const data = {
      isDuo,
      cats: { set: cats.map((cat) => ({ documentId: cat.documentId })) },
      linkedVolunteer: { id: linkedVolunteer.id },
      backupVolunteer: { id: backupVolunteer.id },
      tarification: { documentId: tariff.documentId },
      images: [media.id],
      description: `${names} ${isDuo ? "forment un duo très attaché qui devra être adopté ensemble. Ils sont" : "est"} ${TEMPERAMENTS[sheetIndex % TEMPERAMENTS.length]}. ${isDuo ? "Ils recherchent" : "Le foyer idéal serait"} ${IDEAL_HOMES[sheetIndex % IDEAL_HOMES.length]}. Une rencontre avec ${linkedVolunteer.username}, bénévole référent, permettra de confirmer que le cadre de vie convient.`,
    };
    const existing = await findDraft(strapi, UID.sheet, { cats: { documentId: { $eq: cats[0].documentId } } });
    const sheet = existing
      ? await strapi.documents(UID.sheet).update({ documentId: existing.documentId, data })
      : await strapi.documents(UID.sheet).create({ data });
    await publish(strapi, UID.sheet, sheet.documentId);
    sheets.push({ sheet, cats, status });
    console.log(`[${sheetIndex + 1}/${SHEET_COUNT}] ${names} — ${status} — photo existante ${source.id}`);
  }
  return sheets;
}

async function ensureBlog(strapi, author, pools) {
  const categories = new Map();
  for (const definition of BLOG_CATEGORIES) {
    categories.set(definition.slug, await upsertPlain(strapi, UID.category, { slug: { $eq: definition.slug } }, definition));
  }
  const posts = [];
  for (const [index, definition] of BLOG_POSTS.entries()) {
    const source = pools.article[index];
    const cover = await ensureMedia(strapi, {
      fileName: `scf-demo-article-${String(index + 1).padStart(2, "0")}.jpg`,
      alternativeText: `Illustration de l'article « ${definition.title} »`,
      caption: `Photo de démonstration pour l'article « ${definition.title} » .`,
      source,
    });
    const { category, imageTags: _imageTags, ...fields } = definition;
    posts.push(await upsertPublished(strapi, UID.post, { slug: { $eq: definition.slug } }, {
      ...fields,
      cover: cover.id,
      category: { documentId: categories.get(category).documentId },
      author: { id: author.id },
    }));
  }
  return posts;
}

function requestData(index, target, submittedBy) {
  const [firstName, lastName, streetAddress, postalCode, city, phone, profession] = APPLICANTS[index];
  const hasChildren = index % 3 === 0;
  const apartment = index % 2 === 0;
  const hasOtherAnimals = index % 4 === 0;
  return {
    agreementAccepted: true,
    animalName: target.cats.map((cat) => cat.name).join(" & "),
    firstName,
    lastName,
    birthDate: dateYearsAgo(26 + index),
    streetAddress,
    postalCode,
    city,
    phone,
    email: `${slugPart(firstName)}.${slugPart(lastName)}+demande${index + 1}@demo-scf.fr`,
    householdComposition: index % 3 === 0 ? "couple" : "seul",
    roommateCount: 0,
    hasChildren,
    childrenCount: hasChildren ? 1 + (index % 2) : 0,
    childrenAges: hasChildren ? "7 et 11 ans" : null,
    householdAgreement: true,
    isEmployed: true,
    profession,
    workSchedule: index % 3 === 0 ? "Télétravail deux jours par semaine" : "Horaires de journée réguliers",
    aloneTimePerDay: index % 3 === 0 ? "3 heures" : "6 heures",
    housingType: apartment ? "appartement" : "maison",
    housingArea: `${48 + index * 4} m²`,
    animalLivingSpace: apartment ? "interieur" : "les_deux",
    environmentType: apartment ? "ville" : "lotissement",
    nearBusyRoad: "non",
    canGoOutside: apartment ? "non" : "oui",
    apartmentFloor: apartment ? `${1 + (index % 5)}e étage` : null,
    windowsSecured: apartment ? "oui" : null,
    plansToSecureWindows: apartment,
    hasGarden: apartment ? "non" : "oui",
    gardenArea: apartment ? null : `${80 + index * 10} m²`,
    gardenFencedDetails: apartment ? null : "Jardin entièrement clos par une clôture de 1,80 m",
    hasBalconyOrTerrace: apartment ? "oui" : "non",
    balconyOrTerraceArea: apartment ? "8 m²" : null,
    balconySecurityDetails: apartment ? "Filet de protection posé sur toute la hauteur" : null,
    hasOtherAnimals,
    otherAnimalsDetails: hasOtherAnimals ? "Un chat adulte calme, vacciné et suivi annuellement" : null,
    otherAnimalsSterilized: hasOtherAnimals ? "oui" : "non_applicable",
    otherAnimalsOwnedDuration: hasOtherAnimals ? "4 ans" : null,
    additionalNotes: "Nous avons prévu une pièce calme pour les premiers jours et respecterons le rythme d'adaptation conseillé par le refuge.",
    responsibilityCommitmentAccepted: true,
    processingStatus: ["pending", "in_review", "approved", "rejected"][index % 4],
    catSheet: { documentId: target.sheet.documentId },
    submittedBy: { id: submittedBy.id },
  };
}

async function ensureRequests(strapi, sheets, adopters) {
  const requests = [];
  for (let index = 0; index < APPLICANTS.length; index += 1) {
    const target = sheets[index % 18];
    const data = requestData(index, target, adopters[index % adopters.length]);
    const record = await upsertPublished(strapi, UID.request, { email: { $eq: data.email }, animalName: { $eq: data.animalName } }, data);
    await strapi.db.query(UID.request).update({ where: { id: record.id }, data: { createdAt: isoFromNow(-((index * 3) % 28)) } });
    requests.push(record);
  }
  return requests;
}

async function ensureAbsences(strapi, users) {
  const definitions = [
    [users.volunteers[0], "Congés d'été", -1, 4, "approved"],
    [users.volunteers[0], "Formation premiers secours animalier", 8, 10, "pending"],
    [users.volunteers[1], "Déplacement familial", 13, 17, "pending"],
    [users.volunteers[1], "Week-end prolongé", 24, 27, "approved"],
    [users.volunteers[2], "Rendez-vous médical", 5, 6, "pending"],
    [users.volunteers[2], "Indisponibilité personnelle", -18, -15, "rejected"],
  ];
  const absences = [];
  for (const [user, reason, start, end, status] of definitions) {
    const data = { startDate: isoFromNow(start, 8), endDate: isoFromNow(end, 18), reason, absence_status: status, user: { id: user.id } };
    absences.push(await upsertPublished(strapi, UID.absence, { reason: { $eq: reason }, user: { id: { $eq: user.id } } }, data));
  }
  const adminReason = "Congés administratrice avec délégation";
  const adminAbsence = await upsertPublished(strapi, UID.absence, { reason: { $eq: adminReason }, user: { id: { $eq: users.admin.id } } }, {
    startDate: isoFromNow(35, 8), endDate: isoFromNow(41, 18), reason: adminReason, absence_status: "approved", user: { id: users.admin.id },
  });
  await upsertPlain(strapi, UID.delegation, { sourceAbsenceDocumentId: { $eq: adminAbsence.documentId } }, {
    startDate: isoFromNow(35, 8), endDate: isoFromNow(41, 18), isActive: true,
    sourceAbsenceDocumentId: adminAbsence.documentId, adminUser: { id: users.admin.id }, delegateUser: { id: users.volunteers[0].id },
  });
  return [...absences, adminAbsence];
}

async function ensureConversations(strapi, sheets, adopters, volunteers) {
  const openingMessages = [
    "Bonjour, pourriez-vous me préciser comment se passe son quotidien en famille d'accueil ?",
    "Nous avons déjà un chat. Une cohabitation progressive vous semble-t-elle adaptée ?",
    "Je vis en appartement avec un balcon sécurisé. Ce cadre pourrait-il lui convenir ?",
    "Serait-il possible d'organiser une première rencontre cette semaine ?",
    "Pouvez-vous me confirmer que ses vaccins et son suivi vétérinaire sont à jour ?",
    "Comment réagit-il lorsqu'il reste seul quelques heures dans la journée ?",
    "Nous avons deux enfants calmes. Pensez-vous que leur âge est compatible avec son caractère ?",
    "Merci pour cette fiche. J'aimerais échanger avant de déposer ma demande d'adoption.",
  ];
  const conversations = [];
  for (let index = 0; index < openingMessages.length; index += 1) {
    const target = sheets[index];
    const requester = adopters[index % adopters.length];
    const existing = await strapi.documents(UID.conversation).findMany({
      filters: { catSheet: { documentId: { $eq: target.sheet.documentId } }, requester: { id: { $eq: requester.id } } },
      pagination: { page: 1, pageSize: 1 },
    });
    const data = { catSheet: { documentId: target.sheet.documentId }, requester: { id: requester.id }, lastMessageAt: isoFromNow(-index) };
    const conversation = existing[0]
      ? await strapi.documents(UID.conversation).update({ documentId: existing[0].documentId, data })
      : await strapi.documents(UID.conversation).create({ data });
    const reply = `Bonjour, merci pour votre message. ${target.cats[0].name} est ${TEMPERAMENTS[index % TEMPERAMENTS.length]}. Je vous propose un échange téléphonique pour préparer une rencontre.`;
    for (const [author, content] of [[requester, openingMessages[index]], [volunteers[index % volunteers.length], reply]]) {
      const messages = await strapi.documents(UID.message).findMany({
        filters: { conversation: { documentId: { $eq: conversation.documentId } }, content: { $eq: content } },
        pagination: { page: 1, pageSize: 1 },
      });
      if (!messages[0]) await strapi.documents(UID.message).create({ data: { conversation: { documentId: conversation.documentId }, author: { id: author.id }, content } });
    }
    conversations.push(conversation);
  }
  return conversations;
}

async function verify(strapi) {
  const [sheets, tariffs, posts, volunteers] = await Promise.all([
    strapi.documents(UID.sheet).findMany({ status: "published", pagination: { page: 1, pageSize: 100 }, populate: { cats: true, images: true, tarification: true, linkedVolunteer: true } }),
    strapi.documents(UID.price).findMany({ status: "published", filters: { label: { $in: TARIFFS.map((item) => item.label) } }, pagination: { page: 1, pageSize: 10 } }),
    strapi.documents(UID.post).findMany({ status: "published", filters: { slug: { $in: BLOG_POSTS.map((item) => item.slug) } }, pagination: { page: 1, pageSize: 10 }, populate: { cover: true } }),
    strapi.db.query(UID.user).findMany({ where: { role: { name: "Volunteer" }, email: { $contains: "@demo-scf.fr" } } }),
  ]);
  const demoSheets = sheets.filter((sheet) => sheet.images?.some((image) => image.name?.startsWith("scf-demo-fiche-")));
  if (demoSheets.length !== SHEET_COUNT) throw new Error(`Verification failed: ${demoSheets.length}/${SHEET_COUNT} demo cat sheets found.`);
  if (demoSheets.some((sheet) => !sheet.cats?.length || !sheet.images?.length || !sheet.tarification || !sheet.linkedVolunteer)) throw new Error("Verification failed: a cat sheet is missing a required relation.");
  if (tariffs.length !== 3) throw new Error(`Verification failed: expected 3 demo tariffs, found ${tariffs.length}.`);
  if (posts.length !== 3 || posts.some((post) => !post.cover)) throw new Error("Verification failed: expected 3 published illustrated posts.");
  if (volunteers.length !== 3) throw new Error(`Verification failed: expected 3 demo volunteers, found ${volunteers.length}.`);
}

async function main() {
  const context = await compileStrapi();
  const app = await createStrapi(context).load();
  try {
    console.log("\nCréation/mise à jour du jeu de démonstration…");
    const roles = await ensureRoles(app);
    const users = await ensureUsers(app, roles);
    const moods = await ensureMoods(app);
    const tariffs = await ensureTariffs(app);
    const pools = await getImagePools();
    const sheets = await ensureCatsAndSheets(app, users, moods, tariffs, pools);
    const posts = await ensureBlog(app, users.admin, pools);
    const requests = await ensureRequests(app, sheets, users.adopters);
    const absences = await ensureAbsences(app, users);
    const conversations = await ensureConversations(app, sheets, users.adopters, users.volunteers);
    await verify(app);
    console.log("\nJeu de démonstration prêt :");
    console.log(`- ${sheets.reduce((sum, item) => sum + item.cats.length, 0)} chats dans ${sheets.length} fiches illustrées`);
    console.log("- 3 tarifs partagés, sans création d'un tarif par fiche");
    console.log(`- ${posts.length} articles publiés avec couverture`);
    console.log(`- ${users.volunteers.length} bénévoles, ${users.adopters.length} adoptants et 1 administratrice`);
    console.log(`- ${requests.length} demandes, ${conversations.length} conversations et ${absences.length} absences`);
    console.log("\nComptes de connexion (mot de passe commun) :");
    console.log(`- Admin : sophie.laurent@demo-scf.fr / ${PASSWORD}`);
    console.log(`- Bénévole : camille.bernard@demo-scf.fr / ${PASSWORD}`);
    console.log(`- Adoptant : lea.dubois@demo-scf.fr / ${PASSWORD}`);
    console.log("\nUne nouvelle exécution met à jour ces données et ne les duplique pas.");
  } finally {
    await app.destroy();
  }
}

main().catch((error) => {
  console.error("Échec du seed de démonstration :", error);
  process.exitCode = 1;
});
