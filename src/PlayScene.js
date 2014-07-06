/**
 * Created by katrina on 6/18/14.
 */

var PlayScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        //add three layer in the right order
        this.addChild(new BackgroundLayer(1, 0));
        this.addChild(new AnimationLayer(0));
        this.addChild(new StatusLayer());
    }
});