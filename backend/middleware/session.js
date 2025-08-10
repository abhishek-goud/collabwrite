const isAuthenticated = (req, res, next) => {
    if(!req.session || !req.session.userId || !req.session.username){
        console.log("session: ",req.session)
        return res.status(401).json({message: "Unauthorized"});
    }

    next();
}

module.exports = isAuthenticated;