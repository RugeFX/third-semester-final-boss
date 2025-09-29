import HttpError from "./http.error";

export default class BadRequestError extends HttpError {
    constructor(public meta: unknown[],message: string) {
        super(400, message);
    }
}