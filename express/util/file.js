const fs = require('fs')
const path = require('path')

const deleteFile = (filePath)=>{
 const fullPath =  path.isAbsolute(filePath)? filePath :  path.join(__dirname, '..', filePath); 
 console.log(fullPath);
     fs.unlink(fullPath, (err)=>{
     if(err){
      console.log(err)
          throw (err)
          
     }
     })
}

exports.deleteFile = deleteFile
