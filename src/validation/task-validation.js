import Joi from "joi";

const createTaskValidation = Joi.object({
  title: Joi.string().max(255).required(),
  description: Joi.string().optional(),
  completed: Joi.boolean().optional()
});

const getTaskValidation = Joi.number().positive().required();

const updateTaskValidation = Joi.object({
  id: Joi.number().positive().required(),
  title: Joi.string().max(255).required(),
  description: Joi.string().optional(),
  completed: Joi.boolean().optional()
});

const searchTasksValidation = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  completed: Joi.boolean().optional(),
  page: Joi.number().min(1).positive().default(1),
  size: Joi.number().min(1).positive().max(100).default(10)
});

export {
  createTaskValidation,
  getTaskValidation,
  updateTaskValidation,
  searchTasksValidation
}