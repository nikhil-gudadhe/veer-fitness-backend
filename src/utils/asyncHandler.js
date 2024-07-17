// 1. asyncHandler function:
// Takes a requestHandler function as an argument.

// 2. Returns a new middleware function:
// (req, res, next) => { ... } is the middleware function that wraps requestHandler.

// 3. Promise.resolve(...):
// Ensures that the result of requestHandler is treated as a Promise.

// 4. Error Catching:
// .catch((error) => next(error)) catches any error thrown by requestHandler and passes it to the next middleware, typically an error-handling middleware.

const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
      // Ensure the result of requestHandler is always a Promise
      Promise.resolve(requestHandler(req, res, next))
        .catch((error) => next(error)); // Forward any error to the error-handling middleware
    };
  };
  
export { asyncHandler }