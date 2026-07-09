/**
 * One-off dev seeding script: generates varied CatSheet/Cat test data with
 * real cat photos (from cataas.com) so the frontend discover/adopt features
 * have enough data to exercise filters and ranking.
 *
 * Usage: node scripts/seed-cat-sheets.js [count]
 * Run from the Backend/ directory. Boots Strapi without opening an HTTP
 * server (no port conflict with an already-running `strapi develop`).
 */
const path = require('path')
const os = require('os')
const fs = require('fs')
const { createStrapi } = require('@strapi/strapi')

const MOOD_NAMES = ['Joueur', 'Calme', 'Affectueux', 'Craintif', 'Indépendant', 'Curieux', 'Sociable', 'Câlin']

const MALE_NAMES = ['Simba', 'Milo', 'Leo', 'Tigrou', 'Felix', 'Oscar', 'Charlie', 'Max', 'Loki', 'Salem', 'Gribouille', 'Ziggy']
const FEMALE_NAMES = ['Luna', 'Mimi', 'Nala', 'Bella', 'Chloe', 'Minou', 'Olive', 'Pepper', 'Suzy', 'Zoe', 'Cannelle', 'Praline']
const NEUTRAL_NAMES = ['Nino', 'Pixel', 'Biscuit', 'Nuage', 'Ori']

const FRIENDLY_VALUES = ['yes', 'no', 'unknown']
const ADOPTABLE_STATUSES = ['en_refuge', 'en_famille_accueil']
const OTHER_STATUSES = ['adopte', 'en_soins', 'decede', 'perdu']

const DESCRIPTIONS = [
  "Un chat adorable à la recherche d'une famille aimante.",
  'Très joueur, adore les jouets et les câlins le soir.',
  'Un peu craintif au début mais se révèle très affectueux une fois en confiance.',
  "Idéal pour une famille avec d'autres animaux, très sociable.",
  'A besoin d’un foyer calme pour se reconstruire après un parcours difficile.',
  'Adore observer les oiseaux par la fenêtre pendant des heures.',
  'Réclame des câlins dès qu’une main se tend vers lui.',
  'Indépendant mais toujours ravi de retrouver ses humains le soir.',
  null,
  null,
]

const MEDICAL_HISTORIES = [
  'Aucun antécédent médical particulier.',
  'Traitement antiparasitaire renouvelé tous les 3 mois.',
  'Ancienne fracture de la patte avant, complètement rétablie.',
  null,
  null,
  null,
]

const SOLO_TARIFICATION_LABELS = ['Tarif standard', "Frais d'adoption"]
const DUO_TARIFICATION_LABELS = ['Tarif duo', "Frais d'adoption (les 2)"]

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function pickSome(arr, n) {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n)
}

function randomBool(pTrue = 0.5) {
  return Math.random() < pTrue
}

function randomDateWithinYears(maxYears, minYears = 0) {
  const now = Date.now()
  const span = (maxYears - minYears) * 365 * 24 * 60 * 60 * 1000
  const past = now - (minYears * 365 * 24 * 60 * 60 * 1000 + Math.random() * span)
  return new Date(past).toISOString().slice(0, 10)
}

