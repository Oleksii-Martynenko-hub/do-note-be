require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const usersRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');

const app = express();

const port = process.env.PORT
const URI = process.env.MONGO_URI;

mongoose
  .connect(URI,
  { 
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then((res) => console.log('Connected!'))
  .catch((err) => console.log('error connect', err))
  

app.use(express.json());
app.use(usersRoutes)
app.use(authRoutes);
app.use((req, res, next) => res.status(404).send(['page not found']));

app.listen(port);
