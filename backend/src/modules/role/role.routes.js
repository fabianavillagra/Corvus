
import { Router } from 'express';
import * as roleController from './role.controller.js';

const router = Router();

router.get('/', roleController.getAll);
router.get('/:id', roleController.getById);
router.post('/', roleController.create);
router.put('/:id', roleController.update);
router.patch('/:id', roleController.patch);
router.delete('/:id', roleController.remove);

export default router;