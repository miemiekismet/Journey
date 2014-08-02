/**
 * Created by katrina on 6/18/14.
 */

var StatusLayer = cc.Layer.extend({
    labelDay: null,
    labelCoin: null,
    labelHealth: null,
    ctor:function () {
        this._super();
        this.init();
    },

    init:function () {
        this._super();

        var winsize = cc.director.getWinSize();
        var user_info = UserData.create();
        var sys_info = SystemData.create();

        this.labelDay = cc.LabelTTF.create("Days: " + sys_info.getDay(), "Helvetica", 20);
        this.labelDay.setColor(cc.color(255, 255, 255));//black color
        this.labelDay.setPosition(cc.p(winsize.width - 70, winsize.height - 20));
        this.addChild(this.labelDay);

        this.labelCoin = cc.LabelTTF.create("Coins: " + user_info.getMoney(), "Helvetica", 20);
        this.labelCoin.setColor(cc.color(255, 255, 255));//black color
        this.labelCoin.setPosition(cc.p(winsize.width - 70, winsize.height - 50));
        this.addChild(this.labelCoin);

        this.labelHealth = cc.LabelTTF.create("Health: " + user_info.getHealth(), "Helvetica", 20);
        this.labelHealth.setColor(cc.color(255, 255, 255));//black color
        this.labelHealth.setPosition(cc.p(winsize.width - 70, winsize.height - 80));
        this.addChild(this.labelHealth);
    },

    update: function() {
        var user_info = UserData.create();
        var sys_info = SystemData.create();
        this.labelDay.setString("Days: " + sys_info.getDay(), "Helvetica", 20);
        this.labelCoin.setString("Coins: " + user_info.getMoney(), "Helvetica", 20);
        this.labelHealth.setString("Health: " + user_info.getHealth(), "Helvetica", 20);
    }
});