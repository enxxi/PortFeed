import Joi from 'joi';

const userValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string(),
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
    description: Joi.string(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const certificationValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string(),
    oraganization: Joi.string(),
    description: Joi.string(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const educationValidation = (req, res, next) => {
  const schema = Joi.object({
    school: Joi.string().regex(/^.*학교$/),
    degree: Joi.string().valid('학사', '석사', '박사'),
    major: Joi.string(),
    description: Joi.string(),

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
    oraganization: Joi.string(),
    description: Joi.string(),

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
  certificationValidation,
  educationValidation,
  awardValidation
};
