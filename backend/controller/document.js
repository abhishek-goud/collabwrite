const {
  getDocsByUserId,
  saveDocument,
  getDocById,
  updateDocService,
  shareDocumentService,
} = require("../services/db/document");

const { getUser } = require("../services/db/users");


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
  
    const userId = req.session.userId;
    const newDoc = await saveDocument(userId, "Untitled Document");
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

    const doc = await getDocById(documentId);
    // console.log({doc})
    return res.status(200).json({ ...doc, permission: permission });
  } catch (err) {
    console.log("Error fetching document");
    return res.status(500).json({ message: "Error fetching document" });
  }
};

const updateDocument = async (req, res) => {
  try {
    if(req.permission.toLowerCase() === 'read') return res.status(403).json({message: "access forbidden"})
    const docId = req.params.id;
    const { content, title } = req.body;
    const updatedDoc = await updateDocService(docId, content, title);
    return res.status(200).json({
      message: "document updated successfully",
      title: updatedDoc.title,
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to update document" });
  }
};

const shareDocument = async (req, res) => {
  try {
    const { shareUsername, shareAccess } = req.body;
    const documentId = req.params.id;
    // console.log({shareUsername})
    const shareUser = await getUser({username:shareUsername, email: ""});
    // console.log({shareUser})
    if (!shareUser) return res.status(400).json({ message: "user not found" });
    await shareDocumentService({
      shareUserId: shareUser.userId,
      documentId,
      shareAccess,
    });
    return res.status(200).json({ message: "document shared successfully" });
  } catch (err) {
    console.log({err})
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllDocs,
  createDocument,
  getById,
  updateDocument,
  shareDocument,
};
