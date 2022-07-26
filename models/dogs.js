const mongoose = require('mongoose');
const Schema  = mongoose.Schema;
const Discuss = require('./discuss');

const ImageSchema = new Schema({
    url: String,
    filename: String,
});

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_490,h_368')
})

const DogSchema = new Schema({
    name: {
        type: String,
    },
    type: {
        type: String,
    },
    age: {
        type: Number,
    },
    location: {
        type: String,
    },
    description: {
        type: String,
    },
    images: [ImageSchema],
    price: {
        type: Number
    },
    discusses: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Discuss'
        }
    ],
    author: {
            type: Schema.Types.ObjectId,
            ref: 'User'
    }
});

DogSchema.post('findOneAndDelete', async (dog) =>{
    if(dog){
        await Discuss.remove({_id: {$in: dog.discusses }});
    }
})

module.exports = mongoose.model('Dogs', DogSchema);