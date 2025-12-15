const path = require('path') // Import the path module to work with file and directory paths (if not use this the node js will point to the all your pc ads driveC)

const Product = require('../modules/product')

const fileHelper = require('../util/file')

const {validationResult}=require('express-validator');
const product = require('../modules/product');
const { Error } = require('mongoose');


const errorEng = (err,next)=>{
     
     const error = new Error(err);
     console.log(error);
     error.httpStatusCode = 500;
     return next(error);
}

const ITEM_PER_PAGE = 2
// if you use this kind of export it will not export a function .
exports.getAddProduct = (req,res,next)=>{
   
try {
     
     res.render('admin/edit-products',
          {
          pageTitle : "Add Product",
          path:'/admin/add-product',
          addProductPage:true,
          editing : false,
          errorApp : false,
          errorMessage : null,
          product : Product,
      csrfToken : req.csrfToken(),
      validationError : []
   
          
     })
} catch (error) {
     console.log(error);
}
      
}

exports.postAddProduct = (req,res,next)=>{
     // console.log(req.file)
     // console.log(req.body)

     const title =req.body.title ;
     const image =req.file;
     const price  =req.body.price ;
     const description  =req.body.description ;
     console.log(req.file);
    
     if(!image){
          return res.render('admin/edit-products', {
               pageTitle: 'Add Product',
               path: '/admin/edit-product',
               editing: false,
               errorApp : true,
               product: {
                    title : title,
                    price : price,
                    description : description
               },
               errorMessage : "Given file is not an image in valid format :/",
               csrfToken : req.csrfToken(),
               validationError : []
                        });
               }
const error =  validationResult(req)
              
         // using MangoDb
//     console.log(error);
    if(!error.isEmpty()){
     return  res.render('admin/edit-products', {
               pageTitle: 'Add Product',
               path: '/admin/edit-product',
               editing: false,
               errorApp : true,
               product: {
                    title : title,
                    imageUrl : imageUrl,
                    price : price,
                    description : description
               },
               errorMessage : error.array()[0].msg,
               csrfToken : req.csrfToken(),
               validationError : error.array()
                        });
}


const imageUrl = path.join('images', image.filename);

// console.log("Here",req.user)
const productData = new Product(
          {
               // _id : new mongoose.Types.ObjectId("68daa227a774b255b824f95c"),
               title : title,
               price:price, 
               description:description,
               imageUrl: imageUrl,
               productId: req.user._id, 

               errorApp : false
               })

     productData.save().then(result => {// remember while using mangoose you do not need to add the save methood on your product module, mangoos contain it itself 
          //  console.log(result)
         res.redirect('/admin/products')})
         .catch(err=> {
          errorEng(err,next)
         }) 
}
exports.showAdminProducts = (req,res,next)=>{
     const page = +req.query.page || 1 
     let totalItem;
   //using Mangodb
     // Product.fetchALL()
     // using mongoose 
     Product.find({productId : req.user._id}).countDocuments().then(productNum=>{
          totalItem = productNum
          return Product.find({productId : req.user._id}).skip((page-1)* ITEM_PER_PAGE).limit(ITEM_PER_PAGE)
     }).then(product=>{
           res.render('admin/products',{
               prods : product ,
               pageTitle : 'Admin products',
               path: '/admin/products',
               currentPage: page,
               prevPage : page -1 , 
               nextPage : page+1 , 
               hasPreviousPage : page >  1 ,
               hasNextPage : ITEM_PER_PAGE * page < totalItem ,
               lastPage : Math.ceil(totalItem / ITEM_PER_PAGE) ,
             csrfToken : req.csrfToken(),
             
    errorApp : "False"
               })
     }).catch(err=>{
           errorEng(err,next)
     })
}



exports.getEditProduct = (req,res,next)=>{
     const editMode = req.query.edit;
    
     if(editMode){
          const ProductId = req.params.productID;
     //    console.log(ProductId);
  
// for mongodb && mongoose
     Product.findById(ProductId).then(product => {
               
               if (!product) {
               return res.redirect('/');
               }
               console.log(req.csrfToken);
               res.render('admin/edit-products', {
               pageTitle: 'Edit Product',
               path: '/admin/edit-product',
               editing: editMode,
               errorApp : false,
             errorMessage : null,
               product: product,
               csrfToken : req.csrfToken(),
              validationError : []
               });
               
          })
         .catch(err =>{
            errorEng(err,next)
         });
     }else {
          console.log("Here");
               return res.redirect('/')
     }
     // console.log("Received product ID:", req.params.productID);
     // console.log("Edit mode:", req.query.edit);
    

}

exports.postEditedProduct = (req,res,next)=>{
     const prodID = req.body.prodId;
     const updatedTitle = req.body.title;
     const updatedPrice = req.body.price;
     const updatedImage = req.file;
     const updatedDescription = req.body.description;
     // console.log("Here", prodID);
    
     if(!updatedImage){
          console.log("Iam hereeee");
          return res.render('admin/edit-products', {
               pageTitle: 'Add Product',
               path: '/admin/edit-product',
               editing: false,
               errorApp : true,
               product: {
                    title : updatedTitle,
                    price : updatedPrice,
                    description : updatedDescription
               },
               errorMessage : "Given file is not an image in valid format :/",
               csrfToken : req.csrfToken(),
               validationError : []
                        });
}else{
    
     Product.imageUrl= updatedImage.path;
     // console.log('Here',imageUrl);
     console.log("here",Product.imageUrl)
     // fileHelper.deleteFile(Product.imageUrl)
      }
 const error =  validationResult(req)
       // using MangoDb
//     console.log(error);
    if(!error.isEmpty()){
     return  res.render('admin/edit-products', {
               pageTitle: 'Edit Product',
               path: '/admin/edit-product',
               editing: true,
               errorApp : true,
               product: {
                    title : updatedTitle,
                 
                    price : updatedPrice,
                    description : updatedDescription
               },
               errorMessage : error.array()[0].msg,
               csrfToken : req.csrfToken(),
               validationError : error.array()
               });
               }
     // for mongo db
     // const productUpDet = new Product(updateeTitle,updatedImageUrl,updatedPrice,updatedDescription, prodID)
     // with mongoose 
  

     Product.findById(prodID)
     .then(product=>{
               console.log(product);
               if(product.productId.toString() !== req.user._id.toString()){
                    return res.redirect('/')
               }
               product.title = updatedTitle;
               if(updatedImage){
                    fileHelper.deleteFile(product.imageUrl);
               product.imageUrl = updatedImage.path.replace(/\\/g, '/').split('express/')[1];;
               console.log(product.imageUrl);
               }
               product.price = updatedPrice;
               product.description = updatedDescription
               return product.save().then(result=>{
               console.log("Product Updated");
               res.redirect('/admin/products')
     }).catch(err=>{
          errorEng(err,next)
     })
     })
}

exports.deleteProduct = (req,res,next)=>{
   
     const prodId = req.params.productId.trim();
     console.log(prodId)
Product.findById(prodId)
.then(product=>{
          console.log(product);
if(!product){
     return next(new Error("Product not found "))
}
fileHelper.deleteFile(product.imageUrl);
          return  Product.deleteOne({_id: prodId , productId : req.user._id})
          .then(()=>{
          console.log("Deleted");
            res.status(200).json({message : "Product deleted"})

          }).catch(err=>{
                 res.status(500).json({message: "Product does not dleted"})
          })
 
     }).catch(err=> next(err))
}