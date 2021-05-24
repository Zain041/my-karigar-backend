const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);
const Schema = mongoose.Schema;

// Create Schema
const NewJobsSchema = new Schema({
  buyerId: {
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
  category: {
    type: String,
    default: null,
  },
  budget: {
    type:Number,
    default: null,
  },

  city: {
    type: String,
    default: null,
  },
  numOfDays: {
    type: Number,
    default: null,
  },
  
  jobStatus: {
    type: String,
    default: null,
  },
  jobPostingDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = User = mongoose.model("newjobs", NewJobsSchema);
