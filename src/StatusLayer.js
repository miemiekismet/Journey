/**
 * Created by katrina on 6/18/14.
 */

var StatusLayer = cc.Layer.extend({
    goodsNum: {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0
    },

    ctor:function () {
        this._super();
        this.init();
    },

    init:function () {
        this._super();

        var winsize = cc.director.getWinSize();
        var user_info = new UserData();
        this.labelCoin = cc.LabelTTF.create("Coins: " + user_info.getMoney(), "Helvetica", 20);
        this.labelCoin.setColor(cc.color(0,0,0));//black color
        this.labelCoin.setPosition(cc.p(winsize.width - 70, winsize.height - 20));
        this.addChild(this.labelCoin);

        this.labelHealth = cc.LabelTTF.create("Health: " + user_info.getHealth(), "Helvetica", 20);
        this.labelHealth.setColor(cc.color(0,0,0));//black color
        this.labelHealth.setPosition(cc.p(winsize.width - 70, winsize.height - 50));
        this.addChild(this.labelHealth);
    }
});