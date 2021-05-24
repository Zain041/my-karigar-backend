const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema

// Create Schema
const JobOffersSchema = new Schema({
    buyerId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        default: null
    },
    sellerId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        default: null
      },
    amount: {
        type: Number,
        required: true
    },
    coverLetter: {
        type: String,
        required: true
    },
    jobDate: {
        type: Date,
        required: true,
    },
   
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = User = mongoose.model('jobOffers', JobOffersSchema)