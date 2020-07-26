"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Game = /** @class */ (function () {
    function Game() {
        this.gameConnections = [];
    }
    Game.prototype.getGameConnection = function (roomData) {
        var _gameConnection;
        this.gameConnections.forEach(function (gameConnection) {
            if (gameConnection.roomData.gameName == roomData.gameName && gameConnection.roomData.userId == roomData.userId) {
                _gameConnection = gameConnection;
            }
        });
        return _gameConnection;
    };
    Game.prototype.checkReactConnectionExists = function (roomData) {
        var exists = false;
        this.gameConnections.forEach(function (gameConnection) {
            if (gameConnection.roomData.gameName == roomData.gameName && gameConnection.roomData.userId == roomData.userId && gameConnection.reactSocket !== null && gameConnection.unitySocket == null) {
                exists = true;
            }
        });
        return exists;
    };
    Game.prototype.getGameConnections = function () {
        return this.gameConnections;
    };
    Game.prototype.addGameConnection = function (gameConnection) {
        this.gameConnections.push(gameConnection);
    };
    Game.prototype.removeGameConnection = function (roomData) {
        var _this = this;
        this.gameConnections.forEach(function (gameConnection, i) {
            if (gameConnection.roomData.userId == roomData.userId && gameConnection.roomData.gameName == roomData.gameName) {
                //remove the disconnected player player from players array
                _this.gameConnections.splice(i, 1);
            }
        });
    };
    Game.prototype.addUnitySocketToGameConnection = function (roomData, socket) {
        var foundIndex = this.gameConnections.findIndex(function (gameConnection) {
            return gameConnection.roomData.gameName == roomData.gameName && gameConnection.unitySocket == null && gameConnection.roomData.userId == roomData.userId;
        });
        if (foundIndex >= 0) {
            this.gameConnections[foundIndex].unitySocket = socket;
        }
    };
    Game.prototype.isDuplicate = function (roomData) {
        console.log(this.getGameConnections());
        var isDuplicate = false;
        this.getGameConnections().forEach(function (gameConnection) {
            if (gameConnection.roomData.userId == roomData.userId && gameConnection.roomData.gameName == roomData.gameName) {
                isDuplicate = true;
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