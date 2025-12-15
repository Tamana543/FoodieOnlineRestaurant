const Sequalizer = require('sequelize');

const sequalize = require('../../util/database')

const OrderItem = sequalize.define('order_item',{
     id : {
             type: Sequalizer.INTEGER,
               allowNull : false,
               autoIncrement : true,
               primaryKey : true
     },
     quantity: Sequalizer.INTEGER
})
module.exports = OrderItem;