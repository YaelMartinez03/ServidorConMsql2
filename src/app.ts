import express from 'express';
import productRoutes from './routes/products.routes';

const app = express();

app.use(express.json());

// Montar las rutas de productos
app.use('/api/products', productRoutes);

export default app;