const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const session = require('express-session')
const flash = require('connect-flash')

const connectMongoose = require('./utils/mongoose')
connectMongoose()
const Blog = require('./model/articleSchema')
const Admin = require('./model/createadminSchema')
const Reader = require('./model/signupSchema')

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.static('./'))
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: 'keyboard cat',
    saveUninitialized: true,
    resave: true
}))
app.use(flash())

app.get('/', (req, res) => {
    res.render('pages/index', {alert: req.flash('info')})
})

app.get('/signup', (req, res) => {
    res.render('pages/signup', {alert: req.flash('info')})
})

app.get('/password', (req, res) => {
    res.render('pages/password', {alert: req.flash('info')})
})

app.get('/createadmin', (req, res) => {
    res.render('pages/createadmin', {alert: req.flash('info')})
})

app.get('/blog', async (req, res) => {
    const foundArticle = await Blog.find({})
    res.render('pages/blog', {foundReader, foundArticle})
})

app.get('/:id', async (req, res) => {
    const {id} = req.params
    const articleDetails = await Blog.findById({_id: id})
    res.render('pages/blogdetails', {foundReader, articleDetails})
})

app.get('/article', (req, res) => {
    res.render('pages/article', {alert: req.flash('info')})
})

app.get('/dashboard', (req, res) => {
    res.render('pages/dashboard')
})

app.post('/register', async (req, res) => {
    const{fullname, image, username, password} = req.body
    const foundReader = await Reader.findOne({username:username})

    if (foundReader) {
        req.flash('info', 'Username already exists')
        res.redirect('/signup')
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const details = new Reader ({
        fullname: fullname,
        image: image,
        username: username,
        password: hashedPassword
    })

    await details.save()
    req.flash('info', 'Account has been created!')
    res.redirect('/signup')
})

app.post('/registeradmin', async (req, res) => {
    const{fullname, username, password} = req.body
    const foundReader = await Admin.findOne({username:username})

    if (foundReader) {
        req.flash('info', 'Admin username already exists')
        res.redirect('/createadmin')
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const details = new Admin ({
        fullname: fullname,
        username: username,
        password: hashedPassword
    })

    await details.save()
    req.flash('info', 'Admin created!')
    res.redirect('/createadmin')
})

let foundReader

app.post('/login', async (req, res) => {
    const{username, password} = req.body
    
    foundReader = await Reader.findOne({username: username})
    
    if (foundReader) {
        const checkPassword = await bcrypt.compare(password, foundReader.password)
        
        if (checkPassword) {
            res.redirect('/blog')
        } else {
            req.flash('info', 'Username or Password is incorrect')
            res.redirect('/')
        }
    } else {
        const foundAdmin = await Admin.findOne({username: username})

        if (foundAdmin) {
            const checkPassword = await bcrypt.compare(password, foundAdmin.password)

            if (checkPassword) {
                res.redirect('/dashboard')
            } else {
                req.flash('info', 'Username or Password is incorrect')
                res.redirect('/')
            }
        } else {
            req.flash('info', 'Username or Password is incorrect')
            res.redirect('/')
        }
    }
})

app.post('/changepassword', async (req, res) => {
    const {username, password} = req.body

    if (password.length < 7) {
        req.flash('info', 'Password must be greater than 7')
        res.redirect('/password')
    } else {
        const hashedPassword = await bcrypt.hash(password, 12)

        await Reader.findOneAndUpdate({username: username}, {$set: {password: hashedPassword}})
        req.flash('info', 'Password successfully updated!')
        res.redirect('/')
    }
})

app.post('/sendarticle', async (req, res) => {
    const {title, fullname, category, image, description} = req.body

    const details = new Blog ({
        title: title,
        fullname: fullname,
        category: category,
        image: image,
        description: description
    })

    await details.save()
    req.flash('info', 'Article Created!')
    res.redirect('/article')
})

const PORT = 4000 
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
})