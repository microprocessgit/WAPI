import { find, update, insert, deleteClient } from '../services/client';


let usuario = process.env.USER;
let senha = process.env.PASSWORD;

export function login(req: any, res: any){
  res.render('login.ejs');
};

export function logout(req: any, res: any){
  req.session.destroy();
  res.render('login.ejs');
};

export function cadastro(req: any, res: any){
  if (req.session.usuario) {
    res.render('cadastrar.ejs');
  } else {
    res.redirect('/app/client/');
  }
};

export function buscarCadastro(req: any, res: any){
  if (req.session.usuario) {
    find().then(clients => {
      res.render('cadastros.ejs', { dados: clients, alertaDelete: '' });
    }); 
  } else {
    res.redirect('/app/client/');
  }
};

export function acessar(req: any, res: any){
  if (req.body.usuario == usuario && req.body.senha == senha) {
    req.session.usuario = usuario
    res.redirect('/app/client/form');
  } else {
    req.flash('mensagemErro', 'Usuário/senha incorreto!');
    res.redirect('/app/client/');
  }
};

export function cadastrar(req: any, res: any){
  if (req.session.usuario) {
    insert(req.body).then(clients => {
      if (clients) {
        req.flash('mensagemSucesso', 'Sessão cadastrada com sucesso!');
        res.redirect('/app/client/form');
      } else {
        req.flash('mensagemErro', 'Não foi possível cadastrar a sessão');
        res.redirect('/app/client/form');
      }
    })
  } else {
    res.redirect('/app/client/');
  }
};

export function editarCadastro(req: any, res: any){
  if (req.session.usuario) {
    update(req).then(clients => {
      if (clients) {
        req.flash('mensagemSucesso', 'Atualização realizada com sucesso!');
        res.redirect('/app/client/cadastrados');

      } else {
        req.flash('mensagemErro', 'Ocorreu um erro, tente novamente!');
        res.redirect('/app/client/cadastrados');
      }
    });
  } else {
    res.redirect('/app/client/');
  }
};

export function deletarCadastro(req: any, res: any){
  if (req.session.usuario) {
    deleteClient(req.params.id).then(clients => {
      if (clients) {
        req.flash('mensagemSucesso', 'Operação realizada com sucesso!');
        res.redirect('/app/client/cadastrados');
      } else {
        req.flash('mensagemErro', 'Ocorreu um erro, tente novamente!');
        res.redirect('/app/client/cadastrados');
      }
    });
  } else {
    res.redirect('/app/client/');
  }
};
