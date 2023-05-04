import Joi from "joi";

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
    // fromdate: Joi.string().isoDate(),
    // todate: Joi.string().isoDate(),
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
    // date: Joi.string().regex(/^\d{4}$/),
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
    // date: Joi.string().regex(/^\d{4}$/),
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
    // date: Joi.string().regex(/^\d{4}$/),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = {
  userValidation,
  projectValidation,
  certificateValidation,
  educationValidation,
  awardValidation,
};
