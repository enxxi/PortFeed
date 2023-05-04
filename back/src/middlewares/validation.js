import Joi from "joi";

const userTokenValidation = (req, res, next) => {
  const tokenUser_id = req.currentUserId;
  const pathUser_id = req.params.user_id;

  if (tokenUser_id !== pathUser_id) {
    return next(new Error("인증정보가 올바르지 않습니다."));
  }
  next();
};

const userValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string(),
    description: Joi.string().max(20).allow(null, ""),
    confirmPassword: Joi.string(),
    profile: Joi.string(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }
  next();
};

const projectValidation = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string(),
    description: Joi.string().allow(null, ""),
    date: Joi.string().allow(null, ""),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const certificateValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string(),
    organization: Joi.string(),
    description: Joi.string().allow(null, ""),
    date: Joi.string().allow(null, ""),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const educationValidation = (req, res, next) => {
  const schema = Joi.object({
    school: Joi.string().regex(/(학교|학원)/),
    degree: Joi.string().valid("학사", "석사", "박사"),
    major: Joi.string(),
    description: Joi.string().allow(null, ""),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const awardValidation = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string(),
    organization: Joi.string(),
    description: Joi.string().allow(null, ""),
    date: Joi.string(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = {
  userTokenValidation,
  userValidation,
  projectValidation,
  certificateValidation,
  educationValidation,
  awardValidation,
};
