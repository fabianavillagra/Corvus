
import { Router } from 'express';
import * as condominiumController from './condominium.controller.js';

const router = Router();

router.get('/', condominiumController.getAll);
router.get('/:id', condominiumController.getById);
router.post('/', condominiumController.create);
router.put('/:id', condominiumController.update);
router.patch('/:id', condominiumController.patch);
router.delete('/:id', condominiumController.remove);

export default router;