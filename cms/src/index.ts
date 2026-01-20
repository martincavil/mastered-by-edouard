// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    // Fix guided tour issue by setting preferedLanguage for all admin users
    try {
      const users = await strapi.entityService.findMany('admin::user', {
        limit: 100,
      });

      for (const user of users) {
        if (!user.preferedLanguage) {
          await strapi.entityService.update('admin::user', user.id, {
            data: {
              preferedLanguage: 'en',
            },
          });
        }
      }
    } catch (error) {
      console.log('Bootstrap: Could not update admin users', error);
    }
  },
};
