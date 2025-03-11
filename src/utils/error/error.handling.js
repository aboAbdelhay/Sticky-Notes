export const asyncHandler = (fn) => {
  return async (req, res, next) => {
    fn(req, res, next).catch((error) => {
      return next(new Error(error, { cause: 500 }));
    });
  };
};

export const globalErrorHandling = (error, req, res, next) => {
  if (process.env.MOOD == "dev") {
    return res.status(error.cause || 400).json({
      message: error.message,
      error,
      stack: error.stack,
    });
  }
  return res.status(error.cause || 400).json({ message: error.message });
};
