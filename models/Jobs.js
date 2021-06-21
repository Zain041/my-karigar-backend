const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema

// Create Schema
const JobsSchema = new Schema({
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
    },
    jobDate: {
        type: Date,
    },
    jobTime:{
        type:String,
        default:null
    },
    service:{
        type:String,
        default:null
    },
    
    status: {
        type: String,
        required: true,
        default: 'ongoing',
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = User = mongoose.model('jobs', JobsSchema)