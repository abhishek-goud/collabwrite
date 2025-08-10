const router = require("express").Router();
const isAuthenticated = require("../middleware/session");
const { getAllDocs, createDocument, getById } = require("../controller/document");

router.get("/", isAuthenticated, getAllDocs);
router.post("/new", isAuthenticated, createDocument);
router.get("/:id", isAuthenticated, getById)


module.exports = router;
