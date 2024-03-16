// import
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { PORT = 3000 } = process.env;
const { notFound, serverError } = require('./middlewares/errorHandler.middlewares');

// konfigurasi
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'views')));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// router index
app.get('/', (req, res) => {
  return res.status(200).json({ status: true, message: 'Welcome to pinjol app', err: null, data: null });
});

// error handler
app.use(notFound);
app.use(serverError);

app.listen(PORT, () => console.log('Running on port', PORT));
