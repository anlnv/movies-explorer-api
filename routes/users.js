const router = require('express').Router();

const { updateUserInfoValidation } = require('../middlewares/validation');

const {
  updateUserInfo,
  getCurrentUser,
} = require('../controllers/users');

router.get('/me', getCurrentUser);
router.patch('/me', updateUserInfoValidation, updateUserInfo);

module.exports = router;
