const express = require('express');
const app = express();
const port = 5000;

app.use(express.json()); // parse JSON body

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
