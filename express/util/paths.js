const path = require('path');

module.exports = path.dirname(process.mainModule.filename) // it goes to the main module of the application and gets the directory name of the file that is being used in. no need for static programming