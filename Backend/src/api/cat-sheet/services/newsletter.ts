const getAbsoluteMediaUrl = (url: string, backendUrl: string): string => {
  if (!url) return '';
  if (url.startsWith('http')) return url;

  return `${backendUrl}${url}`;
};

const buildEmailHtml = (catSheet: any, catSheetUrl: string, unsubscribeUrl: string, backendUrl: string): string => {
  const cats = catSheet.cats ?? [];
  const cover = catSheet.images?.[0];
  const coverUrl = cover ? getAbsoluteMediaUrl(cover.url, backendUrl) : null;
  const names = cats.map((cat: any) => cat.name).join(' & ');

  return `
    <!doctype html>
    <html>
      <body style="font-family: sans-serif; color: #222; max-width: 600px; margin: 0 auto;">
        <h1 style="font-size: 20px;">${catSheet.isDuo ? 'Un duo de chats' : 'Un nouveau chat'} recherche une famille : ${names}</h1>
        ${coverUrl ? `<img src="${coverUrl}" alt="${names}" style="width: 100%; max-width: 600px; border-radius: 8px;" />` : ''}
        ${cats
          .map(
            (cat: any) => `
              <h2 style="font-size: 16px; margin-top: 16px;">${cat.name}</h2>
              <p style="font-size: 14px; color: #555;">
                ${cat.gender === 'male' ? 'Mâle' : cat.gender === 'female' ? 'Femelle' : 'Genre non déterminé'}
              </p>
            `,
          )
          .join('')}
        ${catSheet.description ? `<p style="font-size: 14px; line-height: 1.5;">${catSheet.description}</p>` : ''}
        <p style="margin-top: 24px;">
          <a href="${catSheetUrl}" style="background: #d97706; color: white; padding: 10px 16px; border-radius: 6px; text-decoration: none;">
            Voir la fiche complète
          </a>
        </p>
        <hr style="margin-top: 32px; border: none; border-top: 1px solid #eee;" />
        <p style="font-size: 12px; color: #999;">
          Vous recevez cet e-mail car vous êtes inscrit(e) à la newsletter de Sans Croquettes Fixes.
          <a href="${unsubscribeUrl}">Se désinscrire</a>
        </p>
      </body>
    </html>
  `;
};

export default () => ({
  async sendNewCatSheetNotification(documentId: string) {
    const frontendUrl = process.env.FRONTEND_URL || '';
    const backendUrl = process.env.BACKEND_URL || '';

    const catSheet = await strapi.documents('api::cat-sheet.cat-sheet').findOne({
      documentId,
      populate: { cats: true, images: true },
    });

    if (!catSheet) return;

    const subscribers = await strapi.db.query('plugin::users-permissions.user').findMany({
      where: { newsletterOptIn: true, confirmed: true, blocked: false },
    });

    if (subscribers.length === 0) return;

    const catSheetUrl = `${frontendUrl}/adopt/${documentId}`;
    const catNames = (catSheet.cats ?? []).map((cat: any) => cat.name).join(' & ') || 'Un chat';

    for (const subscriber of subscribers) {
      const unsubscribeUrl = `${backendUrl}/api/newsletter/unsubscribe?token=${subscriber.newsletterUnsubscribeToken}`;

      try {
        await strapi.plugin('email').service('email').send({
          to: subscriber.email,
          subject: `Nouveau chat à l'adoption : ${catNames}`,
          html: buildEmailHtml(catSheet, catSheetUrl, unsubscribeUrl, backendUrl),
        });
      } catch (err) {
        strapi.log.error(`Failed to send newsletter email to user ${subscriber.id}`, err);
      }
    }
  },
});
