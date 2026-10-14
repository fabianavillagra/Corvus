import express from 'express';
import condominiumRoutes from './modules/condominium/condominium.routes.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use('/api/condominiums', condominiumRoutes);



app.use(errorHandler);

export default app;
