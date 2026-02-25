     
     const express= require('express');

    //  costom module imports
    const verifyToken=require("./verify-token");
    const connectionModel=require("../models/connection-model");
    const userModel=require("../models/user-model");


    const router=express.Router();
    
    router.post("/create",verifyToken,(req,res)=>{

        let connection=req.body;

        userModel.findOne({_id:connection.following})
        
        .then((userinfo)=>{
           
          if(userinfo.type==="private")
             {
               connection.status="pending";
           
              }

               connectionModel.create(connection)
               .then((connection)=>{
                  res.send({connection})
               })
               .catch((err)=>{
                   console.log(err)
                   res.send({message:"some issue while creating connection"})
               })
          

        })
        
        .catch((err)=>{
          console.log(err);
          res.send({message:"some problem try again latter"})
        })


      })

      




        //  endpoint to see all pending request for private account
          router.get("/pending/:userid",verifyToken,(req,res)=>{
            let userid=req.params.userid;
             
            connectionModel.find({following:userid,status:"pending"})
            .then((requests)=>{
                res.send(requests);
            })
            .catch((err)=>{
                console.log(err);
                res.send({message:"unable to fetch follow request"})
            })

          })

        //  endpoint to accept a request 
        router.put("/changestatus/:connid",verifyToken,(req,res)=>{

          let connid=req.params.connid;

          connectionModel.updateOne({_id:connid},req.body)
          .then((info)=>{
            res.send({message:"successfull"})
          })
          .catch((err)=>{
            console.log(err);
            res.send({message:"some problem updating the request"})
          })
        })
        //  endpoint to unfollow someone  or delete request
        
        router.delete("/connection/:connid",verifyToken,(req,res)=>{
            let connid=req.params.connid;

            connectionModel.findOne({_id:connid})
            .then((info)=>{
                res.send({success:true,status:"nothing"})
            })
            .catch((err)=>{
                console.log(err);
                res.send({message:"some problem while unfollowing"})
            })
        })

      





    module.exports=router