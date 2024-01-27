import {validate} from "../validation/validation.js";
import {
    getUserValidation,
    loginUserValidation,
    registerUserValidation,
    updateUserValidation
} from "../validation/user-validation.js";
import {prismaClient} from "../application/database.js";
import {ResponseError} from "../error/response-error.js";
import bcrypt from "bcrypt";
import {v4 as uuid} from "uuid";

const register = async (request) => {
    const user = validate(registerUserValidation, request);

    const countUser = await prismaClient.user.count({
        where: {
            username: user.username
        }
    });

    if (countUser === 1) {
        throw new ResponseError(400, "Username already exists");
    }

    user.password = await bcrypt.hash(user.password, 10);

    return prismaClient.user.create({
        data: user,
        select: {
            username: true,
            name: true,
            id: true
        }
    });
}

const login = async (request) => {
    const loginRequest = validate(loginUserValidation, request);

    const user = await prismaClient.user.findUnique({
        where: {
            username: loginRequest.username
        },
        select: {
            id: true,
            username: true,
            password: true
        }
    });

    if (!user) {
        throw new ResponseError(401, "Username or password wrong");
    }

    const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);
    if (!isPasswordValid) {
        throw new ResponseError(401, "Username or password wrong");
    }

    const token = uuid().toString();

    // Update user with new token and return user ID
    const updatedUser = await prismaClient.user.update({
        data: {
            token: token
        },
        where: {
            username: user.username
        },
        select: {
            id: true,
            token: true
        }
    });

    return updatedUser;
}


const get = async (username) => {
    username = validate(getUserValidation, username);

    const user = await prismaClient.user.findUnique({
        where: {
            username: username
        },
        select: {
            id: true,       // Include 'id' in the select
            username: true,
            name: true
        }
    });

    if (!user) {
        throw new ResponseError(404, "User not found");
    }

    return user;
}


const update = async (request) => {
    const user = validate(updateUserValidation, request);

    const totalUserInDatabase = await prismaClient.user.count({
        where: {
            username: user.username
        }
    });

    if (totalUserInDatabase !== 1) {
        throw new ResponseError(404, "user is not found");
    }

    const data = {};
    if (user.name) {
        data.name = user.name;
    }
    if (user.password) {
        data.password = await bcrypt.hash(user.password, 10);
    }

    return prismaClient.user.update({
        where: {
            username: user.username
        },
        data: data,
        select: {
            username: true,
            name: true
        }
    })
}

const logout = async (username) => {
    username = validate(getUserValidation, username);

    const user = await prismaClient.user.findUnique({
        where: {
            username: username
        }
    });

    if (!user) {
        throw new ResponseError(404, "user is not found");
    }

    return prismaClient.user.update({
        where: {
            username: username
        },
        data: {
            token: null
        },
        select: {
            username: true
        }
    })
}

const searchTasks = async (userId, request) => {
    request = validate(searchTasksValidation, request);
  
    const skip = (request.page - 1) * request.size;
  
    const filters = [];
  
    filters.push({
      userId: userId
    });
  
    if (request.title) {
      filters.push({
        title: {
          contains: request.title
        }
      });
    }
    if (request.description) {
      filters.push({
        description: {
          contains: request.description
        }
      });
    }
    if (request.completed !== undefined) {
      filters.push({
        completed: request.completed
      });
    }
  
    const tasks = await prismaClient.task.findMany({
      where: {
        AND: filters
      },
      take: request.size,
      skip: skip
    });
  
    const totalItems = await prismaClient.task.count({
      where: {
        AND: filters
      }
    });
  
    return {
      data: tasks,
      paging: {
        page: request.page,
        total_item: totalItems,
        total_page: Math.ceil(totalItems / request.size)
      }
    }
  }

export default {
    register,
    login,
    get,
    update,
    logout,
    searchTasks
}
