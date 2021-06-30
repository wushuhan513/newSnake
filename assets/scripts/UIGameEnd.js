var UIType = require('UIType');

cc.Class({
    extends: cc.Component,

    properties:
    {
        //再来一局
        AgainBtn:
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
        // //积分label
        // ScoreLabel:
        // {
        //     default: null,
        //     type: cc.Label,
        // },

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
        // this.ScoreLabel.string = "" + uiGame.getMySnakeScore();
    },

    onDisable() {
    },

    start() {
        this.AgainBtn.node.on(cc.Node.EventType.TOUCH_END, this.onAgain, this);
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
