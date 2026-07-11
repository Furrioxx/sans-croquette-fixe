/**
 * cat-sheet controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::cat-sheet.cat-sheet', ({ strapi }) => ({
  async create(ctx) {
    const response = await super.create(ctx);
    const documentId = response?.data?.documentId;

    if (documentId) {
      await strapi.documents('api::cat-sheet.cat-sheet').publish({ documentId });

      try {
        await strapi.service('api::cat-sheet.newsletter').sendNewCatSheetNotification(documentId);
      } catch (err) {
        strapi.log.error('Failed to send newsletter emails for cat sheet', err);
      }
    }

    return response;
  },

  async update(ctx) {
    const response = await super.update(ctx);
    const documentId = response?.data?.documentId;

    if (documentId) {
      await strapi.documents('api::cat-sheet.cat-sheet').publish({ documentId });
    }

    return response;
  },
}));
