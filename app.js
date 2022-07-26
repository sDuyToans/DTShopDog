if(process.env.NODE_ENV !== "production"){ //process.env.NODE_ENV la 1 moi truong thuong danh cho development hoac production, 
    require('dotenv').config();//neu chung ta running trong development mode thi process.env se lay nhung gi o trong file env de ta co the truy cap vao chung trong node app bat cu luc nao
    //neu o trong production thi se co cach thiet lap khac de env khong stroge  trong 1 file ma chung ta se add no vao trong environment ~~ 
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const User = require('./models/user');
const ExpressError = require('./utils/ExpressError');
const passport = require('passport');
const LocalStrategy = require('passport-local');

//require Routes
const dogRoute = require('./routes/dogs');
const discussRoute = require('./routes/discuss');
const userRoute = require('./routes/user');


//mongoose setting
mongoose.connect('mongodb://localhost:27017/shopDog');
const db = mongoose.connection;
db.on("error", console.log.bind(console, "Connection Error:"));
db.once("open", () =>{
    console.log("Database connected!")
});
//mongoose setting

//setting views
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'));
//setting views

//setting to read req.body
app.use(express.urlencoded( {extended: true } ));
//setting to use the method override
app.use(methodOverride('_method'));
//setting static dir public
app.use(express.static(path.join(__dirname, 'public')));
//setting session
const sessionConfig = {
        secret: 'thaydoisau!',
        resave: false,
        httpOnly: true,
        saveUninitialized: true,
        cookie: {
            //setting thoi gian het han cho cookie
            expires: Date.now() + 1000 * 60 * 60 *24 * 7, 
            maxAge: 1000 * 60 * 60 *24 * 7
        }
}
//use sessiong
app.use(session(sessionConfig));
//use flash to send message
app.use(flash()); //all requests will have a req.flash() function that can be used for flash messages.

//use passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // passport to use phuong thuc localStrategy(passport-local) va phuong thuc xac thuc cua localStragegy la authenticate cua Usermodel. So confuse =.= which mean use static authenticate method of model in LocalStrategy =))) day la document viet chu doc cung chua hieu lam =)))

// use static serialize and deserialize of model for passport session support, sử dụng tuần tự hóa (serialize) tĩnh và giải mã hóa (deserialize) model để hỗ trợ passport
passport.serializeUser(User.serializeUser()); // noi chung la cach chung ta luu tru 1 user trong session
passport.deserializeUser(User.deserializeUser());// cach chung ta lay user do ra ngoai session


//viet middle ware cho flash
app.use((req, res, next) =>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//use Routes
app.use('/dogs', dogRoute);
app.use('/dogs/:id/discuss', discussRoute);
app.use('/', userRoute);

// Go to HomePage
app.get('/', (req, res) =>{
    res.render('home');
});
// Go to HomePage


//for all the route, using app.all
//this app.all chi thuc hien khi khong co route nao duoc match truoc no
app.all('*', (req, res, next) =>{
    next(new ExpressError('PAGE NOT FOUND', 404));
     // '*' localhost:2000/asdasdasd => khong co route nay thi ta se tao 1 ExpressError moi sau do ta se dua no vao next de call ham viet err o duoi
});

//function de viet loi error ra, sau nay ta se viet cac loi nay ra trang error.ejs 
app.use((err, req, res, next) => {
   const { statusCode = 500 } = err;
   if(!err.message) err.message = 'Somethings went wrong!'
   res.status(statusCode).render('error',{ err })
   //cool nhung ma neu ta dung postman de tao hay edit ma van bo trong duoc nhung data yeu cau di nhien chung ta co the !dogs.name -> throw new ExpressErorr but
   // no qua dai va chung ta cung co nhieu data hon de ma co the viet het nhu name, location, age,.... => use Joi to stop that
});



app.listen(2000, () =>{
    console.log('Serving on port 2000!');
});