import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password } = req.body;

  const filePath = path.join(process.cwd(), "data", "users.json");

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }

  const users = JSON.parse(fs.readFileSync(filePath, "utf8"));

  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ message: "Account already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  users.push({ email, password: hashedPassword });

  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

  return res.status(201).json({ message: "Signup successful" });
}
