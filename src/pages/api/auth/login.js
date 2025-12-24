import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookie from "cookie";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password } = req.body;

  const filePath = path.join(process.cwd(), "data", "users.json");

  // If file missing or empty → no accounts exist
  if (!fs.existsSync(filePath)) {
    return res.status(400).json({ message: "Account does not exist" });
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");

  if (!fileContent || fileContent.trim() === "") {
    return res.status(400).json({ message: "Account does not exist" });
  }

  let users = [];
  try {
    users = JSON.parse(fileContent);
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Server error: user database corrupted" });
  }

  const user = users.find((u) => u.email === email);

  if (!user) {
    return res.status(400).json({ message: "Account does not exist" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Incorrect password" });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.setHeader(
    "Set-Cookie",
    cookie.serialize("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    })
  );

  return res.status(200).json({ message: "Login successful" });
}
