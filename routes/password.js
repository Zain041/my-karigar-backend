// const express = require('express')
// const router = express.Router()
// const cors = require('cors')
// const jwt = require('jsonwebtoken')
// const nodemailer = require('nodemailer')
// const config = require('config')
// const { check, validationResult } = require('express-validator');

// const { globalEmail, globalEmailPass } = require('../../config/email')
// const { uiServerUrl } = require('../../config/url')
// const auth = require('../../middleware/auth')
// const User = require('../../models/User')

// router.use(cors())

// // @route   POST api/password/changePassword
// // @desc    Check Assignment time
// // @access  Public
// router.post('/changePassword',
//     [
//         check('_id', 'ID is required')
//             .not()
//             .isEmpty(),

//         check('password', 'password is required')
//             .not()
//             .isEmpty(),

//         check('newPassword', 'New password is required')
//             .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, 'i')
//             .withMessage('Password must include one lowercase character, one uppercase character, a number, and a special character.'),

//     ],
//     auth, async (req, res) => {
//         const errors = validationResult(req);

//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }

//         const { _id, password, newPassword } = req.body;
//         try {

//             let user = await User.findOne({ _id: _id });

//             if (password != user.password) {
//                 return res.status(404).json({ errors: [{ msg: 'Invalid Credentials' }] })
//             }

//             let newpass = newPassword
//             console.log(newpass)
//             User.findOneAndUpdate(
//                 { _id: _id },
//                 { password: newpass },
//                 { new: true }
//             )
//                 .then(usr => {
//                     return res.status(200).json({ success: [{ msg: 'Password changed successfully!' }] })
//                 }).catch(err => {
//                     return res.status(400).json({ errors: [{ msg: 'Could not change password. Please try again later!' }] })
//                 })

//         } catch (err) {
//             console.error(err.message);
//             return res.status(500).send('Server Error')
//         }

//     })

// // @route   POST api/password/forgotPassword
// // @desc    Forgot Password
// // @access  Public
// router.post('/forgotPassword',
//     [
//         check('email', 'Email is required')
//             .isEmail()
//             .exists()
//             .trim()
//             .normalizeEmail(),
//     ],
//     async (req, res) => {
//         const errors = validationResult(req);

//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }

//         const email = req.body.email
//         try {

//             let user = await User.findOne({ email: email });

//             if (!user)
//                 return res.status(400).json({ errors: [{ msg: 'User does not exist' }] });

//             const payload = {
//                 user: {
//                     email: email,
//                 },
//             }

//             jwt.sign(
//                 payload,
//                 config.get('jwtSecret'),
//                 { expiresIn: 3600 },
//                 (err, token) => {
//                     if (err) console.log({ err });
//                     else {
//                         var transporter = nodemailer.createTransport({
//                             service: 'gmail',
//                             auth: {
//                                 user: globalEmail,
//                                 pass: globalEmailPass
//                             }
//                         });
//                         const mailOptions = {
//                             from: globalEmail, // sender address
//                             to: email, // list of receivers
//                             subject: 'Reset Password', // Subject line
//                             html: '<h1><b>MVAC</b></h1><br />' +
//                                 '<h4><b>Reset Password</b></h4>' +
//                                 '<p>To reset your password, Click on url to access the platform. </p>' +
//                                 '<a href= "' + uiServerUrl + 'resetPassword?token=' + token + '">' + uiServerUrl + 'resetPassword/' + token + '</a>' +
//                                 '<p>This URL is valid only for an hour. </p>' +
//                                 '<br/>' +
//                                 '<br/>' +
//                                 '<p>Regards: </p>' +
//                                 '<p><b>Team MVAC</b></p>'// plain text body
//                         };
//                         transporter.sendMail(mailOptions, function (err, info) {
//                             if (err)
//                                 return res.status(400).json({ err: [{ msg: 'Email could not sent' }] });
//                             else
//                                 return res.json({ info })

//                         })
//                     }
//                 }
//             )
//         } catch (err) {
//             console.error(err.message);
//             res.status(500).send('Server Error')
//         }
//     })

// // @route   POST api/password/resetPassword
// // @desc    Check Assignment time
// // @access  Public
// router.post('/resetPassword',
//     [
//         check('password', 'password is required')
//             .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, 'i')
//             .withMessage('Password must include one lowercase character, one uppercase character, a number, and a special character.'),

//     ],
//     auth, async (req, res) => {
//         const errors = validationResult(req);

//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }

//         const { password } = req.body;
//         let email = req.user.email;
//         try {
//             var pwd = password

//             User.findOneAndUpdate({ email: email }, { password: pwd }, { new: true })
//                 .then(usr => {
//                     var transporter = nodemailer.createTransport({
//                         service: 'gmail',
//                         auth: {
//                             user: globalEmail,
//                             pass: globalEmailPass
//                         }
//                     });
//                     const mailOptions = {
//                         from: globalEmail, // sender address
//                         to: email, // list of receivers
//                         subject: 'Reset Password', // Subject line
//                         html: '<h1><b>MVAC</b></h1><br />' +
//                             '<h4><b>Password Reset Successfully!</b></h4>' +
//                             '<p>Password reset successfully. </p>' +
//                             '<br/>' +
//                             '<br/>' +
//                             '<p>Regards: </p>' +
//                             '<p><b>Team MVAC</b></p>'
//                     };
//                     transporter.sendMail(mailOptions, function (err, info) {
//                         if (err)
//                             console.log(err)
//                         else
//                             console.log("Email sent")
//                     })
//                     return res.status(200).send("Password updated successfully");
//                 }).catch(err => {
//                     return res.status(400).send('Could not reset password due to session timeout.');
//                 })



//         }
//         catch (err) {
//             console.error(err.message);
//             res.status(500).send('Server Error')
//         }
//     })

// module.exports = router