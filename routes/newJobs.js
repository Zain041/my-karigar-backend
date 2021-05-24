const express = require('express');
const router = express.Router();
const cors = require('cors');
const jwt = require('jsonwebtoken');

const path = require('path');
const Profile= require('../models/Profile')

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




router.post(
  '/postJob',

  auth,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    var jobFields = {};

  
      
          
          const {
            category,
            description,
            title,
            budget,
            city,
            numOfDays
          } = req.body;

          if (category) jobFields.category = category;
          if (description) jobFields.description = description;
          if (title) jobFields.title = title;
          if (budget) jobFields.budget = budget;
          if (city) jobFields.city = city;
          if (numOfDays)
            jobFields.numOfDays = numOfDays;
          jobFields.buyerId = req.user._id;
           jobFields.jobStatus = "in_review";
         
          try {
            const job = new Jobs(jobFields);
            await job.save();
            return res.json(job);
          } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
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
  try {
    let  requirement= []
    let jobs = await Jobs.find();
    if (!jobs) return res.status(400).json({ err: [{ msg: 'No Outgoing job requests.' }] })
    for (job in jobs) {
        let profile = await Profile.findOne({ user: jobs[job].buyerId }).select('avatar').select('fullName')
        if (profile) {
          requirement.push({ buyer: profile, job: jobs[job] })
        }
        else {
          requirement.push({ job: jobs[job] })
        }
    }
    return res.json(requirement);
}catch(error){
  console.log(error)
}

}
  
);
router.get('/getJobs', auth, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    let  requirement= []
    let jobs = await Jobs.find();
    if (!jobs) return res.status(400).json({ err: [{ msg: 'No offers found.' }] })
    for (job in jobs) {
        let profile = await Profile.findOne({ user: jobs[job].buyerId }).select('avatar').select('fullName')
        if (profile) {
          requirement.push({ buyer: profile, job: jobs[job] })
        }
        else {
          requirement.push({ job: jobs[job] })
        }
    }
    return res.json(requirement);
}catch(error){
  console.log(error)
}


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
