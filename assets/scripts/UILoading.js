//游戏加载界面
var UIType = require('UIType');

cc.Class({
    extends: cc.Component,

    properties: {
        LoadingProgress:
        {
            default: null,
            type: cc.ProgressBar,
        },

        GuangSprite:
        {
            default: null,
            type: cc.Sprite,
        },

        _needUpdate: true,
    },

    onLoad() {

    },

    onEnable() {

        cc.log('UILoading onEnable enter--------------------------------------');

        this.LoadingProgress.progress = 0;
        if (this.GuangSprite) {
            this.GuangSprite.node.x = this.LoadingProgress.barSprite.node.x;
        }

        this._needUpdate = true;
        cc.log('UILoading onEnable leave--------------------------------------');
    },

    onDisable() {
        this._needUpdate = false;
    },

    start() {

    },

    update(dt) {
        if (this._needUpdate == false) {
            return;
        }

        var addProgress =  dt;
        this.LoadingProgress.progress = this.LoadingProgress.progress + addProgress;
        if (this.LoadingProgress.progress >= 1) {
            this.LoadingProgress.progress = 1
            this._needUpdate = false;

            GameGlobal.UIManager.closeUI(UIType.UIType_GameLoading);
            GameGlobal.UIManager.openUI(UIType.UIType_Game);
        }

        if (this.GuangSprite) {
            this.GuangSprite.node.x = this.LoadingProgress.barSprite.node.x + this.LoadingProgress.progress * this.LoadingProgress.totalLength;
        }
    },
});
