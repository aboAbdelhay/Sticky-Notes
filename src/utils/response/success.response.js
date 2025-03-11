export const successResponse = ({ res, message, token, status, user, note, notes } = {}) => {
  return res.status(status || 200).json({ message, token, user, note, notes });
};
