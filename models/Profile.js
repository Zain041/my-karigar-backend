const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);
const Schema = mongoose.Schema;

// Create Schema
const ProfilesSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
    default: null,
  },
  fullName: {
    type: String,
    default: null,
  },
  phoneNumber: {
    type: Number,
    default: null,
  },
  public_id: {
    type: String,
    default: null,
  },
  about:{
    type: String,
    default: null,
  },
  city: {
    type: String,
    default: null,
  },
  avatar: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    default: "in_review",
  },
  address: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    default: null,
  },
  category:{
    type: String,
    default: null,
  },
  experience: {
    type: String,
    default: null,
  },
  onlineStatus: {
    type: String,
    default: "offline",
  },
 
  availableTimeStart: {
    type: String,
    default: null,
  },
  availableTimeEnd: {
    type: String,
    default: null,
  },
  date: {
    type: Date,
    default: Date.now,
  },
 
 
});

module.exports = User = mongoose.model("profiles", ProfilesSchema);
