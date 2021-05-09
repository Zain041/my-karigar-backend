const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema

// Create Schema
const AppointmentsSchema = new Schema({
  // fullName: {
  //   type: String,
  //   required: true,
  // },
  providerId: {
    type: Schema.Types.ObjectId,
   
    default: null,
  },
  customerId: {
    type: Schema.Types.ObjectId,
   
    default: null,
  },
  appointmentDate:{
    type: String,
    default:null
  },
  appointmentTime:{
    type: String,
    default:null
  },
  appointmentStatus:{
    type: String,
    default:"pending"
  },
  coverLetter:{
    type: String,
    default:null
  },
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = Appointment = mongoose.model('apointments', AppointmentsSchema)