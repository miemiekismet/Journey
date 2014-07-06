/**
 * Created by katrina on 6/29/14.
 */

var MarketScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        //add three layer in the right order
        this.addChild(new BackgroundLayer(3, 0));
        this.addChild(new AnimationLayer(2));
        this.addChild(new StatusLayer());
    }
});