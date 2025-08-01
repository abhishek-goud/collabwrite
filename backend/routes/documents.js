const router = require("express").Router();
const isAuthenticated = require("../middleware/session");
const { getAllDocs, createDocument } = require("../controller/document");

router.get("/", isAuthenticated, getAllDocs);
router.post("/new", isAuthenticated, createDocument);

module.exports = router;
