// Rememeber while using the mongodb you do not need to add the card form ambeded item, you can add it directly from the products (the same with card items )

// const Sequalize = require('sequelize')
// const sequalize = require('../util/database')

// // while using file and SQL uncomment this 
// // const path = require('path')
// // const fs = require('fs')
// // const { json } = require('body-parser')
// // const db = require('../util/database')



// // const p = path.join(
// //           path.dirname(process.mainModule.filename),
// //           'data',
// //           'cart.json'
// //         )
// // module.exports = class Cart {
// //      static addProduct(id,productPrice) {
// //           //lets fetch the previeus cart first 

// //           fs.readFile(p,(err,fileContent)=>{
// //                let cart = {product: [] , totalPrice : 0}
// //           if(!err) {
// //               return cart = JSON.parse(fileContent)
// //           }
// //           // Analyse the cart 
// //           const existantProductIndex = cart.product.findIndex(prod => prod.id === id) 
// //           let existantProduct = cart.product[existantProductIndex]
// //           let updatedProduct;
// //           if(existantProduct){
// //                updatedProduct = {...existantProduct}
// //                updatedProduct.qty = updatedProduct.qty + 1
// //                cart.product= [...cart.product]
// //                cart.product[existantProductIndex] = updatedProduct
// //           }else {
// //                updatedProduct = {id : id , qty : 1}
// //                cart.product = [...cart.product,updatedProduct]
// //           }
// //           cart.totalPrice = cart.totalPrice + +productPrice
// //                fs.writeFile(p, JSON.stringify(cart) ,err => {
// //                     console.log(err);
// //           })
// // })
// // }

// // static deleteProd(id,delProdPrice){
// //      fs.readFile(p,(err,fileContent)=>{
// //           if(err){
// //                return;
// //           }
// //           const updatedCart = {...JSON.parse(fileContent)}
// //           const cleanedId = id.toString().trim();
// //           const product = updatedCart.product.find(prod => prod.id === cleanedId);
// //           if(!product){
// //                return;
// //           }
// //           const prodQty = product.qty;
// //                // console.log(updatedCart);
// //           updatedCart.product = updatedCart.product.filter(
// //                prod => prod.id !== cleanedId
// //                     );
// //           updatedCart.totalPrice = updatedCart.totalPrice - delProdPrice * prodQty
     

// //           fs.writeFile(p, JSON.stringify(updatedCart),err =>{
// //                console.log(err);
// //           })
// //      })
// // }

// // static getCart(){
// //      return db.execute('SELECT * FROM products')
// // //    fs.readFile(p,(err,fileContent)=>{

// // //         if(err){
// // //              return cb(null)
// // //           }
// // //           const cart  = JSON.parse(fileContent);
// // //           cb(cart)
// // //    })

// // }
// // }

// const Cart =sequalize.define('cart',{
// id : {
//      type: Sequalize.INTEGER,
//      allowNull : false,
//      autoIncrement : true,
//      primaryKey : true
// }
// })
// module.exports = Cart;