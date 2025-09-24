const router = require("express").Router();
const {isAuthenticated, checkDocumentPermission} = require("../middlewares/middleware");
const { getAllDocs, createDocument, getById, updateDocument, shareDocument } = require("../controller/document");

router.get("/", isAuthenticated, getAllDocs);
router.get("/:id", isAuthenticated, checkDocumentPermission, getById);

router.post("/new", isAuthenticated, createDocument);

router.put("/:id", isAuthenticated, checkDocumentPermission, updateDocument);
router.put("/share/:id", isAuthenticated, checkDocumentPermission, shareDocument);


module.exports = router;
