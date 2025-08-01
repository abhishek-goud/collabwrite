const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const { getUsers, createUser } = require("../services/users");

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
    res.status(201).json({ message: "User registered successfully", userId });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const userLogin = async(req, res) => {
  const {username, password} = req.body;
  const user = await getUsers({username, password});
  const isValidpassword = await bcrypt.compare(password, user.passwordHash);
  
  if(!isValidpassword){
    return res.status(401).json({message: "Invalid credentials"})
  }

  req.session.userId = user.userId;
  req.session.username = user.username;

  res.json({
    message: "Login successful",
    userId: user.userId,
    username: user.username
  })

}

const checkSession = (req, res) => {
  return res.send("Session is active");
}

module.exports = { registerUser, userLogin, checkSession};
