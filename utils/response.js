const errorResponse = (code, error, res) => {
  res.status(code).json({ message: error });
};
const apiResponse = (code, message, data, res) => {
  res.status(code).json({ message: message, data });
};

export { errorResponse, apiResponse };
