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

var FightLayer = cc.Layer.extend({
    mouse_down: false,
    balls: null,
    cur_ball: null,
    move_count: 0,
    score: 0,
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

        for (var i = 0; i < 7; i++) {
            var ball_row = new Array();
        	for (var j = 0; j < 7; j++) {
                var cur_ball = FightBall.create(i, j, jtox(j), itoy(i));
                this.addChild(cur_ball.ball);
                ball_row.push(cur_ball);
        	}
            balls.push(ball_row);
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
                    cc.log("#Detected mouse down");
                    var target = event.getCurrentTarget();
                    target.mouse_down = true;
                    var num = target.fallIn(event.getLocation());
                    // target.ball_positions;
                    // target.balls;
                    target.cur_ball = target.pickBall(num["i"],num["j"]);
                }
            }, this);
        if ('mouse' in cc.sys.capabilities )
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseUp: function (event) {
                    cc.log("#Detected mouse up");
                    //1.End ball moving
                    var target = event.getCurrentTarget();
                    var cur_section = target.fallIn(location);
                    target.moveBall(target.cur_ball.ball,
                        new cc.Point(jtox(target.cur_ball.j), itoy(target.cur_ball.i)),
                        DEFAULT_SPEED);
                    target.mouse_down = false;
                    target.cur_ball = null;
                    //2.Start elimination
                    var total_combo = 0;
                    target.eliminateBalls(total_combo);
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
                            target.moveBall(target.cur_ball.ball, location, DEFAULT_SPEED);
                        }
                        else {
                            return;
                        }
                        var cur_section = target.fallIn(location);
                        //If touch other ball, move the other ball to cur_ball's place.
                        if (cur_section["i"] != target.cur_ball.i || cur_section["j"] != target.cur_ball.j) {
                            var infected_ball = target.pickBall(cur_section["i"], cur_section["j"]).ball;
                            target.moveBall(infected_ball,
                                new cc.Point(jtox(target.cur_ball.j), itoy(target.cur_ball.i)),
                                DEFAULT_SPEED);
                            target.swapBalls(target.cur_ball.i, target.cur_ball.j, cur_section["i"], cur_section["j"]);
                        }
                        //cc.log("#Detected mouse moving: (" + location.x + ", " + location.y + ")");
                    }
                }
            }, this);
        
    },
    moveBall: function(sprite, position, speed, target, callback) {
        sprite.stopAllActions();
        var move = cc.MoveTo.create(speed, position);
        if(arguments.length == 5) {
            //var onComplete = cc.CallFunc.create(callback, target, position);
            var onComplete = cc.CallFunc.create(callback, target);
            sprite.runAction(cc.Sequence.create(move, onComplete));
        }
        else {
            sprite.runAction(move);
        }
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
    },
    eliminateBalls: function(total_combo) {
        var count = 1;
        var combo = 0;
        //Mark balls from row
        for(var row = 0; row < 7; row++) {
            for(var col = 1; col < 7; col++) {
                if(balls[row][col].color == balls[row][col - 1].color) {
                    count++;
                    //Mark group, assign later.
                    if(count == 3) {
                        balls[row][col - 2].group = 0;
                        balls[row][col - 1].group = 0;
                        balls[row][col].group = 0;
                    }
                    if(count > 3) {
                        balls[row][col].group = 0;
                    }
                }
                else{
                    //Reset count
                    count = 1;
                }
            }
            count = 1;
        }
        //Mark balls from column
        for(var col = 0; col < 7; col++) {
            for(var row = 1; row < 7; row++) {
                if(balls[row][col].color == balls[row - 1][col].color) {
                    count++;
                    //Mark group, assign later.
                    if(count == 3) {
                        balls[row - 2][col].group = 0;
                        balls[row - 1][col].group = 0;
                        balls[row][col].group = 0;
                    }
                    if(count > 3) {
                        balls[row][col].group = 0;
                    }
                }
                else{
                    //Reset count
                    count = 1;
                }
            }
            count = 1;
        } 
        var group = 1;
        var queue = new Array();
        var combo_groups = new Array();
        //Assign combo group to balls
        for(var row = 0; row < 7; row++) {
            for(var col = 0; col < 7; col++) {
                if(balls[row][col].group == 0) {
                    var combo_group = new Array();
                    balls[row][col].group = group++;
                    queue.push(balls[row][col]);
                    combo_group.push(balls[row][col]);
                    while(queue.length != 0) {
                        var elem = queue.shift();
                        if (elem.i < 6 && balls[elem.i + 1][elem.j].color == elem.color
                            && balls[elem.i + 1][elem.j].group == 0) {
                            balls[elem.i + 1][elem.j].group = elem.group;
                            queue.push(balls[elem.i + 1][elem.j]);
                            combo_group.push(balls[elem.i + 1][elem.j]);
                        }
                        if (elem.j < 6 && balls[elem.i][elem.j + 1].color == elem.color
                            && balls[elem.i][elem.j + 1].group == 0) {
                            balls[elem.i][elem.j + 1].group = elem.group;
                            queue.push(balls[elem.i][elem.j + 1]);
                            combo_group.push(balls[elem.i][elem.j + 1]);
                        }
                        if (elem.j > 0 && balls[elem.i][elem.j - 1].color == elem.color
                            && balls[elem.i][elem.j - 1].group == 0) {
                            balls[elem.i][elem.j - 1].group = elem.group;
                            queue.push(balls[elem.i][elem.j - 1]);
                            combo_group.push(balls[elem.i][elem.j - 1]);
                        }
                    }
                    combo_groups.push(combo_group);
                }
            }
        }
        //Print
        for(var row = 0; row < 7; row++) {
            cc.log(row + ": "+ balls[row][0].group + " "
                + balls[row][1].group + " "
                + balls[row][2].group + " "
                + balls[row][3].group + " "
                + balls[row][4].group + " "
                + balls[row][5].group + " "
                + balls[row][6].group);
        }
        //Eliminate balls
        while(combo_groups.length != 0) {
            combo++;
            total_combo++;
            var a_group = combo_groups.shift();
            this.score += a_group[0].group * 100 * a_group.length;
            this.addChild(ComboNum.create(total_combo, new cc.Point(jtox(a_group[0].j), itoy(a_group[0].i))));
            while(a_group.length != 0) {
                var ball = a_group.shift();
                this.removeChild(ball.ball);
                ball.reset();
            }
        }
        //Falling~
        for(var col = 0; col < 7; col++) {
            var null_count = 7;
            for(var row = 6; row >= 0; row--) {
                if(balls[row][col].ball != null) {
                    null_count--;
                    if(null_count != row) {
                        this.move_count++;
                        //cc.log("Move: " + row + ", " + col + ". " + this.move_count);
                        this.moveBall(balls[row][col].ball,
                            new cc.Point(jtox(col), itoy(null_count)),
                            SLOW_SPEED,
                            this,
                            function() {
                            //function(_, position) {
                                this.move_count--;
                                //cc.log("Move: " + ytoi(position.y) + ", " + xtoj(position.x) + ". " + this.move_count);
                                if(this.move_count == 0) {
                                        this.eliminateBalls(total_combo);
                            }
                        });
                        this.swapBalls(row, col, null_count, col);
                    }
                }
            }
        }
        //Refill balls
        for(var row = 0; row < 7; row++) {
            for(var col = 0; col < 7; col++) {
                if(balls[row][col].ball == null) {
                    balls[row][col] = FightBall.create(row, col, jtox(col), itoy(-2));
                    this.addChild(balls[row][col].ball);
                    this.moveBall(balls[row][col].ball,
                            new cc.Point(jtox(col), itoy(row)),
                            SLOW_SPEED);
                }
            }
        }
    }

});

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

var ComboNum = function() {
    this.num = -1;
    this.sprite = null;
}
ComboNum.create = function (num, position) {
    var new_combo = new ComboNum();
    new_combo.num = num;
    new_combo.sprite = cc.Sprite.create(combo_name[num]);
    new_combo.sprite.attr({x: position.x, y: position.y, anchorX: 0.5, anchorY: 0.5});
    return new_combo;
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
var DEFAULT_SPEED = 0.001;
var SLOW_SPEED = 0.3;