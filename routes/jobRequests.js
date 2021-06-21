const express = require('express')
const router = express.Router()
const cors = require('cors')

const { check, validationResult } = require('express-validator');

const config = require('config')
const auth = require('../middleware/auth')
const JobsRequests = require('../models/JobsRequests')
const Jobs = require('../models/Jobs')
const Profile = require('../models/Profile')

const addNotification = require('./notificationFunc');


router.use(cors())

// @route   POST api/jobRequests/sendJobRequest
// @desc    Send Job Request to Seller
// @access  Public
router.post('/sendJobRequest',
    [
        check('sellerId', 'Seller Id is required')
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

        const { sellerId, amount,coverLetter, jobDate,jobTime,service } = req.body;
        console.log(req.body)

        const buyerId = req.user._id
        try {

            let job = await JobsRequests.findOne({ buyerId: req.user._id });

            if (job) {
                return res.status(400).json({ errors: [{ msg: 'Job request already sent.' }] });
            }

            job = new JobsRequests({ buyerId, sellerId, amount, jobDate,coverLetter,jobTime,service })
            await job.save();
            let buyer = await Profile.findOne({ user: buyerId }).select('fullName')
            addNotification("Job Request", sellerId, buyer.fullName + " has sent you a job request");
            return res.json(job)

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }
    })

// @route   POST api/jobRequests/getIncomingJobRequest
// @desc    Get Job Request from buyer
// @access  Public
router.post('/getIncomingJobRequest', auth, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        let request = []
        let jobRequest = await JobsRequests.find({ sellerId: req.user._id })
        if (!jobRequest) return res.status(400).json({ err: [{ msg: 'No incoming job requests.' }] })
        for (job in jobRequest) {
            let profile = await Profile.findOne({ user: jobRequest[job].buyerId }).select('avatar').select('fullName')
            if (profile) {
                request.push({ buyer: profile, request: jobRequest[job] })
            }
            else {
                request.push({ job: jobRequest[job] })
            }
        }
        return res.json(request);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

// @route   POST api/jobRequests/getOutgoingJobRequest
// @desc    get sent job request
// @access  Public
router.post('/getOutgoingJobRequest', auth, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        let request = []
        let jobRequest = await JobsRequests.find({ buyerId: req.user._id })
        if (!jobRequest) return res.status(400).json({ err: [{ msg: 'No Outgoing job requests.' }] })
        for (job in jobRequest) {
            let profile = await Profile.findOne({ user: jobRequest[job].sellerId }).select('avatar').select('fullName')
            if (profile) {
                request.push({ seller: profile, request: jobRequest[job] })
            }
            else {
                request.push({ job: jobRequest[job] })
            }
        }
        return res.json(request);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

// @route   POST api/jobRequests/acceptJobRequest
// @desc    Seller accept Job Request
// @access  Public
router.post('/acceptJobRequest',
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
            await JobsRequests.findOne({ _id: req.body._id })
                .then(async docs => {
                    let jobFields = {}
                    jobFields.buyerId = docs.buyerId;
                    jobFields.sellerId = docs.sellerId;
                    jobFields.amount = docs.amount;
                    jobFields.jobDate = docs.jobDate;
                    jobFields.jobTime=docs.jobTime,
                    jobFields.service=docs.service
                    
                    
                       
                    
                        

                    let job = new Jobs(jobFields);
                    await job.save();
                    await JobsRequests.findOneAndDelete({ _id: req.body._id });
                    let buyer = await Profile.findOne({ user: docs.buyerId }).select('avatar').select('fullName')
                    let seller = await Profile.findOne({ user: docs.sellerId }).select('avatar').select('fullName')
                    addNotification("Accept Request", jobFields.buyerId, seller.fullName + " has accepted your job request");
                    return res.json({ job, seller, buyer});
                })

        }

        catch (err) {
            console.error(err.message);
            return res.status(500).send('Server Error')
        }
    });

// @route   POST api/jobRequests/rejectJobRequest
// @desc    Seller accept Job Request
// @access  Public
router.post('/rejectJobRequest',
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
            await JobsRequests.findOneAndDelete({ _id: req.body._id })
            return res.send("job deleted")
        }

        catch (err) {
            console.error(err.message);
            return res.status(500).send('Server Error')
        }
    });

