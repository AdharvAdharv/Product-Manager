import jwt from "jsonwebtoken";

const jwtAuthMiddleware = (requiredRole) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "No token provided, authorization denied" });
      }

      
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decoded;

      
      if (requiredRole && req.user.userRole !== requiredRole && requiredRole !== 'any') {
        return res.status(403).json({ message: "Access denied, insufficient permissions" });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};

export { jwtAuthMiddleware };
