var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Shape = (function () {
    function Shape() {
    }
    return Shape;
}());
var Rectangle = (function () {
    function Rectangle(name, x, y, width, height, ctx) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.ctx = ctx;
    }
    Rectangle.prototype.draw = function () {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.rect(this.x, this.y, this.width, this.height);
        this.ctx.strokeStyle = "green";
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();
    };
    Rectangle.prototype.isPointInside = function (x, y) {
        return (x > this.x && x < this.x + this.width) && (y > this.y && y < this.y + this.height);
    };
    return Rectangle;
}());
var Circle = (function () {
    function Circle(name, x, y, r, ctx) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.r = r;
        this.ctx = ctx;
    }
    Circle.prototype.draw = function () {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.ellipse(this.x, this.y, this.r, this.r, 0, 0, 2 * Math.PI);
        this.ctx.strokeStyle = "green";
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();
    };
    Circle.prototype.isPointInside = function (x, y) {
        return Math.sqrt(Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2)) > this.r;
    };
    return Circle;
}());
var Key = (function () {
    function Key() {
        this.pressed = {};
        this.LEFT = 65;
        this.UP = 87;
        this.RIGHT = 68;
        this.DOWN = 83;
    }
    Key.prototype.isDown = function (keyCode) {
        return this.pressed[keyCode];
    };
    Key.prototype.onKeydown = function (event) {
        this.pressed[event.keyCode] = true;
    };
    Key.prototype.onKeyup = function (event) {
        delete this.pressed[event.keyCode];
    };
    return Key;
}());
var Player = (function (_super) {
    __extends(Player, _super);
    function Player(game, name, x, y, width, height, ctx) {
        var _this = _super.call(this, name, x, y, width, height, ctx) || this;
        _this.speed = 2;
        _this.newx = 0;
        _this.newy = 0;
        _this.head = new Circle("head", _this.x, _this.y, 10, _this.ctx);
        _this.game = game;
        return _this;
    }
    Player.prototype.moveN = function () {
        this.newy = this.y - this.speed;
    };
    Player.prototype.moveW = function () {
        this.newx = this.x - this.speed;
    };
    Player.prototype.moveE = function () {
        this.newx = this.x + this.speed;
    };
    Player.prototype.moveS = function () {
        this.newy = this.y + this.speed;
    };
    Player.prototype.update = function () {
        if (this.newx && this.newy) {
            var distance = Math.sqrt(Math.pow(this.x - this.newx, 2) + Math.pow(this.y - this.newy, 2));
            if (distance > this.speed) {
                this.newx = this.x - this.newx > 0 ? this.x - (this.speed * 0.707106781) : this.x + (this.speed * 0.707106781);
                this.newy = this.y - this.newy > 0 ? this.y - (this.speed * 0.707106781) : this.y + (this.speed * 0.707106781);
            }
        }
        this.x = this.newx;
        this.y = this.newy;
        this.updateHead();
    };
    Player.prototype.updateHead = function () {
        var squareCenterX = this.x + this.width / 2;
        var squareCenterY = this.y + this.height / 2;
        var maxDist = 20;
        var headx;
        var heady;
        var distancex = squareCenterX - this.game.mousePos.x;
        var distancey = squareCenterY - this.game.mousePos.y;
        var distance = Math.sqrt(Math.pow(distancex, 2) + Math.pow(distancey, 2));
        if (distance > maxDist) {
            var multipl = maxDist / distance;
            this.head.x = squareCenterX - distancex * multipl;
            this.head.y = squareCenterY - distancey * multipl;
        }
        else {
            this.head.x = this.game.mousePos.x;
            this.head.y = this.game.mousePos.y;
        }
    };
    return Player;
}(Rectangle));
var Game = (function () {
    function Game(fps, canvas, ctx) {
        this.shapes = [];
        this.mousePos = { x: 0, y: 0 };
        this.fps = fps;
        this.canvas = canvas;
        this.ctx = ctx;
    }
    Game.prototype.run = function () {
        this.update();
        this.draw();
    };
    Game.prototype.update = function () {
        if (this.key.isDown(this.key.UP) && this.player.y > 0)
            this.player.moveN();
        if (this.key.isDown(this.key.LEFT) && this.player.x > 0)
            this.player.moveW();
        if (this.key.isDown(this.key.DOWN) && this.player.y < this.canvas.height - this.player.height)
            this.player.moveS();
        if (this.key.isDown(this.key.RIGHT) && this.player.x < this.canvas.width - this.player.width)
            this.player.moveE();
        this.player.update();
    };
    ;
    Game.prototype.draw = function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.shapes.forEach(function (shape) {
            shape.draw();
        });
        this.player.draw();
        this.player.head.draw();
    };
    ;
    Game.prototype.mouseMove = function (canvas, evt) {
        var rect = this.canvas.getBoundingClientRect();
        this.mousePos = {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    };
    Game.prototype.start = function () {
        var _this = this;
        this.player = new Player(this, "player", 20, 20, 20, 20, this.ctx);
        this.key = new Key();
        window.addEventListener('keyup', function (event) { _this.key.onKeyup(event); }, false);
        window.addEventListener('keydown', function (event) { _this.key.onKeydown(event); }, false);
        this.canvas.addEventListener('mousemove', function (evt) {
            _this.mouseMove(_this.canvas, evt);
        }, false);
        this.intervalReference = setInterval(function () { _this.run(); }, 1000 / this.fps);
    };
    return Game;
}());
function init() {
    var canvas = document.querySelector('canvas');
    var game = new Game(48, canvas, canvas.getContext('2d'));
    game.start();
}
init();
