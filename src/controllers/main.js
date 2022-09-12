const db = require('../database/models');
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');

const mainController = {

  home: (req, res) => {
    db.Book.findAll({
      include: [{ association: 'authors' }]
    })
      .then((books) => {
        res.render('home', { books });
      })
      .catch((error) => console.log(error));
  },

  bookDetail: (req, res) => {

    db.Book.findByPk(req.params.id, {
      include: [{ association: 'authors' }]
    })
      .then((book) => {
        res.render('bookDetail', { book });
      })
      .catch((error) => console.log(error));

  },

  bookSearch: (req, res) => {
    res.render('search', { books: [] });
  },

  bookSearchResult: (req, res) => {

    db.Book.findAll({
      where: {
        title: {
          [Op.like]: `%${req.body.title}%`
        }
      }
    })
      .then((books) => {
        res.render('search', { books });
      })
      .catch((error) => console.log(error));

  },

  deleteBook: (req, res) => {

    let bookId = req.params.id;

    db.Booksauthors.destroy({ where: { BookId: bookId } })
        .then(() => {
            db.Book.destroy({ where: { id: bookId } })
        }).then(() => {
            return res.redirect('/')
        })

  },

  authors: (req, res) => {
    db.Author.findAll()
      .then((authors) => {
        res.render('authors', { authors });
      })
      .catch((error) => console.log(error));
  },


  authorBooks: (req, res) => {

    db.Author.findByPk(req.params.id, {
      include: [{ association: 'books' }]
    })
      .then((author) => {
        res.render('authorBooks', { author });
      })
      .catch((error) => console.log(error));

  },


  register: (req, res) => {
    res.render('register');
  },


  processRegister: (req, res) => {
    db.User.create({
      Name: req.body.name,
      Email: req.body.email,
      Country: req.body.country,
      Pass: bcrypt.hashSync(req.body.password, 10),
      CategoryId: req.body.category
    })
      .then(() => {
        res.redirect('/');
      })
      .catch((error) => console.log(error));
  },



  login: (req, res) => {
    res.render('login');
  },

  processLogin: (req, res) => {


    db.User.findOne({ where: { Email: req.body.email } }).then(function (usuario) {
      if (usuario) {
        let isOkPassword = bcrypt.compareSync(req.body.password, usuario.Pass);
        if (isOkPassword) {

          req.session.usuarioLogueado = usuario;
          //res.cookie("usuarioLogueado", usuario);

          return res.redirect("/");

        } else {
          return res.render("login", { errors: [{ msg: "Contraseña incorrecta." }] });
        }
      }
      return res.render("login", { errors: [{ msg: "Usuario no registrado." }] });
    })

  },

  logout: (req, res) => {
    req.session.destroy();
    //res.clearCookie("usuarioLogueado");
    res.redirect('/');

  },


  edit: (req, res) => {
    db.Book.findByPk(req.params.id, {
      include: [{ association: 'authors' }]
    })
      .then((book) => {
        res.render('editBook', { book });
      })
      .catch((error) => console.log(error));
  },


  processEdit: (req, res) => {

    let bookId = req.params.id;

    db.Book.update(
      {
        title: req.body.title,
        cover: req.body.cover,
        description: req.body.description,
      },
      {
        where: { id: bookId }
      })
      .then(() => { return res.redirect('/books/detail/' + bookId) })
  }

};

module.exports = mainController;
