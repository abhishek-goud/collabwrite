const { getDocsByUserId, saveDocument } = require("../services/document");
const getAllDocs = async(req, res) => {
    try{
        const userId = req.session.userId;
        const docs = await getDocsByUserId(userId);
        return res.status(200).json(docs)
    } catch (err){
        console.log("Error fetching  documents:", err)
        return res.status(500).json({message: "Internal server error"});
    }
}

const createDocument = async(req, res) => {
    try{
        const {title} = req.body;
        const userId = req.session.userId;
        const newDoc = await saveDocument(userId, title);
        return res.status(201).json({
            message: "Document created successfully",
            document: newDoc,
            docId: newDoc.docId,
            title: newDoc.title,
        })
    } catch(err){
        console.log("Error creating document:", err);
        return res.status(500).json({message: "Internal server error"});
    }
}
module.exports = {getAllDocs, createDocument}