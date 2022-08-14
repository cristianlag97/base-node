
const { Router } = require('express');
const { userGet, userPut, userPost, userPatch, userDelete } = require('../controllers/user.controller');

const router = Router();

router.get('/', userGet);
router.delete('/', userDelete);
router.put('/:id', userPut);
router.post('/', userPost);
router.patch('/', userPatch);


module.exports = router;