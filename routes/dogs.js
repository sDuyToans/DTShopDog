const express = require('express');
const router = express.Router();
const Dogs = require('../models/dogs');
const catchAsyncError = require('../utils/catchAsyncError');
const { isLoggedIn, validateDog, isAuthor }  = require('../middlewares');
const multer = require('multer');
const { storage, cloudinary } = require('../cloudinary/index');
const upload = multer({storage});

router.get('/', catchAsyncError(async (req, res) =>{
    const dogs = await Dogs.find({});
    res.render('dogs/index', { dogs });
}));
router.get('/new', isLoggedIn, (req, res) =>{
    res.render('dogs/new');
});

router.post('/', isLoggedIn, upload.array('image'), validateDog, catchAsyncError(async (req, res, next) =>{
    const newDog = new Dogs(req.body.dogs);
    newDog.author = req.user._id;
    newDog.images = req.files.map(f =>({url: f.path, filename: f.filename})); //chay qua object req.files => tao ra 1 mang moi cai ma moi phan tu luu giu 1 object co chua url va filename
    await newDog.save();
    req.flash('success','Success list a new dog to the shop! Congrat!')
    res.redirect('/dogs');
}));
router.get('/:id', catchAsyncError(async (req, res) =>{
    const { id } = req.params;
    const dog = await Dogs.findById(id).populate({path: 'discusses', populate: {path: 'author'}}).populate('author');
    if (!dog){
        req.flash('error', "Can't find that dog!");
        res.redirect('/dogs');
    }
    res.render('dogs/show',  { dog })
}));
router.get('/:id/edit', isLoggedIn, isAuthor,  catchAsyncError(async (req, res) =>{
    const { id } = req.params;
    const dog = await Dogs.findById(id);
    if (!dog) {
        req.flash('error', "Can't find that dog!");
        res.redirect('/dogs');
    }
    res.render('dogs/edit', { dog });
}));
router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), validateDog, catchAsyncError(async (req, res) =>{
    const { id } = req.params;
    const { dogs } = req.body;
    const dog = await Dogs.findByIdAndUpdate(id, {...dogs});
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    dog.images.push(...imgs);
    await dog.save();
    if(req.body.deleteImages){
        for (let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await dog.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
    }
    req.flash('success', 'Successful update your dog infor!')
    res.redirect(`/dogs/${id}`);
}));
router.delete('/:id', isLoggedIn, isAuthor, catchAsyncError(async (req, res) =>{ 
    const { id } = req.params;
    const dog = await Dogs.findByIdAndDelete(id);
    if (!dog){
        req.flash('error', "Can't find that dog");
        res.redirect('/dogs');
    }
    req.flash('success', 'Success delete!')
    res.redirect('/dogs');
}));

module.exports = router;