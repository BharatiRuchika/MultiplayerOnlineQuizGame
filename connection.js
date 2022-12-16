exports.connect = ()=>{
    try{
        const mongoose = require("mongoose");
        mongoose.connect("mongodb+srv://guvi:admin123@cluster0.bdpws.mongodb.net/kahoot?retryWrites=true&w=majority",{useNewUrlParser:true,useUnifiedTopology:true})
    }catch(err){
       console.log(err);
       process.exit();
    }
}
