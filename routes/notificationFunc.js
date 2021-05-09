const express = require('express')
const router = express.Router()
const cors = require('cors')

const Notification = require('../models/Notification')

router.use(cors())

// @desc    Send Notifications
const addNotification = async (type, receiver, message) => {
    const notificationFields = {};
    notificationFields.type = type;
    notificationFields.message = message;
    notificationFields.receiver = receiver;
    try {
        notification = new Notification(notificationFields);
        await notification.save()
    }
    catch (err) {
        console.log(err.message);
        //Exit process with failure
        process.exit(1);
    }
}

module.exports = addNotification;

