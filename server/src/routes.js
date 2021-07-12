import { findRoot, aggregateChildren } from './utils';
import { useCache, breakCache } from './middleware/cache';

export const routes = (app) => {
  app.get('/api', (req, res) => {
    res.send('Hello there!');
  });

  app.get('/api/graph', useCache, async (req, res) => {
    const { models, redis, cachedResponse } = res.locals;
    let response;

    if (cachedResponse) {
      // Send cached response and perform an early exit.
      return res.send(cachedResponse);
    }

    try {
      const items = await models.Item.aggregate([
        {
          $graphLookup: {
            from: 'items',
            startWith: '$name',
            connectFromField: 'name',
            connectToField: 'parent',
            maxDepth: 0,
            as: 'children',
          },
        },
      ]);

      // Tree aggregation
      const rootNode = findRoot(items);
      aggregateChildren(items, rootNode.children);
      response = rootNode;

      // Cache the response in Redis
      await redis.setAsync(req.path, JSON.stringify(rootNode));
    } catch (error) {
      console.error(error);
    }

    return res.send(response);
  });

  app.post('/api/graph', breakCache, (req, res) => {
    res.send('Caching on /api/graph has been cleared');
  });
};

export default routes;
