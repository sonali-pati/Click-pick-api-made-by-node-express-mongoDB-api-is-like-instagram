      const express=require('express');

      const mongoose=require('mongoose');
      const corse=require('cors')

    //   custom router imports
      const userRouter=require("./routes/user");
      const postRouter=require("./routes/post");
      const connectionRouter=require("./routes/connection");
      const chatRouter=require("./routes/chat");


      const app=express();

    //   middleware inclusion
      app.use(corse());
      app.use(express.json());

      app.use("/pics",express.static("./posts"))


    //   setting up the database connection

      mongoose.connect("mongodb://127.0.0.1:27017/cliclpick_b6")
      .then(()=>{
        console.log("db connected successfully")
      })

    //   setting up routes
        app.use("/users",userRouter);
        app.use("/posts",postRouter);
        app.use("/connections",connectionRouter);
        app.use("/chats",chatRouter);

      










      app.listen(8000,()=>{
        console.log("server is up and running")
      })