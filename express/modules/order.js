const mongoose = require('mongoose');
const { INTEGER, NUMBER } = require('sequelize');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
products:[{
     product : {
          type : Object,
          require : true
     } 
     ,
     quantity : {
          type : Number,
          require:true
     }  
}],
user :{
     name : {
          type : String,
          require : true
     },
     userId :{
          type : Schema.Types.ObjectId,
          require :true,
          ref : 'User'
     }
}
})
module.exports = mongoose.model('Order',OrderSchema)
