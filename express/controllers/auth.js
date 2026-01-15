const crypto = require("crypto")
const bcreypt = require("bcrypt")
const user = require("../modules/user")
const nodemailer = require("nodemailer");
const {validationResult}=require('express-validator');



const errorEng = (err,next)=>{
     
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
}

const TOKEN = "b40df4df3c8c12691bd0c83120c73c0b";
// const transport = nodemailer.createTransport(MailtrapTransport({
//   auth: {
//   token : TOKEN  
//   }
// }))

  // Looking to send emails in production? Check out our Email API/SMTP product!
// const transport = nodemailer.createTransport({
//   host: "sandbox.smtp.mailtrap.io",
//   port: 2525,
//   auth: {
//     user: "e45d30079ebad9",
//     pass: "80d8b774fb7321"
//   }
// });
// const transport = nodemailer.createTransport(MailtrapTransport({
//   auth: {
//   token : TOKEN  
//   }
// }))

 // Looking to send emails in production? Check out our Email API/SMTP product!
const transport = nodemailer.createTransport({
   host: "smtp.gmail.com",
  port: 465,             // or 587
  secure: true,
  auth: {
    user: "tamanafarzami33@gmail.com",
    pass: "ocpr kwis ouha wvhx"
  }
});

exports.getLogin = (req,res,next)=>{
 
  // const isLoggedIn =req.get('Cookie').trim().split('=')[1]==='true' ;
let errorMessage = req.flash('userError')

if(errorMessage.length > 0){
  errorMessage = errorMessage
}else {
  errorMessage = null
}
res.render('auth/login',{

    pageTitle : "Login Page",
      path : '/login',
      // isAuthCorrect: req.session.loggedIn || false
        // isAuthCorrect : logedIn
        isAuthCorrect : false,
        errorMessage : errorMessage,
         oldData : {
    email : '',
    password : '',

  },
    validationError :[]
  
        
   
  })


}

exports.getSignup = (req, res, next) => {
  let errorMessage = req.flash('userError')

if(errorMessage.length > 0){
  errorMessage = errorMessage
}else {
  errorMessage = null
}

  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthCorrect: false,
    errorMessage : errorMessage,
    oldData : {
    email : '',
    password : '',
    confirmPassword : '',
  },
  validationError :[] 
     
  });
};
exports.postLogin = (req,res,next)=>{
  // here you need to store users data so you can understand whose fie are these : cookie

const email = req.body.email
const password = req.body.password
//Lugging in in the user
user.findOne({email : email}).then((user)=>{
  if(!user){
    //      req.flash('userError','User with this email address is not found :(')
    // return res.redirect("/login")
    return res.render('auth/login',{
       path: '/login',
    pageTitle: 'login',
    isAuthCorrect: false,
   errorMessage:  'Incorrect Password or email :/',
   
          oldData : {
            email : email,
            password : password
          },
          validationError :[{path : 'email', path : 'password'}] 
        
    })
  }
  
  bcreypt.compare(password, user.password).then(isMatching=>{
    if(isMatching){
  
    req.session.isloggedin =true
    req.session.user = user
   return  req.session.save((err)=>{
   
 
      res.redirect('/')
    })
    }else {
      // req.flash('userError','Incorrect Password :/')
      return res.status(422).render('auth/login',
        
        {
           path: '/login',
    pageTitle: 'login',
    isAuthCorrect: false,
    errorMessage :  'Incorrect Password :/',
          userError : 'Incorrect Password :/',
          oldData : {
            email : email,
            password : password
          },
          validationError :[{path : 'email', path : 'password'}] 
        }
      )
    }
  })
  .catch(err=>{
    errorEng(err,next)
  })
})
.catch(err=>{
  errorEng(err,next)
})

}
exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
const validated = validationResult(req)
if(!validated.isEmpty()){
  
  let error = validated.array()[0].msg
  return res.status(422).render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthCorrect: false,
    errorMessage : error,
  oldData : {
    email : email,
    password : password,
    confirmPassword : req.body.confirmPassword,
  },
    validationError :validated.array()
  })
}
// user email exist( transformed to the route validation part)

     bcreypt.hash(password,12).then((hashedPassword) =>{
      req.session.isloggedin = true
 const newUser = new user({
     email : email,
      password : hashedPassword,
      card : {item : []}
    })
    return newUser.save()
  }).then(result=>{
    const sender = {
      address: "Tamanafarzami33@gmail.com",
      name:"Tamana Farzami"
    }
    const recipients = email
    transport.sendMail({
      from: sender,
      to:recipients,
      subject: "SIGN UP Completed Successfully :)",
      text : "Congratulation, your account has been successfully authorized!",
        category: "Integration Test",
    }).then((respond)=>console.log(respond))
    .catch(err=>{
      next(new Error(err))
    })
    res.redirect('/login')
// here
  })}
  