// @route   POST api/jobRequests/changeJobStatus
// @desc    Job completed 
// @access  Public
router.post('/changeJobStatus',
    [
        check('_id', 'Job Id is required')
            .not()
            .isEmpty(),
        check('status', 'status is required')
            .not()
            .isEmpty(),
    ],
    auth, async (req, res) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        let { status, _id } = req.body

        let job= await  Jobs.findOne({_id:_id})
        if(!job){
            res.status(401).json({ errors: [{ msg: "job does not  exists" }] });
        }
        console.log(job)
    

        try {
            await Jobs.findOneAndUpdate({ _id: _id }, { status: status }, { new: true })
                .then(async doc => {
                    return res.status(200).json(doc)
                })
        }

        catch (err) {
            console.error(err.message);
            return res.status(500).send('Server Error')
        }
    });

// @route   POST api/jobRequests/getRequestCompleteJobsAsBuyer
// @desc    get all my jobs as buyer with status request_complete
// @access  Public
router.post('/getRequestCompleteJobsAsBuyer', auth, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        let request = []
        let jobRequest = await Jobs.find({ status: 'request_complete', buyerId: req.user._id })
        if (!jobRequest) return res.status(400).json({ err: [{ msg: 'Complete jobs request not found.' }] })
        for (job in jobRequest) {
            let profile = await Profile.findOne({ user: jobRequest[job].sellerId }).select('avatar').select('fullName')
            if (profile) {
                request.push({ seller: profile, request: jobRequest[job] })
            }
            else {
                request.push({ job: jobRequest[job] })
            }
        }
        return res.json(request);

    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

// @route   POST api/jobRequests/getRequestCompleteJobsAsSeller
// @desc    get all my jobs as seller with status request_complete
// @access  Public
router.post('/getRequestCompleteJobsAsSeller', auth, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        let request = []
        let jobRequest = await Jobs.find({ status: 'request_complete', sellerId: req.user._id })
        if (!jobRequest) return res.status(400).json({ err: [{ msg: 'Complete jobs request not found.' }] })
        for (job in jobRequest) {
            let profile = await Profile.findOne({ user: jobRequest[job].buyerId }).select('avatar').select('fullName')
            if (profile) {
                console.log(profile)
                request.push({ buyer: profile, request: jobRequest[job] })
            }
            else {
                request.push({ job: jobRequest[job] })
            }
        }
        console.log(request)
        return res.json(request);

    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

// @route   POST api/jobRequests/getCompletedJobsAsBuyer
// @desc    get all my jobs as buyer with status completed
// @access  Public
router.post('/getCompletedJobsAsBuyer', auth, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        let request = []
        let jobRequest = await Jobs.find({ status: 'completed', buyerId: req.user._id })
        if (!jobRequest) return res.status(400).json({ err: [{ msg: 'Completed jobs not found.' }] })
        for (job in jobRequest) {
            let profile = await Profile.findOne({ user: jobRequest[job].sellerId }).select('avatar').select('fullName')
            if (profile) {
                request.push({ seller: profile, request: jobRequest[job] })
            }
            else {
                request.push({ job: jobRequest[job] })
            }
        }
        return res.json(request);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

// @route   POST api/jobRequests/getCompletedJobsAsSeller
// @desc    get all my jobs as seller with status completed
// @access  Public
router.post('/getCompletedJobsAsSeller', auth, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        let request = []
        let jobRequest = await Jobs.find({ status: 'completed', sellerId: req.user._id })
        if (!jobRequest) return res.status(400).json({ err: [{ msg: 'Completed jobs not found.' }] })
        for (job in jobRequest) {
            let profile = await Profile.findOne({ user: jobRequest[job].buyerId }).select('avatar').select('fullName')
            if (profile) {
                request.push({ buyer: profile, request: jobRequest[job] })
            }
            else {
                request.push({ job: jobRequest[job] })
            }
        }
        return res.json(request);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

// @route   POST api/jobRequests/getOngoingJobsAsBuyer
// @desc    get all my jobs as buyer with status ongoing
// @access  Public
router.post('/getOngoingJobsAsBuyer', auth, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        let request = []
        let jobRequest = await Jobs.find({ status: 'ongoing', buyerId: req.user._id })
        if (!jobRequest) return res.status(400).json({ err: [{ msg: 'Ongoing jobs not found.' }] })
        for (job in jobRequest) {
            let profile = await Profile.findOne({ user: jobRequest[job].sellerId }).select('avatar').select('fullName')
            if (profile) {
                request.push({ seller: profile, request: jobRequest[job] })
            }
            else {
                request.push({ job: jobRequest[job] })
            }
        }
        return res.json(request);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

// @route   POST api/jobRequests/getOngoingJobsAsSeller
// @desc    get all my jobs as seller with status ongoing
// @access  Public
router.post('/getOngoingJobsAsSeller', auth, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        let request = []
        let jobRequest = await Jobs.find({ status: 'ongoing', sellerId: req.user._id })
        if (!jobRequest) return res.status(400).json({ err: [{ msg: 'Completed jobs not found.' }] })
        for (job in jobRequest) {
            let profile = await Profile.findOne({ user: jobRequest[job].buyerId }).select('avatar').select('fullName')
            if (profile) {
                request.push({ buyer: profile, request: jobRequest[job] })
            }
            else {
                request.push({ job: jobRequest[job] })
            }
        }
        return res.json(request);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

// @route   POST api/jobRequests/getIncompleteJobsAsBuyer
// @desc    get all my jobs as buyer with status incomplete
// @access  Public
router.post('/getIncompleteJobsAsBuyer', auth, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        let request = []
        let jobRequest = await Jobs.find({ status: 'cancelled', buyerId: req.user._id })
        if (!jobRequest) return res.status(400).json({ err: [{ msg: 'Incomplete jobs not found.' }] })
        for (job in jobRequest) {
            let profile = await Profile.findOne({ user: jobRequest[job].sellerId }).select('avatar').select('fullName')
            if (profile) {
                request.push({ seller: profile, request: jobRequest[job] })
            }
            else {
                request.push({ job: jobRequest[job] })
            }
        }
        return res.json(request);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

// @route   POST api/jobRequests/getIncompleteJobsAsSeller
// @desc    get all my jobs as seller with status ongoing
// @access  Public
router.post('/getIncompleteJobsAsSeller', auth, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        let request = []
        let jobRequest = await Jobs.find({ status: 'cancelled', sellerId: req.user._id })
        if (!jobRequest) return res.status(400).json({ err: [{ msg: 'Incomplete jobs not found.' }] })
        for (job in jobRequest) {
            let profile = await Profile.findOne({ user: jobRequest[job].buyerId }).select('avatar').select('fullName')
            if (profile) {
                request.push({ buyer: profile, request: jobRequest[job] })
            }
            else {
                request.push({ job: jobRequest[job] })
            }
        }
        return res.json(request);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

// @route   POST api/jobRequests/jobStats
// @desc    get stats all my jobs 
// @access  Public
router.post('/jobStats', auth, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        let jobs = await Jobs.find( { $or: [ { buyerId: req.user._id }, { sellerId: req.user._id } ] })
        let jobRequest = await JobsRequests.find({ $or: [ { buyerId: req.user._id }, { sellerId: req.user._id } ] })
        var jobStats = {};
        var total_job_requests = {}
        console.log(jobs)
        jobs.map(docs => { return docs.status}).forEach(function (i) { jobStats[i] = (jobStats[i] || 0) + 1; })
        total_job_requests = jobRequest.length
        var total_completed_jobs = 0
        if(jobStats.completed)  total_completed_jobs = jobStats.completed
        else total_completed_jobs = 0

        var total_incomplete_jobs = 0
        if(jobStats.cancelled) total_incomplete_jobs = jobStats.cancelled 
        else total_incomplete_jobs = 0

        var total_complete_requests = 0
        if(jobStats.complete_requests)  total_complete_requests = jobStats.complete_requests
        else total_complete_requests = 0

        var total_ongoing_jobs = 0
        if(jobStats.ongoing) total_ongoing_jobs = jobStats.ongoing
        else total_ongoing_jobs = 0

        return res.json( {total_ongoing_jobs, total_completed_jobs, total_incomplete_jobs, total_complete_requests, total_job_requests} );
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});



module.exports = router