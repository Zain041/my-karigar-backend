const Joi = require("joi");
//newJob Post validation
const productVal = (data) => {
  const schema = Joi.object({
    seller_id: Joi.string().required(),
    product_name: Joi.string().required(),
    product_description: Joi.string().required(),
    product_price: Joi.number().required(),
    product_location: Joi.string().required(),
    product_lat: Joi.number().required(),
    product_lng: Joi.number().required(),
    posting_date_time: Joi.date(),
    selling_status: Joi.string().required(),
  });
  return schema.validate(data);
};

module.exports = {
  productVal,
};
