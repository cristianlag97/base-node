const { Router } = require('express');
const { check } = require('express-validator');
const {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} = require('../controllers/category.controller');
const { existsCategoryById, diferentCategory } = require('../helpers/db-validators');
const {validateInput, validateJWT, isAdminRole} = require('../middlewares');

const router = Router();

//* Obtener todas las categorias - publico *//
router.get('/', getCategories);

//* Obtener una categoría por id - publico *//
router.get('/:id',[
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(existsCategoryById),
  validateInput //* valida todo lo que venga del req *//
], getCategory);

//* Crear categoría - privado - cualquier persona con un token valido *//
router.post('/', [
  validateJWT,
  check('name', 'El nombre es obligatorio').not().isEmpty(),//* prepara el error en la request *//
  validateInput //* recibe los errores en el caso de que hayan errores en los checks *//
], createCategory);

//* Actualizar categoria por id - privado - cualquier persona con un token valido *//
router.put('/:id', [
  validateJWT,
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(existsCategoryById),
  check('name' , 'El nombre es obligaotrio para actualizar').not().isEmpty(),
  check('name').custom(diferentCategory),
  validateInput
], updateCategory)

//* Borrar una categoria - privado - admin *//
router.delete('/:id', [
  validateJWT,
  isAdminRole,
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(existsCategoryById),
  validateInput
], deleteCategory)


module.exports = router;