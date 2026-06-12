const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');
const logAudit = require('../utils/auditLogger');

const allowedMimeTypes = new Map([
  ['image/png', 'png'],
  ['image/jpeg', 'jpg'],
  ['image/webp', 'webp'],
  ['video/mp4', 'mp4'],
  ['video/webm', 'webm'],
  ['video/quicktime', 'mov'],
  ['application/pdf', 'pdf'],
]);

const uploadRoot = path.join(__dirname, '..', 'uploads');

const saveDataUrl = async ({ dataUrl, folder = 'general', originalName = 'upload' }) => {
  const match = String(dataUrl || '').match(/^data:([^;]+);base64,(.+)$/);

  if (!match) {
    const error = new Error('File upload không đúng định dạng data URL');
    error.statusCode = 400;
    throw error;
  }

  const mimeType = match[1];
  const extension = allowedMimeTypes.get(mimeType);

  if (!extension) {
    const error = new Error('Chỉ hỗ trợ PNG, JPG, WEBP, MP4, WEBM, MOV hoặc PDF');
    error.statusCode = 400;
    throw error;
  }

  const buffer = Buffer.from(match[2], 'base64');
  const isVideo = mimeType.startsWith('video/');
  const maxBytes = (isVideo ? 30 : 8) * 1024 * 1024;

  if (!buffer.length || buffer.length > maxBytes) {
    const error = new Error(`File rỗng hoặc vượt quá ${isVideo ? 30 : 8}MB`);
    error.statusCode = 400;
    throw error;
  }

  const safeFolder = String(folder || 'general').replace(/[^a-z0-9_-]/gi, '').toLowerCase() || 'general';
  const destination = path.join(uploadRoot, safeFolder);
  await fs.mkdir(destination, { recursive: true });

  const baseName = path
    .basename(String(originalName || 'upload'), path.extname(String(originalName || 'upload')))
    .replace(/[^a-z0-9_-]/gi, '-')
    .replace(/-+/g, '-')
    .slice(0, 60)
    .toLowerCase() || 'upload';
  const fileName = `${Date.now()}-${crypto.randomBytes(5).toString('hex')}-${baseName}.${extension}`;
  const filePath = path.join(destination, fileName);

  await fs.writeFile(filePath, buffer);

  return {
    url: `/uploads/${safeFolder}/${fileName}`,
    fileName,
    mimeType,
    size: buffer.length,
  };
};

exports.uploadPublicFile = async (req, res) => {
  try {
    const file = await saveDataUrl({
      dataUrl: req.body.dataUrl,
      folder: req.body.folder || 'receipts',
      originalName: req.body.originalName,
    });

    res.status(201).json({ success: true, file });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

exports.uploadAdminFile = async (req, res) => {
  try {
    const file = await saveDataUrl({
      dataUrl: req.body.dataUrl,
      folder: req.body.folder || 'admin',
      originalName: req.body.originalName,
    });

    await logAudit({
      req,
      action: 'file.uploaded',
      entityType: 'Upload',
      entityId: file.url,
      after: file,
      metadata: { folder: req.body.folder || 'admin' },
    });

    res.status(201).json({ success: true, file });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};
