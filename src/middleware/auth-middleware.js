import { prismaClient } from "../application/database.js";

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      errors: "Unauthorized"
    }).end();
  } else {
    const token = authHeader.split(' ')[1];
    
    const user = await prismaClient.user.findFirst({
      where: {
        token: token
      }
    });

    if (!user) {
      res.status(401).json({
        errors: "Unauthorized"
      }).end();
    } else {
      req.user = user;
      next();
    }
  }
}
