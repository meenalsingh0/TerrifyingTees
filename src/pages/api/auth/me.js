import jwt from "jsonwebtoken";
import cookie from "cookie";

export default function handler(req, res) {
  const cookies = cookie.parse(req.headers.cookie || "");
  const token = cookies.token;

  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ email: decoded.email });
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
