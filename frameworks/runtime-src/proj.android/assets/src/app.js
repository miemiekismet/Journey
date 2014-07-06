
var WelcomeLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        //Init
        this._super();

        var size = cc.director.getWinSize();

        //Title
        var helloLabel = cc.LabelTTF.create("Journey", "Arial", 50);
        // position the label on the center of the screen
        helloLabel.x = size.width / 2;
        helloLabel.y = size.height - helloLabel.height;
        // add the label as a child to this layer
        this.addChild(helloLabel, 5);

        //Menu
        cc.log("#Setting Menu");
        var startLabel = cc.LabelTTF.create("Start", "Arial", 30);
        var exitLabel = cc.LabelTTF.create("Exit", "Arial", 30);

        // add a "close" icon to exit the progress. it's an autorelease object
        var startItem = cc.MenuItemLabel.create(
            startLabel,
            function () {
                cc.log("@Start clicked");
                cc.director.runScene(new PlayScene());
            }, this);
        startItem.attr({
            x: size.width / 2,
            y: size.height / 2,
            anchorX: 0.5,
            anchorY: 0.5
        });

        var exitItem = cc.MenuItemLabel.create(
            exitLabel,
            function () {
                cc.log("@Exit is clicked!");
            }, this);
        exitItem.attr({
            x: size.width / 2,
            y: size.height / 2 - 2 * exitItem.height,
            anchorX: 0.5,
            anchorY: 0.5
        });

        var menu = cc.Menu.create(startItem);
        menu.x = 0;
        menu.y = 0;
        menu.addChild(exitItem);
        this.addChild(menu, 1);

        //Background
        cc.log("#Setting Background");
        var centerPos = cc.p(size.width / 2, size.height / 2);
        var spriteBG = cc.Sprite.create(res.bg_open_jpg);
        spriteBG.attr({
            x: size.width / 2,
            y: size.height / 2,
            anchorX: 0.5,
            anchorY: 0.5
        });
        this.addChild(spriteBG);

//        // add "HelloWorld" splash screen"
//        this.sprite = cc.Sprite.create(res.HelloWorld_png);
//        this.sprite.attr({
//            x: size.width / 2,
//            y: size.height / 2,
//            scale: 0.5,
//            rotation: 180
//        });
//        this.addChild(this.sprite, 0);
//
//        var rotateToA = cc.RotateTo.create(2, 0);
//        var scaleToA = cc.ScaleTo.create(2, 1, 1);
//
//        this.sprite.runAction(cc.Sequence.create(rotateToA, scaleToA));
//        helloLabel.runAction(cc.Spawn.create(cc.MoveBy.create(2.5, cc.p(0, size.height - 40)),cc.TintTo.create(2.5,255,125,0)));
        return true;
    }
});

var WelcomeScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new WelcomeLayer();
        this.addChild(layer);
    }
});

