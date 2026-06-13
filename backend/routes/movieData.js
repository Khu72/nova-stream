import { Router } from 'express';
const router = Router();

import { getResults, getMovie, getListedMovies } from '../controllers/movieDataController.js'

router.get('/search/:name', getResults);
router.get('/:id', getMovie)
router.post('/list', getListedMovies);

export default router;