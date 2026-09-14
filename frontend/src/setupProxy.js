module.exports = function(app) {
  app.post('/api/generate-solution', (req, res) => {
    res.json({ solution: '# Solution\n\nProfessional development of your project within budget.' });
  });
  app.post('/api/send-solution', (req, res) => {
    res.json({ success: true });
  });
};
