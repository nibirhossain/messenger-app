const router = require('express').Router();

const { getFriends, messageUploadDB, getMessages, ImageMessageSend } = require('../controller/messengerController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/get-friends', authMiddleware, getFriends);
router.post('/send-message', authMiddleware, messageUploadDB);
router.get('/get-message/:id', authMiddleware, getMessages);
router.post('/image-message-send', authMiddleware, ImageMessageSend);

module.exports = router;