const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);
const Schema = mongoose.Schema;

// Create Schema
const NewJobsSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "users",
    default: null,
  },
  jobPostImage: {
    type: String,
    default: null,
  },
  jobTitle: {
    type: String,
    default: null,
  },
  jobDescription: {
    type: String,
    default: null,
  },
  jobSkills: {
    type: String,
    default: null,
  },

  jobLocation: {
    type: String,
    default: null,
  },
  experienceRequired: {
    type: String,
    default: null,
  },
  salary: {
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
