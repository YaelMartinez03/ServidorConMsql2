import { Router } from 'express';
import { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  updateProductPrice, 
  deleteProduct 
} from '../controllers/products.controller';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.patch('/:id/price', updateProductPrice); // Ruta para cambiar solo el precio
router.delete('/:id', deleteProduct); // Baja lógica

export default router;