   
   const mongoose=require('mongoose');

   const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is Mandatory"],
    },
    username:{
        type:String,
        required:true,
        unique:[true,"Username Already Taken"],
        minLength:[2,"Username should be of 2 or more letters"],
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    type:{
        type:String,
        enum:["public","private"],
        default:"public",
    },
    profile_pic:{
        type:String,
        default:"https://previews.123rf.com/images/kritchanut/kritchanut1406/kritchanut140600093/29213195-male-silhouette-avatar-profile-picture.jpg"
    },
    bio:{
        type:String,
    },
    link:{
        type:String,
    },
   },{timestamps:true})

   const userModel=mongoose.model("users",userSchema);

   module.exports=userModel;

















   