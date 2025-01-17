const express = require('express');
const router = express.Router();
const userController = require('../../controllers/admin/user.controller');
const { authenticateAdmin } = require('../../middlewares/auth.middleware');

router.use(authenticateAdmin);

router.route('/')
    .get(userController.getAllUsers);

router.route('/:id')
    .get(userController.getUser)
    .put(userController.updateUserStatus);

router.get('/stats/overview', userController.getUserStats);
router.get('/:id/activity', userController.getUserActivity);

module.exports = router;
