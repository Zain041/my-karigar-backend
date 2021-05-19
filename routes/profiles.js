const express = require("express");
const router = express.Router();
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const { v4: uuidv4 } = require('uuid');
const { check, validationResult } = require("express-validator");
// const addNotification = require("./notificationFunc");
// C:\Program Files\MongoDB\Server\3.4\bin
const auth = require("../middleware/auth");
const Profile = require("../models/Profile");
const User = require("../models/User");
// const Rating = require("../models/Ratings");

router.use(cors());

const storageEngine = multer.diskStorage({
    destination: './public/uploads/categories/',
    filename: function (req, file, fn) {
      fn(null, req.body.categoryName + path.extname(file.originalname)); //+'-'+file.fieldname
    }
  });
  //init
  const upload = multer({
    storage: storageEngine,
    limits: { fileSize: 200000 },
    fileFilter: function (req, file, callback) {
  
      validateFile(file, callback);
    }
  }).single('avatar');
  var validateFile = function (file, cb) {
    allowedFileTypes = /jpeg|jpg|png|gif/;
    const extension = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedFileTypes.test(file.mimetype);
    if (extension && mimeType) {
      return cb(null, true);
    } else {
      cb("Invalid file type. Only JPEG, PNG and GIF file are allowed.")
    }
  }
  cloudinary.config({
    cloud_name: "mykarigar041",
    api_key: "233295414959746",
    api_secret: "PcnRph4xxsW7J0Z9G6AHNETK3ms",
  });
  
// @route   GET api/profiles/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

