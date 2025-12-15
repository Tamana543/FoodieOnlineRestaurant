// file to make a connection between sql and the nodejs file 
/**
 // if you are going to use SQL : 
// const sql = require('mysql2')


// const pool = sql.createPool({// pool is where you can have a run-on connection between server opsite of create connection that use to connect only one way and you need to reconnect them each time 
// host: 'localhost',
// user : 'root',
// database : 'node_sql',
// password: 'Tamanasql0782177966@'
// })

// module.exports = pool.promise()// to give you the promise using feature( using asynchrounous feature)

 */


// with sequalizer 
/**
 const Sequelize = require('sequelize')

const sequelize = new Sequelize( 'node_sql','root','Tamanasql0782177966@',{
     dialect: 'mysql',
     host: 'localhost',
      
})
module.exports = sequelize;
 * */


//With mongodb 

const mongodb = require('mongodb')
const mongoClient = mongodb.MongoClient;
let _db; 
const mangoCreateDb = (cb)=>{
try {
     mongoClient.connect(`mongodb+srv://Tamana_Farzami:siD1r51eESGme4qQ@cluster0.ufecoqb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`).then(client=>{
          console.log("Created");
          _db = client.db() // it is a connection to the databsae (the database own ) stored in a variable 
          // console.log(_db);
          cb()
     }).catch(err=>{
          console.log(err);
          throw err
     })
} catch (error) {
     console.log("Mangobd creation error",error);
}

}
const getDb = (test)=>{

     // console.log(_db);
     if(_db){

          return _db; // returning the database function 
     }
     
     throw "database not found "
} ;

exports.mangoCreateDb = mangoCreateDb
exports.getDb = getDb


// mongodb+srv://<db_username>:<db_password>@cluster0.ufecoqb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
