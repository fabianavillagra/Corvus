import { Router } from 'express';

import * as personController from './person.controller.js';

const router = Router();

router.get('/', personController.getAll);
router.get('/:id', personController.getById);
router.post('/', personController.create);
router.put('/:id', personController.update);
router.patch('/:id', personController.patch);
router.delete('/:id', personController.remove);

export default router;