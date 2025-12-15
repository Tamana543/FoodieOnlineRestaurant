// with moongoose 

const mongoose = require('mongoose')
const schema = mongoose.Schema;

const UserSchema = new schema({
email : {
     type:String,
     require:true
},
password : {
     type : String,
     require : true
},
resetToken : String,
resetExpiredToken : Date,
cart :{
items : [{productId : {type : schema.Types.ObjectId, require : true,ref:'Product'} ,
     quantity :{type : Number , require : true}}]
}
})
UserSchema.methods.addToCart = function(product){

          const cartProductIndex = this.cart.items.findIndex(cp =>{
               return cp.productId.toString() === product._id.toString()
          })
          
          let newQuantity = 1; 
          const updatedCartItem = [...this.cart.items]

          if(cartProductIndex >= 0 ){
          newQuantity = this.cart.items[cartProductIndex].quantity + 1 ;
          updatedCartItem[cartProductIndex].quantity = newQuantity

          }else {
          updatedCartItem.push(
               {productId : product._id,
               quantity : newQuantity})
          }
                    
          const updatedCart = {items : updatedCartItem} 
               // console.log("here",updatedCart);  
          this.cart = updatedCart
          // console.log(this.cart);
          return  this.save()
     }

UserSchema.methods.deleteCartItem = function(prod_id){
      const updatedItem = this.cart.items.filter(item =>{
               return item.productId.toString() !== prod_id.toString()
          })
          console.log(updatedItem);
         this.cart.items = updatedItem;
         return this.save()
          
}
UserSchema.methods.clearCart = function(){
  this.cart = {items : []}
  return this.save()

} 
module.exports = mongoose.model('User',UserSchema)
