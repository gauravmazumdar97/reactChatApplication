const Joi = require("joi");

class UserRequest {
  getSignedUrl = () => {
    return Joi.object().keys({
      file_name: Joi.string().required().trim(),
      folder_name: Joi.string().required().trim()
    });
  }



}


module.exports = new UserRequest();