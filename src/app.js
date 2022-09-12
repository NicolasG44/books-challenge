const express = require('express');
const session = require("express-session");
const mainRouter = require('./routes/main');
const userLogged = require("./middlewares/userLogged");
const userAdmin = require("./middlewares/userAdmin");

//const cookieParser = require('cookie-parser');

const app = express();

app.use(session({
  secret: "Secreto",
  resave: false,
  saveUninitialized: false,
}));
app.use(userLogged);
app.use(userAdmin);

// app.use(cookieParser());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', 'src/views');

app.use('/', mainRouter);

app.listen(3000, () => {
  console.log('listening in http://localhost:3000');
});
