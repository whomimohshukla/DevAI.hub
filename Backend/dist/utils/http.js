"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseError = parseError;
function parseError(err) {
    if (err instanceof Error)
        return err.message;
    return String(err);
}
