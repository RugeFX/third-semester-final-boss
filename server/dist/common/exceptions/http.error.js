export default class HttpError extends Error {
    status;
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}
//# sourceMappingURL=http.error.js.map