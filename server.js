const express = require('express')
const connectDB = require('./utils/connectDB')
const path = require('path')
const app = express()
app.use(express.json())

app.use(express.urlencoded({extended:true}))
// const result = require('./views/data')

const bcrypt = require('bcrypt')
const User = require('./model/registerationSchema') 
const Admin = require('./model/adminReg')
const Kay = require('./model/adminform')

const session = require('express-session')
const flash = require('connect-flash')

connectDB()

app.set('view engine','ejs')
app.set('views',path.join(__dirname,'/views'))

app.use(express.static(path.join(__dirname,'public')))


app.use(session({
secret: 'keyboard cat', 
saveUninitialized:true,
resave:true        
}))

app.use(flash());



// app.get('/adminReg',(req, res) =>{
//   res.render('adminReg.ejs',{ messages: req.flash('info')})

// })

app.get('/adminDashboard', async (req, res) =>{
    //  const allUsers = await User.find()
    //  console.log(allUsers)
    const foundKay = await Kay.find({})

    res.render('adminDashboard.ejs', {foundUser, foundKay})
  })


app.get('/register',(req, res)=>{
    res.render('register.ejs',{ messages: req.flash('info')})
})



app.get('/login', (req, res) =>{
    res.render('login.ejs',{ messages: req.flash('info')})
})

// app.get('/forgetpassword', (req, res) =>{
//     res.render('forgetpassword.ejs',{ messages: req.flash('info')})
// })



app.get('/adminform',async (req, res)=>{
  res.render('adminform.ejs')
})


app.get('/find/:id', async (req, res) => {
    const {id} = req.params
    const blogDetails = await Kay.findById({_id: id})
    res.render('readmore.ejs', {foundUser, blogDetails})
})



app.post('/adminreg',async(req,res) => {
    try{
        const {title, author, category, description,image} = req.body
        console.log({title, author, category, description,image})

        const userdata = new Kay({
            title:title,
            author:author,
            category:category,
            image:image,
            description:description,
            role:'User',
            active:true
        })
        await userdata.save()
    }catch (error) {
        console.log(error)
    }

    }) 



// app.get('/dashboard',(req,res)=>{
//     console.log(foundUser)
//     res.render('dashboard.ejs',{foundUser})
// })

// app.post('/adminregistration',async(req,res) => {
//     try{
//         const {username, password} = req.body
//         console.log({username, password})

//         const foundUser = await User.findOne({username:username})

//         if(foundUser){
//             req.flash('info', 'user already exist')
//             res.redirect('/register')
//         }
    
        
//         const hashedPassword = await bcrypt.hash(password,10)


//         const user = new Admin({
//             username:username,
//             password:hashedPassword,
//             role:'Admin',
//             active:true
//         })
//         await user.save()
//         console.log({username, hashedPassword})
//         res.redirect('/login')
//     }catch (error) {
//         console.log(error)
//     }
//     }) 




app.post('/registration',async(req,res) => {
    try{
        const {username, password,image,fullname} = req.body
        console.log({username, password,image,fullname})

        const foundUser = await User.findOne({username:username})

        if(foundUser){
            req.flash('info', 'user already exist')
            res.redirect('/register')
        }
    
        const hashedPassword = await bcrypt.hash(password,10)


        const user = new User({
            fullname: fullname,
              image: image,
            username:username,
            password:hashedPassword,
            role:'User',
            active:true
        })
        await user.save()
        console.log({username, hashedPassword})
        res.redirect('/login')
    }catch (error) {
        console.log(error)
    }
    }) 



    let foundUser

    app.post('/login', async (req, res) => {
        const {username, password} = req.body
        
             foundUser = await User.findOne({username:username})


    if (foundUser){
        const user = await bcrypt.compare(password, foundUser.password)
        if(user){
            res.redirect('/adminDashboard')
        }else{
            req.flash('info', 'username or password incorrect')
            res.redirect('/login')
        }
    }else{
    const foundAdmin = await Admin.findOne({username:username})
     if(foundAdmin){
        const user = await bcrypt.compare(password, foundAdmin.password)
        if(user){
            res.redirect('/adminDashboard')
        }else{
            req.flash('info', 'username or password incorrect')
            res.redirect('/login')
        }
     }
    }
    
    })


const PORT = 3000
app.listen(PORT,()=>{
    console.log(`listening to port${PORT}`)
})