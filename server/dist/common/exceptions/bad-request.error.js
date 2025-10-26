import HttpError from "./http.error";
export default class BadRequestError extends HttpError {
    meta;
    constructor(meta, message) {
        super(400, message);
        this.meta = meta;
    }
}
//# sourceMappingURL=bad-request.error.js.map