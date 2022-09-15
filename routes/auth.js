const { Router } = require('express');
const { check } = require('express-validator');
const { createUser, loginUser, revalidateToken } = require('../controllers/auth.js');
const { validateFields } = require('../middlewares/validate-fileds.js');
const { validateJWT } = require('../middlewares/validate-jwt.js');

const router = Router();

router.post('/new',[
    check('name', 'The name is required').not().isEmpty(),
    check('email', 'The email is required').isEmail(),
    check('password', 'The password is required').isLength({min: 6}),
    validateFields
], createUser);

router.post('/', [
    check('email', 'The email is required').isEmail(),
    check('password', 'The password is required').isLength({min: 6}),
    validateFields
], loginUser);

router.get('/renew', validateJWT, revalidateToken);

module.exports = router;