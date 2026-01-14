export default [
  'strapi::logger',
  'strapi::errors',
  // Custom middleware to disable guided tour
  'global::disable-guided-tour',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
