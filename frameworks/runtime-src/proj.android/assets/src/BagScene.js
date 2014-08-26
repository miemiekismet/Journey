/**
 * Created by katrina on 6/18/14.
 */

var BagScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        //add three layer in the right order
        var bg_layer = new BackgroundLayer(2, 0);
        var sts_layer = new StatusLayer();
        var anm_layer = new AnimationLayer(1, sts_layer);
        this.addChild(bg_layer);
        this.addChild(anm_layer);
        this.addChild(sts_layer);
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
        var user_info = UserData.create();

        //Drawing Bag Title
        cc.log("#Drawing Bag in Bag Scene");
        var bag_title_label = cc.LabelTTF.create("Barn", "Arial", 20);
        bag_title_label.attr({
            x: padding * 3,
            y: this.height - 2 * padding,
            anchorX: 0.5,
            anchorY: 0.5
        });
        var bag_title_bg = cc.Sprite.create(res.bg_title_png);
        bag_title_bg.attr({
            x: padding * 3,
            y: this.height - 2 * padding,
            anchorX: 0.5,
            anchorY: 0.5
        });
        this.addChild(bag_title_label, 2);
        this.addChild(bag_title_bg, 1);

        //Drawing Bag Content
        var i = 0;
        for(var stock in user_info.getAllStock()) {
            cc.log("Stock:");
            cc.log(goods_name[i]);
            cc.log(user_info.getStock(i));
            var stock_img = cc.Sprite.create(goods_img[i]);
            stock_img.attr({
                x: padding * 2,
                y: this.height - stock_img.height * (i + 1)  - padding * (i + 4),
                anchorX: 0,
                anchorY: 0
            });
            var stock_label = cc.LabelTTF.create(goods_name[i], "Arial", 15);
            stock_label.attr({
                x: stock_img.getPositionX() + stock_img.getContentSize().width + padding,
                y: stock_img.getPositionY(),
                anchorX: 0,
                anchorY: 0
            });
            var stock_price_label = cc.LabelTTF.create(" " + user_info.getStock(i), "Arial", 15);
            stock_price_label.attr({
                x: padding * 12,
                y: stock_img.getPositionY(),
                anchorX: 0,
                anchorY: 0
            });
            this.addChild(stock_img, 1);
            this.addChild(stock_label, 1);
            this.addChild(stock_price_label, 1);
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
            x: padding * 10,
            y: this.height - 2 * padding,
            anchorX: 0.5,
            anchorY: 0.5
        });
        this.addChild(exit_menu, 1);
    }
});