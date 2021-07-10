export const routes = (app, models) => {
  const { Item } = models;

  app.get('/api/graph', async (req, res) => {
    try {
      const items = await Item.find();
      res.send(items);
    } catch (error) {
      console.error(error);
    }
  });
};

export default routes;
