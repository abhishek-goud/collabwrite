const {
  getDocsByUserId,
  saveDocument,
  getDocById,
  updateDocService,
  checkDocumentPermissionService
} = require("../services/document");
const getAllDocs = async (req, res) => {
  try {
    const userId = req.session.userId;
    const docs = await getDocsByUserId(userId);
    return res.status(200).json(docs);
  } catch (err) {
    console.log("Error fetching  documents:", err);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    console.log("session: ", req.session);
  }
};

const createDocument = async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.session.userId;
    const newDoc = await saveDocument(userId, title);
    return res.status(201).json({
      message: "Document created successfully",
      document: newDoc,
      docId: newDoc.docId,
      title: newDoc.title,
    });
  } catch (err) {
    console.log("Error creating document:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getById = async (req, res) => {
  try {
    const documentId = req.params.id;
    const userId = req.session.userId;
    const permission = req.permission;
    

    const doc = await getDocById(documentId, userId);
    return res.status(200).json({...doc, permission: permission});
  } catch (err) {
    console.log("Error fetching document");
    return res.status(500).json({ message: "Error fetching document" });
  }
};

const updateDocument = async (req, res) => {
  try {
    const docId = req.params.id;
    const { content, title } = req.body;
    const updatedDoc = await updateDocService(docId, content, title);
    return res
      .status(200)
      .json({
        message: "document updated successfully",
        title: updatedDoc.title,
      });
  } catch (err) {
    res.status(500).json({ message: "Failed to update document" });
  }
};



module.exports = { getAllDocs, createDocument, getById, updateDocument };
