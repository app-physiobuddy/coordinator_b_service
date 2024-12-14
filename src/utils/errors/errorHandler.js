function errorHandler(error, req, res, next) {
  console.warn("ERROR HANDLING CALLED")
  const statusCode = error.statusCode || 500;
  console.error(JSON.stringify(error.message), error.stack);
  res.status(statusCode).json({ 
    error: "Something went wrong!",
    message: error.message.public || error.message,

  });
}
module.exports = errorHandler




