//UI管理类(处理打开与关闭， TODO: 管理UI层级, UI的打开方式)

var UIType = require("UIType");

cc.Class({
    extends: cc.Component,

    properties: {
        UIList: {
            default: [],
            type: [cc.Node],
        },

        //通用遮罩
        BgMaskSprite: {
            default: null,
            type: cc.Sprite,
        },
    },

    // onLoad () {},

    onEnable() {
        this.BgMaskSprite.node.active = false;
    },

    start() {

    },

    //获取UI对应的脚本
    getUIScriptName(uiType) {
        var scriptList = ['UIHall', 'UIGame', 'UIGameOver', 'UILoading', 'UIGameEnd', 'UIShare', 'UIMessageTip',
            'UIKeFu', 'UIInviteFriend', 'UIQianDao', 'UISkin', 'UISetting', 'UIZSAd'
        ];
        return scriptList[uiType];
    },

    //是否二级弹窗UI
    isPopUI(uiType) {
        if (uiType == UIType.UIType_HallInvite ||
            uiType == UIType.UIType_KeFu ||
            uiType == UIType.UIType_InviteFriend ||
            uiType == UIType.UIType_QianDao ||
            uiType == UIType.UIType_Setting ||
            uiType == UIType.UIType_RankQQ ||
            uiType == UIType.UIType_GameOver ||
            uiType == UIType.UIType_GameEnd
        ) {
            return true;
        }
        return false;
    },
    //
    showMask(isShow) {
        this.BgMaskSprite.node.active = isShow;
    },
    //打开UI
    openUI(uiType) {
        if (uiType >= this.UIList.length) {
            cc.log("openUI invalid uiType, please check UIList");
            return;
        }

        if (this.UIList[uiType] == null || this.UIList[uiType] == undefined) {
            cc.log("openUI invalid uiType, object null");
            return;
        }

        this.UIList[uiType].active = true;

        //二级弹窗UI，显示遮罩
        if (this.isPopUI(uiType)) {
            this.BgMaskSprite.node.active = true;

            var actNode = this.UIList[uiType];
            actNode.scale = 0;
            cc.tween(actNode)
                .to(0.1, {
                    scale: 1,
                })
                .start()
            // actNode.runAction(cc.scaleTo(0.1, 1).easing(cc.easeSineIn()))
        }

        // if (this.isPopUI(uiType) || uiType == UIType.UIType_Skin) {
        //     //关闭大厅广告的处理
        //     var uihall = this.getUI(UIType.UIType_Hall);
        //     if (uihall != null && uihall.node.active) {
        //         uihall.pauseAdShow();
        //     }
        // }


    },

    //关闭UI
    closeUI(uiType) {
        if (uiType >= this.UIList.length) {
            cc.log("closeUI invalid uiType, please check UIList");
            return;
        }

        //二级弹窗UI，关闭遮罩
        if (this.isPopUI(uiType)) {
            this.BgMaskSprite.node.active = false;
            this.UIList[uiType].active = false;
        } else {
            this.UIList[uiType].active = false;
        }
    },

    //关闭UI
    onCloseUI(node, uiType) {
        this.UIList[uiType].active = false;
    },

    //获取某个UI 
    getUI(uiType) {
        if (uiType >= this.UIList.length) {
            cc.log("closeUI invalid uiType, please check UIList");
            return;
        }
        return this.UIList[uiType].getComponent(this.getUIScriptName(uiType));
    },

    //显示某个消息
    showMessage(msg) {
        var uiMessageTip = this.getUI(UIType.UIType_ShowMessage);
        if (uiMessageTip) {
            uiMessageTip.showMessage(msg);
        }
    },

    //刷新货币
    RefreshCoin() {
        var hallUI = this.getUI(UIType.UIType_Hall)
        hallUI.updateGoldNum()
        hallUI.updateDiamondNum()

    },
    // update (dt) {},
});