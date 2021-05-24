const express = require("express");
const router = express.Router();
const cors = require("cors");

const { check, validationResult } = require("express-validator");


const auth = require("../middleware/auth");
const Appointment = require("../models/appointment");
const Profiles = require("../models/Profile")
const addNotification = require('./notificationFunc');


router.use(cors());


router.post("/addAppointment", auth, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
        const {appointmentDate,providerId,appointmentTime,coverLetter}=req.body

        const appointmentFields = {};
  appointmentFields.customerId = req.user._id;
 
  if (appointmentDate) appointmentFields.appointmentDate = appointmentDate;
  if (appointmentTime) appointmentFields.appointmentTime = appointmentTime;
  if (coverLetter) appointmentFields.coverLetter = coverLetter;
  if (providerId) appointmentFields.providerId = providerId;

   let appointment = new Appointment(
    appointmentFields
   )
   await appointment.save();

   return res.json({msg:"Appointment Created Successfully",appointment});
    } catch (err) {
        console.error(err.message);
        return res.status(500).send("Server Error");
    }
})

router.get('/getAppointments',
    
async (req, res) => {
  

 
   try {
       let appointments = await Appointment.find()
       
       return res.json( appointments );
   }
   catch (err) {
       console.error(err.message);
       res.status(500).send('Server Error')
   }
});

router.post("/updateAppointmentStatus", auth, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
      const {appointmentStatus,id,customerId}=req.body

      const appointmentFields = {};
      


if (appointmentStatus) appointmentFields.appointmentStatus = appointmentStatus;




 let appointment =  await Appointment.findOneAndUpdate({_id:id},
  appointmentFields,{
       unique:true
     }
 )

 let profile= await Profiles.findOne({user:req.user._id})

     if(appointmentStatus=="approved"){
      addNotification('Appointment Approved',customerId,profile.fullName+"Has Approved your Appointment you can contact him on appropriate time ")
     }else{
      addNotification('Appointment Rejected',customerId,profile.fullName+"Has Rejected  your Appointment The provider is not available ")
     }
      



 return res.json("Appointment Updated Successfully");
  } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
  }
})
  module.exports = router;