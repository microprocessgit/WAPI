import { Router } from 'express'
import * as controller from './controller'

const router = Router()

router.get('/', controller.chat)
router.get('/chat-vazio', controller.chatVazio)
router.post('/delete', controller.deleteMessages)


export default router