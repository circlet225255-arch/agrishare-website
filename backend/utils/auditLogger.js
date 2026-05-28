const AuditLog = require('../models/AuditLog');

const cleanDocument = (value) => {
  if (!value) return value;
  if (typeof value.toObject === 'function') return value.toObject();
  return value;
};

const logAudit = async ({ req, action, entityType, entityId, before, after, metadata }) => {
  try {
    await AuditLog.create({
      actorId: req.user?._id,
      actorSnapshot: req.user
        ? {
            fullName: req.user.fullName,
            email: req.user.email,
            role: req.user.role,
          }
        : undefined,
      action,
      entityType,
      entityId: entityId ? String(entityId) : undefined,
      before: cleanDocument(before),
      after: cleanDocument(after),
      metadata,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });
  } catch (error) {
    console.error('Audit log failed:', error.message);
  }
};

module.exports = logAudit;
