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
            var menu_layer = new MenuLayer(this.sts_layer);
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
    sts_layer: null,
    ctor:function (sts_layer) {
        this._super();
        this.sts_layer = sts_layer;
        this.init();
    },
    init:function () {
        this._super();

        //Setting Menu size
        var winsize = cc.director.getWinSize();
        var padding = winsize.width / 80;

        //Drawing Buttons
        cc.log("#Drawing Buttons in Play Scene");
        var barn_button_unclicked = cc.Sprite.create(res.btn_barn_unclicked_png);
        var barn_button_clicked = cc.Sprite.create(res.btn_barn_clicked_png);
        var barn_button_disabled = cc.Sprite.create(res.btn_barn_unclicked_png);

        var market_button_unclicked = cc.Sprite.create(res.btn_market_unclicked_png);
        var market_button_clicked = cc.Sprite.create(res.btn_market_clicked_png);
        var market_button_disabled = cc.Sprite.create(res.btn_market_unclicked_png);

        var next_city_button_unclicked = cc.Sprite.create(res.btn_next_city_unclicked_png);
        var next_city_button_clicked = cc.Sprite.create(res.btn_next_city_clicked_png);
        var next_city_button_disabled = cc.Sprite.create(res.btn_next_city_unclicked_png);

        var fight_label = cc.LabelTTF.create("Fight", "Arial", 20);

        var barn_item = cc.MenuItemSprite.create(
            barn_button_unclicked,
            barn_button_clicked,
            barn_button_disabled,
            function () {
                cc.log("@Bag clicked");
                cc.director.runScene(new BagScene());
            });
        var barn = cc.Menu.create(barn_item);
        barn.x = 240;
        barn.y = 390;
        this.addChild(barn, 1);

        var market_item = cc.MenuItemSprite.create(
            market_button_unclicked,
            market_button_clicked,
            market_button_disabled,
            function () {
                cc.log("@Market is clicked!");
                cc.director.runScene(new MarketScene());
            });
        var market = cc.Menu.create(market_item);
        market.x = 560;
        market.y = 135;
        this.addChild(market, 1);

        var next_city_item = cc.MenuItemSprite.create(
            next_city_button_unclicked,
            next_city_button_clicked,
            next_city_button_disabled,
            function () {
                cc.log("@Next city is clicked!");
                var system_data = SystemData.create();
                system_data.setDay();
                this.changeDayAnimation();
                this.sts_layer.update();
            }.bind(this));
        var next_city = cc.Menu.create(next_city_item);
        next_city.x = 710;
        next_city.y = 313;
        this.addChild(next_city, 1);

        var fight_item = cc.MenuItemLabel.create(
            fight_label,
            function () {
                cc.log("@Fight is clicked!");
                cc.director.runScene(new FightScene());
            }, this);
        fight_item.attr({
            x: padding,
            y: this.height - market_item.height - fight_item.height - 8 * padding,
            anchorX: 0,
            anchorY: 0
        });
    },
    changeDayAnimation:function() {
        var mask = cc.Sprite.create(res.change_day_mask_png);
        mask.setOpacity(0);
        mask.setPosition(cc.p(0, 0));
        mask.setAnchorPoint(cc.p(0, 0))
        this.addChild(mask, 2);
        var show = cc.fadeIn(0.5);
        var disappear = cc.fadeOut(1);
        var on_complete = cc.CallFunc.create(
            function(_, obj) {
                this.removeChild(obj);
            }.bind(this),
            this, mask);
        mask.runAction(cc.Sequence.create(show, disappear, on_complete));
    }
});