// A utility class designed to standardize the format of API responses.
// Example: const response = new apiResponse(200, { id: 1, name: 'John Doe' }, 'Data retrieved successfully');

class apiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
}

export {apiResponse}