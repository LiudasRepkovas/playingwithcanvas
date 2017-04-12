class Shape {
    name: string;
}

class Rectangle implements Shape{
    
    name: string;
    public x: number;
    public y: number;
    width: number;
    height: number;
    ctx: CanvasRenderingContext2D
    
    constructor(
        name: string,
        x:number,
        y:number,
        width:number,
        height:number,
        ctx: CanvasRenderingContext2D
    ){
        this.name = name;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.ctx = ctx
    }

    draw(): void{
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.rect(this.x, this.y, this.width, this.height);
        this.ctx.strokeStyle="green";
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();
    }

    isPointInside(x: number, y: number): boolean{
        return (x > this.x && x < this.x + this.width) && (y > this.y && y < this.y + this.height)
    }
}

class Circle implements Shape{
    name: string;
    public x: number;
    public y: number;
    public r: number;
    ctx: CanvasRenderingContext2D
    
    constructor(
        name: string,
        x:number,
        y:number,
        r:number,
        ctx: CanvasRenderingContext2D
    ){
        this.name = name;
        this.x = x;
        this.y = y;
        this.r = r;
        this.ctx = ctx
    }

    draw(): void{
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.ellipse(this.x, this.y, this.r, this.r, 0, 0, 2 * Math.PI);
        this.ctx.strokeStyle="green";
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();
    }

    isPointInside(x: number, y: number): boolean{
        return Math.sqrt(Math.pow(x-this.x, 2) + Math.pow(y-this.y, 2)) > this.r
    }
}

class Key{

    pressed: any = {};

    LEFT: number = 65;
    UP: number = 87;
    RIGHT: number = 68;
    DOWN: number = 83;

    isDown(keyCode: number){
        return this.pressed[keyCode];
    }

    onKeydown(event: any){
        this.pressed[event.keyCode] = true;
    }

    onKeyup(event: any) {
        delete this.pressed[event.keyCode];
    }
}

class Player extends Rectangle{

    game: Game;
    lastMove: string;
    speed: number = 2;
    newx: number = 0;
    newy: number = 0;
    head: Circle;

    constructor(
        game: Game,
        name: string,
        x:number,
        y:number,
        width:number,
        height:number,
        ctx: CanvasRenderingContext2D
    ){
        super(name, x, y, width, height, ctx);
        this.head = new Circle("head", this.x, this.y, 10, this.ctx);
        this.game = game;

    }

    moveN(){
        this.newy = this.y - this.speed;
    }
    moveW(){
        this.newx = this.x - this.speed;
    }
    moveE(){
        this.newx = this.x + this.speed;
    }
    moveS(){
        this.newy = this.y + this.speed;
    }
    update(){
        if(this.newx && this.newy){
            let distance = Math.sqrt(Math.pow(this.x-this.newx, 2) + Math.pow(this.y-this.newy, 2));
            if(distance > this.speed){
                this.newx = this.x - this.newx > 0 ? this.x - (this.speed * 0.707106781) : this.x + (this.speed * 0.707106781);
                this.newy = this.y - this.newy > 0 ? this.y - (this.speed * 0.707106781) : this.y + (this.speed * 0.707106781);
            }
        }
        this.x = this.newx;
        this.y = this.newy;
        this.updateHead();
        
    }
    updateHead(){
        let squareCenterX = this.x + this.width / 2;
        let squareCenterY = this.y + this.height /2;
        let maxDist = 20;

        let headx;
        let heady;

        let distancex = squareCenterX-this.game.mousePos.x;
        let distancey = squareCenterY-this.game.mousePos.y;

        let distance = Math.sqrt(Math.pow(distancex, 2) + Math.pow(distancey, 2));

        if(distance > maxDist){
            let multipl = maxDist / distance;
            this.head.x = squareCenterX - distancex * multipl;
            this.head.y = squareCenterY - distancey * multipl;
        } else {
            this.head.x = this.game.mousePos.x;
            this.head.y = this.game.mousePos.y;
        }
    }
}

class Game {
    fps: number;
    intervalReference: any;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    shapes: any[] = [];
    direction: string;
    key: Key;
    player:Player;
    mousePos: any = {x:0, y:0};

    constructor(fps: number, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D){
        this.fps = fps;
        this.canvas = canvas;
        this.ctx = ctx;
    }

    run(){
        this.update();
        this.draw();
    }

    update(){
        if (this.key.isDown(this.key.UP) && this.player.y > 0) this.player.moveN();
        if (this.key.isDown(this.key.LEFT)  && this.player.x > 0) this.player.moveW();
        if (this.key.isDown(this.key.DOWN)  && this.player.y < this.canvas.height - this.player.height) this.player.moveS();
        if (this.key.isDown(this.key.RIGHT) && this.player.x < this.canvas.width - this.player.width) this.player.moveE();
        this.player.update();
    };

    draw(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.shapes.forEach((shape:any)=>{
            shape.draw();
        })
        this.player.draw();
        this.player.head.draw();
    };

    mouseMove(canvas: HTMLCanvasElement, evt: any){
        var rect = this.canvas.getBoundingClientRect();
        this.mousePos =  {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
    }

    start(){

        this.player = new Player(this, "player", 20, 20, 20, 20, this.ctx);
        this.key = new Key();
        window.addEventListener('keyup', (event)=> { this.key.onKeyup(event); }, false);
        window.addEventListener('keydown', (event)=> { this.key.onKeydown(event); }, false);
        this.canvas.addEventListener('mousemove', (evt) => {
            this.mouseMove(this.canvas, evt);
        }, false);
        this.intervalReference = setInterval(()=>{this.run()}, 1000/this.fps);

    }





}

function init(){
    let canvas =  document.querySelector('canvas');
    const game = new Game(48, canvas, canvas.getContext('2d'));
    game.start();
}

init();



