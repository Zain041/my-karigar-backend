const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema

// Create Schema
const NotificationSchema = new Schema({
    createdOn: {
        type: Date,
        default: Date.now
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        default: null
    },
    type: {
        type: String, 
    },
    message: {
        type: String,
        required: true,
    }
})

module.exports = Notifications = mongoose.model('notifications', NotificationSchema)