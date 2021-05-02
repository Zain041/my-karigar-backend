const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema

// Create Schema
const ServicesSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "users",
        default: null,
      },
 
  title: {
    type: String,
    default: null,
   
  },
  description: {
    type: String,
    default: null,
   
  },
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = Services = mongoose.model('services', ServicesSchema)