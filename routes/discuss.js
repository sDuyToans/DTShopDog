const express = require('express');
const router = express.Router( {mergeParams: true });
const Dog = require('../models/dogs');
const Discuss = require('../models/discuss');
const catchAsyncError = require('../utils/catchAsyncError');
const { validateDiscuss, isLoggedIn, isDiscussAuthor }  = require('../middlewares');


// dung passport de redirect nhung ma no khong the chuyen huong ve dogs/62c7319e77072a9c3d34e54e/discuss nhu vay duoc vi thuc te khong co route nao nhu vay
// the nen minh viet 1 route rieng cho no
router.get('/', (req, res) =>{
    const {id} = req.params;
    res.redirect(`/dogs/${id}`);
});
//router de back ve trang view khi chua dang nhap ma an delete
router.get('/:discussId', (req, res) =>{
    const {id} = req.params;
    res.redirect(`/dogs/${id}`);
})
router.post('/', isLoggedIn, validateDiscuss, catchAsyncError(async (req, res) =>{
    const { id } = req.params;
    const dog = await Dog.findById(id);
    const comment = new Discuss(req.body.discuss);
    comment.author = req.user._id;
    dog.discusses.push(comment);
    await comment.save();
    await dog.save();
    req.flash('success', 'Success created a comment!');
    res.redirect(`/dogs/${id}`);
}));

router.delete('/:discussId', isLoggedIn, isDiscussAuthor, catchAsyncError(async (req, res) =>{
    const { id, discussId } = req.params;
    await Discuss.findByIdAndDelete(discussId);
    await Dog.findByIdAndUpdate(id, { $pull: {discusses: discussId}});
    req.flash('success', 'Success deleted your comment!');
    res.redirect(`/dogs/${id}`);
}));



module.exports = router;