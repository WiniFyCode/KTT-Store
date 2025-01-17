const express = require('express');
const router = express.Router();
const addressController = require('../../controllers/customer/address.controller');
const { authenticateCustomer } = require('../../middlewares/auth.middleware');

router.use(authenticateCustomer);

router.route('/')
    .get(addressController.getMyAddresses)
    .post(addressController.addAddress);

router.route('/:id')
    .put(addressController.updateAddress)
    .delete(addressController.deleteAddress);

router.post('/:id/default', addressController.setDefaultAddress);

module.exports = router;
