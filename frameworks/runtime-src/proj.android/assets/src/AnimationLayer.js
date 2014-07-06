/**
 * Created by katrina on 6/18/14.
 */

var AnimationLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        this.init();
    },
    init:function () {
        this._super();

        var menu_layer = new MenuLayer();
        this.addChild(menu_layer, 10);
//        var spriteRunner = cc.Sprite.create(res.player_png);
//        spriteRunner.attr({x: 80, y: 85});
//
//        //create the move action
//        var actionTo = cc.MoveTo.create(2, cc.p(300, 85));
//        spriteRunner.runAction(cc.Sequence.create(actionTo));
//        this.addChild(spriteRunner);
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
        var bag_label = cc.LabelTTF.create("Bag", "Arial", 12);
        var more_label = cc.LabelTTF.create("To be Added", "Arial", 12);

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

        var more_item = cc.MenuItemLabel.create(
            more_label,
            function () {
                cc.log("@More is clicked!");
            }, this);
        more_item.attr({
            x: padding,
            y: this.height - more_item.height - 4 * padding,
            anchorX: 0,
            anchorY: 0
        });

        var menu = cc.Menu.create(bag_item);
        menu.x = 0;
        menu.y = 0;
        menu.addChild(more_item);
        this.addChild(menu, 1);
    }
});