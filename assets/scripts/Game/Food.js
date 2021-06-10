cc.Class({
    extends: cc.Component,

    properties: {

        Atlas:
        {
            default: null,
            type: cc.SpriteAtlas,
        },

        _Type: 1,
    },

    // onLoad () {},

    start() {

    },

    //
    setType(foodType) {
        if (foodType < 1 || foodType > 5) {
            foodType = 1;
        }

        this._Type = foodType;

        var sprite = this.node.getComponent(cc.Sprite);
        var atlasName = 'food_' + foodType;
        var spriteFrame = this.Atlas.getSpriteFrame(atlasName);
        if (spriteFrame) {
            sprite.spriteFrame = spriteFrame;
        }
    },

    //食物增加的重量,重量影响长度
    getAddWeight() {
        // return 3;
        return this._Type * 0.5;
    }
    //
    // update (dt) {},
});
