const { Router } = require('express');
const { check } = require('express-validator');
const {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} = require('../controllers/product.controller');
const { existsProductById, diferentProduct, existsCategoryById } = require('../helpers/db-validators');
const { validateJWT, validateInput, isAdminRole } = require('../middlewares');

const router = Router();

//* Obtener todas las categorias - publico *//
router.get('/', getProducts);

//* Obtener una categoría por id - publico *//
router.get('/:id', [
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(existsProductById),
  validateInput //* valida todo lo que venga del req *//
], getProduct);

//* Crear categoría - privado - cualquier persona con un token valido *//
router.post('/', [
  validateJWT,
  check('name', 'El nombre es obligatorio').not().isEmpty(),//* prepara el error en la request *//
  check('category', 'No es un Id válido').isMongoId(),
  check('category').custom(existsCategoryById),
  // check('category').custom(findCategory),//* mejorar validación haciendo una consulta a su tabla por nombre *//
  validateInput //* recibe los errores en el caso de que hayan errores en los checks *//
], createProduct);

//* Actualizar categoria por id - privado - cualquier persona con un token valido *//
router.put('/:id', [
  validateJWT,
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(existsProductById),
  check('name' , 'El nombre es obligaotrio para actualizar').not().isEmpty(),
  check('name').custom(diferentProduct),
  validateInput
], updateProduct);

//* Borrar una categoria - privado - admin *//
router.delete('/:id', [
  validateJWT,
  isAdminRole,
  // check('category', 'No es un ID válido').isMongoId(),
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(existsProductById),
  validateInput
],deleteProduct);



module.exports = router;