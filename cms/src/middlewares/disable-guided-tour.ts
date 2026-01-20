/**
 * Middleware to completely disable the guided tour
 * This intercepts requests to guided-tour endpoints and returns empty responses
 */
export default () => {
  return async (ctx, next) => {
    // Intercept all guided tour related requests
    if (ctx.url.includes('guided-tour') || ctx.url.includes('/admin/users/me')) {
      if (ctx.url.includes('/admin/users/me')) {
        // For /admin/users/me, pass through but modify response
        await next();
        if (ctx.body && ctx.body.data) {
          ctx.body.data.tours = [];
          ctx.body.data.preferedLanguage = null;
        }
        return;
      }

      // For guided-tour endpoints, return empty response
      ctx.status = 200;
      ctx.body = {
        data: null,
      };
      return;
    }

    await next();
  };
};
