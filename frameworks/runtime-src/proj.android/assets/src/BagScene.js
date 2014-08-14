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