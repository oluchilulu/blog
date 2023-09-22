// const mongoose = require('mongoose')
// const dbLink = 'mongodb+srv://judeoluchi:Cherechi_1@cluster0.bvn952f.mongodb.net/test'



require('dotenv').config()               //.
const mongoose = require('mongoose');      //.
console.log(process.env.DB)                //.

function connectDB(){
    try{
        console.log('connecting to db')      
        mongoose.connect(process.env.DB)      //.

        // mongoose.connect(dbLink,{
        //     useNewUrlParser:true,
        //     useUnifiedTopology:true,
        // })
        // mongoose.connect('mongodb://127.0.0.1:27017/db')
        console.log('connected')
    }catch (error) {
        console.log(error)
    }
}

module.exports = connectDB

// github gives u the ability to ci/cd (continues integration and continues deployment)
//i.e when u mprove on you vscode using the live server, it automaticlly changes too in the github
//roadmap.sh/full-stack