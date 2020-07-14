"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var body_parser_1 = __importDefault(require("body-parser"));
var cors_1 = __importDefault(require("cors"));
var dotenv_1 = __importDefault(require("dotenv"));
var path_1 = __importDefault(require("path"));
var socketInstance_1 = __importDefault(require("./socketIo/socketInstance"));
dotenv_1.default.config();
var ExpressServer = /** @class */ (function () {
    function ExpressServer() {
        this.app = express_1.default();
        this.app.use(body_parser_1.default.json({ 'limit': '50mb' }));
        this.app.use(body_parser_1.default.urlencoded({ 'extended': true, 'limit': '50mb' }));
        this.app.use(cors_1.default({ 'origin': '*', 'methods': ['*', 'DELETE', 'GET', 'OPTIONS', 'PATCH', 'POST'], 'allowedHeaders': ['*', 'authorization', 'content-type'] }));
        //this.app.use(this.router)
        this.app.use('/', express_1.default.static('build/games'));
        this.app.get("/game/cubeGame", function (req, res) {
            console.log("here");
        });
        this.app.get("*", function (req, res) {
            var gameName = req.originalUrl.substring(0, req.originalUrl.indexOf('?')).replace(/[^a-zA-Z ]/g, "");
            var userId = Object.keys(req.query)[0];
            var roomData = { userId: userId, gameName: gameName };
            setTimeout(function () {
                sendErrorIframe(roomData);
            }, 5000);
            res.sendFile(path_1.default.join("build/errorPage/error.html"), { root: process.env.ROOT_FOLDER });
        });
        this.server = http_1.default.createServer(this.app);
        this.server.listen(process.env.PORT || 8000);
        ExpressServer.socketInstance = socketInstance_1.default.getSocketInstance(this.server);
        console.log('=====================================');
        console.log('SERVER SETTINGS:');
        console.log("Server running at - localhost:8000");
        console.log('=====================================');
    }
    ExpressServer.initSerever = function () {
        return new ExpressServer();
    };
    return ExpressServer;
}());
var sendErrorIframe = function (roomData) {
    var reactSocket = ExpressServer.socketInstance.gameInstance.getGameConnection(roomData);
    console.log("reactSocket: " + reactSocket);
    reactSocket.reactSocket.emit("gameReady");
};
ExpressServer.initSerever();
//# sourceMappingURL=index.js.map