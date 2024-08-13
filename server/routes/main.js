const express= require('express');
const router = express.Router();
const Post= require('../models/Post');

/* 
    GET/ 
    HOME 
*/
router.get('', async(req, res) => {
    try{
    const locals ={
        title:"Madalin's Blog",
        description: "In acest blog veti afla lucruri noi despre mine."
    }


    let perPage=10;
    let page=   req.query.page || 1;
    
    const data= await Post.aggregate([{$sort: {createdAt: -1}}])
    .skip(perPage*page-perPage)
    .limit(perPage)
    .exec();

    const count= await Post.countDocuments();
    const nextPage= parseInt(page) +1;
    const hasNextPage= nextPage<= Math.ceil(count/perPage);

    

    res.render('index',{
        locals,
        data,
        current: page,
        nextPage: hasNextPage ? nextPage : null,
        currentRoute: '/'
    });

    
    res.render('index', { locals, data });
    }catch(error){
        console.log(error);
    }
    
});



// router.get('', async(req, res) => {
//     const locals ={
//         title:"Madalin's Blog",
//         description: "In acest blog veti afla lucruri noi despre mine."
//     }
//     try{
//     const data = await Post.find();
//     res.render('index', { locals, data });
//     }catch(error){
//         console.log(error);
//     }
// });

/* 
    GET/ 
    Post: id , currentRoute
*/

 router.get('/post/:id', async(req, res) => {
     try{
    let slug= req.params.id;

    const data = await Post.findById({_id: slug});

    const locals ={
        title:data.title,
        description: "In acest blog veti afla lucruri noi despre mine.",
        currentRoute:`/post/${slug}`
    }
     res.render('post', { locals, data, currentRoute:`/post/${slug}`});
     }catch(error){
        console.log(error);
     }
    });

/* 
    Post search
*/

 router.post('/search', async(req, res) => {
     try{

     const locals ={
        title:"Search",
        description: "In acest blog veti afla lucruri noi despre mine."
     } 
     let searchTerm= req.body.searchTerm;
     const searchNoSpecialChar= searchTerm.replace(/[^a-zA-Z0-9]/g, "")
     const data = await Post.find({
        $or: [{title: {$regex: new RegExp(searchNoSpecialChar, 'i')}},
              {body : {$regex: new RegExp(searchNoSpecialChar, 'i')}}]});
    res.render("search", { data, locals });
     }catch(error){
        console.log(error);
     }

 });

// // TITLU ABOUT


//  router.get('/about', async(req, res) => {
//      const locals ={
//          title:"Despre noi",
//          description: "Despre noi."
//      }
//      try{
//          res.render('about', { locals});
//     }catch(error){
//         console.log(error);
//     }
//  });

// // TITLU Contact


// router.get('/contact', async(req, res) => {
//     const locals ={
//         title:"Contact",
//         description: "contact."
//     }
//     try{
//         res.render('contact', { locals});
//    }catch(error){
//        console.log(error);
//    }
// });



//current route

router.get('/about',(req, res) => {
    res.render('about',{
        currentRoute: '/about'
    });
});
router.get('/contact',(req, res) => {
    res.render('contact',{
        currentRoute: '/contact'
    });
});




// function insertPostData(){
//     Post.insertMany([
//     {
//         title: "Blogul meu",
//         body:"Acesta este textul meu"
//     },
//     {
//         title: "Titlu de test1",
//         body:"Text de test1"
//     },
//     {
//         title: "Titlu de test2",
//         body:"Text de test2"
//     },
//     {
//         title: "Titlu de test3",
//         body:"Text de test3"
//     }
//     ])
// }
//insertPostData();


module.exports = router;
