import express from 'express';
import condominiumRoutes from './modules/condominium/condominium.routes.js';
import personRoutes from './modules/person/person.routes.js';
import userRoutes from './modules/user/user.routes.js';
import roleRoutes from './modules/role/role.routes.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});


app.use('/api/condominiums', condominiumRoutes);
app.use('/api/persons', personRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);



app.use(errorHandler);

export default app;
