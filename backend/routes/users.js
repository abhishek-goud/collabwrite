const { registerUser, userLogin, checkSession } = require("../controller/user");
const isAuthenticated = require("../middleware/session");


const router = require("express").Router();

router.post("/register", registerUser);
router.post("/login", userLogin);
router.get("/session", isAuthenticated ,checkSession);

module.exports = router;
