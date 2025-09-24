const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const { getUser, createUser } = require("../services/db/users");

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await getUsers({ username, email });
    if (existingUser) {
      return res.status(400).json({
        message:
          existingUser.email === email
            ? "Email already exists"
            : "Username already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const userId = uuidv4();

    await createUser({ username, email, passwordHash, userId });
    return res
      .status(201)
      .json({ message: "User registered successfully", userId });
  } catch (err) {
    console.error("Error registering user:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await getUser({ username, password });
    const isValidpassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidpassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    req.session.userId = user.userId;
    req.session.username = user.username;

    return res.json({
      message: "Login successful",
      userId: user.userId,
      username: user.username,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const checkSession = (req, res) => {
  return res.status(200).json({
    message: true,
    username: req.session.username,
    userId: req.session.userId,
  });
};

module.exports = { registerUser, userLogin, checkSession };
