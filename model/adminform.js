const mongoose = require("mongoose")
const {Schema} = mongoose
const users = new Schema({
        title:{
        type:  String,
        require: true, 
         
        unique:true
        },

        image:{
            require:true,
            type:String
        },

        author:{
            type:  String,
            require: true, 
            
            },

            category:{
                type:  String,
                require: true, 
                       
                },

                description:{
                    type:  String,
                    require: true,
                    
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

module.exports = mongoose.model('Kay', users)