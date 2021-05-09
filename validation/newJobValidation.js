const Joi = require("joi");
//newJob Post validation
const newJobVal = (data) => {
  const schema = Joi.object({
    seller_id: Joi.string().required(),
    job_title: Joi.string().required(),
    job_description: Joi.string().required(),
    job_skills: Joi.string().required(),
    job_location: Joi.string().required(),
    experience_required: Joi.string().required(),
    salary: Joi.number(),
    job_status: Joi.string().required(),
  });
  return schema.validate(data);
};
//newJob Get validation
const getJobVal = (data) => {
  const schema = Joi.object({
    job_id: Joi.string().required(),
  });
  return schema.validate(data);
}; //newJob Get user fav validation
const getUserFavJobVal = (data) => {
  const schema = Joi.object({
    user_id: Joi.string().required(),
  });
  return schema.validate(data);
};

module.exports = {
  newJobVal,
  getJobVal,
  getUserFavJobVal,
};
