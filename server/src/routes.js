import { findRoot, aggregateChildren } from './utils';

export const routes = (app, models) => {
  const { Item } = models;

  app.get('/api/graph', async (req, res) => {
    try {
      const items = await Item.aggregate([
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
      const rootNode = findRoot(items);
      aggregateChildren(items, rootNode.children);
      res.send(rootNode);
    } catch (error) {
      console.error(error);
    }
  });
};

export default routes;
