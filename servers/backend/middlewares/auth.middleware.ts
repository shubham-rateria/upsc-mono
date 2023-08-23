import jwt from "jsonwebtoken";
import { UserModel } from "../models/user";

const extractJwtMiddleware = (req: any, res: any, next: any) => {
  // Extract JWT from cookie
  const token = req.cookies.jwt;

  console.log({ token });

  if (!token) {
    return res.status(401).json({ message: "No JWT found in cookie" });
  }

  // Verify the JWT
  jwt.verify(token, "your-secret-key", async (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: "Invalid JWT" });
    }

    try {
      // Find the user based on the JWT payload
      const user = await UserModel.findById(decodedToken.userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Attach the user object to the request
      req.user = user;
      next();
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

export default extractJwtMiddleware;
