const express = require('express');
const routes = require('./routes/route');
const prisma = require('./config/db');

const app = express();
const port = 3000;

app.use(express.json());
app.use('/api', routes);

// Tes Koneksi Prisma
prisma.$connect()
  .then(() => console.log('Database connected'))
  .catch((err) => console.log('Error: ' + err));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});