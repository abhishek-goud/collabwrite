const { getDocsByUserId, saveDocument, getDocById } = require("../services/document");
const getAllDocs = async(req, res) => {
    try{
        const userId = req.session.userId;
        const docs = await getDocsByUserId(userId);
        return res.status(200).json(docs)
    } catch (err){
        console.log("Error fetching  documents:", err)
        return res.status(500).json({message: "Internal server error"});
    }
    finally{
        console.log("session: ",req.session)
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

const getById = async(req, res) => {
    try{
        const documentId = req.params.id;
        const userId = req.session.userId;

        const doc = await getDocById(documentId, userId);
        return res.status(200).json(doc);
    } catch(err){
        console.log("Error fetching document")
        return res.status(500).json({message: "Error fetching document"});
    }
}
module.exports = {getAllDocs, createDocument, getById}