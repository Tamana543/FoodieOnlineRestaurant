const productController = require('../controllers/shop')
const rootAuth = require('../middleware/roots_auth') ;
const express= require('express');



const router = express.Router()

router.get('/',rootAuth,productController.getShopPage)

router.get('/products',rootAuth,productController.getProductsShop)

router.get('/products/:productId',rootAuth,productController.getProductBId)// This way you can add and go through a randum id url and render it based its id, you can name it anything not only productId

router.get('/cart',rootAuth,productController.getCartShop)

router.post('/cart',rootAuth,productController.postCartShop)
router.post('/cart-delete-item', rootAuth,productController.postDelCardView)

router.get('/order',rootAuth,productController.getOrderShop)

router.post('/order_items',rootAuth,productController.postOrderShop)

router.get('/checkout', rootAuth, productController.getCheckout);

router.post('/create-checkout-session',rootAuth,productController.createCheckoutSession)
router.get('/checkout/success',productController.getCheckoutSuccess)
router.get('/checkout/cancel',productController.getCheckout)


router.get('/order/:orderId',rootAuth,productController.getInvoice)

// router.get('/checkout',rootAuth,productController.getCheckout)


module.exports = router;