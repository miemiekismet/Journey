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
        var padding = winsize.width / 40;

        var user_info = UserData.create();
        var sys_info = SystemData.create();

        //Drawing Market Title
        cc.log("#Drawing Market in Market Scene");
        var market_title_label = cc.LabelTTF.create("Market", "Arial", 20);
        market_title_label.attr({
            x: padding * 3,
            y: this.height - 2 * padding,
            anchorX: 0.5,
            anchorY: 0.5
        });
        var market_title_bg = cc.Sprite.create(res.bg_title_png);
        market_title_bg.attr({
            x: padding * 3,
            y: this.height - 2 * padding,
            anchorX: 0.5,
            anchorY: 0.5
        });
        this.addChild(market_title_label, 2);
        this.addChild(market_title_bg, 1);

        //

        var goods_today = sys_info.getGoods();
        var prices_today = sys_info.getPrices();

        for (var i in goods_today) {
            (function(that, idx){
                var cur_good = goods_today[idx];
                //Background
                var bg_single_good = cc.Sprite.create(res.bg_single_good_png);
                bg_single_good.attr({
                    x: padding * 4,
                    y: winsize.height + bg_single_good.height - (10 + 2 * idx) * padding * 1.25
                });
                bg_single_good.setAnchorPoint(cc.p(0, 0));
                that.addChild(bg_single_good, 1);
                //Image
                var good_img = cc.Sprite.create(goods_img[cur_good]);
                good_img.attr({
                    x: padding * 2,
                    y: 8
                });
                good_img.setAnchorPoint(cc.p(0, 0));
                bg_single_good.addChild(good_img);
                //Name
                var good_label = cc.LabelTTF.create(goods_name[cur_good], "Arial", 20);
                good_label.attr({
                    x: padding * 5,
                    y: 8
                });
                good_label.setAnchorPoint(cc.p(0, 0));
                bg_single_good.addChild(good_label, 2);
                //Price
                var good_price = cc.LabelTTF.create("$" + prices_today[idx], "Arial", 20);
                good_price.attr({
                    x: padding * 10,
                    y: 8
                });
                good_price.setAnchorPoint(cc.p(0, 0));
                bg_single_good.addChild(good_price, 2);
                //Buy Button
                var btn_buy_unclicked = cc.Sprite.create(res.btn_buy_unclicked_png);
                var btn_buy_clicked = cc.Sprite.create(res.btn_buy_clicked_png);
                var btn_buy_disabled = cc.Sprite.create(res.btn_buy_unclicked_png);
                var buy_item = cc.MenuItemSprite.create(
                    btn_buy_unclicked,
                    btn_buy_clicked,
                    btn_buy_disabled,
                    function () {
                        cc.log("@Buy clicked");
                    });
                var buy = cc.Menu.create(buy_item);
                buy.attr({
                    x: padding * 20,
                    y: 22
                });
                buy.setAnchorPoint(cc.p(0, 0));
                bg_single_good.addChild(buy, 2);
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
            x: padding * 10,
            y: this.height - 2 * padding,
            anchorX: 0.5,
            anchorY: 0.5
        });
        this.addChild(exit_menu, 1);
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