var UIType = require('UIType');

cc.Class({
    extends: cc.Component,

    properties:
    {
        //返回按钮 
        BackBtn:
        {
            default: null,
            type: cc.Button,
        },
        //再来一局
        AgainBtn:
        {
            default: null,
            type: cc.Button,
        },
        //炫耀
        ShareBtn:
        {
            default: null,
            type: cc.Button,
        },
        //关闭按钮 
        CloseBtn:
        {
            default: null,
            type: cc.Button,
        },
        //长度Label
        LenLabel:
        {
            default: null,
            type: cc.Label,
        },
        //击杀label
        KillLabel:
        {
            default: null,
            type: cc.Label,
        },

        //奖励金币：
        RewardGoldLabel:
        {
            default: null,
            type: cc.Label,
        },

    },

    onEnable() {

        //去掉 返回与再来一局按钮 ()
        // this.BackBtn.node.active = false;
        this.AgainBtn.node.active = true;


        var uiMgr = GameGlobal.UIManager;
        var uiGame = uiMgr.getUI(UIType.UIType_Game);
        // uiGame.reliveResetGame();
        this.RewardGoldLabel.string = "";
        this.LenLabel.string = "" + uiGame.getMySnakeLen();
        this.KillLabel.string = "" + uiGame.getMySnakeKill();
    },

    onDisable() {
    },

    start() {
        this.BackBtn.node.on(cc.Node.EventType.TOUCH_END, this.onBack, this);
        this.AgainBtn.node.on(cc.Node.EventType.TOUCH_END, this.onAgain, this);
        // this.ShareBtn.node.on(cc.Node.EventType.TOUCH_END, this.onShareBtn, this);
        this.CloseBtn.node.on(cc.Node.EventType.TOUCH_END, this.onBack, this);
    },


    //刷新奖励金币数
    refreshRewardGold(gold) {
        if (this.RewardGoldLabel) {
            this.RewardGoldLabel.string = gold;
        }
    },

    //返回
    onBack(event) {
        return
        if (event) {
            event.stopPropagation();
        }


        var uiMgr = GameGlobal.UIManager;
        uiMgr.closeUI(UIType.UIType_GameEnd);
        uiMgr.closeUI(UIType.UIType_Game);
        uiMgr.openUI(UIType.UIType_Hall);

        if (window.wx != undefined) {
            wx.triggerGC();
        }

    },

    //
    onAgain(event) {
        if (event) {
            event.stopPropagation();
        }

        var uiMgr = GameGlobal.UIManager;
        uiMgr.closeUI(UIType.UIType_GameEnd);
        var uiGame = uiMgr.getUI(UIType.UIType_Game);
        uiGame.resetGameEnd();
        uiGame.reliveResetGame();
    },

    // update (dt) {},
});
