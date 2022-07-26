const express = require('express');
const User = require('../models/user');
const router = express.Router();
const passport = require('passport');
const catchAsyncError = require('../utils/catchAsyncError');

const redirectSauKhiAnDeleteMaChuaLogin = (urlRedir) =>{
    if((urlRedir).includes('?_method=DELETE')){
        let arr = (urlRedir).split('');
        for ( let i = arr.length - 1; i > 0 ; i--){
            console.log(arr[i])
            if (arr[i] === '?'){
                mark = i;
                break;
            }
        }
        arr.splice(mark, 15);
        (urlRedir) = arr.join("");
    }
    return (urlRedir);  
    //viet tam function de doc cai url neu no co chua method delete thi chuyen no thanh arr roi cat di phan method do xong bien no thanh string roi tra lai de tiep tuc
    //logic thi van hoi lung cung nhung chay duoc roi quay lai kiem tra sau, sau nay neu build them route phia sau discuss thi se la van de cua cai funtion nay can sua lai nhieu!
}

router.get('/register', (req, res) =>{
    res.render('users/register');
});
router.post('/register', catchAsyncError(async (req, res) =>{
    try{
    const { email, username, password } = req.body;
    const user = new User({email, username});
    const registerUser = await User.register(user, password);
    req.login(registerUser, err =>{ //req.login dung de: sau khi nguoi dung dang ky thi tu dong login vao cho user chu khong can phai vao form login de tu login
        if(err){
            return next(err);
        }
        req.flash('success', `Welcome to the Shop, Have a good day! ${username}`)
        res.redirect('/dogs');
    });}
    catch (err) {
        req.flash('error', err.message);
        res.redirect('/register');
    }
    //tai sao su dung try cactch o day thi ta co catchAsyncError chi render loi thu chung ta can sau khi dang ky loi chinh la redirect to trang dang ky nen ta phai tu viet try catch o day
}));
router.get('/login', (req, res) =>{
    res.render('users/login');
});
router.post('/login', function(req, res, next) {
    let returnTo = '/dogs';
    let mark = -1;
    if(req.session.redirectTo){ 
        redirectSauKhiAnDeleteMaChuaLogin((req.session.redirectTo));
        returnTo = req.session.redirectTo;
    }
    return passport.authenticate('local', { successRedirect: returnTo, failureFlash: true, failureRedirect: '/login'}) (req, res, next)
});
// router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), (req, res) =>{
//     req.flash('success', 'Welcome Back!');
//     res.redirect('/dogs')
// })
router.get('/logout', (req, res, next) =>{
    req.logOut(function(err){ //req.logOut: do passport cung cap de logout
        if(err){
            return next(err);
        }
    req.flash('success', 'Success log out of your account! Goodbye');
    res.redirect('/dogs');
    });
})


module.exports = router;