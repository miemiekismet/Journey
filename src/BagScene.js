/**
 * Created by katrina on 6/18/14.
 */
/**
 * Created by katrina on 6/18/14.
 */

var BagScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        //add three layer in the right order
        this.addChild(new BackgroundLayer(2, 0));
        this.addChild(new AnimationLayer(1));
        this.addChild(new StatusLayer());
    }
});