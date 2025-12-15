const deleterProduct = (btn)=>{
     // console.log(btn)
     const prodId = btn.parentNode.querySelector('[name = productId]').value;
     const csrfTok = btn.parentNode.querySelector('[name = _csrf]').value;

     const btnParrent = btn.closest('article')

     fetch('/admin/product/'+prodId,{
method: 'DELETE',
headers :{
     'csrf-token':csrfTok
}
     }).then(result => {
         return result.json()
     })
     .then(()=>{
          console.log("Done")
          // btnParrent.remove() this is a method which is not working in all the browsers so 
          btnParrent.parentNode.removeChild(btnParrent)
     })
     .catch(err =>{
          console.log(err);
     })
     
}