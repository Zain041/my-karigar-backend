const express = require('express')
const router = express.Router()
const cors = require('cors')
const { validationResult } = require('express-validator');

const auth = require('../middleware/auth')
const Profile = require('../models/Profile')
const Notification = require('../models/Notification')

router.use(cors())

// @route   POST api/notifications/getNotifications
// @desc    Get my profile
// @access  Private
router.post('/getNotifications', auth, async (req, res) => {
    const errors = validationResult(req);
  console.log("id",req.user._id)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      var notification = await Notification.find({receiver: req.user._id}, function (err, docs) {
        if (err) res.status(400).json({ err: [{ msg: 'No new notification' }] })
      })
      return res.json(notification)
    }
    catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error')
    }
  });

  // @route   POST api/notifications/clearNotifications
// @desc    Get my profile
// @access  Private
router.post('/clearNotifications', auth, async (req, res) => {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      await Notification.findOneAndDelete({receiver: req.user._id}, function (err, docs) {
        if (err) res.status(400).json({ err: [{ msg: 'No new notification' }] })
      })
      return res.json('No new notification')
    }
    catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error')
    }
  });

module.exports = router

