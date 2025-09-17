const router = require("express").Router();
const {isAuthenticated, checkDocumentPermission} = require("../middlewares/middleware");
const { getAllDocs, createDocument, getById, updateDocument } = require("../controller/document");

router.get("/", isAuthenticated, getAllDocs);
router.post("/new", isAuthenticated, createDocument);
router.get("/:id", isAuthenticated, checkDocumentPermission, getById);
router.put("/:id", isAuthenticated, updateDocument);


module.exports = router;
