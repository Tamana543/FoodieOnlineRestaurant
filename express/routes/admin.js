const express = require('express')
const productController = require('../controllers/admin')
const rootAuth = require('../middleware/roots_auth') ;
const {check,body} = require('express-validator')
const router = express.Router() // Create a new router 
// Router is a mini express application that can be used to handle routes and middleware
router.get('/add-product',rootAuth,productController.getAddProduct)
// ,[
//      check('email').isEmail().withMessage("Incorrect Password or email :/")
// ]

router.post('/add-product',
     [
          //  check('imageUrl').notEmpty().withMessage('We need an image from your product :| ').isURL().withMessage('The given imageUrl from your product is not correct :| ').withMessage('The image url is not valide :|'),
          check('title').isString().isLength({min : 3}).trim().withMessage('The title is not valid :| '),
          check('price').notEmpty().withMessage('We need to know the price of your product :| ').isFloat().isLength({min: 1}).withMessage('The given price is not okay :('),
          check('description').notEmpty().withMessage('You can not leave description empty :| ').isLength({min : 5}).withMessage("You should write at least 5 charachter about your product..").trim()
     ]
     ,
      rootAuth, productController.postAddProduct)

router.get('/products', rootAuth, productController.showAdminProducts)

router.get('/edit-product/:productID', rootAuth, productController.getEditProduct)

router.post('/edit-product',  [
          check('title').isString().isLength({min : 3}).trim().withMessage('The title is not valid :| '),
          check('price').notEmpty().withMessage('We need to know from your product :| ').isFloat().isLength({min: 1}).withMessage('The given price is not okay :('),
          check('description').notEmpty().withMessage('You can not leave description empty :| ').isLength({min : 5}).withMessage("You should write at least 5 charachter about your product..").trim()
     ]
     , rootAuth, productController.postEditedProduct)

router.delete('/product/:productId', rootAuth,productController.deleteProduct)
// admin/edit-products
module.exports = router ;// Export the router so it can be used in other files// it returns a function 

