"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __importDefault(require("./game"));
var ReactSocketListener = /** @class */ (function () {
    function ReactSocketListener(_socket, _roomData) {
        var _this = this;
        this.userId = "0";
        this.socket = _socket;
        this.roomData = _roomData;
        this.gameInstance = game_1.default.getGameInstance();
        if (!this.gameInstance.isDuplicate(this.roomData.userId)) {
            console.log(this.roomData.gameName + "/" + this.roomData.userId);
            this.socket.join(this.roomData.gameName + "/" + this.roomData.userId);
            this.gameInstance.addGameConnection({
                roomData: {
                    userId: this.roomData.userId,
                    gameName: this.roomData.gameName,
                },
                reactSocket: this.socket,
                unitySocket: null
            });
            this.userId = this.roomData.userId;
            this.socket.emit("gameReady");
        }
        else {
            this.socket.emit('isDuplicate');
        }
        this.socket.on("disconnect", function () {
            _this.gameInstance.removeGameConnection(_this.userId);
        });
    }
    return ReactSocketListener;
}());
exports.default = ReactSocketListener;
//# sourceMappingURL=reactSocketListener.js.map