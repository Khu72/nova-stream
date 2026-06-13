import express from 'express';
import cors from 'cors';

import authRoutes from './routes/user.js'
import movieRoutes from './routes/movieData.js'
import storageRoutes from './routes/storage.js'

const app = express();

app.use(cors());
app.use(express.json());

app.use('/user', authRoutes);
app.use('/movie', movieRoutes)
app.use('/storage', storageRoutes)

const PORT = 4000
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})