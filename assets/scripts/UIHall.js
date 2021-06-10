
var UIType = require('UIType');
// var SoundType = require('SoundType');
var Snake = require('Snake');

cc.Class({
    extends: cc.Component,

    properties: {
        //照片
        MyPhotoSprite:
        {
            default: null,
            type: cc.Sprite,
        },
        //蛇的父节点
        SnakeShowNode:
        {
            default: null,
            type: cc.Node,
        },
        //昵称：
        MyNickLabel:
        {
            default: null,
            type: cc.Label,
        },

        //限时模式：
        TimeModeBtn:
        {
            default: null,
            type: cc.Button,
        },

        //子域遮罩
        SubMaskSprite:
        {
            default: null,
            type: cc.Sprite,
        },

        //子域Sprite
        SubContentSprite:
        {
            default: null,
            type: cc.Sprite,
        },

        //展示用蛇
        ShowNodeList:
        {
            default: [],
            type: [cc.Node],
        },

        //金币label
        GoldLabel:
        {
            default: null,
            type: cc.Label,
        },

        //钻石label
        DiamLabel:
        {
            default: null,
            type: cc.Label,
        },

    },

    onLoad() {
        cc.log('UIHall onLoad----------------------------');

    },

    onEnable() {
        cc.log('UIHall onEnable  enter------------------------');

        this._SoundMgr = GameGlobal.SoundManager;
        this._SoundMgr.stopAll();
        // this._SoundMgr.playSound(SoundType.SoundType_Bg);

        this.updateMyInfo();
        cc.log('UIHall onEnable  leave------------------------');
    },

    onDisable() {

    },


    start() {

        cc.log('UIHall   start enter ------------------------');
        //几种模式
        this.TimeModeBtn.node.on(cc.Node.EventType.TOUCH_END, this.onTimeModeBtn, this);

        cc.log('UIHall   start leave ------------------------');
    },

    //更新左上角信息
    updateMyInfo() {
        var self = this;

        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            if (GameGlobal.DataManager._MyAvatarURL.length > 0) {
                cc.loader.load(
                    { url: GameGlobal.DataManager._MyAvatarURL, type: 'png' }, function (err, tex) {
                        cc.log('load url', err);
                        if (tex instanceof cc.Texture2D) {
                            var spriteFrame = new cc.SpriteFrame(tex);
                            self.MyPhotoSprite.spriteFrame = spriteFrame;
                        }
                    }
                )
            }
        }
        else if (cc.sys.platform === cc.sys.QQ_PLAY) {
            if (GameGlobal.DataManager._MyAvatarURL.length > 0) {
                var image = new Image();
                image.onload = function () {
                    var tex = new cc.Texture2D();
                    tex.initWithElement(image);
                    tex.handleLoadedTexture();
                    self.MyPhotoSprite.spriteFrame = new cc.SpriteFrame(tex);
                }
                image.src = GameGlobal.DataManager._MyAvatarURL;
            }

        }

        if (GameGlobal.DataManager._MyNickName.length > 0) {
            self.MyNickLabel.string = GameGlobal.DataManager._MyNickName;
        }

    },

    //更新金币数
    updateGoldNum() {
        var curGold = GameGlobal.DataManager.CurGold
        this.GoldLabel.string = curGold;
    },

    //更新钻石
    updateDiamondNum() {
        var curDiamond = GameGlobal.DataManager.CurDiamond
        this.DiamLabel.string = curDiamond;
    },

    //时间模式
    onTimeModeBtn(event) {
        //停止事件的传递
        event.stopPropagation();

        //_CurSelectMode设置当前游戏选择的模式
        GameGlobal.DataManager._CurSelectMode = 0;

        GameGlobal.UIManager.closeUI(UIType.UIType_Hall);
        GameGlobal.UIManager.openUI(UIType.UIType_GameLoading);
    },

});
