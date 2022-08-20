const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignIn } = require('../controllers/auth.controller');
const { validateInput } = require('../middlewares/validate-inputs');

const router = Router();

router.post('/login',[
  check('email', 'El correo es obligatorio').isEmail(),
  check('password', 'La contraseña es obligatoria').not().isEmpty(),
  validateInput
], login);

router.post('/google',[
  check('id_token', 'El token de Google es necesario').not().isEmpty(),
  validateInput
], googleSignIn);

module.exports = router;