"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var AuthHelper = /** @class */ (function () {
    function AuthHelper() {
    }
    AuthHelper.authenticateGameRequest = function (req, res, next) {
        var token = req.session.jwt;
        console.log(req.headers.referer);
        if (req.headers.referer == undefined)
            return res.sendStatus(401);
        if (token == null)
            return res.sendStatus(401);
        jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, user) {
            if (err)
                return res.sendStatus(403);
            //req.user = user
            next();
        });
    };
    return AuthHelper;
}());
exports.default = AuthHelper;
//# sourceMappingURL=authHelper.js.map