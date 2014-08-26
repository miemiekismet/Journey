var TradeDialog = cc.Layer.extend({
	title_text: null,
	buy_or_sell: null,
	good_id: null,
	number: 0,
	func: null,
    ctor:function (buy_or_sell, good_id) {
        this._super();
        this.buy_or_sell = buy_or_sell;
        if (buy_or_sell){
        	this.title_text = "BUY";
        }
        else {
        	this.title_text = "SELL"
        }
        this.good_id = good_id;
        this.init();
    },
    init:function () {
    	cc.log("#Building dialog for: " + this.title_text);
    	cc.log("#This dialog's size is': " + this.width + ", " + this.height);

    	//Background
    	var bg_dialog = cc.Sprite.create(res.bg_dialog_png);
    	this.addChild(bg_dialog);
    	//Title
    	var title_label = cc.LabelTTF.create(this.title_text, "Arial", "30");
    	title_label.attr({
    		x: -200,
    		y: 100,
    		color: cc.color.BLACK,
    		anchorX: 0,
    		anchorY: 0
    	});
    	cc.log(title_label);
    	this.addChild(title_label);
    	this.addTradeBar();
    	this.addMessage("xx");
    },
    addTradeBar: function() {
    	//Number
    	var number_label = cc.LabelTTF.create("" + this.number, "Arial", "20");
    	number_label.attr({
            x: -135,
            y: 0,
            anchorX: 0.5,
            anchorY: 0.5,
    		color: cc.color.BLACK,
    	});
    	this.addChild(number_label, 1);

    	//Plus Button
    	var btn_plus_unclicked = cc.Sprite.create(res.btn_plus_png);
    	var btn_plus_clicked = cc.Sprite.create(res.btn_plus_png);
    	var btn_plus_disabled = cc.Sprite.create(res.btn_plus_minus_disabled_png);
    	var plus_item = cc.MenuItemSprite.create(
            btn_plus_unclicked,
            btn_plus_clicked,
            btn_plus_disabled,
            function () {
                this.number++;
                cc.log("@Plus clicked:" + this.number);
                if(this.number > 0) {
                	minus_item.setEnabled(true);
                }
                number_label.setString(this.number);
            }.bind(this));
        var plus = cc.Menu.create(plus_item);
        plus.attr({
            x: -170,
            y: 0,
            anchorX: 0.5,
            anchorY: 0.5
        });
        this.addChild(plus, 1);

    	//Minus Button
    	var btn_minus_unclicked = cc.Sprite.create(res.btn_minus_png);
    	var btn_minus_clicked = cc.Sprite.create(res.btn_minus_png);
    	var btn_minus_disabled = cc.Sprite.create(res.btn_plus_minus_disabled_png);
    	var minus_item = cc.MenuItemSprite.create(
            btn_minus_unclicked,
            btn_minus_clicked,
            btn_minus_disabled,
            function () {
                this.number--;
                cc.log("@Minus clicked:" + this.number);
                if(this.number == 0) {
                	minus_item.setEnabled(false);
                }
                number_label.setString(this.number);
            }.bind(this));
    	minus_item.setEnabled(false);
        var minus = cc.Menu.create(minus_item);
        minus.attr({
            x: -100,
            y: 0,
            anchorX: 0.5,
            anchorY: 0.5
        });
        this.addChild(minus, 1);

        //Button Yes
        var btn_yes_label = cc.LabelTTF.create(this.title_text, "Arial", 20);
        btn_yes_label.attr({
            x: 0,
            y: 0,
            anchorX: 0.5,
            anchorY: 0.5
        });
    	var btn_yes_unclicked = cc.Sprite.create(res.bg_title_png);
    	var btn_yes_clicked = cc.Sprite.create(res.bg_title_png);
    	var btn_yes_disabled = cc.Sprite.create(res.bg_title_png);
    	var btn_yes_item = cc.MenuItemSprite.create(
            btn_yes_unclicked,
            btn_yes_clicked,
            btn_yes_disabled,
            function () {
            	cc.log("@Button Yes clicked");
            	if(this.number == 0) return;
            	this.trade();
            	this.getParent().removeChild(this);
            }.bind(this));
        var btn_yes = cc.Menu.create(btn_yes_item);
        btn_yes.attr({
            x: 0,
            y: 0,
            anchorX: 0.5,
            anchorY: 0.5
        });
        this.addChild(btn_yes_label, 2);
        this.addChild(btn_yes, 1);
        //Button No
        var btn_no_label = cc.LabelTTF.create("Cancel", "Arial", 20);
        btn_no_label.attr({
            x: 100,
            y: 0,
            anchorX: 0.5,
            anchorY: 0.5
        });
    	var btn_no_unclicked = cc.Sprite.create(res.bg_title_png);
    	var btn_no_clicked = cc.Sprite.create(res.bg_title_png);
    	var btn_no_disabled = cc.Sprite.create(res.bg_title_png);
    	var btn_no_item = cc.MenuItemSprite.create(
            btn_no_unclicked,
            btn_no_clicked,
            btn_no_disabled,
            function () {
            	cc.log("@Button No clicked");
            	this.getParent().removeChild(this);
            }.bind(this));
        var btn_no = cc.Menu.create(btn_no_item);
        btn_no.attr({
            x: 100,
            y: 0,
            anchorX: 0.5,
            anchorY: 0.5
        });
        this.addChild(btn_no_label, 2);
        this.addChild(btn_no, 1);
    },
    addMessage: function(msg) {
    	var msg_label = cc.LabelTTF.create("* " + msg, "Arial", 18);
        msg_label.attr({
            x: -150,
            y: -50,
    		color: cc.color.BLACK,
            anchorX: 0.5,
            anchorY: 0.5
        });
        this.addChild(msg_label);
    },
    trade: function() {
    	if(this.buy_or_sell) {
    		this.buy();
    	}
    	else {
    		this.sell();
    	}
    },
    buy: function() {
        var user_info = UserData.create();
        var sys_info = SystemData.create();

        var money = user_info.getMoney();
        var price = sys_info.getPrice(this.good_id);

        if (price == -1) {
            cc.log("###Warning: unexpected logic - get price of the good which is not available today###");
            return false;
        }
        if (money < price * this.number) {
            cc.log("#not enough money for buying" + this.good_id);
            return false;
        }
        user_info.setMoney(0 - price * this.number);
        user_info.setStock(this.good_id, this.number);
        this.getParent().sts_layer.update();
        cc.log("#Bought good: " + this.good_id + "Number: " + this.number);
        return true;
    },
    sell: function() {
        var user_info = UserData.create();
        var sys_info = SystemData.create();

        var money = user_info.getMoney();
        var price = sys_info.getPrice(this.good_id);

        if (price == -1) {
            cc.log("###Warning: unexpected logic - get price of the good which is not available today###");
            return false;
        }
        if (user_info.getStock(this.good_id) < this.number) {
            cc.log("#not enough goods for selling" + this.good_id);
            return false;
        }
        user_info.setMoney(price * this.number);
        user_info.setStock(this.good_id, 0 - this.number);
        this.getParent().sts_layer.update();
        cc.log("#Sold good: " + this.good_id + "Number: " + this.number);
        return true;
    }
});