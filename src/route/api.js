import express from "express";
import userController from "../controller/user-controller.js";
import taskController from "../controller/task-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

const userRouter = express.Router();
userRouter.use(authMiddleware);

// User API
userRouter.get('/api/users/current', userController.get);
userRouter.patch('/api/users/current', userController.update);
userRouter.delete('/api/users/logout', userController.logout);

// Task API
userRouter.post('/api/users/:userId/tasks', taskController.createTask);
userRouter.get('/api/users/:userId/tasks/:taskId', taskController.getTask);
userRouter.put('/api/users/:userId/tasks/:taskId', taskController.updateTask);
userRouter.delete('/api/users/:userId/tasks/:taskId', taskController.removeTask);
userRouter.get('/api/users/:userId/tasks', taskController.searchTasks);

export { userRouter };
