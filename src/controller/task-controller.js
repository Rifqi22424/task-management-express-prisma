// task-controller.js
import taskService from "../service/task-service.js";

const createTask = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const request = req.body;
        const result = await taskService.createTask(userId, request);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const getTask = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const taskId = req.params.taskId;
        const result = await taskService.getTask(userId, taskId);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const updateTask = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const taskId = req.params.taskId;
        const request = req.body;
        request.id = taskId;

        const result = await taskService.updateTask(userId, request);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const removeTask = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const taskId = req.params.taskId;

        await taskService.removeTask(userId, taskId);
        res.status(200).json({
            data: "OK"
        });
    } catch (e) {
        next(e);
    }
}

const searchTasks = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    // Convert userId to an integer
    const userIdInt = parseInt(userId, 10);

    const request = {
      title: req.query.title,
      description: req.query.description,
      completed: req.query.completed,
      page: req.query.page,
      size: req.query.size
    };

    const result = await taskService.searchTasks(userIdInt, request);
    res.status(200).json({
      data: result.data,
      paging: result.paging
    });
  } catch (e) {
    next(e);
  }
}


export default {
    createTask,
    getTask,
    updateTask,
    removeTask,
    searchTasks
}
