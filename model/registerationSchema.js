const mongoose = require("mongoose")
const {Schema} = mongoose
// To connect to database, 

// const users = new Schema({
//     username: String,
//     password: String, 
//     role: String,
//     active: Boolean
// }) // without validation

// Backend Schema Validat
const users = new Schema({
        username:{
        type:  String,
        require: true, 
        
        unique:true,
        trim:true,
        },

        password:{
        type:  String,
        require: true, 
        trim:true,
        },

        fullname:{
            type:String,
            require:true,
        },

        image:{
            type:String,
            require:true,
        },

        role:{
        type:  String,
        require: true, 
        },

        active:{
        type:  Boolean,
        require: true, 
        },

    })

module.exports = mongoose.model('User', users);