exports.postLogout = (req,res,next)=>{
req.session.destroy((err)=>{
 
  // to delete a session 
  res.redirect('/')

});
}

exports.getReset = (req,res,next)=>{
  let errorMessage = req.flash('error')

if(errorMessage.length > 0){
  errorMessage = errorMessage
}else {
  errorMessage = null
}

  res.render('auth/resetPassword', {
    path: '/reset',
    pageTitle: 'Reset Password',
    isAuthCorrect: false,
    errorMessage : errorMessage
     
  });
}
exports.postReset = (req,res,next)=>{
crypto.randomBytes(32,(error , buffer)=>{
if(error){
 
  res.redirect('/reset')
}
const token = buffer.toString('hex')
user.findOne({email : req.body.email}).then((userSearch)=>{

if(!userSearch){
  req.flash('error','The email address not found :(')
  
  res.redirect('/reset')
}

userSearch.resetToken = token
userSearch.resetExpiredToken = Date.now() + 360000 // to milisecond ;
return userSearch.save() 
}).then(respond=>{
   const sender = {
      address: "Tamanafarzami33@gmail.com",
      name:"Tamana Farzami"
    }

    const recipients = req.body.email
     res.redirect('/');
transport.sendMail({
      from:"Tamanafarzami33@gmail.com" ,
      to:recipients,
      subject: "Reset Password",
      html: `<p>Reset your password from here</p> 
      <a href="http://localhost:5430/reset/${token}" > Reset Password</a>
      `,
        category: "Integration Test",
    })
}).catch(err=>{
  errorEng(err,next)
}
)
})
}

exports.getNewPassword = (req,res,next)=>{
  const token = req.params.token;
  user.findOne({resetToken : token , resetExpiredToken : {$gt : Date.now()}}).then(user =>{
  let errorMessage = req.flash('passwordRepeated')

if(errorMessage.length > 0){
 errorMessage = errorMessage
}else {
 errorMessage = null
}

res.render('auth/newPassword', {
  path: '/newPassword',
  pageTitle: 'New Password',
  isAuthCorrect: false,
  errorMessage : errorMessage,
  userId : user._id.toString(),
  passwordToken : token 
});
}).catch(err=>{
  errorEng(err,next)
})

}

exports.postNewPassword = (req,res,next)=>{
  const newPassword = req.body.password;
  const UserId = req.body.userId;
  const newToken = req.body.passwordToken
  let resetUser;
  user.findOne({resetToken : newToken , resetExpiredToken : {$gt : Date.now()}, _id :UserId}).then(userEn=>{
    if(!userEn){
      req.flash('erroMessage','user not found')
    }
    resetUser= userEn
  return bcreypt.hash(newPassword , 12)
  }).then(hashedPassword =>{
resetUser.password = hashedPassword;
resetUser.resetToken = undefined;
resetUser.resetExpiredToken = undefined
return resetUser.save()
  }).then(respond=>{
    res.redirect('/login')

  }).catch(err=>{
    errorEng(err)
  })
}
