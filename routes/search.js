const express = require('express')
const router = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator');

const config = require('config')
const auth = require('../middleware/auth')
const Profile = require('../models/Profile')

router.use(cors())

// @route   POST api/search/fetchUsersByCategories
// @desc    Search All Users in specified category
// @access  Public
router.post('/fetchUsersByCategories',
    [
        check('roleId', 'Category ID is required')
            .not()
            .isEmpty()
    ],
    auth, async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        try {
            let profileSearch = await Profile.find({ roleId: req.body.roleId }, function (err, docs) {
                if (err) res.status(400).json({ err: [{ msg: 'Users not found' }] })
            })
            return res.json({ profileSearch });
        }
        catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }
    });

   

// @route   POST api/search/searchUserByName
// @desc    Search user name in specified category
// @access  Public
router.post('/searchUserByName',
    [
        check('roleId', 'Category ID is required')
            .not()
            .isEmpty(),
    ],
    auth, async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        try {
            let profileSearch = await Profile.find({ roleId: req.body.roleId, fullName: { "$regex": req.body.fullName, "$options": "i" } }, function (err, docs) {
                if (err) res.status(400).json({ err: [{ msg: 'User not found' }] })
            })
                .select('-_id')
                .select('-user')
                .select('-profileVideo')
                .select('-profileImage')
                .select('-address')
                .select('-date')
            return res.json({ profileSearch });

        }
        catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }
    });

module.exports = router
