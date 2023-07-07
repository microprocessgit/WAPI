import { Router } from 'express';
import chatRoutes from './chats';
import contactRoutes from './contacts';
import groupRoutes from './groups';
import messageRoutes from './messages';
import sessionRoutes from './sessions';
import clientsRoutes from '../clients/routes';
import chatRoute from '../chat/routes';


const router = Router();
router.use('/sessions', sessionRoutes);
router.use('/:sessionId/chats', chatRoutes);
router.use('/:sessionId/contacts', contactRoutes);
router.use('/:sessionId/groups', groupRoutes);
router.use('/:sessionId/messages', messageRoutes);
router.use('/app/client', clientsRoutes)
router.use('/app/chat', chatRoute)

export default router;
