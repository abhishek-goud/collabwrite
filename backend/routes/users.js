const { registerUser, userLogin, checkSession } = require("../controller/user");
const {isAuthenticated} = require("../middlewares/middleware");


const router = require("express").Router();

router.get("/session", isAuthenticated ,checkSession);

router.post("/register", registerUser);
router.post("/login", userLogin);


module.exports = router;
