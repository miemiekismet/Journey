/**
 * Created by katrina on 6/18/14.
 */

var PlayScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        //add three layer in the right order
        var bg_layer = new BackgroundLayer(1, 0);
        //var sts_layer = new StatusLayer();
        var anm_layer = new AnimationLayer(0, null);
        this.addChild(bg_layer);
        this.addChild(anm_layer);
        //this.addChild(sts_layer);
    }
});