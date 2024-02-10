const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    url:{
        type:String,
        require:true
    },
    skill:[
        {
        type:String,
        require:true
          }
        ],
    degree:{
        type:String,
        require:true
    },
    current : {
        type:Boolean,
        require:true,
        default:false

    },
    finished:{
        type:Date,
        require:true
    }
},{
    timestamps:true
})

const Tmp = new mongoose.model("tmp",userSchema)
module.exports = Tmp