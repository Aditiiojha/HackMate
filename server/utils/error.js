/**
 * Creates a custom error object.
 * @param {number} statusCode The HTTP status code for the error (e.g., 404, 401).
 * @param {string} message The error message to send to the client.
 * @returns {Error} A new Error object with added statusCode and success properties.
 */
export const errorHandler = (statusCode, message) => {
  const error = new Error();
  error.statusCode = statusCode;
  error.message = message;
  return error;
};