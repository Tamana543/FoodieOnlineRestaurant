const fs = require('fs')
const path = require('path')
// const Stripe = require('stripe')('')
const Stripe = require('stripe')('sk_test_51SQrvaK9KSZoYEE7Rkde09ZNsuH71PipjWgaVmPV1Xiy5f7yRQxRl0jCJVOQZDHyRthtQUkomK9xJbvd7jjmEnKn00EcsqeejR')
const Product = require('../modules/product')
const Order = require('../modules/order')
const PDFDocument = require('pdfkit')
const { Error } = require('mongoose')

const errorEng = (err,next)=>{
     
      const error = new Error(err);
      error.httpStatusCode = 500;
      console.log(error);
      return next(error);
}

const ITEM_PER_PAGE = 2

exports.getProductsShop = (req,res, next)=>{

  const page = +req.query.page || 1 
  let totalItem ;

  // with sequalizer 

  // Product.fetchALL() // with simple sequalizer 
  // with mongoose : 
  Product.find().countDocuments().then(productNumber=>{
    totalItem = productNumber
    return Product.find().skip((page - 1) * ITEM_PER_PAGE).limit(ITEM_PER_PAGE)
    // .select('price title')// populate method wil give you exactly the whole user obj without it you have access only on name and some information (name) .
    // .populate('user','name') 
  }).then(products=>{
    res.render('shop/product-list',{
      prods : products,
      pageTitle : 'Products',
        path: '/products',
       currentPage : page,
       hasNextPage : ITEM_PER_PAGE * page < totalItem, 
       hasPreviousPage : page > 1,
       prevPage : page - 1,
       nextPage : page + 1,
       lastPage : Math.ceil(totalItem / ITEM_PER_PAGE)
    })  
  }).catch(err=>
  {
    errorEng(err,next)
  }
  )


}
exports.getShopPage = (req,res,next)=>{
const page = +req.query.page || 1
let totalItems;
// Product.fetchALL() with vanila mongodb
Product.find().countDocuments().then(productNumbers =>{
totalItems = productNumbers
return Product.find().skip((page - 1) * ITEM_PER_PAGE).limit(ITEM_PER_PAGE)// with mongoose 
}) .then(products=>{
res.render('shop/index',{
    prods : products ,
      pageTitle : 'All products',
     path: '/',
     currentPage : page,
     hasNextPage :ITEM_PER_PAGE * page < totalItems,
     hasPreviousPage : page > 1 ,
     nextPage : page + 1 ,
     prevPage : page - 1 ,
     lastPage : Math.ceil(totalItems / ITEM_PER_PAGE)
    })
}).catch(err=>{
  errorEng(err,next)
})

     }


exports.getProductBId = (req,res,next)=>{
      const productId = req.params.productId; // params object is given by express and Yiu can find the dinamic productId from it 
     // working with MangoBd
            
          Product.findById(productId).then(product=>{
            res.render('shop/product_detail',{
              product : product,
                pageTitle : product.title,
                path: '/products',
            })
          }).catch(err=>{
            errorEng(err,next)
          })
}
exports.getCheckout = (req,res,next)=>{
  let carts ;
  let total;
   req.user.populate('cart.items.productId').then(user =>{
//  console.log(cart);

carts = user.cart.items.filter(p => p.productId)
total= 0 
console.log('Me',carts);
carts.forEach(p=>{
   if (p.productId) {
          total += p.productId.price * p.quantity;
        }
})
 return Stripe.checkout.sessions.create({
  payment_method_types : ['card'],
 
        line_items: carts.map(p => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: p.productId.title,
              description: p.productId.description
            },
            unit_amount: p.productId.price * 100
          },
          quantity: p.quantity
})),
 mode: 'payment', 
  success_url: req.protocol +'://' + req.get('host') + '/checkout/success', // req.protocol = http or https, :// host = localhost( or any other )
  cancel_url: req.protocol +'://' + req.get('host') + '/checkout/cancel',
 })
 }).then(session=>{
  res.render('shop/checkout', {
    stripePublicKey: 'sk_test_51SQrvaK9KSZoYEE7Rkde09ZNsuH71PipjWgaVmPV1Xiy5f7yRQxRl0jCJVOQZDHyRthtQUkomK9xJbvd7jjmEnKn00EcsqeejR',
     path: '/checkout',
     pageTitle : 'Checkout', 
     totalCast : total ,
     prods : carts ,
      isAuthenticated: req.session.isLoggedIn,
      csrfToken : req.csrfToken(),
      sessionId : session
     })

 })
 .catch(err=>{
   errorEng(err,next)
 })

}
exports.getCheckoutSuccess = ()=>{
  req.user.populate('cart.items.productId').then(user =>{
//  console.log(cart);
const product = user.cart.items.map(i =>{
  return {quantity : i.quantity, product : {...i.productId._doc}}
});
const order = new Order({
user : {
   email : req.user.email,
    userId : req.user
},
products : product
 
}); 

return order.save()
 })
 .then((result)=>{
return req.user.clearCart()
 
})
.then(()=> res.redirect('/order'))
.catch(err=>{
  errorEng(err,next)
})
}

