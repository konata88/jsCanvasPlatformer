const Map = [];
const ImageLibrary = [];
const Player = {x:35, y:30, oldX:35, oldY:10, halfX:2, halfY:4, powerX:0, powerY:0, fall: false, baseX: 35, baseY: 30}

const Brick = class {
    constructor(x, y, halfX, halfY, moving = false, movingParams = {} ) {
        this.x = x;
        this.y = y;
        this.halfX = halfX;
        this.halfY = halfY;
        this.moving = moving;
        this.movingParams = movingParams;
        Map.push(this)
    }
};

new Brick(4, 2, 4, 2);
new Brick(12, 2, 4, 2);
new Brick(20, 2, 4, 2);
new Brick(28, 2, 4, 2);
new Brick(36, 2, 4, 2);
new Brick(44, 2, 4, 2);
new Brick(52, 2, 4, 2);
new Brick(60, 2, 4, 2);
new Brick(68, 2, 4, 2);
new Brick(76, 2, 4, 2);
new Brick(84, 2, 4, 2);
new Brick(92, 2, 4, 2);
new Brick(100, 2, 4, 2);
new Brick(108, 2, 4, 2);
new Brick(116, 2, 4, 2);
new Brick(124, 2, 4, 2);
new Brick(132, 2, 4, 2);

new Brick(48, 20, 4, 2);
new Brick(56, 20, 4, 2);
new Brick(64, 20, 4, 2);

new Brick(30, 40, 4, 2);
new Brick(22, 40, 4, 2);

new Brick(0, 20, 4, 2, true, {axis: 'x', right: true, startX: 0, finishX: 20});
new Brick(0, 40, 4, 2, true, {axis: 'y', up: true, startY: 40, finishY: 80});

const images = [
    {file: "1.bmp", name: 'front'},
    {file: "2.bmp", name: 'left'},
    {file: "3.bmp", name: 'right'}
];