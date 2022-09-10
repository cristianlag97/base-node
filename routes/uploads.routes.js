const { Router } = require('express');
const { check } = require('express-validator');
const { uploadFiles, showImage, updateImageCloudinary, updateImage } = require('../controllers/uploads');
const { allowedCollections } = require('../helpers/db-validators');
const validateFile = require('../middlewares/validate-file');
const { validateInput } = require('../middlewares/validate-inputs');

const router = Router();

router.post('/',validateFile, uploadFiles);

router.put('/:collection/:id', [
  validateFile,
  check('id', 'El id debe ser un id de mongo').isMongoId(),
  check('collection').custom( c => allowedCollections(c, ['users', 'products']) ),
  validateInput
], updateImageCloudinary);
// ], updateImage);

router.get('/:collection/:id', [
  check('id', 'El id debe ser un id de mongo').isMongoId(),
  check('collection').custom( c => allowedCollections(c, ['users', 'products']) ),
  validateInput
], showImage)


module.exports = router;