async function downloadCatImage(seed) {
  const res = await fetch(`https://cataas.com/cat?width=600&_=${seed}`)
  if (!res.ok) throw new Error(`Failed to download image: ${res.status}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  const tmpPath = path.join(os.tmpdir(), `cat-seed-${seed}-${Date.now()}.jpg`)
  fs.writeFileSync(tmpPath, buffer)
  return tmpPath
}

async function uploadImage(strapi, filepath, name) {
  const stats = fs.statSync(filepath)
  const [uploaded] = await strapi.plugin('upload').service('upload').upload({
    data: {},
    files: {
      filepath,
      originalFilename: name,
      mimetype: 'image/jpeg',
      size: stats.size,
    },
  })
  fs.unlinkSync(filepath)
  return uploaded.id
}

async function getVolunteerIds(strapi) {
  const volunteers = await strapi.db.query('plugin::users-permissions.user').findMany({
    populate: { role: true },
  })
  const ids = volunteers.filter((u) => u.role?.name === 'Volunteer').map((u) => u.id)
  if (!ids.length) {
    throw new Error(
      'No user with the "Volunteer" role was found. cat-sheet.linkedVolunteer is now required — ' +
        'create at least one Volunteer account before running this seed script.',
    )
  }
  return ids
}

async function ensureMoods(strapi) {
  const existing = await strapi.documents('api::cat-mood.cat-mood').findMany({ pagination: { pageSize: 100 } })
  const existingNames = new Set(existing.map((m) => m.name))
  const all = [...existing]
  for (const name of MOOD_NAMES) {
    if (existingNames.has(name)) continue
    const doc = await strapi.documents('api::cat-mood.cat-mood').create({ data: { name } })
    await strapi.documents('api::cat-mood.cat-mood').publish({ documentId: doc.documentId })
    all.push(doc)
  }
  return all
}

function buildCatData(gender, status, moodDocIds) {
  const isKitten = randomBool(0.25)
  const names = gender === 'male' ? MALE_NAMES : gender === 'female' ? FEMALE_NAMES : NEUTRAL_NAMES
  return {
    name: pick(names),
    birthDate: isKitten ? randomDateWithinYears(1) : randomDateWithinYears(12, 1),
    gender,
    vaccinated: randomBool(0.75),
    identified: randomBool(0.7),
    sterilized: randomBool(0.65),
    decontaminate: randomBool(0.6),
    dogFriendly: pick(FRIENDLY_VALUES),
    catFriendly: pick(FRIENDLY_VALUES),
    childFriendly: pick(FRIENDLY_VALUES),
    cat_moods: pickSome(moodDocIds, Math.floor(Math.random() * 3) + 1),
    catStatus: status,
    trappingDate: randomBool(0.4) ? randomDateWithinYears(3) : null,
    medicalHistory: pick(MEDICAL_HISTORIES),
  }
}

async function createCat(strapi, data) {
  const doc = await strapi.documents('api::cat.cat').create({ data })
  await strapi.documents('api::cat.cat').publish({ documentId: doc.documentId })
  return doc
}

function buildTarificationData(isDuo) {
  if (isDuo) {
    return { label: pick(DUO_TARIFICATION_LABELS), price: pick([220, 240, 260, 280, 300]) }
  }
  return { label: pick(SOLO_TARIFICATION_LABELS), price: pick([80, 100, 120, 150, 180]) }
}

async function createTarification(strapi, data) {
  const doc = await strapi.documents('api::tarification.tarification').create({ data })
  await strapi.documents('api::tarification.tarification').publish({ documentId: doc.documentId })
  return doc
}

async function createCatSheet(strapi, { isDuo, catDocIds, imageIds, description, tarificationDocId, linkedVolunteerId }) {
  const doc = await strapi.documents('api::cat-sheet.cat-sheet').create({
    data: {
      isDuo,
      cats: catDocIds,
      images: imageIds,
      description,
      tarification: tarificationDocId,
      linkedVolunteer: linkedVolunteerId,
    },
  })
  await strapi.documents('api::cat-sheet.cat-sheet').publish({ documentId: doc.documentId })
  return doc
}

async function main() {
  const count = Number(process.argv[2]) || 30
  const appContext = await require('@strapi/core').compileStrapi()
  const app = await createStrapi(appContext).load()

  try {
    console.log('Ensuring cat moods exist...')
    const moods = await ensureMoods(app)
    const moodDocIds = moods.map((m) => m.documentId)

    console.log('Looking up volunteer accounts...')
    const volunteerIds = await getVolunteerIds(app)

    let seedCounter = 0
    for (let i = 0; i < count; i++) {
      const isDuo = randomBool(0.25)
      // ~75% adoptable so the discover/adopt filters have plenty of data,
      // ~25% other statuses to verify they get correctly excluded.
      const status = randomBool(0.75) ? pick(ADOPTABLE_STATUSES) : pick(OTHER_STATUSES)
      const catCount = isDuo ? 2 : 1

      const catDocIds = []
      for (let c = 0; c < catCount; c++) {
        const gender = pick(['male', 'female', 'not_determined'])
        const catData = buildCatData(gender, status, moodDocIds)
        const cat = await createCat(app, catData)
        catDocIds.push(cat.documentId)
      }

      const imageCount = isDuo ? 2 : Math.random() < 0.85 ? 1 : 0
      const imageIds = []
      for (let img = 0; img < imageCount; img++) {
        seedCounter += 1
        const filepath = await downloadCatImage(seedCounter)
        const imageId = await uploadImage(app, filepath, `cat-${seedCounter}.jpg`)
        imageIds.push(imageId)
      }

      const tarification = await createTarification(app, buildTarificationData(isDuo))

      const sheet = await createCatSheet(app, {
        isDuo,
        catDocIds,
        imageIds,
        description: pick(DESCRIPTIONS),
        tarificationDocId: tarification.documentId,
        linkedVolunteerId: pick(volunteerIds),
      })

      console.log(
        `[${i + 1}/${count}] Created cat-sheet ${sheet.documentId} (status=${status}, duo=${isDuo}, images=${imageIds.length}, tarification=${tarification.label} ${tarification.price}€)`,
      )
    }

    console.log('Done seeding cat sheets.')
  } finally {
    await app.destroy()
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
