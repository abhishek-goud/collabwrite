const { PrismaClient } = require("../../generated/prisma");

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
        });
      }
    }

    return result;
  } catch (err) {
    throw new Error("Error fetching documents: " + err.message);
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
    throw new Error("Error saving document: " + err.message);
  }
};

const getDocById = async (documentId) => {
  try {
    const doc = await prisma.document.findUnique({
      where: { docId: documentId },
    });
    return doc;
  } catch (err) {
    throw new Error("Error fetching document: " + err.message);
  }
};

const updateDocService = async (docId, content, title) => {
  try {
    const updatedDoc = await prisma.document.update({
      where: {
        docId: docId,
      },
      data: {
        content: content,
        title: title,
        updatedAt: new Date(),
      },
    });
    return updatedDoc;
  } catch (err) {
    throw new Error("Error updating document");
  }
};

const checkDocumentPermissionService = async (docId, userId) => {
  try {
    console.log(`Checking permissions for user ${userId} on document ${docId}`);

    const permission = await prisma.permission.findFirst({
      where: {
        docId: docId,
        userId: userId,
      },
    });

    if (!permission) {
      console.log("null");
      return null;
    }

    return permission.access;
  } catch (error) {
    console.error("Error checking document permission:", error);
    throw new Error("Error checking document permission: " + error.message);
  }
};

const shareDocumentService = async ({
  shareUserId,
  documentId,
  shareAccess,
}) => {
  try {
    const result = await prisma.permission.upsert({
      where: {
        userId_docId: {
          userId: shareUserId,
          docId: documentId,
        },
      },
      update: {
        access: shareAccess,
      },
      create: {
        userId: shareUserId,
        docId: documentId,
        access: shareAccess,
      },
    });
    return result;
  } catch (error) {
    console.log({ error });
    throw new Error("Error sharing document");
  }
};

const updateDocContentService = async (documentId, content) => {
  try {
    const doc = await prisma.document.update({
      where: {
        docId: documentId,
      },
      data: {
        content: content,
      },
    });
  } catch (err) {
    throw new Error("Error updating document");
  }
};

module.exports = {
  getDocsByUserId,
  saveDocument,
  getDocById,
  updateDocService,
  checkDocumentPermissionService,
  shareDocumentService,
  updateDocContentService
};
