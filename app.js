const express = require('express')
const app = express()
const path = require('path')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const multer = require('multer')

const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const {ensureAuthenticated} = require('./helpers/auth')

const keys = require('./config/keys')

//Public folder
app.use(express.static(path.join(__dirname, 'public')))

//Ideas Route
const ideas = require('./routes/ideas')
const users = require('./routes/users')

// Requiring passport file from config dir:
require('./config/passport')(passport)

const port = process.env.PORT || 3000

mongoose.Promise = global.Promise

mongoose.connect(keys.mongoURI, 
  { useNewUrlParser: true,
    useUnifiedTopology: true
  }
)
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))

app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(express.static('public'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

//Express session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect-flash middleware
app.use(flash())


//Global variables
app.use((req, res, next) => {
  res.locals.err_msg = req.flash('err_msg')
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error = req.flash('error')
  res.locals.user = req.user || null
  next() 
})

app.listen(port, () => console.log('server started at ' + port));

// Home page routes

app.get('/', function (req, res) {
  res
  .render('index')
})

// About page routes

app.get('/about', function (req, res) {
  res.render('about')
})

//Using all models middleware
app.use('/ideas', ideas)
app.use('/users', users)



