"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __importDefault(require("./game"));
var apiRequest_1 = __importDefault(require("../helperClasses/apiRequest"));
var UnitySocketListener = /** @class */ (function () {
    function UnitySocketListener(_socket, _gameData) {
        var _this = this;
        this.userId = "0";
        this.socket = _socket;
        this.gameInstance = game_1.default.getGameInstance();
        this.apiRequest = apiRequest_1.default.getApiRequestInstance();
        // add this game instance and get the user Id for the room name
        var userId = this.gameInstance.addUnitySocketToGameConnectionAndGetId(_gameData.name, this.socket);
        //if thee are no avalible react clients
        if (userId == "0") {
            console.log("in if no id if");
            this.socket.emit("sendToErrorPage", {});
        }
        else {
            console.log("in else");
            this.gameData = {
                id: _gameData._id,
                name: _gameData.name,
                userId: userId
            };
            //set user id
            //join roomSS
            this.socket.join(this.gameData.name + "/" + this.gameData.userId);
            console.log("game data: ", this.gameData);
            //send game info to unity client
            this.socket.emit("connectedToServer", this.gameData);
            this.socket.on("challengeCompleted", function (challenge) {
                try {
                    _this.apiRequest.post("game", "challengeCompleted", challenge);
                    //send to react
                    _this.socket.to(challenge.gameName + "/" + _this.userId).emit("challengeCompleted", challenge.name);
                }
                catch (e) {
                    console.log(e);
                }
            });
        }
    }
    return UnitySocketListener;
}());
exports.default = UnitySocketListener;
//# sourceMappingURL=unitySocketListener.js.map