exports.createCheckoutSession = (req,res,next)=>{
  req.user.populate('cart.items.productId')
  .then(user=>{
    const cart = user.cart.items.filter(p=> p.productId)

    return Stripe.checkout.sessions.create({
          line_items: cart.map(p => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: p.productId.title,
              description: p.productId.description
            },
            unit_amount: p.productId.price * 100
          },
          quantity: p.quantity
        })),
        mode : 'payment',
        success_url : req.protocol+ '://' + req.get('host') + '/checkout/success',
        cancel_url:  req.protocol+ '://' + req.get('host') + '/checkout/cancel'
    })
  }).then(session =>{
        res.json({id: session.id})
  }).catch (err => {
    next(err)
  })
}
exports.getCartShop =(req,res,next)=>{
// console.log(req.user.getCart());
// by Mongoose
// console.log("Meee",user.cart.items.productId)
 req.user.populate('cart.items.productId').then(user =>{
//  console.log(cart);
const carts = user.cart.items;
console.log('Me',carts);
 res.render('shop/cart', {
     path: '/cart',
     pageTitle : 'Cart', 
     prods : carts ,
      isAuthenticated: req.session.isLoggedIn,
      csrfToken : req.csrfToken()
     })

 }).catch(err=>{
   errorEng(err,next)
 })


}
    
exports.postCartShop = (req,res,next)=>{
  // console.log('req Budy ', req.body);
  const productId = req.body.productId;
  // console.log('Idddd',productId);

try {
  
  Product.findById(productId).then((product)=>{
 console.log("Me",req);
  return req.user.addToCart(product)
  }).then(
    (result)=>{
     
     res.redirect('/cart')
    }
  ).catch(err=>{
    errorEng(err,next)
  })
  
  
} catch (error) {
errorEng(error,next);
}

}

exports.postDelCardView = (req,res,next)=>{
    const productId = req.body.productId.trim();
    // console.log("Here",req.user);
    
//By mongoDb
req.user.deleteCartItem(productId)
.then(cart=>{
    // return cart.findById()
    res.redirect('/cart')
}).catch(err=>{
  errorEng(err,next)
})

}

exports.postOrderShop = (req,res,next)=>{
  
req.user.populate('cart.items.productId').then(user =>{
//  console.log(cart);
const product = user.cart.items.map(i =>{
  return {quantity : i.quantity, product : {...i.productId._doc}}
});
const order = new Order({
user : {
   email : req.user.email,
    userId : req.user
},
products : product
 
}); 

return order.save()
 })
 .then((result)=>{
return req.user.clearCart()
 
})
.then(()=> res.redirect('/order'))
.catch(err=>{
  errorEng(err,next)
})

// with Mongodb
/**

  // req.user.addOrder().then((result)=>{

  //   res.redirect('shop/order')
  // }).catch(err=>console.log(err))
 */

 
}


exports.getOrderShop = (req,res)=>{
// with mongoose 
Order.find({'user.userId': req.user._id})
.then(result=>{

  res.render('shop/order',{
    pageTitle : "Ordered Page",
      path : '/order',
    order: result,
         
  })
}).catch(err=>{
  errorEng(err,next)
})
// with Mongodb
/**
 
  // req.user.getOrder().then(result=>{
  //   res.render('shop/order',{
  //     pageTitle : 'Ordered Page',
  //     path : '/order',
  //     order : result
  //   })
  // })
 */

}

exports.getInvoice = (req,res,next)=>{
const orderId = req.params.orderId;
// const invoiceName = `invoice-${orderId}.pdf`
Order.findById(orderId).then(order =>{
  if(!order){
    return next(new Error("No order found"))
  }
  if(order.user.userId.toString() !== req.user._id.toString()){
    
    return next(new Error("Unauthorized"))
  }

  const invoiceName = 'invoice-'+orderId+'.pdf'
  // const invoicePath = path.join('express/data','invoice',invoiceName)
  // const invoicePath = path.join(__dirname, '../data/invoice', invoiceName);
  const invoicePath = path.join(__dirname, '..', 'data', 'invoice', invoiceName);

  // pdfkti
  const pdfDoc = new PDFDocument()
   res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${invoiceName}"`);
  pdfDoc.pipe(fs.createWriteStream(invoicePath))
  pdfDoc.pipe(res)
  pdfDoc.fontSize(25).text('Your products invoice: ')
  let totalPrise = 0

order.products.forEach(prod=>{
totalPrise += prod.product.price * prod.quantity
pdfDoc.text('__________')
pdfDoc.fontSize(15).text(`
  ${prod.product.title} : ${prod.product.description}, Cost each ${prod.product.price}, you have ${prod.quantity} in your card :) 
  `)
  pdfDoc.fontSize(22).text(`You have to pay ${totalPrise}`)
  })
  pdfDoc.end()

//   fs.readFile(invoicePath,(err,data)=>{
//   if(err){
//     return next(err)
//   }
//   // res.setHeader('Content-Type', 'application/pdf');// it is good for small projects( search read and stream files)
//   //         res.setHeader(
//   //           'Content-Disposition',
//   //           'attachment; filename="' + invoiceName + '"'
//   //         );
//   //  const fileStream = fs.createReadStream(invoicePath);

//   //     res.setHeader('Content-Type', 'application/pdf');
//   //     res.setHeader('Content-Disposition', `inline; filename="${invoiceName}"`);
//   //     fileStream.pipe(res);
//   // res.send(data)
// })
}).catch((err)=>{
  next(new Error(err))
})
// console.log(orderId);
}