// @route   POST api/profiles/createOrUpdateProfile
// @desc    Create new profile / Update existing profile
// @access  Public
router.post("/createOrUpdateProfile", auth, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const {
    address,
    fullName,
    phoneNumber,
    category,
    experience,
    availableTimeStart,
    availableTimeEnd,
    city,
    about,
  } = req.body;

  const profileFields = {};
  profileFields.user = req.user._id;
 
  if (about) profileFields.about = about;
  if (city) profileFields.city = city;
  if (address) profileFields.address = address;
  if (fullName) profileFields.fullName = fullName;
  if (phoneNumber) profileFields.phoneNumber = phoneNumber;
  if (experience) profileFields.experience = experience;
  if (category) profileFields.category = category;
  if (availableTimeStart) profileFields.availableTimeStart = availableTimeStart;
  if (availableTimeEnd) profileFields.availableTimeEnd = availableTimeEnd;

  try {
    var profile = await Profile.findOne({ user: req.user._id });
    if (profile) {
      profile = await Profile.findOneAndUpdate(
        { user: req.user._id },
        { $set: profileFields },
        { new: true }
      );
      return res.json(profile);
    }

    //Create Profile
    else {
      // profileFields.fullName = req.user.fullName;
      // profileFields.phoneNumber = req.user.phoneNumber;
      profile = new Profile(profileFields);
      await profile.save();
      return res.json(profile);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
// get providers 
router.get('/getProviders',
    
async (req, res) => {
  

 
   try {
       let profiles = await Profile.find({role:"provider"})
       
       return res.json({ profiles });
   }
   catch (err) {
       console.error(err.message);
       res.status(500).send('Server Error')
   }
});

router.post('/searchProviders',
    
async (req, res) => {
  
console.log(req.body)
 
   try {
    let profiles
      if(req.body.city!=null && req.body.category!=null){
        profiles = await Profile.find({role:"provider",status:"accepted",city:req.body.city,category:req.body.category})
      } else  if(req.body.city==null && req.body.category!=null){
        profiles = await Profile.find({role:"provider",status:"accepted",category:req.body.category})
      } else  if(req.body.city!=null){
        profiles = await Profile.find({role:"provider",status:"accepted",city:req.body.city})
      }
      else  if(req.body.category!=null){
        profiles = await Profile.find({role:"provider",status:"accepted"})
      }

      console.log(profiles)
       return res.json(profiles );
     
   }
   catch (err) {
       console.error(err.message);
       res.status(500).send('Server Error')
   }
});
// update profile by Admin-----------------------------------------------
router.put("/UpdateProfile", async (req, res) => {

 
  try {
 

    const profile = await Profile.findOneAndUpdate({user:req.body.user_id},{
      status:req.body.status
    },{ new: true })

    res.send(profile)
    

    
  } catch (error) {
    
    return res.status(404).send(error.message)
  }

  

}
)
router.post("/deleteProfile", async (req, res) => {

 
  try {
 

    const profile = await Profile.findOneAndDelete({user:req.body.user_id})

    res.send(profile)
    

    
  } catch (error) {
    
    return res.status(404).send(error.message)
  }

  

}
)

// @route   POST api/profiles/getCurrentUserProfile
// @desc    Get my profile
// @access  Private
router.post("/getCurrentUserProfile", auth, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  try {
    var profile = await Profile.findOne(
      { user: req.user._id },
      function (err, docs) {
        if (err) res.status(400).json({ err: [{ msg: "Profile not found" }] });
      }
    );
    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/profiles/getAllUsersProfile
// @desc    Get users profile image
// @access  Private
router.get("/getAllUsersProfile", async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  try {
    var profile = await Profile.find(function (err, docs) {
      if (err) res.status(400).json({ err: [{ msg: "Users not found" }] });
    });
    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/profiles/getUserProfile
// @desc    Get detailed user profile
// @access  Private
router.post("/getUserProfile", auth, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  try {
    var profile = await Profile.findOne({ _id: req.body._id });
    if (profile) {
      let userid = profile.user;
      console.log(userid);
      var user = await User.findOne({ _id: userid }).select("email");
    } else {
      res.status(404).send("User profile not found");
    }
    return res.json({ profile, user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//-------------------------------------------Image Upload Start Here---------------------------------------------

//init


// @route   POST api/profiles/uploadPhoto
// @desc    Post users profile image
// @access  Private
router.post("/uploadPhoto", auth, async (req, res) => {
    upload(req, res, async (error) => {
    if (error) {
      let msg = null;
      if (error.message) msg = error.message;
      else msg = error;
      return res.status(400).json({ errors: [{ msg: msg }] });
    } else {
      if (req.file == undefined) {
        return res
          .status(404)
          .json({ errors: [{ msg: "Image does not exist" }] });
      } else {

          var image = null;
        await cloudinary.uploader.upload(
          req.file.path,
          {
            resource_type: "image",
            public_id: "userProfileImages/"  + uuidv4(),
            chunk_size: 6000000,
          },
          function (error, result) {
            image = result;
          }
        );
        const profileFields = {};

        const avatar= image;
        const public_id=image.public_id

        profileFields.user = req.user._id;
        if (avatar) profileFields.avatar = avatar.secure_url;
        if (public_id) profileFields.public_id = avatar.public_id;
        console.log("avatar",profileFields.avatar);
        console.log("url",avatar.secure)
        try {
          var profile = await Profile.findOne({ user: req.user._id });

          if (profile) {
            var profile = await Profile.findOneAndUpdate(
              { user: req.user._id },
              { $set: profileFields },
              { new: true }
            );
            return res.json(profile);
          } else {
            profile = new Profile(profileFields);
            await profile.save();
            return res.status(200).json(profile);
          }
        } catch (err) {
          console.log(err);
          return res
            .status(404)
            .json({ errors: [{ msg: "image could not be uploaded" }] });
        }
      }
    }
  }

  
    )}
);

   
        /**
         * Create new record in mongoDB
         */
        // var image = "uploads/images/" + req.file.filename;
        // const profileFields = {};
        // const avatar = image;

        // profileFields.user = req.user._id;
        // if (avatar) profileFields.avatar = avatar;
        // try {
        //   var profile = await Profile.findOne({ user: req.user._id });

        //   if (profile) {
        //     var profile = await Profile.findOneAndUpdate(
        //       { user: req.user._id },
        //       { $set: profileFields },
        //       { new: true }
        //     );
        //     return res.json(profile);
        //   } else {
        //     profile = new Profile(profileFields);
        //     await profile.save();
        //     return res.status(200).json(profile);
        //   }
        // } catch (err) {
        //   return res
        //     .status(404)
        //     .json({ errors: [{ msg: "Image could not be uploaded" }] });
        // }
      
    
  
//-------------------------------------------Image Upload End Here---------------------------------------------

// @route   POST api/profiles/getProfileImage
// @desc    Get users profile image
// @access  Private
router.post("/getProfileImage", auth, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  try {
    let image = await Profile.findOne(
      { user: req.user._id },
      function (err, docs) {
        if (err) res.status(400).json({ err: [{ msg: "User not found" }] });
      }
    )
      .select("-_id")
      .select("-fullName")
      .select("-phoneNumber")
      .select("-profileVideo")
      .select("-roleId")
      .select("-address")
      .select("-date");
    return res.json({ image });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//-------------------------------------------Video Upload Start Here---------------------------------------------

const storageVideoEngine = multer.diskStorage({
  destination: "./public/uploads/videos/",
  filename: function (req, file, fn) {
    fn(null, req.user._id + path.extname(file.originalname)); //+'-'+file.fieldname
  },
});
//init
const uploadVideo = multer({
  storage: storageVideoEngine,
  limits: { fileSize: 1073741824 },
  fileFilter: function (req, file, callback) {
    validateVideoFile(file, callback);
  },
}).single("profileVideo");
var validateVideoFile = function (file, cb) {
  allowedFileTypes = /mp4/;
  const extension = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeType = allowedFileTypes.test(file.mimetype);
  if (extension && mimeType) {
    return cb(null, true);
  } else {
    cb("Invalid file type. Only mp4 file is allowed.");
  }
};

cloudinary.config({
  cloud_name: "mykarigar041",
  api_key: "233295414959746",
  api_secret: "PcnRph4xxsW7J0Z9G6AHNETK3ms",
});

// @route   POST api/profiles/uploadVideo
// @desc    Post users profile image
// @access  Private
router.post("/uploadVideo", auth, async (req, res) => {
  uploadVideo(req, res, async (error) => {
    if (error) {
      let msg = null;
      if (error.message) msg = error.message;
      else msg = error;
      return res.status(400).json({ errors: [{ msg: msg }] });
    } else {
      if (req.file == undefined) {
        return res
          .status(404)
          .json({ errors: [{ msg: "Video not attached" }] });
      } else {
        var video = null;
        await cloudinary.uploader.upload(
          req.file.path,
          {
            resource_type: "video",
            public_id: "profileVideo/" + req.user._id,
            chunk_size: 6000000,
          },
          function (error, result) {
            video = result;
          }
        );
        const profileFields = {};

        profileFields.user = req.user._id;
        if (video) profileFields.profileVideo = video.secure_url;
        try {
          var profile = await Profile.findOne({ user: req.user._id });

          if (profile) {
            var profile = await Profile.findOneAndUpdate(
              { user: req.user._id },
              { $set: profileFields },
              { new: true }
            );
            return res.json(profile);
          } else {
            profile = new Profile(profileFields);
            await profile.save();
            return res.status(200).json(profile);
          }
        } catch (err) {
          console.log(err);
          return res
            .status(404)
            .json({ errors: [{ msg: "Video could not be uploaded" }] });
        }
      }
    }
  });
});
//-------------------------------------------Video Upload End Here-----------------------------------------------

// @route   POST api/profiles/sendRating
// @desc    Send ratings to other user
// @access  Public
router.post("/sendRating", auth, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  var { rating, feedback, receiver } = req.body;
  rating = parseFloat(rating);

  try {
    let rate = new Rating({ sender: req.user._id, rating, feedback, receiver });
    await rate.save();
    let profile = await Profile.findOne({ user: req.user._id }).select(
      "fullName"
    );
    addNotification(
      "New Rating",
      receiver,
      profile.fullName + " has sent you a new rating"
    );
    let receiverRatings = await Rating.find({ receiver: receiver });
    var sum = 0;
    receiverRatings.map((rat) => {
      sum += rat.rating;
    });
    let avgRating = parseFloat(sum) / parseFloat(receiverRatings.length);
    let receiverProfile = await Profile.findOneAndUpdate(
      { user: receiver },
      { $set: { averageRating: avgRating } },
      { new: true }
    );
    return res.json({ rate, receiverProfile });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
