import express from 'express'
import path from 'path';
import session from 'express-session';
import flash from 'connect-flash';

const views = express()

views.use(session({
  secret:'baileys',
  saveUninitialized: true,
  resave: true
}));

views.use(express.urlencoded({ extended: true }))

views.use(flash());

views.use((req, res, next)=>{
  res.locals.mensagemSucesso = req.flash('mensagemSucesso')
  res.locals.mensagemErro = req.flash('mensagemErro')
  next()
})

views.use(express.static(path.join(path.resolve(), 'views')));

views.set('views engine', 'ejs');

export default views