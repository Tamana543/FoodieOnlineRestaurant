const authController =  require('../controllers/auth')
const express = require('express')
const {check,body} = require('express-validator')
const router = express.Router()
const user = require('../modules/user')


router.get('/login',authController.getLogin)

router.post('/login',[
     check('email').isEmail().withMessage("Incorrect Password or email :/")
],authController.postLogin)

router.post('/logout',authController.postLogout)

router.post('/signup',[
check('email')
.isEmail()
.withMessage("Please enter an valid email. ").normalizeEmail()
.custom((email,{req})=>{
     
// if(email == 'tamanafarzami22@gmail.com'){
//      throw new Error("This user is blocked..")
// }
// return true

return user.findOne({email : email}).then(userDoc =>{
if(userDoc){
      return Promise.reject("User already exist, try login ᓚᘏᗢ")
}}
)
}),
body('password').isStrongPassword({
     minLength: 6,
     minLowercase:1,
     minUppercase:1,
     minSymbols: 1,
     minNumbers: 1
}).withMessage('Password must be at least 5 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol.').trim(),
body('confirmPassword').trim().custom((value,{req})=>{
     if(value !== req.body.password){
          throw new Error("Passwords Should Match -_-");
          
     }
     return true
})
], authController.postSignup);


router.get('/signup', authController.getSignup);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;