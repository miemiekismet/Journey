
var WelcomeLayer = cc.Layer.extend({
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
        var startOverLabel = cc.LabelTTF.create("StartOver", "Arial", 30);
        var startLabel = cc.LabelTTF.create("Start", "Arial", 30);
        var exitLabel = cc.LabelTTF.create("Exit", "Arial", 30);

        var startOverItem = cc.MenuItemLabel.create(
            startOverLabel,
            function () {
                cc.log("@Start Over clicked");
                alert("Game Data Cleared.");
                cc.sys.localStorage.clear();
            }, this);
        startOverItem.attr({
            x: size.width / 2,
            y: size.height / 2 + startOverItem.height,
            anchorX: 0.5,
            anchorY: 0.5
        });

        var startItem = cc.MenuItemLabel.create(
            startLabel,
            function () {
                cc.log("@Start clicked");
                cc.director.runScene(new PlayScene());
            }, this);
        startItem.attr({
            x: size.width / 2,
            y: size.height / 2 - startItem.height,
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
            y: size.height / 2 - 3 * exitItem.height,
            anchorX: 0.5,
            anchorY: 0.5
        });

        var menu = cc.Menu.create(startOverItem);
        menu.x = 0;
        menu.y = 0;
        menu.addChild(startItem);
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

cc.log = function(msg){
    //do nothing;
}
