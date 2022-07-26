const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DiscussSchema = new Schema({
    comment: {
        type: String,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Discuss', DiscussSchema);