class InvalidFileTypeError extends Error {
    name = "InvalidFileTypeError"
    message = "InvalidFileTypeError"
}
class UnauthorizedError extends Error {
    name = "UnauthorizedError"
    message = "UnauthorizedError"
}
class InvalidJSONError extends Error {
    name = "InvalidJSONError"
    message = "InvalidJSONError"
}

module.exports = {
    InvalidFileTypeError,
    UnauthorizedError,
    InvalidJSONError
}