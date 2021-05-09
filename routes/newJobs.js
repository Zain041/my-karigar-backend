const express = require('express');
const router = express.Router();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const { check, validationResult } = require('express-validator');
const {
  getJobVal,
  newJobVal,
  getUserFavJobVal,
} = require('../validation/newJobValidation');


const auth = require('../middleware/auth');
const Jobs = require('../models/NewJobs');


router.use(cors());
router.post('/test', (req, res) => {
  return res.json({ msg: 'New Jobs Works' });
});

//init


router.post('/toggleJob', auth, async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { job_status, job_id } = req.body;

  try {
    if (job_id) {
      let job = await Jobs.findOneAndUpdate({ _id: job_id }, { jobStatus: job_status }, { new: true })
      res.status(200).json(job)
    }
  } catch (error) {
    res.send(error.message)
  }
});

router.post(
  '/postJob',

  auth,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    var jobFields = {};

  
        if (error) {
          let msg = null;
          if (error.message) msg = error.message;
          else msg = error;
          return res.status(400).json({ errors: [{ msg: msg }] });
        } else {
          /**
           * Create new record in mongoDB
           */
          const { error } = newJobVal(req.body);
          if (error) {
            return res.json(error.details[0].message);
          }
          
          const {
            seller_id,
            job_title,
            job_description,
            job_skills,
            job_location,
            experience_required,
            salary,
            job_status,
          } = req.body;

          if (seller_id) jobFields.userId = seller_id;
          if (job_title) jobFields.jobTitle = job_title;
          if (job_description) jobFields.jobDescription = job_description;
          if (job_skills) jobFields.jobSkills = job_skills;
          if (job_location) jobFields.jobLocation = job_location;
          if (experience_required)
            jobFields.experienceRequired = experience_required;
          if (salary) jobFields.salary = salary;
          if (job_status) jobFields.jobStatus = job_status;
          if (jobImage) jobFields.jobPostImage = jobImage;
          try {
            const job = new Jobs(jobFields);
            await job.save();
            return res.json(job);
          } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
          }
        }
      
  }
);
router.post('/getJob', auth, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { error } = getJobVal(req.body);
  if (error) {
    return res.json(error.details[0].message);
  }

  const newJob = await Jobs.find({ _id: req.body.job_id });
  return res.json(newJob);
});
router.get('/getJobs', auth, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const newJobs = await Jobs.find();
  return res.json(newJobs);
});
// f
router.post('/getUserJobs', auth, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { error } = getUserFavJobVal(req.body);
  if (error) {
    return res.json(error.details[0].message);
  }

  const userJobs = await Jobs.find({ userId: req.body.user_id });
  if (!userJobs) {
    return res.json({ msg: 'No Jobs for this user found' });
  }

  return res.json(userJobs);
});

module.exports = router;
