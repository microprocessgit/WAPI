import { Router } from 'express'
import * as controller from './controller'

const router = Router()

router.get('/',controller.login)

router.get('/logout', controller.logout)

router.get('/form', controller.cadastro)

router.get('/cadastrados', controller.buscarCadastro)

router.post('/form', controller.acessar)

router.post('/', controller.cadastrar)

router.post('/editar', controller.editarCadastro)

router.get('/excluir/:id', controller.deletarCadastro)



export default router