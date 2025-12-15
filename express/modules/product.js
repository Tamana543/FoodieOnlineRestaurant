// with mangoose 
const mongoose = require('mongoose');
const Scheme = mongoose.Schema;

const schemaFirstProduct =new Scheme({
     title : {
          type : String,
          require:true
     },
     price :{
          type : Number,
          require :true
     },
     description :{
          type : String,
          require : true
     },
     imageUrl : {
          type : String,
          require : true
     },
productId : {
     type : Scheme.Types.ObjectId,
     ref : 'User',
     require : true
}

}) ;

module.exports = mongoose.model('Product',schemaFirstProduct)

