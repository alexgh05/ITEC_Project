// Handle file upload errors from multer
export const uploadErrorHandler = (err, req, res, next) => {
  if (err && err.message && err.message.includes('Only image files are allowed')) {
    return res.status(400).json({ 
      success: false, 
      error: 'Only image files (jpeg, jpg, png, webp) are allowed' 
    });
  }
  
  if (err && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ 
      success: false, 
      error: 'File size is too large. Maximum file size is 5MB' 
    });
  }
  
  if (err) {
    return res.status(400).json({ 
      success: false, 
      error: err.message || 'Error uploading file' 
    });
  }
  
  next();
};

// Handle 404 errors
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// General error handler
export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
}; 