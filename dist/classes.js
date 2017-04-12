"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        this.ctx.rect(this.x, this.y, this.width, this.height);
        this.ctx.strokeStyle = "green";
        this.ctx.stroke();
        this.ctx.restore();
    };
    Rectangle.prototype.isPointInside = function (x, y) {
        return (x > this.x && x < this.x + this.width) && (y > this.y && y < this.y + this.height);
    };
    return Rectangle;
}());
exports.Rectangle = Rectangle;
