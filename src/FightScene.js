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
    monster: null,
    mouse_down: false,
    ball_board: null,
    cur_ball: null,
    move_count: 0,
    score: null,
    health: null,
    ctor:function () {
        this._super();
        this.init();
    },
    init:function () {
        this._super();

        //Setting FightLayer size
        var winsize = cc.director.getWinSize();
        var padding = winsize.width / 40;

        //Init monster's image and hp
        this.monster = Monster.create();
        this.addChild(this.monster.sprite);
        this.addChild(this.monster.name_label);
        this.addChild(this.monster.hp_label);

        //Init balls and score
        this.ball_board = BallBoard.create(5, 6);
        this.score = ScoreNum.create();

        this.ball_board.each(function(obj) {
            this.addChild(obj);
        }.bind(this));
        this.eliminateBalls(0, true);
        this.score.num = 0;
        this.addChild(this.score.sprite);

        //Init health
        this.health = HealthNum.create();
        this.addChild(this.health.sprite);

        // //Init exit button
        // var exit_label = cc.LabelTTF.create("Exit", "Arial", 20);
        // var exit_item = cc.MenuItemLabel.create(
        //     exit_label,
        //     function () {
        //         cc.log("@Exit clicked");
        //         cc.eventManager.removeAllListeners();
        //         cc.director.runScene(new PlayScene());
        //     },
        //     this);
        // var exit_menu = cc.Menu.create(exit_item);
        // exit_menu.attr({
        //     width: 50,
        //     x: padding * 3,
        //     y: padding * 3,
        //     anchorX: 0,
        //     anchorY: 0
        // });
        // this.addChild(exit_menu, 1);

        if( 'touches' in cc.sys.capabilities )
            cc.eventManager.addListener(cc.EventListener.create({
                event: cc.EventListener.TOUCH_ALL_AT_ONCE,
                onTouchesBegan:function (touches, event) {
                    cc.log("#Detected touches down");
                    var target = event.getCurrentTarget();
                    target.mouse_down = true;
                    var num = target.board().fallIn(touches[0].getLocation());
                    target.cur_ball = target.board().ball(num["i"],num["j"]);
                }
            }), this);
        else if ('mouse' in cc.sys.capabilities)
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseDown: function (event) {
                    cc.log("#Detected mouse down");
                    var target = event.getCurrentTarget();
                    target.mouse_down = true;
                    var num = target.board().fallIn(event.getLocation());
                    target.cur_ball = target.board().ball(num["i"],num["j"]);
                }
            }, this);

        if( 'touches' in cc.sys.capabilities )
            cc.eventManager.addListener(cc.EventListener.create({
                event: cc.EventListener.TOUCH_ALL_AT_ONCE,
                onTouchesEnded:function (touches, event) {
                    cc.log("#Detected touches up");
                    //1.End ball moving
                    var target = event.getCurrentTarget();
                    target.moveBall(target.cur_ball.ball,
                        cc.p(jtox(target.cur_ball.j), itoy(target.cur_ball.i)),
                        DEFAULT_SPEED);
                    target.mouse_down = false;
                    target.cur_ball = null;
                    //2.Start elimination
                    var total_combo = 0;
                    target.eliminateBalls(total_combo, false);
                }
            }), this);
        else if ('mouse' in cc.sys.capabilities)
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseUp: function (event) {
                    cc.log("#Detected mouse up");
                    //1.End ball moving
                    var target = event.getCurrentTarget();
                    target.moveBall(target.cur_ball.ball,
                        cc.p(jtox(target.cur_ball.j), itoy(target.cur_ball.i)),
                        DEFAULT_SPEED);
                    target.mouse_down = false;
                    target.cur_ball = null;
                    //2.Start elimination
                    var total_combo = 0;
                    target.eliminateBalls(total_combo, false);
                }
            }, this);
        
        if( 'touches' in cc.sys.capabilities )
            cc.eventManager.addListener(cc.EventListener.create({
                event: cc.EventListener.TOUCH_ALL_AT_ONCE,
                onTouchesMoved:function (touches, event) {
                    var target = event.getCurrentTarget();
                    if(target.mouse_down) {
                        //Move the ball in hand.
                        var location = touches[0].getLocation();
                        if (target.board().inBoard(location)) {
                            target.moveBall(target.cur_ball.ball, location, DEFAULT_SPEED);
                        }
                        else {
                            return;
                        }
                        var cur_section = target.board().fallIn(location);
                        //If touch other ball, move the other ball to cur_ball's place.
                        if (cur_section["i"] != target.cur_ball.i || cur_section["j"] != target.cur_ball.j) {
                            var infected_ball = target.board().ball(cur_section["i"], cur_section["j"]).ball;
                            target.moveBall(infected_ball,
                                cc.p(jtox(target.cur_ball.j), itoy(target.cur_ball.i)),
                                DEFAULT_SPEED);
                            target.board().swapBalls(target.cur_ball.i, target.cur_ball.j,
                                cur_section["i"], cur_section["j"]);
                        }
                        //cc.log("#Detected mouse moving: (" + location.x + ", " + location.y + ")");
                    }
                }
            }), this);
        else if ('mouse' in cc.sys.capabilities)
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseMove: function (event) {
                    var target = event.getCurrentTarget();
                    if(target.mouse_down) {
                        //Move the ball in hand.
                        var location = event.getLocation();
                        if (target.board().inBoard(location)) {
                            target.moveBall(target.cur_ball.ball, location, DEFAULT_SPEED);
                        }
                        else {
                            return;
                        }
                        var cur_section = target.board().fallIn(location);
                        //If touch other ball, move the other ball to cur_ball's place.
                        if (cur_section["i"] != target.cur_ball.i || cur_section["j"] != target.cur_ball.j) {
                            var infected_ball = target.board().ball(cur_section["i"], cur_section["j"]).ball;
                            target.moveBall(infected_ball,
                                cc.p(jtox(target.cur_ball.j), itoy(target.cur_ball.i)),
                                DEFAULT_SPEED);
                            target.board().swapBalls(target.cur_ball.i, target.cur_ball.j,
                                cur_section["i"], cur_section["j"]);
                        }
                        //cc.log("#Detected mouse moving: (" + location.x + ", " + location.y + ")");
                    }
                }
            }, this);
        
    },
    board: function() {
        return this.ball_board;
    },
    moveBall: function(sprite, position, speed, on_complete) {
        sprite.stopAllActions();
        var move_ball = cc.MoveTo.create(speed, position);
        if(arguments.length == 4) {
            sprite.runAction(cc.Sequence.create(move_ball, on_complete));
        }
        else {
            sprite.runAction(move_ball);
        }
    },
    showCombo: function(num, pos) {
        var combo_num = ComboNum.create(num, pos);
        combo_num.sprite.setOpacity(0);
        this.addChild(combo_num.sprite,2);

        var show = cc.fadeIn(0.15);
        var hold = cc.fadeTo(0.5, 255);
        var disappear = cc.fadeOut(0.15);
        var on_complete = cc.CallFunc.create(
            function(_, obj) {
                this.removeChild(obj);
            }.bind(this),
            this, combo_num.sprite);
        
        combo_num.sprite.runAction(cc.Sequence.create(show, hold, disappear, on_complete));
    },
    eliminateBalls: function(total_combo, fast_mode) {
        var count = 1;
        var combo = 0;
        //Mark balls from row
        for(var row = 0; row < 5; row++) {
            for(var col = 1; col < 6; col++) {
                if(this.ball_board.ball(row, col).color == this.ball_board.ball(row, col - 1).color) {
                    count++;
                    //Mark group, assign later.
                    if(count == 3) {
                        this.ball_board.ball(row, col - 2).group = 0;
                        this.ball_board.ball(row, col - 1).group = 0;
                        this.ball_board.ball(row, col).group = 0;
                    }
                    if(count > 3) {
                        this.ball_board.ball(row, col).group = 0;
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
        for(var col = 0; col < 6; col++) {
            for(var row = 1; row < 5; row++) {
                if(this.ball_board.ball(row, col).color == this.ball_board.ball(row - 1, col).color) {
                    count++;
                    //Mark group, assign later.
                    if(count == 3) {
                        this.ball_board.ball(row - 2, col).group = 0;
                        this.ball_board.ball(row - 1, col).group = 0;
                        this.ball_board.ball(row, col).group = 0;
                    }
                    if(count > 3) {
                        this.ball_board.ball(row, col).group = 0;
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
        for(var row = 0; row < 5; row++) {
            for(var col = 0; col < 6; col++) {
                if(this.ball_board.ball(row, col).group == 0) {
                    var combo_group = new Array();
                    this.ball_board.ball(row, col).group = group++;
                    queue.push(this.ball_board.ball(row, col));
                    combo_group.push(this.ball_board.ball(row, col));
                    while(queue.length != 0) {
                        var elem = queue.shift();
                        if (elem.i < 4 && this.ball_board.ball(elem.i + 1, elem.j).color == elem.color
                            && this.ball_board.ball(elem.i + 1, elem.j).group == 0) {
                            this.ball_board.ball(elem.i + 1, elem.j).group = elem.group;
                            queue.push(this.ball_board.ball(elem.i + 1, elem.j));
                            combo_group.push(this.ball_board.ball(elem.i + 1, elem.j));
                        }
                        if (elem.j < 5 && this.ball_board.ball(elem.i, elem.j + 1).color == elem.color
                            && this.ball_board.ball(elem.i, elem.j + 1).group == 0) {
                            this.ball_board.ball(elem.i, elem.j + 1).group = elem.group;
                            queue.push(this.ball_board.ball(elem.i, elem.j + 1));
                            combo_group.push(this.ball_board.ball(elem.i, elem.j + 1));
                        }
                        if (elem.j > 0 && this.ball_board.ball(elem.i, elem.j - 1).color == elem.color
                            && this.ball_board.ball(elem.i, elem.j - 1).group == 0) {
                            this.ball_board.ball(elem.i, elem.j - 1).group = elem.group;
                            queue.push(this.ball_board.ball(elem.i, elem.j - 1));
                            combo_group.push(this.ball_board.ball(elem.i, elem.j - 1));
                        }
                    }
                    combo_groups.push(combo_group);
                }
            }
        }
        //Debug: print group of each ball
        for(var row = 0; row < 5; row++) {
            cc.log(row + ": "+ this.ball_board.ball(row, 0).group + " "
                + this.ball_board.ball(row, 1).group + " "
                + this.ball_board.ball(row, 2).group + " "
                + this.ball_board.ball(row, 3).group + " "
                + this.ball_board.ball(row, 4).group);
        }
        //Eliminate balls
        while(combo_groups.length != 0) {
            combo++;
            total_combo++;
            var a_group = combo_groups.shift();
            if (!fast_mode) {
                this.score.addScore(a_group[0].group * 100 * a_group.length);
                this.monster.loseHp(a_group[0].group * a_group.length);
                this.showCombo(total_combo, cc.p(jtox(a_group[0].j), itoy(a_group[0].i)));
            }
            while(a_group.length != 0) {
                var ball = a_group.shift();
                this.removeChild(ball.ball);
                this.ball_board.deleteBall(ball.i, ball.j)
            }
        }
        //Falling~
        for(var col = 0; col < 5; col++) {
            var null_count = 5;
            for(var row = 4; row >= 0; row--) {
                if(this.ball_board.ball(row,col).ball != null) {
                    null_count--;
                    if(null_count != row) {
                        this.move_count++;
                        var on_complete = cc.CallFunc.create(this.onMoveComplete, this, total_combo, fast_mode);
                        //cc.log("Move: " + row + ", " + col + ". " + this.move_count);
                        this.moveBall(this.ball_board.ball(row,col).ball,
                            cc.p(jtox(col), itoy(null_count)),
                            fast_mode ? FAST_SPEED : SLOW_SPEED,
                            on_complete
                        );
                        this.ball_board.swapBalls(row, col, null_count, col);
                    }
                }
            }
        }
        //Refill balls
        for(var row = 0; row < 5; row++) {
            for(var col = 0; col < 6; col++) {
                if(this.ball_board.ball(row,col).ball == null) {
                    this.ball_board.createBall(row, col, jtox(col), itoy(-2));
                    this.addChild(this.ball_board.ball(row,col).ball);
                    this.move_count++;
                    var on_complete = cc.CallFunc.create(this.onMoveComplete, this, total_combo, fast_mode);
                    this.moveBall(this.ball_board.ball(row,col).ball,
                            cc.p(jtox(col), itoy(row)),
                            fast_mode ? FAST_SPEED : SLOW_SPEED,
                            on_complete);
                }
            }
        }
        //No ball eliminated in this turn
        if (combo == 0 && !fast_mode) {
            if(this.monster.hp <= 0) {
                cc.log("#Killed the monster.");
                this.fightEnd();
                return;
            }
            else {
                this.monsterAttack();
            }
        }
    },
    onMoveComplete: function(_, total_combo, fast_mode) {
        //function(_, position) {
        this.move_count--;
        //cc.log("Move: " + ytoi(position.y) + ", " + xtoj(position.x) + ". " + this.move_count);
        if(this.move_count == 0) {
            this.eliminateBalls(total_combo, fast_mode);
        }
    },
    fightEnd: function() {
        var user_info = UserData.create();
        user_info.setHealth(this.health.num - user_info.getHealth());
        cc.eventManager.removeAllListeners();
        cc.director.runScene(new PlayScene());
    },
    monsterAttack: function() {
        this.health.addHealth(0 - Math.floor(this.monster.attack_max * (Math.random() * 0.7 + 0.3)));
        if (this.health.num == 0) {
            cc.log("#Killed by the monster.");
            return false;
        }
        else {
            return true;
        }
    }

});

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

var ScoreNum = function() {
    this.num = -1;
    this.sprite = null;
    this.addScore = function(add) {
        this.num += add;
        this.sprite.setString("Score: " + this.num.toString());
    };
}
ScoreNum.create = function () {
    var new_score = new ScoreNum();
    new_score.num = 0;
    new_score.sprite = cc.LabelTTF.create("Score: " + new_score.num.toString(), "Arial", 28);
    new_score.sprite.attr({x: 40, y: 395, anchorX: 0, anchorY: 0});
    return new_score;
}

var HealthNum = function() {
    this.num = -1;
    this.sprite = null;
    this.addHealth = function(add) {
        this.num += add;
        if(this.num < 0) {
            this.num = 0;
        }
        this.sprite.setString("Health: " + this.num.toString());
    }
}
HealthNum.create = function () {
    var user_info = UserData.create();
    var new_health = new HealthNum();
    new_health.num = user_info.getHealth();
    new_health.sprite = cc.LabelTTF.create("HP: " + new_health.num, "Arial", 28);
    new_health.sprite.attr({x: 40, y: 350, anchorX: 0, anchorY: 0});
    return new_health;
}

var Monster = function() {
    this.name = "";
    this.name_label = null;
    this.hp = 0;
    this.hp_label = null;
    this.sprite = null;
    this.attack_max = 0;
    this.loseHp = function(lose) {
        this.hp -= lose;
        if (this.hp < 0) {
            this.hp = 0;
        }
        this.hp_label.setString("HP: " + this.hp.toString());
    }
}
Monster.create = function() {
    var system_data = SystemData.create();
    var day = system_data.getDay();
    var new_monster = new Monster();
    var monster_num = Math.floor(10 * Math.random());
    new_monster.name = monster_name[monster_num];
    new_monster.hp = Math.floor(10 * Math.sqrt(Math.sqrt(day)) * (Math.random() + 1));
    new_monster.attack_max = Math.floor(2 * Math.sqrt(Math.sqrt(day)) * (Math.random() + 1));
    new_monster.sprite = cc.Sprite.create(monster_image[monster_num]);
    new_monster.sprite.attr({
        x: 40,
        y: 80,
        anchorX: 0,
        anchorY: 0
    });
    new_monster.name_label = cc.LabelTTF.create(new_monster.name, "Arial", 28);
    new_monster.name_label.attr({
        x: 40,
        y: 50,
        anchorX: 0,
        anchorY: 0
    });
    new_monster.hp_label = cc.LabelTTF.create("HP: " + new_monster.hp, "Arial", 28);
    new_monster.hp_label.attr({
        x: 40,
        y: 30,
        anchorX: 0,
        anchorY: 0
    });
    return new_monster;
}
var FAST_SPEED = 0;
var DEFAULT_SPEED = 0.001;
var SLOW_SPEED = 0.4;