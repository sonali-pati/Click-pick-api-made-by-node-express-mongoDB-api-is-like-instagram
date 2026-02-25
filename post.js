    
     const express=require('express');
     const formidable = require('formidable');
     const fs = require ('fs');

     //    costom module imports

     const verifyToken=require('./verify-token.js');
     const postModel=require("../models/post-model");
     const likeModel=require("../models/like-model");
     const commentModel=require("../models/comment-model");

     const router=express.Router();
      
     router.post("/create",verifyToken,(req,res)=>{
       
          const form = new formidable.IncomingForm();
         
          form.parse(req,(err,fields,files)=>{
            
            if(!err)
            {


              let ext = files.contents.originalFilename.split(".")[1].toLowerCase();
              
              if( ext==="png" || ext==="jpeg" || ext==="jpg" || ext==="mp4" )
              {
                let newFilepath="/posts/"+files.contents.newFilename+"."+ext;
                  // above for movement
                  // bellow for accessibility
                let newFileName="http://localhost:8000/pics/"+files.contents.newFilename+"."+ext;
                  
                   fs.readFile(files.contents.filepath,(err,fileContent)=>{
                       
                     if(!err)
                     {
                      fs.writeFile("./"+ newFilepath,fileContent,(err)=>{
                           
                        if(!err)
                        {
                          fields["contents"] = [newFileName]

                          postModel.create(fields)

                          .then((doc)=>{
                            res.send({success:true,message:"post created successfully"})
                          })
                          .catch((err)=>{
                            console.log(err);
                            res.send({success:false,message:"some problem try again"})
                          })
                            
                        }

                      });
                     }

                  });
                  
                 




                  res.send({success:true,message:"file upload success "})
              }
              else
              {
                 res.send({success:false,message:"file type not supported"})
        
              }

            }

          })

     })
        
       
                  
                  

              
             

        

        

        
     

   //   to get all the post for a perticuler user

     router.get("/userposts:user_id",(req,res)=>{

      let userid=req.params.user_id;
      postModel.find({user:userid})

      .then((posts)=>{
         res.send(posts)
       })
      .catch((err)=>{
       console.log(err);
       res.send({message:"some issue while fetching posts"})
      })

     })

   //   to get info about single post
     router.get("/:id",(req,res)=>{
        let id=req.params.id;
        postModel.findOne({_id:id})
        .then((post)=>{
          res.send(post);
        })
        .catch((err)=>{
          console.log(err);
          res.send({message:"some issue while fetching post"})
        })
     })
      
    //  to delete a post
      
      router.delete("/:id",(req,res)=>{
        let id=req.params.id;
        postModel.deleteOne({_id:id})
        .then((info)=>{
          res.send({message:"post deleted successfully"})
        })
        .catch((err)=>{
          console.log(err);
          res.send({message:"some issue while deleting post"})
        })
      })

      // to like a post
      router.post("/like",(req,res)=>{
         likeModel.create(req.body)
         .then((like)=>{
           res.send({message:"like successfull"})
         })
         .catch((err)=>{
          console.log(err)
          res.send({message:"some issue while liking post"})
         })
      })

        // to comment on a post
        router.post("/comment",(req,res)=>{
          
          commentModel.create(req.body)
          .then((comment)=>{
            res.send({message:"comment suuccessfull"})
          })
          .catch((err)=>{
            console.log(err);
            res.send({message:"some issue while commentiong on post"})
          })
        })

        
           module.exports=router;