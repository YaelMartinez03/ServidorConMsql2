import { Request, Response } from 'express';
import { pool } from '../conf/dbConnection';

// 1. Obtener todos los productos activos
export const getProducts = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE status = TRUE');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener producto por ID (Validando entero positivo y existencia)
export const getProductById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0 || !Number.isInteger(id)) {
    return res.status(400).json({ error: 'El ID debe ser un número entero positivo' });
  }

  try {
    const [rows]: any = await pool.query('SELECT * FROM products WHERE id = ? AND status = TRUE', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado o inactivo' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 2. Crear un producto (Validando que price sea numérico y mayor que cero)
export const createProduct = async (req: Request, res: Response) => {
  const { name, price, description } = req.body;

  if (!name || price === undefined || typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ error: 'Datos inválidos. El precio debe ser un número mayor a cero y el nombre es obligatorio.' });
  }

  try {
    const [result]: any = await pool.query(
      'INSERT INTO products (name, price, description, status) VALUES (?, ?, ?, TRUE)',
      [name, price, description || '']
    );
    res.status(201).json({ 
      message: 'Producto creado con éxito', 
      data: { id: result.insertId, name, price, description, status: true } 
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'No se pudo crear el producto' });
  }
};

// 3. Actualización completa de un producto
export const updateProduct = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name, price, description } = req.body;

  if (isNaN(id) || id <= 0 || !Number.isInteger(id)) {
    return res.status(400).json({ error: 'El ID debe ser un número entero positivo' });
  }

  if (!name || price === undefined || typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ error: 'Datos inválidos. El precio debe ser un número mayor a cero.' });
  }

  try {
    const [result]: any = await pool.query(
      'UPDATE products SET name = ?, price = ?, description = ? WHERE id = ? AND status = TRUE',
      [name, price, description, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado para actualizar' });
    }

    res.json({ message: 'Producto actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Cambiar solo el precio de un producto
export const updateProductPrice = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { price } = req.body;

  if (isNaN(id) || id <= 0 || !Number.isInteger(id)) {
    return res.status(400).json({ error: 'El ID debe ser un número entero positivo' });
  }

  if (price === undefined || typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ error: 'El precio debe ser un número mayor a cero' });
  }

  try {
    const [result]: any = await pool.query(
      'UPDATE products SET price = ? WHERE id = ? AND status = TRUE',
      [price, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado para cambiar precio' });
    }

    res.json({ message: 'Precio actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar precio:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 4 y 5. Baja lógica del producto (Cambiar status a FALSE)
export const deleteProduct = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0 || !Number.isInteger(id)) {
    return res.status(400).json({ error: 'El ID debe ser un número entero positivo' });
  }

  try {
    const [result]: any = await pool.query(
      'UPDATE products SET status = FALSE WHERE id = ? AND status = TRUE',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado o ya estaba inactivo' });
    }

    res.json({ message: 'Producto dado de baja exitosamente' });
  } catch (error) {
    console.error('Error al dar de baja el producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};