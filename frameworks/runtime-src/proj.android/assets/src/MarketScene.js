/**
 * Created by katrina on 6/29/14.
 */

var MarketScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        //add three layer in the right order
        var bg_layer = new BackgroundLayer(3, 0);
        var sts_layer = new StatusLayer();
        var anm_layer = new AnimationLayer(2, sts_layer);
        this.addChild(bg_layer);
        this.addChild(anm_layer);
        this.addChild(sts_layer);
    }
});

var MarketLayer = cc.Layer.extend({
    sts_layer: null,
    ctor:function (sts_layer) {
        this._super();
        this.sts_layer = sts_layer;
        this.init();
    },
    init:function () {
        this._super();

        var winsize = cc.director.getWinSize();
        var padding = winsize.height / 40;

        var user_info = UserData.create();
        var sys_info = SystemData.create();

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

        var goods_today = sys_info.getGoods();
        var prices_today = sys_info.getPrices();

        for (var i in goods_today) {
            (function(that, good){
                var cur_good = goods_today[good];
                var good_label = cc.LabelTTF.create(goods_name[cur_good] + ":" + prices_today[i], "Arial", 20);
                var good_item = cc.MenuItemLabel.create(good_label, function() {this.buyIn(cur_good);}, that);
                good_item.attr({
                    x: padding,
                    y: winsize.height - (5 + 2 * i) * padding,
                    anchorX: 0,
                    anchorY: 0
                });
                market_list.addChild(good_item);
            })(this, i)
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
    },

    buyIn: function(good) {
        var user_info = UserData.create();
        var sys_info = SystemData.create();

        var money = user_info.getMoney();
        var price = sys_info.getPrice(good);

        if (price == -1) {
            cc.log("###Warning: unexpected logic - get price of the good which is not available today###");
            return false;
        }
        if (money < price) {
            cc.log("#not enough money for" + good);
            return false;
        }
        user_info.setMoney(money - price);
        user_info.setStock(good, 1);
        this.sts_layer.update();
        cc.log("#buy in good: " + good);
        return true;
    }
});