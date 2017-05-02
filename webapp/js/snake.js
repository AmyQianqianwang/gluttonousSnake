
var CANVAS = document.getElementById("canvas");
var CTX = CANVAS.getContext("2d");
var SNAKE = new Array(); //用数组模拟蛇身map
var DIR = "right";  //用来控制蛇头的方向
var SIZE = 18;  //蛇身的长宽
var FOODX = 0;  //食物的x坐标
var FOODY = 0;  //食物的y坐标
var HEADX = 0; //蛇头的x坐标
var HEADY = 0; //蛇头的y坐标
var MAXWIDTH = parseInt(document.getElementsByName('row')[0].value); //画布的高度
var MAXHEIGHT = parseInt(document.getElementsByName('col')[0].value); //画布的宽度
var speed = parseInt(document.getElementsByName('level')[0].value);  //蛇的速度
var foodKind = 1; //食物类别
var skinColor = 1; //蛇身颜色
var SCORE = 0;  //计算玩家分数
var len = 0; //蛇身长度
var interval = null;
var state = 0;//状态码
var highestScore = 0;
var carrier; //承载对象(食物，障碍，滑板，刹车)
var brakeTimers = [], //随机刹车
    skateTimers = []; //随机滑板

CANVAS.width = MAXWIDTH;
CANVAS.height = MAXHEIGHT;

document.getElementById("newGameButton").click(function () {
    newgame();
});
//=============================游戏控制=======================================================
function init(){
    SNAKE = []; //数组模拟蛇身map
    DIR = "right"; //用来控制蛇头的方向
    HEADX = 0; //蛇头的x坐标
    HEADY = 0; //蛇头的y坐标
    window.clearInterval(interval);
    interval = null;
}
function newgame() {
    state = 0;
    init();
    //初始化画布
    MAXWIDTH = parseInt(document.getElementsByName('row')[0].value); //画布的高度
    MAXHEIGHT = parseInt(document.getElementsByName('col')[0].value); 
    CTX.clearRect(0, 0, MAXWIDTH, MAXHEIGHT);
    CANVAS.width = MAXWIDTH;
    CANVAS.height = MAXHEIGHT;
    SCORE = 0;
    document.getElementById("score").innerHTML = SCORE;
    //画一条蛇
    drawSnake();
    //放置食物
    setFood();
    // addRandomBrake();
}
function starts() {
    //需要重新初始化。。。
    if (state == 1) {
        alert("已经开始了！");
        return false;
    }
    init();
    drawSnake();

    //移动蛇
    interval = window.setInterval(move, 3000 / speed);
    if (state != 0) {
        return false;
    }
    state = 1;
}
function pause(obj) {
    if (state == 0) {
        alert('还没开始呢！');
        return false;
    }
    if (state == 2) {
        state = 3;
        interval = setInterval(move, 3000 / speed);
        obj.value = "暂停";

    } else {
        state = 2;
        clearInterval(interval);
        obj.value = "继续";
    }
}
function move() {
    switch (DIR) {
        case "up": HEADY = HEADY - SIZE; break;
        case "right": HEADX = HEADX + SIZE; break;
        case "down": HEADY = HEADY + SIZE; break;
        case "left": HEADX = HEADX - SIZE; break;
    }
    if (HEADX > MAXWIDTH - SIZE || HEADY > MAXHEIGHT - SIZE || HEADX < 0 || HEADY < 0) {
        alert("你的分数为：" + SCORE + "分，继续努力!失败原因：碰壁了！");
        newgame();
    }
    // if (carrier[HEADX][HEADY] == "block") {
    //     alert("你的分数为：" + SCORE + "分，继续努力!失败原因：碰到路障了！");
    //     newgame();
    // }
    for (var i = 1; i < SNAKE.length; i++) {
        if (SNAKE[i][0] == SNAKE[0][0] && SNAKE[i][1] == SNAKE[0][1]) {
            alert("你的分数为：" + SCORE + "分，继续努力！失败原因：撞到自己了！");
            newgame();
        }
    }
    // len = SNAKE.length;
    // //加速
    // if (len % 4 == 0 && speed < 60 && carrier[HEADX][HEADX] == "food") {
    //     speed += 5;
    //     walk();
    //     alert("加速！");
    // }
    // //捡到刹车
    // if (carrier[HEADX][HEADX] == "brake") {
    //     speed = 5;
    //     walk();
    //     alert("捡到刹车！");
    // }
    // //遭遇滑板
    // if (carrier[HEADX][HEADX] == "skate") {
    //     speed += 20;
    //     walk();
    //     alert("遭遇滑板！");
    // }
    // //添加阻挡物
    // if (len % 6 == 0 && len < 60 && carrier[HEADX][HEADX] == "food") {
    //     addObject("block");
    // }
    if (SNAKE.length == MAXWIDTH * MAXHEIGHT) {
        alert("好厉害~");
        //window.location.reload();
        newgame();
    }
    moveIn(HEADX, HEADY);//移动一格
}
document.onkeydown = function (e) { //改变蛇方向
    var code = e.keyCode - 37;
    switch (code) {
        case 1: DIR = "up"; break;//上
        case 2: DIR = "right"; break;//右
        case 3: DIR = "down"; break;//下
        case 0: DIR = "left"; break;//左
    }
}
//=============================画一条蛇=======================================================
function drawSnake() {
    skinColor = parseInt(document.getElementsByName('skinColor')[0].value);
    CTX.fillStyle = skinChange(skinColor);
    //画蛇头
    CTX.fillRect(HEADX, HEADY, SIZE, SIZE);
    SNAKE.push([HEADX, HEADY]);

    //画蛇身
    switch (DIR) {
        case "up":
            drawBody(HEADX, HEADY + SIZE, HEADX, HEADY + 2 * SIZE);
            break;
        case "right":
            drawBody(HEADX - SIZE, HEADY, HEADX - 2 * SIZE, HEADY);
            break;
        case "down":
            drawBody(HEADX, HEADY - SIZE, HEADX, HEADY - 2 * SIZE);
            break;
        case "left":
            drawBody(HEADX + SIZE, HEADY, HEADX + 2 * SIZE, HEADY);
            break;
    }
}
function drawBody(x1, y1, x2, y2) {
    CTX.fillRect(x1, y1, SIZE, SIZE);
    CTX.fillRect(x2, y2, SIZE, SIZE);
    SNAKE.push([x1, y1]);
    SNAKE.push([x2, y2]);
}

