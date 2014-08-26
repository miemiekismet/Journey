/**
 * Created by katrina on 6/17/14.
 */

var BackgroundLayer = cc.Layer.extend({
    ctor:function (scene, city) {
        this._super();
        this.scene = scene;
        this.city = city;
        this.init();
    },

    init:function () {
        this._super();
        var winsize = cc.director.getWinSize();

        cc.log("height" + winsize.height);
        cc.log("width" + winsize.width);

        //create the background image and position it at the center of screen
        var spriteBG;
        switch (this.scene) {
            case 0: spriteBG = createNormalMap(0); break; // Opening
            case 1: spriteBG = createTmxMap(this.city); break; // City
            case 2: spriteBG = createNormalMap(2); break; //Bag
            case 3: spriteBG = createNormalMap(3); break; //Market
            case 4: spriteBG = createNormalMap(4); break; //Fight
            default: spriteBG = createNormalMap(0); break;
        };
        spriteBG.attr({
            x: winsize.width / 2,
            y: winsize.height / 2,
            anchorX: 0.5,
            anchorY: 0.5
        });
        this.addChild(spriteBG);
    }
});

function createNormalMap(map_num) {
    cc.log("#Changing background to " + pic_map_name[map_num]);
    return cc.Sprite.create(pic_map_name[map_num]);
}

function createTmxMap(map_num) {
    cc.log("#Changing background to " + city_map_name[map_num]);
    return cc.TMXTiledMap.create(city_map_name[map_num]);
}