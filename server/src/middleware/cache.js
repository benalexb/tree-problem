/**
 * Using the request's path, this middleware checks Redis for a cached response.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export const useCache = async (req, res, next) => {
  try {
    res.locals.cachedResponse = JSON.parse(await res.locals.redis.getAsync(req.path));
    await next();
  } catch (error) {
    console.error(error);
  }
};

/**
 * Using the request's path, this middleware deletes the cached response from Redis.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export const breakCache = async (req, res, next) => {
  try {
    await res.locals.redis.delAsync(req.path);
    await next();
  } catch (error) {
    console.error(error);
  }
};
