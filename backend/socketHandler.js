const getRedisClient = require("./config");

const {
  getDocById,
  updateDocContentService,
} = require("./services/db/document");
const {
  getCachedDocById,
  setDocInCache,
  getCachedUserInfo,
  setUserInfoInCache,
} = require("./services/redis/document");

const socketHandler = async (io) => {
  const redisClient = await getRedisClient();
  io.on("connection", (socket) => {
    // console.log("server socket");
    socket.on(
      "join-document",
      async ({ documentId, userId, username, color }) => {
        socket.join(documentId);
        console.log(`Socket ${socket.id} joined room: ${documentId}`);

        try {
          await setUserInfoInCache(socket.id, userId, documentId);

          let doc = await getCachedDocById(documentId);
          if (!doc) {
            doc = await getDocById(documentId);
            await setDocInCache(documentId, doc);
          }

          let cursors = doc?.cursors || [];
          console.log("size", cursors.length);

          cursors = cursors.filter((c) => c.userId !== userId);

          cursors.push({
            userId,
            documentId,
            username,
            position: 0,
            color,
          });
          console.log({ cursors });
          await redisClient.hSet(`document:${documentId}`, {
            cursors: JSON.stringify(cursors),
          });

          //send document state to new joining client
          socket.emit("document-state", {
            content: doc.content,
            title: doc.title,
            cursors: cursors,
          });

          //Broadcast cursors to all client in the room
          io.to(documentId).emit("cursor-update", cursors);
        } catch (error) {
          console.log("Error", error);
        }
      }
    );

    // socket.on("text-operation", async (operation) => {
    //   try {
    //     const { documentId, userId, username, position, color, character } =
    //       operation;
    //     const doc = getDocByIdFromCache(documentId);
    //     if (!doc) return;

    //     let newContent = doc.content || "";
    //     if (type === "insert" && character) {
    //       newContent =
    //         newContent.slice(0, position) +
    //         character +
    //         newContent.slice(position);
    //     } else if (type === "delete") {
    //       newContent =
    //         newContent.slice(0, position) + newContent.slice(position + 1);
    //     }

    //     await redisClient.hSet(`doc:${documentId}`, {
    //       content: newContent,
    //     });

    //     const updateIdx =doc.cursors.find((c) => c.userId == userId)

    //     if(updateIdx >= 0) {
    //       const cursor = doc.cursors[updateIdx];
    //       doc.cursors[updateIdx] = {...cursor, position: position}
    //     }

    //     socket.to(documentId).emit("cursor-update", operation);

    //     await updateDocContentService(documentId, newContent);
    //   } catch (error) {
    //     console.log("Error", error);
    //   }
    // });

    // socket.on(
    //   "cursor-update",
    //   async ({ userId, documentId, position, cursor }) => {
    //     const doc = await getDocByIdFromCache(documentId);
    //     doc.
    //   }
    // );

    socket.on("text-operation", async (operation) => {
      try {
        const {
          documentId,
          userId,
          // username,
          position,
          // color,
          character,
          type,
        } = operation;

        let doc = await getCachedDocById(documentId);
        if (!doc) return;

        let newContent = doc.content || "";

        if (type === "insert" && character) {
          newContent =
            newContent.slice(0, position) +
            character +
            newContent.slice(position);
        } else if (type === "delete") {
          if (position < 1) return;
          const adjPos = position - 1;
          newContent =
            newContent.slice(0, adjPos) + newContent.slice(adjPos + 1);
        }

        doc.content = newContent;

        // Update cursor
        // const updatedCursor = doc?.cursors || [];
        const updateIdx = doc.cursors.findIndex((c) => c.userId === userId);
        if (updateIdx >= 0) {
          doc.cursors[updateIdx] = { ...doc.cursors[updateIdx], position };
        } else {
          // doc.cursors.push({ userId, username, position, color });/
          return;
        }

        // Save back to Redis
        await redisClient.hSet(`document:${documentId}`, {
          content: doc.content,
          cursors: JSON.stringify(doc.cursors),
        });

        // Broadcast cursor update
        socket.to(documentId).emit("cursor-update", doc.cursors);

        // Broadcast text operation (so others update too)
        socket.to(documentId).emit("text-operation", {
          documentId,
          type,
          position,
          character,
          userId,
        });

        // Persist final content to DB
        // console.log("DOC CONTENT",doc.content)
        console.log("TEXT OP CHAR", character);
        console.log("NEW CONTENT", newContent);
        await updateDocContentService(documentId, doc.content);
      } catch (error) {
        console.log("Error", error);
      }
    });

    socket.on("cursor-update", async (cursorInfo) => {
      try {
        const { documentId, userId, position } = cursorInfo;
        const doc = await getCachedDocById(documentId);
        if (!doc) return;
        let cursors = doc?.cursors || [];
        const updateIdx = cursors.findIndex((c) => c.userId === userId);
        cursors[updateIdx] = { ...cursors[updateIdx], position };
        await redisClient.hSet(`document:${documentId}`, {
          cursors: JSON.stringify(cursors),
        });
        io.to(documentId).emit("cursor-update", cursors);
      } catch (error) {
        console.log("Error updating cursor", error);
      }
    });

    socket.on("disconnect", async () => {
      try {
        const { userId, documentId } = await getCachedUserInfo(socket.id);
        const doc = await getCachedDocById(documentId);
        let cursors = [];
        cursors = JSON.parse(doc.cursors);
        if (!Array.isArray(cursors)) cursors = [];
        cursors = cursors.filter((c) => c.userId !== userId);

        await redisClient.hSet(`document:${documentId}`, {
          cursors: JSON.stringify(cursors),
        });

        io.to(documentId).on("cursor-update", cursors);
      } catch (error) {
        console.log("internal server error");
      }
    });
  });
};

module.exports = { socketHandler };
