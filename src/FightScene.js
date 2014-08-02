var FightScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        //add three layer in the right order
        var bg_layer = new BackgroundLayer(4, 0);
        var anm_layer = new AnimationLayer(3);
        this.addChild(bg_layer);
        this.addChild(anm_layer);
    }
});

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

var FightLayer = cc.Layer.extend({
    mouse_down: false,
    balls: null,
    cur_ball: null,
    ball_positions: null,
    ctor:function () {
        this._super();
        this.init();
    },
    init:function () {
        this._super();

        //Setting FightLayer size
        var winsize = cc.director.getWinSize();
        var padding = winsize.width / 40;
        var user_info = UserData.create();
        balls = new Array();
        ball_positions = new Array();

        for (var i = 0; i < 7; i++) {
            var ball_row = new Array();
        	var position_row = new Array();
        	for (var j = 0; j < 7; j++) {
                var position = {
                    "x": jtox(j),
                    "y": itoy(i)
                };
                var cur_ball = FightBall.create(i, j, position["x"], position["y"]);
                cc.log("ball id" + cur_ball.ball.__instanceId);
                this.addChild(cur_ball.ball);
                ball_row.push(cur_ball);
        		position_row.push(position);
        		//cc.log("i: " + position["x"] + ", j: " + position["y"]);
        	}
            balls.push(ball_row);
        	ball_positions.push(position_row);
        }
        //Place initial balls.
        // if( 'touches' in cc.sys.capabilities )
        //     cc.eventManager.addListener(cc.EventListener.create({
        //         event: cc.EventListener.TOUCH_ALL_AT_ONCE,
        //         onTouchesEnded:function (touches, event) {
        //             if (touches.length <= 0)
        //                 return;
        //             event.getCurrentTarget().moveBall(touches[0].getLocation());
        //         }
        //     }), this);
        // else
        if ('mouse' in cc.sys.capabilities )
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseDown: function (event) {
                    var target = event.getCurrentTarget();
                    target.mouse_down = true;
                    var num = target.fallIn(event.getLocation());
                    // target.ball_positions;
                    // target.balls;
                    target.cur_ball = target.pickBall(num["i"],num["j"]);
                    cc.log("#Detected mouse down");
                }
            }, this);
        if ('mouse' in cc.sys.capabilities )
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseUp: function (event) {
                    var target = event.getCurrentTarget();
                    var cur_section = target.fallIn(location);
                    target.moveBall(target.cur_ball.ball, new cc.Point(jtox(target.cur_ball.j), itoy(target.cur_ball.i)));
                    target.mouse_down = false;
                    target.cur_ball = null;
                    cc.log("#Detected mouse up");
                }
            }, this);
        if ('mouse' in cc.sys.capabilities )
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseMove: function (event) {
                    var target = event.getCurrentTarget();
                    if(target.mouse_down) {
                        //Move the ball in hand.
                        var location = event.getLocation();
                        if (target.inBoard(location)) {
                            target.moveBall(target.cur_ball.ball, location);
                        }
                        else {
                            return;
                        }
                        var cur_section = target.fallIn(location);
                        //If touch other ball, move the other ball to cur_ball's place.
                        if (cur_section["i"] != target.cur_ball.i || cur_section["j"] != target.cur_ball.j) {
                            cc.log("!!!see infected");
                            var infected_ball = target.pickBall(cur_section["i"], cur_section["j"]).ball;
                            target.moveBall(infected_ball,
                                new cc.Point(jtox(target.cur_ball.j), itoy(target.cur_ball.i)));
                            target.swapBalls(target.cur_ball.i, target.cur_ball.j, cur_section["i"], cur_section["j"]);
                        }
                        //cc.log("#Detected mouse moving: (" + location.x + ", " + location.y + ")");
                    }
                }
            }, this);
        
    },
    moveBall: function(sprite, position) {
        sprite.stopAllActions();
        sprite.runAction(cc.MoveTo.create(0.001, position));
    },
    inBoard: function(location) {
        return (location.x > 343 && location.x < 790 && location.y > 10 && location.y< 470);
    },
    fallIn: function(location) {
        var j = xtoj(location.x);
        var i = ytoi(location.y);
        cc.log("#fall In i: " + i + " j: " + j);
        return {"i": i, "j": j};
    },
    pickBall: function(i, j) {
        return balls[i][j];
    },
    swapBalls: function(i, j, k, l) {
        var tmp = balls[i][j];
        tmp.i = k;
        tmp.j = l;
        balls[i][j] = balls[k][l];
        balls[i][j].i = i;
        balls[i][j].j = j;
        balls[k][l] = tmp;
    }

});

var FightBall = function(){
    this.i = -1;
    this.j = -1;
    this.ball = null;
}
FightBall.create = function(i, j, posx, posy) {
    var new_ball = new FightBall();
    new_ball.i = i;
    new_ball.j = j;
    new_ball.ball = cc.Sprite.create(ball_name[Math.floor(Math.random()*100%6)]);
    new_ball.ball.attr({x: posx, y: posy, anchorX: 0.5, anchorY: 0.5});
    return new_ball;
}