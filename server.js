// server.js
const express = require('express');
const app = express();
const port = 5000;

app.use(express.json());

// Sample API route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
