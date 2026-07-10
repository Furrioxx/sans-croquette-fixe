/**
 * tarification controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::tarification.tarification', ({ strapi }) => ({
  async create(ctx) {
    const response = await super.create(ctx);
    const documentId = response?.data?.documentId;

    if (documentId) {
      await strapi.documents('api::tarification.tarification').publish({ documentId });
    }

    return response;
  },

  async update(ctx) {
    const response = await super.update(ctx);
    const documentId = response?.data?.documentId;

    if (documentId) {
      await strapi.documents('api::tarification.tarification').publish({ documentId });
    }

    return response;
  },
}));
