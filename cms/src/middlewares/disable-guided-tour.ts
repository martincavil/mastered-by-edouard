/**
 * Middleware to completely disable the guided tour
 * This intercepts requests to guided-tour endpoints and returns empty responses
 */
export default () => {
  return async (ctx, next) => {
    // Intercept guided tour requests and return empty data
    if (ctx.url === "/admin/guided-tour-meta") {
      ctx.status = 200;
      ctx.body = {
        data: null,
      };
      return;
    }

    await next();
  };
};
