/**
 * Created by katrina on 6/18/14.
 */

var AnimationLayer = cc.Layer.extend({
    scene_num: -1,
    sts_layer: null,
    ctor:function (scene_num, sts_layer) {
        this._super();
        this.scene_num = scene_num;
        this.sts_layer = sts_layer;
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
            var market_layer = new MarketLayer(this.sts_layer);
            this.addChild(market_layer, 10);
        }
        else if (this.scene_num == 3) {
            cc.log("#Adding Fight Layer for Fight Scene");
            var fight_layer = new FightLayer();
            this.addChild(fight_layer, 10);
        }
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
        var bag_label = cc.LabelTTF.create("Bag", "Arial", 23);
        var market_label = cc.LabelTTF.create("Market", "Arial", 23);
        var fight_label = cc.LabelTTF.create("Fight", "Arial", 23);

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
            y: this.height - market_item.height - 5 * padding,
            anchorX: 0,
            anchorY: 0
        });
        var fight_item = cc.MenuItemLabel.create(
            fight_label,
            function () {
                cc.log("@Fight is clicked!");
                cc.director.runScene(new FightScene());
            }, this);
        fight_item.attr({
            x: padding,
            y: this.height - market_item.height - fight_item.height - 7 * padding,
            anchorX: 0,
            anchorY: 0
        });

        var menu = cc.Menu.create(bag_item);
        menu.x = 0;
        menu.y = 0;
        menu.addChild(market_item);
        menu.addChild(fight_item);
        this.addChild(menu, 1);
    }
});