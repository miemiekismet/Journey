/**
 * Created by katrina on 6/18/14.
 */

var AnimationLayer = cc.Layer.extend({
    ctor:function (scene_num) {
        this._super();
        this.scene_num = scene_num;
        this.init();
    },
    init:function () {
        this._super();
        if (this.scene_num == 0) {
            cc.log("#Adding Menu Layer for Playing Scene");
            var menu_layer = new MenuLayer();
            this.addChild(menu_layer, 10);
        }
        else if (this.scene_num == 1) {
            cc.log("#Adding Bag Layer for Bag Scene");
            var bag_layer = new BagLayer();
            this.addChild(bag_layer, 10);
        }
        else if (this.scene_num == 2) {
            cc.log("#Adding Market Layer for Market Scene");
            var market_layer = new MarketLayer();
            this.addChild(market_layer, 10);
        }
//        var spriteRunner = cc.Sprite.create(res.player_png);
//        spriteRunner.attr({x: 80, y: 85});
//
//        //create the move action
//        var actionTo = cc.MoveTo.create(2, cc.p(300, 85));
//        spriteRunner.runAction(cc.Sequence.create(actionTo));
//        this.addChild(spriteRunner);
    }
});

var MarketLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        this.init();
    },
    init:function () {
        this._super();

        var winsize = cc.director.getWinSize();
        var padding = winsize.height / 40;

        var user_info = new UserData();
        var system_info = new SystemData();

        //Drawing Market Title
        cc.log("#Drawing Market in Market Scene");
        var market_title_label = cc.LabelTTF.create("Market", "Arial", 20);
        var market_title_item = cc.MenuItemLabel.create(market_title_label, this);
        market_title_item.attr({
            x: padding,
            y: winsize.height - 2 * padding,
            anchorX: 0,
            anchorY: 0
        });
        var market_list = cc.Menu.create(market_title_item);
        market_list.x = 0;
        market_list.y = 0;

        var goods_today = system_info.getGoods();
        var prices_today = system_info.getPrices();

        var idx = 0;
        for (var i in goods_today) {
            var good = goods_today[i];
            var good_label = cc.LabelTTF.create(goods_name[good] + ":" + prices_today[idx], "Arial", 20);
            var good_item = cc.MenuItemLabel.create(good_label, buyIn(good), this);
            good_item.attr({
                x: padding,
                y: winsize.height - (5 + 2 * i) * padding,
                anchorX: 0,
                anchorY: 0
            });
            market_list.addChild(good_item);
            idx++;
        }
        //Drawing Exit Btn
        var exit_label = cc.LabelTTF.create("Exit", "Arial", 20);
        var exit_item = cc.MenuItemLabel.create(
            exit_label,
            function () {
                cc.log("@Exit clicked");
                cc.director.runScene(new PlayScene());
            },
            this);
        var exit_menu = cc.Menu.create(exit_item);
        exit_menu.attr({
            width: 50,
            x: padding * 3,
            y: padding * 3,
            anchorX: 0,
            anchorY: 0
        });
        this.addChild(exit_menu, 1);
        this.addChild(market_list, 1);
    }
});
var BagLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        this.init();
    },
    init:function () {
        this._super();

        var winsize = cc.director.getWinSize();
        var padding = winsize.width / 40;
        var user_info = new UserData();

        //Drawing Bag Title
        cc.log("#Drawing Bag in Bag Scene");
        var bag_title_label = cc.LabelTTF.create("Stocks", "Arial", 20);
        var bag_title_item = cc.MenuItemLabel.create(bag_title_label, this);
        bag_title_item.attr({
            x: padding,
            y: this.height - 2 * padding,
            anchorX: 0,
            anchorY: 0
        });

        var bag_list = cc.Menu.create(bag_title_item);

        bag_list.attr({
            x: padding,
            y: padding,
            anchorX: 0,
            anchorY: 0});

        //Drawing Bag Content
        var i = 0;
        for(var stock in user_info.getAllStock()) {
            cc.log("Stock:");
            cc.log(goods_name[i]);
            cc.log(user_info.getStock(i));
            var stock_label = cc.LabelTTF.create(goods_name[i] + "     " + user_info.getStock(i), "Arial", 15);
            var stock_item = cc.MenuItemLabel.create(stock_label, this);
            stock_item.attr({
                width: 50,
                x: padding,
                y: this.height - stock_item.height * (i + 1)  - padding * (i + 3),
                anchorX: 0,
                anchorY: 0
            });
            bag_list.addChild(stock_item);
            i++;
        }
        //Drawing Exit Btn
        var exit_label = cc.LabelTTF.create("Exit", "Arial", 20);
        var exit_item = cc.MenuItemLabel.create(
            exit_label,
            function () {
                cc.log("@Exit clicked");
                cc.director.runScene(new PlayScene());
            },
            this);
        var exit_menu = cc.Menu.create(exit_item);
        exit_menu.attr({
            width: 50,
            x: padding * 3,
            y: padding * 3,
            anchorX: 0,
            anchorY: 0
        });
        this.addChild(bag_list, 1);
        this.addChild(exit_menu, 1);
    }
});

var MenuLayer= cc.Layer.extend({
    ctor:function () {
        this._super();
        this.init();
    },
    init:function () {
        this._super();

        //Setting Menu size
        var winsize = cc.director.getWinSize();
        var padding = winsize.width / 80;

        this.attr({
            width: 96,
            height: 192,
            x: padding,
            y: winsize.height - 192 - padding,
            anchorX: 0,
            anchorY: 0
        });

        //Drawing Menu Background
        var bg_sprite = cc.Sprite.create(res.bg_menu_1_png);
        bg_sprite.attr({
            x: this.width / 2,
            y: this.height / 2,
            anchorX: 0.5,
            anchorY: 0.5
        });
        this.addChild(bg_sprite, 0);

        //Drawing Menu Text
        cc.log("#Drawing Menu in Play Scene");
        var bag_label = cc.LabelTTF.create("Bag", "Arial", 12);
        var market_label = cc.LabelTTF.create("Market", "Arial", 12);

        // add a "close" icon to exit the progress. it's an autorelease object
        var bag_item = cc.MenuItemLabel.create(
            bag_label,
            function () {
                cc.log("@Bag clicked");
                cc.director.runScene(new BagScene());
            }, this);
        bag_item.attr({
                x: padding,
                y: this.height - 3 * padding,
                anchorX: 0,
                anchorY: 0
            });
        var market_item = cc.MenuItemLabel.create(
            market_label,
            function () {
                cc.log("@Market is clicked!");
                cc.director.runScene(new MarketScene());
            }, this);
        market_item.attr({
            x: padding,
            y: this.height - market_item.height - 4 * padding,
            anchorX: 0,
            anchorY: 0
        });

        var menu = cc.Menu.create(bag_item);
        menu.x = 0;
        menu.y = 0;
        menu.addChild(market_item);
        this.addChild(menu, 1);
    }
});

function buyIn(good) {

}