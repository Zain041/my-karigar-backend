const express = require("express");
const router = express.Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

const config = require("config");
const auth = require("../middleware/auth");
const Services = require("../models/services");

// const Rating = require("../../models/Ratings");
// const Chats = require("../../models/Chat");
// const JobMessages = require("../../models/JobMessages");
// const ShopMessages = require("../../models/ShopMessages");
router.use(cors());


router.post("/addServices", auth, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
        const {title,description}=req.body

        const servicesFields = {};
  servicesFields.user = req.user._id;
 
  if (title) servicesFields.title = title;
  if (description) servicesFields.description = description;

   let services = new Services(
       servicesFields
   )
   await services.save();

   return res.json("Service Created Successfully");
    } catch (err) {
        console.error(err.message);
        return res.status(500).send("Server Error");
    }
})

router.post("/updateServices", auth, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
      const {title,description}=req.body

      const servicesFields = {};
      console.log(req.body.id)


if (title) servicesFields.title = title;
if (description) servicesFields.description = description;

 let services =  await Services.findOneAndUpdate({_id:req.body.id},
     servicesFields,{
       unique:true
     }
 )



 return res.json("Service Updated Successfully");
  } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
  }
})
router.post("/deleteServices", auth, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
      const {id}=req.body
      console.log(id)

 



 let services =  await Services.findOneAndDelete({_id:id}
    
 )


 return res.json("Service Deleted Successfully ");
  } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
  }
})


router.post("/getCurrentUserServices", auth, async (req, res) => {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
   console.log(req.body.id)
    try {
      var services = await Services.find(
        { user: req.body.id },
        function (err, docs) {
          if (err) res.status(400).json({ err: [{ msg: "Services not found" }] });
        }
      );
      console.log(services)
      return res.json(services);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  });
  module.exports = router;