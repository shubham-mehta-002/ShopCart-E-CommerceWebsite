class ApiResponse {
  constructor(statusCode = 200, message = "success", data = null) {
    this.statusCode = statusCode;
    this.message = message;
    this.success = statusCode < 400;
    this.data = data;
  }
}

module.exports = { ApiResponse };
