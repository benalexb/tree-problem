module.exports = app => {
  console.log('Entered Routes...'); // bbarreto_debug

  app.get('/api/graph', (req, res) => {
    // Just some hello world stuff for now...
    res.send('Hello there!');
  });
};