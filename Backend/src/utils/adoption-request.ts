const ADOPTION_REQUEST_UID = 'api::adoption-request.adoption-request' as any

export const ADOPTION_REQUEST_POPULATE = {
  catSheet: {
    populate: {
      cats: true,
      linkedVolunteer: {
        populate: {
          role: true,
        },
      },
      backupVolunteer: {
        populate: {
          role: true,
        },
      },
      images: true,
    },
  },
  submittedBy: {
    populate: {
      role: true,
    },
  },
}

const CONDITIONAL_FIELDS_BY_KEY: Record<string, string[]> = {
  householdComposition: ['householdCompositionOther', 'roommateCount'],
  hasChildren: ['childrenCount', 'childrenAges'],
  householdAgreement: ['householdDisagreementReason'],
  isEmployed: ['profession', 'workSchedule'],
  housingType: [
    'housingTypeOther',
    'apartmentFloor',
    'windowsSecured',
    'windowsSecuredOther',
    'plansToSecureWindows',
    'hasGarden',
    'hasGardenOther',
    'livingPlaceDetails',
    'gardenArea',
    'gardenFencedDetails',
    'hasBalconyOrTerrace',
    'balconyOrTerraceArea',
    'balconySecurityDetails',
  ],
  animalLivingSpace: ['animalLivingSpaceOther'],
  environmentType: ['environmentTypeOther'],
  nearBusyRoad: ['nearBusyRoadOther'],
  canGoOutside: ['canGoOutsideOther'],
  windowsSecured: ['windowsSecuredOther'],
  hasGarden: ['hasGardenOther', 'gardenArea', 'gardenFencedDetails'],
  hasBalconyOrTerrace: ['balconyOrTerraceArea', 'balconySecurityDetails'],
  hasOtherAnimals: ['otherAnimalsDetails', 'otherAnimalsSterilized', 'otherAnimalsOwnedDuration'],
}

const trimString = (value: unknown) => {
  if (typeof value !== 'string') {
    return value
  }

  const trimmed = value.trim()
  return trimmed.length ? trimmed : null
}

export const sanitizeAdoptionRequestPayload = (payload: Record<string, unknown>) => {
  const data = Object.fromEntries(
    Object.entries(payload).map(([key, value]) => [key, trimString(value)]),
  ) as Record<string, unknown>

  if (data.householdComposition !== 'colocation') {
    data.roommateCount = null
  }

  if (data.householdComposition !== 'autre') {
    data.householdCompositionOther = null
  }

  if (data.hasChildren !== true) {
    data.childrenCount = null
    data.childrenAges = null
  }

  if (data.householdAgreement !== false) {
    data.householdDisagreementReason = null
  }

  if (data.isEmployed !== true) {
    data.profession = null
    data.workSchedule = null
  }

  if (data.housingType !== 'appartement') {
    data.apartmentFloor = null
    data.windowsSecured = null
    data.windowsSecuredOther = null
    data.plansToSecureWindows = null
    data.hasGarden = null
    data.hasGardenOther = null
    data.gardenArea = null
    data.gardenFencedDetails = null
    data.hasBalconyOrTerrace = null
    data.balconyOrTerraceArea = null
    data.balconySecurityDetails = null
  }

  if (data.housingType !== 'autre') {
    data.housingTypeOther = null
  }

  if (data.animalLivingSpace !== 'autre') {
    data.animalLivingSpaceOther = null
  }

  if (data.environmentType !== 'autre') {
    data.environmentTypeOther = null
  }

  if (data.nearBusyRoad !== 'autre') {
    data.nearBusyRoadOther = null
  }

  if (data.canGoOutside !== 'autre') {
    data.canGoOutsideOther = null
  }

  if (data.windowsSecured !== 'autre') {
    data.windowsSecuredOther = null
  }

  if (data.hasGarden !== 'autre') {
    data.hasGardenOther = null
  }

  if (data.hasGarden === 'non') {
    data.gardenArea = null
    data.gardenFencedDetails = null
  }

  if (data.hasBalconyOrTerrace === 'non') {
    data.balconyOrTerraceArea = null
    data.balconySecurityDetails = null
  }

  if (data.hasOtherAnimals !== true) {
    data.otherAnimalsDetails = null
    data.otherAnimalsSterilized = 'non_applicable'
    data.otherAnimalsOwnedDuration = null
  }

  Object.entries(CONDITIONAL_FIELDS_BY_KEY).forEach(([key, fields]) => {
    if (data[key] === null || data[key] === undefined) {
      fields.forEach((field) => {
        data[field] = null
      })
    }
  })

  return data
}

export const hasActiveApprovedAbsence = async (strapi: any, userId: number, referenceDate: string) => {
  const absences = await strapi.documents('api::absence.absence').findMany({
    status: 'draft',
    filters: {
      user: {
        id: {
          $eq: userId,
        },
      },
      absence_status: {
        $eq: 'approved',
      },
      startDate: {
        $lte: referenceDate,
      },
      endDate: {
        $gte: referenceDate,
      },
    },
    pagination: {
      page: 1,
      pageSize: 1,
    },
  })

  return absences.length > 0
}

export const getAuthorizedCatSheetDocumentIds = async (strapi: any, user: { id: number }) => {
  const now = new Date().toISOString()

  const [linkedSheets, backupSheets] = await Promise.all([
    strapi.documents('api::cat-sheet.cat-sheet').findMany({
      status: 'draft',
      filters: {
        linkedVolunteer: {
          id: {
            $eq: user.id,
          },
        },
      },
      fields: ['documentId'],
    }),
    strapi.documents('api::cat-sheet.cat-sheet').findMany({
      status: 'draft',
      filters: {
        backupVolunteer: {
          id: {
            $eq: user.id,
          },
        },
      },
      fields: ['documentId'],
      populate: {
        linkedVolunteer: true,
      },
    }),
  ])

  const backupEligibility = await Promise.all(
    backupSheets.map(async (sheet: any) => {
      const linkedVolunteerId = sheet.linkedVolunteer?.id

      if (!linkedVolunteerId) {
        return null
      }

      const isEligible = await hasActiveApprovedAbsence(strapi, linkedVolunteerId, now)
      return isEligible ? sheet.documentId : null
    }),
  )

  return Array.from(
    new Set([
      ...linkedSheets.map((sheet: any) => sheet.documentId),
      ...backupEligibility.filter(Boolean),
    ]),
  )
}

export const getAdoptionRequestWithRelations = async (strapi: any, documentId: string) => {
  return await strapi.documents(ADOPTION_REQUEST_UID).findOne({
    documentId,
    status: 'draft',
    populate: ADOPTION_REQUEST_POPULATE as any,
  })
}
