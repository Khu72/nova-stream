import { Router } from 'express';
const router = Router();

import { checkIfFileExist, getOwnedMovies, getSignedUrl } from '../controllers/storageController.js';

router.get('/movie/:id', checkIfFileExist);
router.get('/get/movies', getOwnedMovies);
router.get('/get/:id', getSignedUrl);

export default router;