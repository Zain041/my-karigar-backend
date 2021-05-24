const express = require('express')
const router = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator');

const config = require('config')
const auth = require('../middleware/auth')
const JobOffers = require('../models/jobOffer')
const Jobs = require('../models/Jobs')
const Profile = require('../models/Profile')

const addNotification = require('./notificationFunc');


router.use(cors())



router.post('/sendJobOffer',
    [
        check('buyerId', 'Buyer Id is required')
            .not()
            .isEmpty(),

        check('amount', 'Amount is required')
            .not()
            .isEmpty(),

        check('jobDate', 'Job Date is required')
            .not()
            .isEmpty(),
    ],
    auth, async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { buyerId, amount,coverLetter,jobDate } = req.body;

        const sellerId = req.user._id
        try {

            let job = await JobOffers.findOne({ sellerId: req.user._id });

            if (job) {
                return res.status(400).json({ errors: [{ msg: 'Job request already sent.' }] });
            }

            job = new JobOffers({ buyerId, sellerId, amount,coverLetter,jobDate })
            await job.save();
            let seller = await Profile.findOne({ user: sellerId }).select('fullName')
            addNotification("Job Offer", buyerId, seller.fullName + " has sent you a job offer");
            return res.json(job)

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }
    })



    router.post('/acceptJobOffer',
    [
        check('_id', 'JobOffer Id is required')
            .not()
            .isEmpty(),
    ],
    auth, async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        try {
            await JobOffers.findOne({ _id: req.body._id })
                .then(async docs => {
                    let jobFields = {}
                    jobFields.buyerId = docs.buyerId;
                    jobFields.sellerId = docs.sellerId;
                    jobFields.amount = docs.amount;
                    jobFields.jobDate = docs.jobDate;
                    
                    
                       
                    
                        

                    let job = new Jobs(jobFields);
                    await job.save();
                    await JobOffers.findOneAndDelete({ _id: req.body._id });
                    let buyer = await Profile.findOne({ user: docs.buyerId }).select('avatar').select('fullName')
                    let seller = await Profile.findOne({ user: docs.sellerId }).select('avatar').select('fullName')
                    addNotification("Accept Offer", jobFields.sellerId, buyer.fullName + " has accepted your job Offer");
                    return res.json({ job, seller, buyer});
                })

        }

        catch (err) {
            console.error(err.message);
            return res.status(500).send('Server Error')
        }
    });


    router.post('/rejectJobOffer',
    [
        check('_id', 'Job Id is required')
            .not()
            .isEmpty(),
    ],
    auth, async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        try {
            await JobOffers.findOneAndDelete({ _id: req.body._id })
            return res.send("offer deleted")
        }

        catch (err) {
            console.error(err.message);
            return res.status(500).send('Server Error')
        }
    });


    router.post('/getIncomingJobOffers', auth, async (req, res) => {
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        try {
            let offers = []
            let offer = await JobOffers.find({ buyerId: req.user._id })
            if (!offer) return res.status(400).json({ err: [{ msg: 'No Incoming Offers.' }] })
            for (job in offer) {
                let profile = await Profile.findOne({ user: offer[job].sellerId }).select('avatar').select('fullName')
                if (profile) {
                    offers.push({ seller: profile, request: offer[job] })
                }
                else {
                    offers.push({ job: offer[job] })
                }
            }
            return res.json(offers);
        }
        catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }
    });





    module.exports = router