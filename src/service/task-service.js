// task-service.js
import { validate } from "../validation/validation.js";
import {
  createTaskValidation,
  getTaskValidation,
  updateTaskValidation,
  searchTasksValidation
} from "../validation/task-validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { getUserValidation } from "../validation/user-validation.js";

const createTask = async (userId, request) => {
    const task = validate(createTaskValidation, request);
  
    // Convert userId to integer
    const userIdInt = parseInt(userId, 10);
  
    return prismaClient.task.create({
      data: {
        title: task.title,
        description: task.description,
        user: { connect: { id: userIdInt } },  // Connect the task to the user by userId
        completed: task.completed
      },
      select: {
        id: true,
        title: true,
        description: true,
        completed: true
      }
    });
  }
  
  

  const getTask = async (userId, taskId) => {
    userId = validate(getUserValidation, userId);
    taskId = validate(getTaskValidation, taskId);
  
    // Convert userId and taskId to integers
    const userIdInt = parseInt(userId, 10);
    const taskIdInt = parseInt(taskId, 10);
  
    const task = await prismaClient.task.findFirst({
      where: {
        userId: userIdInt,
        id: taskIdInt
      },
      select: {
        id: true,
        title: true,
        description: true,
        completed: true
      }
    });
  
    if (!task) {
      throw new ResponseError(404, "Task not found");
    }
  
    return task;
  }
  

  const updateTask = async (userId, request) => {
    const task = validate(updateTaskValidation, request);
  
    // Convert userId to integer
    const userIdInt = parseInt(userId, 10);
  
    const totalTaskInDatabase = await prismaClient.task.count({
      where: {
        userId: userIdInt,
        id: task.id
      }
    });
  
    if (totalTaskInDatabase !== 1) {
      throw new ResponseError(404, "Task not found");
    }
  
    return prismaClient.task.update({
      where: {
        id: task.id
      },
      data: {
        title: task.title,
        description: task.description,
        completed: task.completed,
      },
      select: {
        id: true,
        title: true,
        description: true,
        completed: true
      }
    });
  }
  

  const removeTask = async (userId, taskId) => {
    // Convert userId and taskId to integers
    const userIdInt = parseInt(userId, 10);
    taskId = validate(getTaskValidation, taskId);
  
    const totalInDatabase = await prismaClient.task.count({
      where: {
        userId: userIdInt,
        id: taskId
      }
    });
  
    if (totalInDatabase !== 1) {
      throw new ResponseError(404, "Task not found");
    }
  
    return prismaClient.task.delete({
      where: {
        id: taskId
      }
    });
  }
  

  const searchTasks = async (userId, request) => {
    request = validate(searchTasksValidation, request);
  
    const skip = (request.page - 1) * request.size;
  
    const filters = {
      userId: userId
    };
  
    if (request.title) {
      filters.title = {
        contains: request.title
      };
    }
    if (request.description) {
      filters.description = {
        contains: request.description
      };
    }
    if (request.completed !== undefined) {
      filters.completed = request.completed;
    }
  
    const tasks = await prismaClient.task.findMany({
      where: filters,
      take: request.size,
      skip: skip
    });
  
    const totalItems = await prismaClient.task.count({
      where: filters
    });
  
    return {
      data: tasks,
      paging: {
        page: request.page,
        total_item: totalItems,
        total_page: Math.ceil(totalItems / request.size)
      }
    };
  };
  

export default {
  createTask,
  getTask,
  updateTask,
  removeTask,
  searchTasks
}