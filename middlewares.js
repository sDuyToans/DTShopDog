const { dogsSchema, discussSchema } = require('./JoiSchema');
const ExpressError = require('./utils/ExpressError');
const Dog = require('./models/dogs');
const Discuss = require('./models/discuss');

module.exports.isLoggedIn = (req, res, next) =>{
    req.session.redirectTo = req.originalUrl;
    if(req.isAuthenticated()){ //kiem tra xem da co user dang nhap chua
        next(); // co thi goi next
    } else {
    //nguoc lai chua co thi flash error message va redirect ve trang login
    req.flash('error', 'You must be loggin first!');
    res.redirect('/login');
    }
};
module.exports.validateDog = (req, res, next) =>{
    const { error } = dogsSchema.validate(req.body); // kiem tra xem co error khi validate req.body dung Joi de kiem tra
    if(error) { //neu co error
        const msg = error.details.map(el => el.message).join(','); //map over cac error.details tao ra 1 mang el chua cac message error
        throw new ExpressError(msg, 400); //nen loi ra expresserror
    } else {
    next(); //nguoc lai khong co loi thi next
    }
};

module.exports.validateDiscuss = (req, res, next) =>{
    const { error } = discussSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
};

module.exports.isAuthor = async (req, res, next) =>{
    const { id } = req.params;
    const dog = await Dog.findById(id);
    if(!dog.author.equals(req.user._id)){ // neu dog.author ma khong = req.user.id thi se flash error message nguoc lai thi next
        req.flash('error', "You do not have permission to do that! Have to be the author!");
        res.redirect(`/dogs/${id}`);
    }
    else {
        next();
    }
};

module.exports.isDiscussAuthor = async(req, res, next) =>{
    const { id, discussId } = req.params;
    const discuss = await Discuss.findById(discussId);
    if(!discuss.author.equals(req.user._id)){
        req.flash('error', "You do not have permission to do that!");
        res.redirect(`/dogs/${id}`);
    }
    else {
        next();
    }
}


// ham check xem da dang nhap hay chua dung isAuthenticated cua passport
// function checkAuthentication(req,res,next){
//     if(req.isAuthenticated()){
//         //req.isAuthenticated() will return true if user is logged in
//         next();
//     } else{
//         res.redirect("/login");
//     }
// }