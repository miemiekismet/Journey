/**
 * Created by katrina on 6/18/14.
 */

var StatusLayer = cc.Layer.extend({
    label_day: null,
    label_coin: null,
    label_health: null,
    bg_status: null,
    ctor:function () {
        this._super();
        this.init();
    },

    init:function () {
        this._super();

        var winsize = cc.director.getWinSize();
        var user_info = UserData.create();
        var sys_info = SystemData.create();

        this.bg_status = cc.Sprite.create(res.bg_status_png);
        this.bg_status.setPosition(cc.p(winsize.width - 135, winsize.height - 70));
        this.addChild(this.bg_status);

        this.label_day = cc.LabelTTF.create("Days: " + sys_info.getDay(), "Helvetica", 20);
        this.label_day.setColor(cc.color(255, 255, 255));//black color
        this.label_day.setPosition(cc.p(winsize.width - 135, winsize.height - 40));
        this.addChild(this.label_day);

        this.label_coin = cc.LabelTTF.create("Coins: $" + user_info.getMoney(), "Helvetica", 20);
        this.label_coin.setColor(cc.color(255, 255, 255));//black color
        this.label_coin.setPosition(cc.p(winsize.width - 135, winsize.height - 70));
        this.addChild(this.label_coin);

        this.label_health = cc.LabelTTF.create("Health: " + user_info.getHealth(), "Helvetica", 20);
        this.label_health.setColor(cc.color(255, 255, 255));//black color
        this.label_health.setPosition(cc.p(winsize.width - 135, winsize.height - 100));
        this.addChild(this.label_health);
    },

    update: function() {
        var user_info = UserData.create();
        var sys_info = SystemData.create();
        this.label_day.setString("Days: " + sys_info.getDay());
        this.label_coin.setString("Coins: $" + user_info.getMoney());
        this.label_health.setString("Health: " + user_info.getHealth());
    }
});