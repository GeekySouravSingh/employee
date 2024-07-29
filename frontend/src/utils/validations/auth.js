import Joi from "joi";

export const validateRegisterFormFields = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    "string.empty": "username is required",
    "string.min": "username must be at least 3 characters",
    "string.max": "username must be at most 30 characters",
    "string.pattern.base":
      "username must not contain numbers or special characters",
  }),

  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "dev", "ca"] },
    })
    .required()
    .messages({
      "any.required": "Email is required",
      "string.empty": "Email is required",
      "string.email": "Email must be valid",
    }),

  password: Joi.string().min(4).required().messages({
    "string.min": "Password must be atlest of 4 characters",
    "string.empty": "Password is required",
  }),

  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match", // Custom error message for matching
    "any.required": "Confirm password is required",
  }),
});

export const validateLoginFormFields = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "dev", "ca"] },
    })
    .required()
    .messages({
      "any.required": "Email is required",
      "string.empty": "Email is required",
      "string.email": "Email must be valid",
    }),

  password: Joi.string().min(4).required().messages({
    "string.min": "Password must be atlest of 4 characters",
    "string.empty": "Password is required",
  }),
});

export const validatePasswordFields = Joi.object({
  password: Joi.string().min(4).required().messages({
    "string.min": "Password must be atlest of 4 characters",
    "string.empty": "Password is required",
  }),

  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match", // Custom error message for matching
    "any.required": "Confirm password is required",
  }),
});

export const validateEmailFields = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "dev", "ca"] },
    })
    .required()
    .messages({
      "any.required": "Email is required",
      "string.empty": "Email is required",
      "string.email": "Email must be valid",
    }),
});
