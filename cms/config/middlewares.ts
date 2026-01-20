export default [
  'strapi::logger',
  'strapi::errors',
  // Custom middleware to disable guided tour
  'global::disable-guided-tour',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: ['*'], // Allow all origins for now, you can restrict this later
      headers: '*',
    }
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
