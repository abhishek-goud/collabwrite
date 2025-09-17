
const socketHandler = (io) => {
    io.on("connection", (socket) => {
        console.log("server socket")
        socket.on("join-document", ({documentId, userId, username}) => {
            socket.join(documentId);
            console.log(`Socket ${socket.id} joined room: ${documentId}`);
        })
    })
}


module.exports = { socketHandler };