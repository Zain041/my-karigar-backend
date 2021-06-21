const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema

// Create Schema
const RatingSchema = new Schema({
        rating: {
            type: Number,
            default: null
        },
        feedback: {
            type: String,
            default: null,
        },
        service: {
            type: String,
            default: null,
        },
        receiver: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            default: null
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            default: null
        },
        date: {
            type: Date,
            default: Date.now()
        }
})

module.exports = User = mongoose.model('ratings', RatingSchema)