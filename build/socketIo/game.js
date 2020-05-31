"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Game = /** @class */ (function () {
    function Game() {
        this.gameConnections = [];
    }
    Game.prototype.getGameConnections = function () {
        return this.gameConnections;
    };
    Game.prototype.addGameConnection = function (gameConnection) {
        this.gameConnections.push(gameConnection);
    };
    Game.prototype.removeGameConnection = function (userId) {
        var _this = this;
        this.gameConnections.forEach(function (gameConnection, i) {
            if (gameConnection.roomData.userId == userId) {
                //remove the disconnected player player from players array
                _this.gameConnections.splice(i, 1);
            }
        });
    };
    Game.prototype.addUnitySocketToGameConnectionAndGetId = function (gameName, socket) {
        var id = "0";
        var foundIndex = this.gameConnections.findIndex(function (gameConnection) {
            return gameConnection.roomData.gameName == gameName && gameConnection.unitySocket == null;
        });
        if (foundIndex >= 0) {
            this.gameConnections[foundIndex].unitySocket = socket;
            id = this.gameConnections[foundIndex].roomData.userId;
        }
        return id;
    };
    Game.prototype.isDuplicate = function (userId) {
        var isDuplicate = false;
        this.gameConnections.forEach(function (gameConnection) {
            if (gameConnection.roomData.userId == userId) {
                return isDuplicate = true;
            }
        });
        return isDuplicate;
    };
    Game.getGameInstance = function () {
        if (!Game.GameInstance) {
            Game.GameInstance = new Game();
        }
        return Game.GameInstance;
    };
    return Game;
}());
exports.default = Game;
//# sourceMappingURL=game.js.map