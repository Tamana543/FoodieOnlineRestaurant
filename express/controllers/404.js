exports.get404 = (req,res)=>{
     // res.status(404).sendFile(path.join(__dirname,'Views','404.html'))
     res.status(404)
     .render('404',
          {pageTitle : 'Page Not Found',
           path : ''
          ,
            isAuthCorrect : req.isLoggedIn},
           )
}
exports.get500 = (req,res)=>{
     // res.status(404).sendFile(path.join(__dirname,'Views','404.html'))
     res.status(500)
     .render('500',
          {pageTitle : 'Error',
           path : ''
          ,
            isAuthCorrect : req.isLoggedIn},
           )
}