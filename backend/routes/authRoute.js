const router = require('express').Router();

const { userRegister, userLogin } = require('../controller/authController');

router.post('/user-login', userLogin);
router.post('/user-registration', userRegister);

module.exports = router;