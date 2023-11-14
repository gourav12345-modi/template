ategory')
app.get('/api/status', (req, res) => {
  res.json({ message: 'ok' });
});
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`listing on http://localhost:${PORT}`);
});
