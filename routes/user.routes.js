const { Router } = require('express');
const { check } = require('express-validator');
const { userGet, userPut, userPost, userPatch, userDelete } = require('../controllers/user.controller');
const { isRoleValidate, emailExist, existUserById } = require('../helpers/db-validators');
// const { validateInput } = require('../middlewares/validate-inputs');
// const { validateJWT } = require('../middlewares/validate-jwt');
// const { isAdminRole, addRole } = require('../middlewares/validate-role');
const {validateInput, validateJWT, isAdminRole, addRole} = require('../middlewares');

const router = Router();

router.get('/', userGet);

router.delete('/:id',[
  validateJWT,
  // isAdminRole,
  addRole('ADMIN_ROLE', 'SALES_ROLE'),
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(existUserById),//* prepara el error en la request *//
  validateInput //* valida todo lo que venga del req (recibe los errores en el caso de que hayan errores en los checks)*//
], userDelete);

router.put('/:id',[
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(existUserById),
  check('role').custom( isRoleValidate ),
  validateInput
], userPut);

router.post('/',[
  check('name', 'El nombre es obligatorio').not().isEmpty(),
  check('password', 'La contraseña debe tener mínimo 6 caracteres').isLength({min: 6}),
  check('email', 'El correo no es válido').isEmail(),
  check('email').custom( emailExist ),
  //* esto se hará contra la base de datos *//
  // check('role', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
  check('role').custom( isRoleValidate ),
  validateInput
], userPost);

router.patch('/', userPatch);


module.exports = router;