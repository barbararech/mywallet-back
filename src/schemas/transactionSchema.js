import joi from "joi";

export const transactionSchema = joi.object({
  value: joi.number().required(),
  description: joi.string().required(),
  type: joi.string().valid("income", "expense").required(),
});

export const updateTransactionSchema = joi.object({
  value: joi.number().required(),
  description: joi.string().required(),
  type: joi.string().valid("income", "expense").required(),
  _id: joi.required()
});