function skinChange(colorNum) {
    if (colorNum == 1) {
        return "black";
    } else if (colorNum == 2) {
        return "green";
    } else {
        return "blue";
    }
}
//===========================放置食物==============================
function foodChange(foodKind) {
    if (foodKind == 1) {
        return "red";
    } else if (foodKind == 2) {
        return "yellow";
    } else {
        return "pink";
    }
}
function setFood() {
    do {
        FOODX = SIZE * Math.floor(Math.random() * MAXWIDTH / SIZE);
        FOODY = SIZE * Math.floor(Math.random() * MAXHEIGHT / SIZE);
    } while (foodInSnake());
    foodKind = parseInt(document.getElementsByName('foodKind')[0].value)
    CTX.fillStyle = foodChange(foodKind);
    CTX.fillRect(FOODX, FOODY, SIZE, SIZE);
}
function foodInSnake() {
    for (var i = 0; i < SNAKE.length; i++) {
        if (FOODX == SNAKE[i][0] && FOODY == SNAKE[i][1]) {
            return true;
        }
    }
    return false;
}
// //========================================添加障碍物===========================
// //添加物品
// function addObject(name) {
//     var p = randomPointer();
//     carrier[p[0]][p[1]] = name;
//     gridElems[p[0]][p[1]].className = name;
// }
// //添加随机数量刹车和滑板
// function addRandomBrake() {
//     var num = randowNum(1, 5);
//     for (var i = 0; i < num; i++) {
//         brakeTimers.push(window.setTimeout(function () { addObject("brake") }, randowNum(10000, 100000)));
//         skateTimers.push(window.setTimeout(function () { addObject("skate") }, randowNum(5000, 100000)));
//     }
// }
// //产生随机整数
// function randowNum(start, end) {
//     return Math.floor(Math.random() * (end - start)) + start;
// }

// //产生指定范围随机点
// function randomPointer(startX, startY, endX, endY) {
//     startX = startX || 0;
//     startY = startY || 0;
//     endX = endX || WIDTH;
//     endY = endY || HEIGHT;
//     var p = [],
//         x = Math.floor(Math.random() * (endX - startX)) + startX,
//         y = Math.floor(Math.random() * (endY - startY)) + startY;
//     if (carrier[x][y]) return randomPointer(startX, startY, endX, endY);
//     p[0] = x;
//     p[1] = y;
//     return p;
// }

//========================================移动吃食物===========================
function moveIn(x, y) {
    skinColor = parseInt(document.getElementsByName('skinColor')[0].value);
    CTX.fillStyle = skinChange(skinColor);
    CTX.fillRect(x, y, SIZE, SIZE);//重画蛇头 
    //把新蛇头添加到 SNAKE 数组
    var newSnake = [[x, y]];
    SNAKE = newSnake.concat(SNAKE);

    if (false == eatFood()) {//如果没吃到食物，减少一格蛇尾 
        var snakeTail = SNAKE.pop();//获得蛇尾位置
        CTX.clearRect(snakeTail[0], snakeTail[1], SIZE, SIZE);//去掉蛇尾 
    }
}
function eatFood() {
    if (HEADX == FOODX && HEADY == FOODY) {
        CTX.fillStyle = "block";
        CTX.fillRect(FOODX, FOODY, SIZE, SIZE);
        foodKind = parseInt(document.getElementsByName('foodKind')[0].value);
        setFood();
        if (foodKind == 1) {
            SCORE = SCORE + 1;
        } else if (foodKind == 2) {
            SCORE = SCORE + 2;
        } else {
            SCORE = SCORE + 3;
        }
        if (SCORE >= highestScore) {
            highestScore = SCORE;
        }
        document.getElementById("score").innerHTML = SCORE;
        document.getElementById("highestScore").innerHTML = highestScore;
        return true;
    }
    return false;
}      