var BallBoard = function() {
	//Data:
	//Board saving position
	this.board = null;
	//Balls on the board
	this.balls = null;
	//Rows default value is 7
	this.row = 7;
	//Column default value is 7
	this.column = 7;

	//Methods:
	//Do operation on each ball
	this.each = function(func) {
		for (var i = 0; i < this.row; i++) {
			for (var j = 0; j < this.column; j++) {
				func(this.balls[i][j].ball);
			}
		};
	};
	//Calculate which block this location falls in
	this.fallIn = function(location) {
        var j = xtoj(location.x);
        var i = ytoi(location.y);
        cc.log("#fall In i: " + i + " j: " + j);
        return {"i": i, "j": j};
    };
    //Calculate the position of the block
    this.getPosition = function(i, j) {
    	return new cc.Point(jtox(j), itoy(i));
    };
    //Determine whether the position is inside the board *
    this.inBoard = function(location) {
        return (location.x > 343 && location.x < 790 && location.y > 10 && location.y< 470);
    };
    //Pick ball in specific block
    this.ball = function(i, j) {
        return this.balls[i][j];
    };
    //Swap two balls in two blocks
    this.swapBalls = function(i, j, k, l) {
        var tmp = this.balls[i][j];
        tmp.i = k;
        tmp.j = l;
        this.balls[i][j] = this.balls[k][l];
        this.balls[i][j].i = i;
        this.balls[i][j].j = j;
        this.balls[k][l] = tmp;
    };
    this.deleteBall = function(i, j) {
    	this.balls[i][j].reset();
    };
    this.createBall = function(i, j, posx, posy) {
    	this.balls[i][j] = FightBall.create(i, j, posx, posy);
    }
};

BallBoard.create = function(row, column) {
	var ball_board = new BallBoard();
	ball_board.row = row;
	ball_board.column = column;
	ball_board.balls = new Array();
	for (var i = 0; i < row; i++) {
        var ball_row = new Array();
    	for (var j = 0; j < column; j++) {
            var cur_ball = FightBall.create(i, j, jtox(j), itoy(i));
            ball_row.push(cur_ball);
    	}
        ball_board.balls.push(ball_row);
    }
    return ball_board;
}

var FightBall = function() {
    this.i = -1;
    this.j = -1;
    this.color = "";
    this.ball = null;
    //for elimination group number
    this.group = -1;
    this.reset = function() {
        this.color = "";
        delete this.ball;
        this.ball = null;
        this.group = -1;
    }
}
FightBall.create = function(i, j, posx, posy) {
    var new_ball = new FightBall();
    new_ball.i = i;
    new_ball.j = j;
    new_ball.color = Math.floor(Math.random()*100%6);
    new_ball.ball = cc.Sprite.create(ball_name[new_ball.color]);
    new_ball.ball.attr({x: posx, y: posy, anchorX: 0.5, anchorY: 0.5});
    return new_ball;
}

//Calculation tools
var itoy = function(i) {
    return 480 - 28 - i * 16 * 4 - 18;
}
var jtox = function(j) {
    return 23 * 16 + j * 16 * 4 + 15;
}
var ytoi = function(y) {
    var re = (480 - 28 - 18 - y) / (16 * 4) - Math.floor((480 - 28 - 18 - y) / (16 * 4));
    return Math.floor((480 - 28 - 18 - y) / (16 * 4)) + (re < 0.5 ? 0 : 1);
}
var xtoj = function(x) {
    var re = (x - 15 - 23 * 16) / (16 * 4) - Math.floor((x - 15 - 23 * 16) / (16 * 4));
    return Math.floor((x - 15 - 23 * 16) / (16 * 4)) + (re < 0.5 ? 0 : 1);
}