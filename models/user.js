const { required } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true
    }
});
// khong can chi dinh username va password boi vi chung ta dung passport
// =>
UserSchema.plugin(passportLocalMongoose); 
// viec nay se them vao userSchema username and password, no se dam bao nhung username do la duy nhat, khong trung 
// va dieu tuyet nhat la no se cho ta mot so phuong thuc de su dung


module.exports = mongoose.model('User', UserSchema);
