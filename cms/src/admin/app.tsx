import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    locales: [],
    // Désactive complètement les tours guidés
    tutorials: false,
    notifications: { releases: false },
  },
  bootstrap(app: StrapiApp) {
    // Désactive les tours au niveau de l'application
    if (app.configurations && app.configurations.tutorials) {
      app.configurations.tutorials = false;
    }

    // Empêche l'initialisation des tours
    if (app.plugins) {
      Object.keys(app.plugins).forEach((pluginName) => {
        const plugin = app.plugins[pluginName];
        if (plugin && plugin.tours) {
          plugin.tours = [];
        }
      });
    }
  },
};
