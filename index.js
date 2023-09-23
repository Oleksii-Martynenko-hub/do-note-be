require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
// const cron = require('node-cron');

// const envsToHeroku = require('./src/utils/envs-to-heroku');
const usersRoutes = require('./src/routes/users');
const authRoutes = require('./src/routes/auth');
const errorMiddleware = require('./src/middlewares/error-middleware');
const authMiddleware = require('./src/middlewares/auth-middleware');
// const usersControllers = require('./src/controllers/users')

// const task = cron.schedule('*/5 * * * * *', () =>  {
//   usersControllers.deleteOldTokens();
// });

// task.start();
// task.destroy();

const { PORT, MONGO_URI } = process.env;

// envsToHeroku(); // add environment variables from env.json to .env and heroku config

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use(authRoutes);
app.use(authMiddleware, usersRoutes);

app.use(errorMiddleware);

app.use((req, res, next) => res.status(404).send(['page not found']));

const start = async () => {
  try {
    await mongoose.connect(MONGO_URI, { 
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    
    app.listen(PORT, () => console.log(`Server started on ${PORT}`));
  } catch (e) {console.log(e);}
}

start();
