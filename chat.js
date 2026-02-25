       
       const express= require('express');


     
       //  costom module imports
    const verifyToken=require("./verify-token");
    const chatModel=require('../models/chat-model');

    const router=express.Router();

//  endpoint to send a message

     router.post("/create",(req,res)=>{

        let chat=req.body;
        chatModel.create(chat)
        .then((doc)=>{
            res.send({message:"chat created"})
        })
        .catch((err)=>{
            console.log(err);
            res.send({message:"some problem while creating chat message"})
        })
     })
     
    //  endpoint to get a conversation

    router.get("/chats/:userid/:chatterid",(req,res)=>{

        let userid=req.params.userid;
        let chatterid= req.params.chatterid;

        chatModel.find({$or:[{sender:userid,receiver:chatterid},{sender:chatterid,receiver:userid}]})

        .then((chats)=>{
         res.send({success:true,chats:chats})
        })
        .catch((err)=>{
            console.log(err);
            res.send({message:"some problem while getting chats"})
        })
    })
   
    
    module.exports=router

    