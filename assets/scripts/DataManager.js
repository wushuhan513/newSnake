var UIType = require("UIType");

//数据管理器
var GameRewardType =
{
    RT_GOLD: 0,
    RT_DIAMOND: 1,
    RT_FLOWER: 2,
};


cc.Class({
    extends: cc.Component,

    properties: {
        //当前分数:
        CurScore:
        {
            default: 0,
            type: cc.Integer,
        },
        //当前金币数：
        CurGold:
        {
            default: 0,
            type: cc.Integer,
        },

        //当前钻石
        CurDiamond:
        {
            default: 0,
            type: cc.Integer,
        },

        //我的头像地址
        _MyAvatarURL: "",
        _MyNickName: "",
        _Province: 0,

        _AllLinks: [],
        //当前选择的游戏模式
        _CurSelectMode: 0,

        //-------------配置数据相关-----------------
        //复活花费金币
        _FuHuoCostGold: 0,

        //游戏开始时间
        _GameStartTime: 0,

        //当前主角使用的皮肤
        _SKinDataArray: [],
        _CurMySKinIndex: 0,
        _CurRecord: 0,
    },


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.log('DataManager onLoad----------------------------');
    },

    onEnable() {
    },
    //
    start() {
        cc.log("DataManager start");
        this._CurSelectMode = 0;
        var self = this;

    },


    //获取当前分数
    getCurScore() {
        return this.CurScore;
    },

    //设置当前分数
    setCurScore(curScore) {
        this.CurScore = curScore;
    },

    //--------------------货币begin-----------------------
    //获取当前金币
    getCurGold() {
        return this.CurGold;
    },

    //设置当前金币
    setCurGold(curGold) {
        if (curGold == undefined) {
            return;
        }
        this.CurGold = curGold;

    },


    //获取当前金币
    getCurFlower() {
        return this.CurFlower;
    },

    //设置当前金币
    setCurFlower(curFlower) {
        if (curFlower < 0) {
            curFlower = 0;
        }

        this.CurFlower = curFlower;

    },

    //设置钻石
    setDiamond(curDiamond) {
        if (curDiamond == undefined) {
            return;
        }

        if (curDiamond < 0) {
            curDiamond = 0;
        }

        this.CurDiamond = curDiamond;
    },
    //钻石
    getCurDiamond() {
        return this.CurDiamond;
    },

    //----------------------货币end-----------------------------------

    //获取复活花费金币数
    getFuHuoGold() {
        return this._FuHuoCostGold;
    },

    // update (dt) {},
});

window.GameRewardType = GameRewardType;
