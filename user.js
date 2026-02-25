    

       const express=require('express');
       const bcryptjs=require('bcryptjs');
       const jwt=require("jsonwebtoken");

    //    costom module imports

       const verifyToken=require('./verify-token.js')

      const userModel=require("../models/user-model");

const connectionModel = require('../models/connection-model.js');
const postModel = require('../models/post-model.js');

       

       const router =express.Router();

       // endpoints for user registration or user cration

        router.post("/signup",(req,res)=>{
           let user=req.body;

           bcryptjs.genSalt(10,(err,salt)=>{

               if(err===null || err===undefined)
               {
                   bcryptjs.hash(user.password,salt,(err,encpass)=>{
                     
                       if(err===null || err=== undefined)
                       {
                           user.password=encpass;

                             userModel.create(user)
                            .then((doc)=>{
                             res.status(201).send({success:true,message:"user register successfully"})
                          })

                            .catch((err)=>{
                            //  console.log(err);
                            if(err.code===11000)
                            {
                              res.status(409).send({success:false,message:"Email or Username Already exist"})
                            }
                            else
                            { 
                              res.status(400).send({success:false,message:err.errors.name.properties.message})
                            }
                           
                        })


                       }


                   })
               }
           })


         
           
        })

       //  endpoint for login
          
       router.post("/login",(req,res)=>{
         let userCred=req.body

         console.log(userCred)

         userModel.findOne({$or:[{email:userCred.email_user},{username:userCred.email_user}]})
         .then((user)=>{
          if(user!==null)
          {
           bcryptjs.compare(userCred.password,user.password,(err,result)=>{
               if(err===null || err===undefined)
               {
                   if(result===true)
                   {
                     jwt.sign(userCred,"secretkey",(err,token)=>{
                       if(err===null || err===undefined)
                       {
                         res.status(200).send({success:true,token:token,email:user.email,userid:user._id,username:user.username,profile_pic:user.profile_pic})
                       }
                     })
                   }
                   else
                   {
                    res.status(403).send({success:false,message:"incorrect password"})
                   }
               }
           })
          }
          else
          {
           res.status(404).send({message:"username or email not found"})
          }


         })
         .catch((err)=>{
           console.log(err)
           res.status(503).send({success:false,message:"some problem while login in user"})
         })



       })
        
      //  endpoint to get post of people that we follow plus ours

       router.get("/posts/:loggedinid",verifyToken,async (req,res)=>{
        let id=req.params.loggedinid;
        let following=await connectionModel.find({follower:id,status:"accepted"});

        let postids=following.map((f,index)=>{
          return f.followin;
        })
          
            postids.push(id);

            postModel.find({user:{$in:postids}}).populate('user')
            .then(async(allposts)=>{
                  
                let posts=[];
                for(let i=0;i<allposts.length;i++)
                {
                     let likes = await likeModel.find({post:allposts[i]._id})
                     let post={...allposts[i]._doc};
                     post.likes=likes;
                     posts.push(post)
                }
                    // console.log(allposts);

                res.send({success:true,posts}); 
            })
            .catch((err)=>{
              console.log(err);
              res.send({message:"some issue while fetching posts"})
            })
       })
         

    //    endpoint to get single user info /profile info

      router.get("/profile/:username/:loggedinid",verifyToken,(req,res)=>{

      
        
        

        userModel.findOne({username:req.params.username})
        .then(async(user)=>{

          let following=await connectionModel.find({follower:user._id,status:"accepted"});
          let followers=await connectionModel.find({following:user._id,status:"accepted"});
          let connection=null

           if(user._id.toString()!==req.params.loggedinid)
           {
              connection=await connectionModel.findOne({follower:req.params.loggedinid,following:user._id})
              if(connection==null)
              {
                connection={success:true,status:"nothing"}
              }
           }
           else
           {
              connection={success:true,status:"same"}
           }
           

            postModel.find({user:user._id})
            .then((posts)=>{

              res.send({success:true,user:user,following:following,followers:followers,posts:posts,connection}) 
              
            })
            .catch((err)=>{
              console.log(err);
              res.send({message:"some issue while fetching posts"})
            })

         
        })

        .catch((err)=>{
            console.log(err);
            res.send({success:false,message:"some problem while getting user info"});
        })

      })
       
      // to update a porofile

        router.put("/:id",(req,res)=>{
          
          let userid=req.params.id;

          userModel.updateOne({_id:userid},req.body)
          .then((info)=>{
            res.send({success:true,message:"profile update successfully"})
          })
          .catch((err)=>{
            console.log(err);
            res.send({success:false,message:"some problem while updating profile"})
          })

        })
         
          // endpoint for getting userinfo based on username

           router.get("/search/:username",verifyToken,(req,res)=>{

             let username=req.params.username;

             userModel.find({username:{$regex: username, $options: 'i'}})
             .then((users)=>{
                  res.send({success:true,users})
             }) 
             .catch((err)=>{
              console.log(err);
              res.send({success:false,message:"some problem while fetching users"})
             })

           })

         
            module.exports=router;