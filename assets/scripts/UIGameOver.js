var UIType = require('UIType');


cc.Class({
    extends: cc.Component,

    properties:
    {
        //倒计时Label
        TimerLabel:
        {
            default: null,
            type: cc.Label,
        },
        //重来
        AgainBtn:
        {
            default: null,
            type: cc.Button,
        },

        _CurTimeCount: 10,
        _CurVideoAd: null,
    },


    // onLoad () {},

    start() {
        // this.BackBtn.node.on(cc.Node.EventType.TOUCH_END, this.onBack, this);
        // this.CloseBtn.node.on(cc.Node.EventType.TOUCH_END, this.onBack, this);
        this.AgainBtn.node.on(cc.Node.EventType.TOUCH_END,this.replay,this);
    },

    onEnable() {
        cc.log('UIGameOver onEnable enter-----------------------------');

        this._CurTimeCount = 10;
        this.TimerLabel.string = this._CurTimeCount + "";
        this.schedule(this.onTimer, 1);

        //---------------------------------广告相关 begin ----------------------------------------

        if (this._CurVideoAd == null) {
            if (window.wx != undefined) {
                this._CurVideoAd = wx.createRewardedVideoAd({ adUnitId: GameGlobal.DataManager.VideoAdid });
            }
        }

        //开启重来按钮 
        this.AgainBtn.node.active = true;
        //去掉返回按钮
        // this.BackBtn.node.active = false;
        //关闭分享按钮
        // this.ReliveBtn.node.active = false;

        var DataManager = GameGlobal.DataManager

        // if (DataManager._CurShareReliveCount >= DataManager._ShareReliveCount) {
        //     this.ReliveBtn.node.active = false;
        // }
        // else {
        //     this.ReliveBtn.node.active = true;
        // }

        this._IsPause = false;

        cc.log('UIGameOver onEnable leave-----------------------------');
    },

    onDisable() {
        this.unscheduleAllCallbacks();
    },

    //金币复活
    onRelive(event) {
        event.stopPropagation();
        var curGold = GameGlobal.DataManager.getCurGold();
        var costGold = GameGlobal.DataManager.getFuHuoGold();
        if (Number(curGold) < Number(costGold)) {
            GameGlobal.UIManager.showMessage('金币不足，无法复活');
            return;
        }
        //复活的处理
        var uiMgr = GameGlobal.UIManager;
        uiMgr.closeUI(UIType.UIType_GameOver);
        var uiGame = uiMgr.getUI(UIType.UIType_Game);
        uiGame.reliveResetGame();
    },

    replay(event){
        var uiMgr = GameGlobal.UIManager;
        uiMgr.closeUI(UIType.UIType_GameOver);

        var uiGame = uiMgr.getUI(UIType.UIType_Game);
        uiGame.reliveResetGame();
        // GameGlobal.uiGame.reliveResetGame();
    },

    //返回
    onBack(event) {
        event.stopPropagation();
        var uiMgr = GameGlobal.UIManager;
        uiMgr.closeUI(UIType.UIType_GameOver);
        var uiGame = uiMgr.getUI(UIType.UIType_Game);
        uiGame.setGameState(4);
    },

    onTimer() {
        if (this._IsPause == true) {
            return;
        }
        this._CurTimeCount -= 1;
        this.TimerLabel.string = this._CurTimeCount + "";
        if (this._CurTimeCount == 0) {
            this.unscheduleAllCallbacks();

            var uiMgr = GameGlobal.UIManager;
            uiMgr.closeUI(UIType.UIType_GameOver);

            var uiGame = uiMgr.getUI(UIType.UIType_Game);
            uiGame.setGameState(4);
        }
    },

    // update (dt) {},
});
