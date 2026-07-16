import { hasActiveApprovedAbsence } from '../../../utils/adoption-request'

const wrapEmailHtml = (title: string, bodyHtml: string, ctaUrl: string, ctaLabel: string): string => `
  <!doctype html>
  <html>
    <body style="font-family: sans-serif; color: #222; max-width: 600px; margin: 0 auto;">
      <h1 style="font-size: 20px;">${title}</h1>
      ${bodyHtml}
      <p style="margin-top: 24px;">
        <a href="${ctaUrl}" style="background: #d97706; color: white; padding: 10px 16px; border-radius: 6px; text-decoration: none;">
          ${ctaLabel}
        </a>
      </p>
      <hr style="margin-top: 32px; border: none; border-top: 1px solid #eee;" />
      <p style="font-size: 12px; color: #999;">
        Sans Croquettes Fixes
      </p>
    </body>
  </html>
`

const buildNewRequestEmailHtml = (adoptionRequest: any, requestsUrl: string): string =>
  wrapEmailHtml(
    `Nouvelle demande d'adoption pour ${adoptionRequest.animalName}`,
    `
      <p style="font-size: 14px; line-height: 1.5;">
        ${adoptionRequest.firstName} ${adoptionRequest.lastName} a soumis une demande d'adoption pour ${adoptionRequest.animalName}.
      </p>
    `,
    requestsUrl,
    'Voir la demande',
  )

const buildApprovedEmailHtml = (adoptionRequest: any, requestsUrl: string): string =>
  wrapEmailHtml(
    `Votre demande d'adoption pour ${adoptionRequest.animalName} a été approuvée`,
    `
      <p style="font-size: 14px; line-height: 1.5;">
        Bonne nouvelle ! Votre demande d'adoption pour ${adoptionRequest.animalName} a été approuvée.
      </p>
    `,
    requestsUrl,
    'Voir mes demandes',
  )

const buildRejectedEmailHtml = (adoptionRequest: any, requestsUrl: string): string =>
  wrapEmailHtml(
    `Votre demande d'adoption pour ${adoptionRequest.animalName} n'a pas été retenue`,
    `
      <p style="font-size: 14px; line-height: 1.5;">
        Nous vous informons que votre demande d'adoption pour ${adoptionRequest.animalName} n'a malheureusement pas été retenue.
      </p>
    `,
    requestsUrl,
    'Voir mes demandes',
  )

export default () => ({
  async sendNewAdoptionRequestNotification(adoptionRequest: any) {
    const frontendUrl = process.env.FRONTEND_URL || ''
    const requestsUrl = `${frontendUrl}/dashboard/adoption-requests`

    const linkedVolunteer = adoptionRequest.catSheet?.linkedVolunteer
    const backupVolunteer = adoptionRequest.catSheet?.backupVolunteer

    let recipientEmail: string | undefined

    if (linkedVolunteer?.id) {
      const isOnLeave = await hasActiveApprovedAbsence(strapi, linkedVolunteer.id, new Date().toISOString())
      recipientEmail = isOnLeave ? backupVolunteer?.email : linkedVolunteer.email

      if (isOnLeave && !backupVolunteer?.email) {
        strapi.log.warn(
          `Adoption request ${adoptionRequest.documentId}: linked volunteer is on leave and no backup volunteer is set, no notification sent`,
        )
      }
    } else {
      recipientEmail = backupVolunteer?.email
    }

    if (!recipientEmail) return

    try {
      await strapi.plugin('email').service('email').send({
        to: recipientEmail,
        subject: `Nouvelle demande d'adoption pour ${adoptionRequest.animalName}`,
        html: buildNewRequestEmailHtml(adoptionRequest, requestsUrl),
      })
    } catch (err) {
      strapi.log.error(`Failed to send new adoption request email to ${recipientEmail}`, err)
    }
  },

  async sendAdoptionRequestApprovedNotification(adoptionRequest: any) {
    const frontendUrl = process.env.FRONTEND_URL || ''
    const requestsUrl = `${frontendUrl}/mes-demandes-adoption`

    if (!adoptionRequest.email) return

    try {
      await strapi.plugin('email').service('email').send({
        to: adoptionRequest.email,
        subject: `Votre demande d'adoption pour ${adoptionRequest.animalName} a été approuvée`,
        html: buildApprovedEmailHtml(adoptionRequest, requestsUrl),
      })
    } catch (err) {
      strapi.log.error(`Failed to send adoption request approved email to ${adoptionRequest.email}`, err)
    }
  },

  async sendAdoptionRequestRejectedNotification(adoptionRequest: any) {
    const frontendUrl = process.env.FRONTEND_URL || ''
    const requestsUrl = `${frontendUrl}/mes-demandes-adoption`

    if (!adoptionRequest.email) return

    try {
      await strapi.plugin('email').service('email').send({
        to: adoptionRequest.email,
        subject: `Votre demande d'adoption pour ${adoptionRequest.animalName} n'a pas été retenue`,
        html: buildRejectedEmailHtml(adoptionRequest, requestsUrl),
      })
    } catch (err) {
      strapi.log.error(`Failed to send adoption request rejected email to ${adoptionRequest.email}`, err)
    }
  },
})
