const c = document.getElementById("myCanvas");
const ctx = c.getContext("2d");

let adown = false;
let ddown = false;
let currentAnim = 'stand';

const multi = 8;


window.onkeydown = function(e) {
    //console.log('down: '+e.keyCode);
    // a - 65; d - 68; space - 32
    kk = e.keyCode
    if (kk === 65) {
        Player.powerX = -50
        adown = true
    }
    if (kk === 68) {
        Player.powerX = 50
        ddown = true
    }

    if (kk === 32) { //jump
        if (!Player.fall) {
            Player.powerY = 300
        }
    }

}

window.onkeyup = function(e) {
    // a - 65; d - 68; space - 32
    const kk = e.keyCode
    if (kk === 65) {
        adown = false
        Player.powerX = (ddown) ? 50 : 0
    }
    if (kk === 68) {
        ddown = false
        Player.powerX = (adown) ? -50 : 0
    }
}

const getXCoord = (x, halfX) =>  (x * multi) - (halfX * multi);
const getYCoord = (y, halfY) => (600 - (y * multi)) - (halfY * multi);

function drawRect(x, y, halfX, halfY) {
    xCoord = getXCoord(x, halfX) - Player.offsetX;
    yCoord = getYCoord(y, halfY) - Player.offsetY;

    ctx.rect(xCoord, yCoord, (halfX*2) * multi, (halfY*2) * multi);
    ctx.stroke();
}

function drawPlayer() {
    xCoord = getXCoord(Player.baseX, Player.halfX)
    yCoord = getYCoord(Player.baseY, Player.halfY)

    xCoordNew = getXCoord(Player.x, Player.halfX)
    yCoordNew = getYCoord(Player.y, Player.halfY)

    Player.offsetX = xCoordNew - xCoord;
    Player.offsetY = yCoordNew - yCoord;

    //find image we need
    const image = findImageByName(currentAnim)
    ctx.drawImage(image.element, xCoord, yCoord);
}

function Render() {
    ctx.clearRect(0, 0, 600, 600);
    ctx.beginPath();

    currentAnim = adown ? 'right' : ddown ? 'left' : 'front';
    drawPlayer()
    Map.forEach(o => drawRect(o.x,o.y, o.halfX, o.halfY)) //draw bricks
}

function isCollide(other) {
    if ( Math.abs(Player.x - other.x) >= Player.halfX + other.halfX ) return false;
    if ( Math.abs(Player.y - other.y) >= Player.halfY + other.halfY ) return false;
    return true;
}

function getCollideObject() {
    return Map.find(brick => isCollide(brick))
}

async function loadImage(img) {
    const decoded = new Image();
    decoded.src = img.file;
    await decoded.decode();
    return {element: decoded, name:img.name};
}

function findImageByName(name) {
    return ImageLibrary.find(img => (img.name === name));
}

//load images
(() => {
    images.forEach(image => {
        loadImage(image).then(loaded => ImageLibrary.push(loaded));
    });
})();

//physics cycle
const t = setInterval(function() {
    let collideObj
    let moveHorisontal = 0
    let moveVertical = 0
    if (ImageLibrary.length !== images.length) return false; //not loaded
    if (Player.powerX !== 0) {
        moveHorisontal = Player.powerX / 4
    }

    if (moveHorisontal !== 0) {
        Player.x = Player.x + (moveHorisontal/10)
        collideObj = getCollideObject()

        if (collideObj) {
            Player.x = Player.oldX
        } else {
            Player.oldX = Player.x
        }
    }

    if (Player.powerY === 0) {
        Player.powerY = -50;
    }
    if (Player.powerY < -200) {   //max falling speed
        Player.powerY = -200
    }

    moveVertical = Player.powerY / 4
    Player.y = Player.y + (moveVertical/10)
    //check obs and ground crossing

    Player.fall = true

    if (Player.y < 4) {
        //мы уже приземлились
        Player.y = 4;
        Player.powerY = 0;
        Player.fall = false
    }

    collideObj = getCollideObject()
    if (collideObj) {
        //мы уже приземлились
        //если мы падаем вниз
        if (moveVertical < 0) {
            Player.y = collideObj.y + collideObj.halfY + Player.halfY; //тут должны быть координаты граунда или обьекта
            Player.fall = false
        } else {
            //головой об потолок
            Player.y = collideObj.y - collideObj.halfY - Player.halfY
            Player.fall = true
        }
        Player.powerY = 0;
    }

    if (Player.fall) {
        Player.powerY = Player.powerY - 50;
    }

    //move moving parts
    Map.forEach(brick => {
        if (!brick.moving) return;

        if(brick.movingParams.axis === 'x') {
            const distance = (brick.movingParams.right) ?  0.5 : -0.5;
            brick.x = brick.x + distance;
            if ((collideObj === brick) && !Player.fall) {
                Player.x = Player.x + distance;
            }
            if ((brick.x < brick.movingParams.startX) || (brick.x > brick.movingParams.finishX))  {
                brick.movingParams.right = !brick.movingParams.right; //change moving direction
            }
        }
        if(brick.movingParams.axis === 'y') {
            const distance = (brick.movingParams.up) ?  0.5 : -0.5;
            brick.y = brick.y + distance;
            if ((collideObj === brick) && !Player.fall) {
                Player.y = Player.y + distance;
            }
            if ((brick.y < brick.movingParams.startY) || (brick.y > brick.movingParams.finishY))  {
                brick.movingParams.up = !brick.movingParams.up; //change moving direction
            }
        }
    })

    Render();
}, 50);
