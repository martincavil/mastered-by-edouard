import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    locales: [],
    tutorials: false,
    notifications: { releases: false },
  },
  bootstrap(app: StrapiApp) {
    // Protection complète contre les tours - approche défensive
    try {
      // Désactive les configurations de tutorial
      if (app.configurations) {
        app.configurations.tutorials = false;
        if (app.configurations.tutorials) {
          delete app.configurations.tutorials;
        }
      }

      // Neutralise tous les tours de tous les plugins
      if (app.plugins) {
        Object.keys(app.plugins).forEach((pluginName) => {
          try {
            const plugin = app.plugins[pluginName];
            if (plugin) {
              // Neutralise tours avec un objet Proxy pour intercepter tous les accès
              Object.defineProperty(plugin, 'tours', {
                get: () => [],
                set: () => {},
                configurable: false,
                enumerable: false,
              });
            }
          } catch (e) {
            // Ignore les erreurs pour les plugins individuels
            console.warn(`Could not disable tours for plugin ${pluginName}`, e);
          }
        });
      }

      // Patch global pour éviter les accès à tours
      if (typeof window !== 'undefined') {
        const originalDefineProperty = Object.defineProperty;
        Object.defineProperty = function (obj: any, prop: string, descriptor: PropertyDescriptor) {
          if (prop === 'tours' && descriptor.value !== undefined) {
            descriptor.value = [];
          }
          return originalDefineProperty(obj, prop, descriptor);
        };
      }
    } catch (error) {
      console.error('Error disabling guided tours:', error);
    }
  },
};
