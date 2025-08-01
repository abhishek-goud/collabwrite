const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();

const getDocsByUserId = async (userId) => {
  try {
    const userPermissions = await prisma.permission.findMany({
      where: { userId: userId },
    });
 
    const docIds = userPermissions.map((perm) => perm.docId);
 
    const docs = await prisma.document.findMany({
      where: {
        docId: {
          in: docIds,
        },
      },
      select: {
        docId: true,
        title: true,
        createdBy: true,
        updatedAt: true,
      },
    });

  

    const result = [];
    for (const doc of docs) {
      // Find permission for this document
      const perm = userPermissions.find((p) => p.docId === doc.docId);

      if (perm) {
        result.push({
          docId: doc.docId,
          title: doc.title,
          createdBy: doc.createdBy,
          updatedAt: doc.updatedAt,
          access: perm.access,
        })
      }
    }

    return result;
  } catch (err) {
    console.log("Error fetching documents:", err);
  }
};

const saveDocument = async (userId, title) => {
  try {
    const doc = await prisma.document.create({
      data: {
        title,
        content: "",
        createdBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log({ doc });

    const permission = await prisma.permission.create({
      data: {
        userId,
        docId: doc.docId,
        access: "admin",
      },
    });

    return doc;
  } catch (err) {
    console.log("Error saving document:", err);
  }
};

module.exports = { getDocsByUserId, saveDocument };
