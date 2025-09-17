const { checkDocumentPermissionService } = require("../services/document");

const isAuthenticated = (req, res, next) => {
    if(!req.session || !req.session.userId || !req.session.username){
        console.log("session: ",req.session)
        return res.status(401).json({message: "Unauthorized"});
    }

    next();
}


const checkDocumentPermission = async (req, res, next) => {
  try {
    const docId = req.params.id;
    const userId = req.session.userId;
    const permission = await checkDocumentPermissionService(docId, userId);

    if (permission) {
       console.log({permission})
        req.permission = permission;
        next();
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};




module.exports = {isAuthenticated, checkDocumentPermission};