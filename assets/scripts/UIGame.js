
var Snake = require('Snake');
var Food = require('Food');
var GameJoystickClass = require('GameJoystick');
var UIType = require('UIType');
var SoundType = require('SoundType');

var snakeStartPos = [
    cc.v2(-1200, -1200), cc.v2(800, 800), cc.v2(-500, -800), cc.v2(500, 800),
    cc.v2(-800, 1200), cc.v2(800, -800), cc.v2(-500, 500), cc.v2(500, -500),
    cc.v2(-200, 400),
];

var GameState =
{
    GS_Invalid: 0,
    GS_Game: 2,
    GS_GameOver: 3,
    GS_GameEnd: 4,
};

var RankInfoUI = cc.Class({
    IndexLabel: null,
    NameLabel: null,
    LenLabel: null,
})
    ;

var UIGame = cc.Class({
    extends: cc.Component,

    properties: {

        NewerSprite:
        {
            default: null,
            type: cc.Sprite,
        },

        AllObjNode:
        {
            default: null,
            type: cc.Node,
        },
        NameBaseNode:
        {
            default: null,
            type: cc.Node,
        },
        FoodBaseNode:
        {
            default: null,
            type: cc.Node,
        },
        //摇杆
        GameJoystick:
        {
            default: null,
            type: GameJoystickClass,
        },
        //相机
        Camera:
        {
            default: null,
            type: cc.Camera,
        },
        BgSprite:
        {
            default: null,
            type: cc.Sprite,
        },
        SpeedBtn:
        {
            default: null,
            type: cc.Button,
        },

        TimerSprite:
        {
            default: null,
            type: cc.Node,
        },

        TimerLabel:
        {
            default: null,
            type: cc.Label,
        },
        KillLabel:
        {
            default: null,
            type: cc.Label,
        },
        KillNameLabel:
        {
            default: null,
            type: cc.Label,
        },
        BeKilledNameLabel:
        {
            default: null,
            type: cc.Label,
        },
        KillCountLabel:
        {
            default: null,
            type: cc.Label,
        },
        KillSprite:
        {
            default: null,
            type: cc.Sprite,
        },
        LenLabel:
        {
            default: null,
            type: cc.Label,
        },

        InfoPanel:
        {
            default: null,
            type: cc.Node,
        },

        _SnakeList: [],
        _MapSizeWidth: 0,
        _MapSizeHeight: 0,
        _Game: null,
        _GameState: 0,
        //加速是否开启
        _IsSpeedDown: false,
        _DataMgr: null,
        _CurTime: 120,

        _RankUpdateTimer: 0,
        _RankInfoList: [],
        _NameList: [],
        _BodyList: [],
        _HeadList: [],
        _KillShowTimer: 0,
        _SoundMgr: null,
        _IsFirstPause: false,

    },

    onLoad() {
        this._Game = GameGlobal.Game;
        this._DataMgr = GameGlobal.DataManager;

        this._MapSizeWidth = this.BgSprite.node.width;
        this._MapSizeHeight = this.BgSprite.node.height;

        //初始化排行榜显示

        // for (var i = 0; i < 10; ++i) {
        //     var rankUI = new RankInfoUI();

        //     var curChild = this.InfoPanel.children[i];
        //     rankUI.IndexLabel = curChild.getChildByName('indexLabel').getComponent(cc.Label);
        //     rankUI.NameLabel = curChild.getChildByName('nameLabel').getComponent(cc.Label);
        //     rankUI.LenLabel = curChild.getChildByName('lenLabel').getComponent(cc.Label);

        //     rankUI.IndexLabel.string = "";
        //     rankUI.NameLabel.string = "";
        //     rankUI.LenLabel.string = "";

        //     this._RankInfoList.push(rankUI);
        // }
    },

    onEnable() {
        this.NewerSprite.node.active = false;

        this._DataMgr._GameStartTime = new Date().getTime();

        this._DataMgr._CurShareReliveCount = 0;
        this._SoundMgr = GameGlobal.SoundManager;
        this._SoundMgr.stopAll();
        this._SoundMgr.playSound(SoundType.SoundType_GameBg);

        this.KillSprite.node.active = false;

        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        this._KillShowTimer = 0;

        this._CurTime = 120;

        if (this._DataMgr._CurSelectMode == 0) {
            this.TimerLabel.node.active = true;
            this.TimerSprite.active = true;
        }
        else {
            this.TimerLabel.node.active = false;
            this.TimerSprite.active = false;
        }


        this._NameList = [];
        GameGlobal.getRandomNameList(9, this._NameList);

        this._BodyList = [];
        this._HeadList = [];        //初始化所有蛇
        for (var i = 0; i < 10; ++i) {
            if (i == 0) {
                var newSnake = new Snake();
                var mySkin = GameGlobal.DataManager._CurMySKinIndex + 1;
                newSnake.init(mySkin, [mySkin, mySkin], this.AllObjNode, cc.v2(0, 0), this.Camera, true, this._MapSizeWidth, this._MapSizeHeight, i);//newSnake.init(4, [10, 20], this.AllObjNode, cc.v2(0, 0), this.Camera, true, this._MapSizeWidth, this._MapSizeHeight);
                newSnake.initMoveDir(cc.v2(1, 0));
                var myName = this._DataMgr._MyNickName;
                if (myName.length == 0) {
                    myName = 'Me';
                }
                newSnake.setName(myName, this.NameBaseNode);
                newSnake.setMoveSpeed(300);
                this._SnakeList.push(newSnake);
            }
            else {

                var newSnake = new Snake();

                //初始位置：
                var headType = Math.floor(Math.random() * 16) + 1; // var headType = Math.floor(Math.random() * 20) + 1;
                this._HeadList.push(headType);

                var bodyType1 = Math.floor(Math.random() * 16) + 1; //var bodyType1 = Math.floor(Math.random() * 40) + 1;
                // var bodyType2 = Math.floor(Math.random() * 40) + 1;
                // if(bodyType1 == bodyType2)
                // {
                //     bodyType2 = bodyType1 + 1;
                //     if(bodyType2 == 41)
                //     {
                //         bodyType2 = 1;     
                //     }
                // }

                //var bodyList =  [bodyType1, bodyType1];    
                var bodyList = [headType, headType];
                this._BodyList.push(bodyList);
                newSnake.init(headType, bodyList, this.AllObjNode, snakeStartPos[i - 1], this.Camera, false, this._MapSizeWidth, this._MapSizeHeight, i);
                var ranDir = cc.v2(1, 0);
                ranDir.rotateSelf(Math.random() * 3.14);
                newSnake.initMoveDir(ranDir);
                newSnake.setName(this._NameList[i - 1], this.NameBaseNode);
                newSnake.setMoveSpeed(300);
                this._SnakeList.push(newSnake);
            }

        }

        //初始化食物
        for (var i = 0; i < 80; ++i) {
            this.addFood();
        }

        this.setGameState(GameState.GS_Game);
    },

    onDisable() {
        var manager = cc.director.getCollisionManager();
        manager.enabled = false;

        //重置所有蛇
        for (var i = 0; i < 10; ++i) {
            this._SnakeList[i].deadReset();
        }
        this._SnakeList = [];
        //重置所有食物
        this._Game.DelAllFood();
    },


    onDestroy() {
        //重置所有蛇
        for (var i = 0; i < 10; ++i) {
            this._SnakeList[i].deadReset();
        }
        this._SnakeList = [];
        //重置所有食物
        this._Game.DelAllFood();
    },

    start() {
        this.FoodBaseNode.setSiblingIndex(-1000);
        this.NameBaseNode.setSiblingIndex(100);

        this.GameJoystick.setCallback(this, this.joyCallback);

        this.SpeedBtn.node.on(cc.Node.EventType.TOUCH_START, this.onSpeedBtnDown, this);
        this.SpeedBtn.node.on(cc.Node.EventType.TOUCH_END, this.onSpeedBtnUp, this);
        this.NewerSprite.node.on(cc.Node.EventType.TOUCH_END, this.onTouchNewer, this);
        //注册逻辑事件
        this.node.on('meKill', this.onSelfBeKilled, this);
        this.node.on('otherKill', this.onOtherBeKilled, this);
        this.node.on('meBound', this.onMeBound, this);
    },


    //添加食物
    addFood() {
        var x = ((Math.random() - 0.5) * 2) * (this._MapSizeWidth / 2 - 200);
        var y = ((Math.random() - 0.5) * 2) * (this._MapSizeHeight / 2 - 200);

        var food = this._Game.GetFreeFood();
        food.parent = this.FoodBaseNode;
        food.x = x;
        food.y = y;
        food.setSiblingIndex(-500);
        // this.Camera.addTarget(food);
        var foodIns = food.getComponent(Food);
        foodIns.setType(Math.floor(Math.random() * 5) + 1);

    },

    //检查并生成新食物
    checkAddFood() {
        var curFoodCount = this.FoodBaseNode.childrenCount;
        if (curFoodCount < 150) {
            this.addFood();
        }
    },

    //复活重置游戏
    reliveResetGame() {
        var selfSnake = this._SnakeList[0];
        if (selfSnake) {
            selfSnake.resetPos(cc.v2(0, 0));
            selfSnake.initMoveDir(cc.v2(1, 0));
            //无敌
            selfSnake.setState(1);
            selfSnake.changeSnakeSize();
        }
        this.setGameState(GameState.GS_Game);
    },

    //获取主角的击杀，长度
    getMySnakeLen() {
        var selfSnake = this._SnakeList[0];
        if (selfSnake) {
            return selfSnake.getSnakeLength();
        }
        return 0;
    },

    getMySnakeKill() {
        var selfSnake = this._SnakeList[0];
        if (selfSnake) {
            return selfSnake._KillCount;
        }
        return 0;
    },

    //重置游戏
    resetGameEnd() {

        this._CurTime = 120;

        //重置所有蛇
        for (var i = 0; i < 10; ++i) {
            this._SnakeList[i].deadReset();
        }
        this._SnakeList = [];
        //重置所有食物
        this._Game.DelAllFood();

        //
        //初始化所有蛇
        for (var i = 0; i < 10; ++i) {
            if (i == 0) {
                var newSnake = new Snake();
                var mySkin = GameGlobal.DataManager._CurMySKinIndex + 1;
                newSnake.init(mySkin, [mySkin, mySkin], this.AllObjNode, cc.v2(0, 0), this.Camera, true, this._MapSizeWidth, this._MapSizeHeight, i); //newSnake.init(4, [10, 20], this.AllObjNode, cc.v2(0, 0), this.Camera, true, this._MapSizeWidth, this._MapSizeHeight);
                var myName = this._DataMgr._MyNickName;
                if (myName.length == 0) {
                    myName = 'Me';
                }

                newSnake.initMoveDir(cc.v2(1, 0));
                newSnake.setName(myName, this.NameBaseNode);
                newSnake.setMoveSpeed(300);
                newSnake.changeSnakeSize();
                this._SnakeList.push(newSnake);
            }
            else {

                var newSnake = new Snake();

                //初始位置：
                newSnake.init(this._HeadList[i - 1], this._BodyList[i - 1], this.AllObjNode, snakeStartPos[i - 1], this.Camera, false, this._MapSizeWidth, this._MapSizeHeight, i);
                var ranDir = cc.v2(1, 0);
                ranDir.rotateSelf(Math.random() * 3.14);
                newSnake.initMoveDir(ranDir);
                newSnake.setName(this._NameList[i - 1], this.NameBaseNode);
                newSnake.setMoveSpeed(300);
                newSnake.changeSnakeSize();
                this._SnakeList.push(newSnake);
            }

        }

        //初始化食物
        for (var i = 0; i < 80; ++i) {
            this.addFood();
        }

        this.setGameState(GameState.GS_Game);

    },

    //重置游戏
    resetGame1() {
        this._SnakeList[0].deadReset();
        this._SnakeList[0] = null;

        var newSnake = new Snake();
        var mySkin = GameGlobal.DataManager._CurMySKinIndex + 1;
        newSnake.init(mySkin, [mySkin, mySkin], this.AllObjNode, cc.v2(0, 0), this.Camera, true, this._MapSizeWidth, this._MapSizeHeight, 0);
        var myName = this._DataMgr._MyNickName;
        if (myName.length == 0) {
            myName = 'Me';
        }

        newSnake.initMoveDir(cc.v2(1, 0));
        newSnake.setName(myName, this.NameBaseNode);
        newSnake.setMoveSpeed(300);
        newSnake.changeSnakeSize();

        this._SnakeList[0] = newSnake;
        //无敌
        newSnake.setState(1);
        this.setGameState(GameState.GS_Game);
    },


    //摇杆回调函数 
    joyCallback(offX, offY, delta, angle) {
        //操控对象
        if (this._SnakeList.length <= 0) {
            return;
        }
        var playerSnake = this._SnakeList[0];
        playerSnake.setMoveDir(offX, offY, delta, angle);
    },

    //开启加速
    onSpeedBtnDown(event) {
        event.stopPropagation();
        this._IsSpeedDown = true;
    },
    //关闭加速
    onSpeedBtnUp(event) {
        event.stopPropagation();
        this._IsSpeedDown = false;
    },

    //主角被杀
    onSelfBeKilled(event) {
        event.stopPropagation();

        this.setGameState(GameState.GS_GameOver);
    },

    //其它玩家被杀
    onOtherBeKilled(event) {
        event.stopPropagation();

        //cc.log('onOtherBeKilled -------', event);
        var killedSnake = event.detail.killed;
        var beKilledSnake = event.detail.beKilled;

        killedSnake.addKillCount();
        //广播消息
        if (killedSnake === this._SnakeList[0]) {
            this.updateSelfSnakeInfo();
        }

        //删除该条蛇
        if (beKilledSnake == null) {
            cc.log('onOtherBeKilled beSnake = null');
            return;
        }
        this.KillSprite.node.active = true;
        this.KillCountLabel.string = killedSnake._KillCount;
        this.KillNameLabel.string = killedSnake._PlayerName;
        this.BeKilledNameLabel.string = beKilledSnake._PlayerName;
        this._KillShowTimer = 1.5;
        //在死蛇原地生成食物
        beKilledSnake.deadFood(this.FoodBaseNode);
        //重置
        beKilledSnake.deadReset();
        //删除
        var index = this._SnakeList.indexOf(beKilledSnake);
        this._SnakeList.splice(index, 1);

        //蛇的重生
        this.onOtherRelive(beKilledSnake._HeadType, beKilledSnake._BodyTypeList, beKilledSnake._PlayerName);
    },

    //其它玩家重生
    onOtherRelive(headType, bodyTypeList, name) {
        var newSnake = new Snake();

        //初始位置：
        // var headType = Math.floor(Math.random() * 8) + 1;

        var posIndex = Math.floor(Math.random() * 9);
        newSnake.init(headType, bodyTypeList, this.AllObjNode, snakeStartPos[posIndex], this.Camera, false, this._MapSizeWidth, this._MapSizeHeight, this._SnakeList.length);
        var ranDir = cc.v2(1, 0);
        ranDir.rotateSelf(Math.random() * 3.14);
        newSnake.initMoveDir(ranDir);
        newSnake.setName(name, this.NameBaseNode);
        newSnake.setMoveSpeed(300);
        this._SnakeList.push(newSnake);

        //无敌
        newSnake.setState(1);
    },

    //主角超出边界
    onMeBound(event) {

        event.stopPropagation();

        this.setGameState(GameState.GS_GameOver);
    },

    //蛇碰到了食物的回调
    onSnakeHitFood(snake) {
        if (snake === this._SnakeList[0]) {
            this.updateSelfSnakeInfo();
        }
    },

    onTouchNewer(event) {
        event.stopPropagation();
        this.NewerSprite.node.active = false;
        this._IsFirstPause = false;
    },

    //设置游戏状态
    setGameState(state) {
        if (this._GameState == state)
            return;

        this._GameState = state;

        if (this._GameState == GameState.GS_Game) {
            this.updateSelfSnakeInfo();
        }
        else if (this._GameState == GameState.GS_GameOver) {
            var selfSnake = this._SnakeList[0];
            this._DataMgr.CurScore = selfSnake.getSnakeLength();
            var self = this;

            // GameGlobal.WeiXinPlatform.postScoreToPlatform(this._DataMgr.getCurScore(), this._DataMgr._GameStartTime);

            //写分数
            // GameGlobal.Net.requestScore(selfSnake.getSnakeLength());
            GameGlobal.UIManager.openUI(UIType.UIType_GameOver);
        }
        else if (this._GameState == GameState.GS_GameEnd) {
            var selfSnake = this._SnakeList[0];
            this._DataMgr.CurScore = selfSnake.getSnakeLength();
            var self = this;

            // GameGlobal.WeiXinPlatform.postScoreToPlatform(self._DataMgr.getCurScore(), this._DataMgr._GameStartTime);

            //写分数
            // GameGlobal.Net.requestScore(selfSnake.getSnakeLength());
            GameGlobal.UIManager.openUI(UIType.UIType_GameEnd);
            // GameGlobal.Net.requestScoreGold(selfSnake.getSnakeLength());
        }
    },

    updateSelfSnakeInfo() {
        var selfSnake = this._SnakeList[0];
        if (selfSnake) {
            this.KillLabel.string = selfSnake._KillCount;
            this.LenLabel.string = selfSnake.getSnakeLength();
            // this.resetGame1();
        }
    },

    onHideKillSprite() {
        this.KillSprite.node.active = false;
    },
    //帧更新
    update(dt) {

        //dt = 0.016;
        if (this._IsFirstPause) {
            return;
        }

        this._KillShowTimer -= dt;
        if (this._KillShowTimer < 0 && this.KillSprite.node.active) {
            this.onHideKillSprite();
        }

        if (this._GameState == GameState.GS_GameOver || this._GameState == GameState.GS_GameEnd) {
            return;
        }

        //所有蛇的更新
        var len = this._SnakeList.length;
        if (len <= 0) {
            return;
        }

        for (var i = 0; i < len; ++i) {
            this._SnakeList[i].update(dt);
        }
        //食物

        //摄像机节点的位置更新
        this.Camera.node.position = this._SnakeList[0]._SnakeHead.position;

        var mySnake = this._SnakeList[0];
        var speed = mySnake._MoveSpeed;
        //微信QQ
        if (this._IsSpeedDown) {
            speed += 350;
            if (speed > 700) {
                speed = 700;
            }
            mySnake.setMoveSpeed(speed);
        } else {
            speed -= 400 * dt;
            if (speed < 300) {
                speed = 300;
            }
            mySnake.setMoveSpeed(speed);
        }

        //更新时间
        if (this._DataMgr._CurSelectMode == 0) {
            this._CurTime -= dt;
            if (this._CurTime <= 0) {
                this._CurTime = 0;

                this.setGameState(GameState.GS_GameEnd);
            }

            var timeNum = Math.floor(this._CurTime);
            var showTxt = this.TimerLabel.string;

            var min = Math.floor(timeNum / 60);
            var second = Math.floor(timeNum % 60);
            var newText = min + ":" + (second > 9 ? second : "0" + second);
            if (newText != showTxt) {
                this.TimerLabel.string = newText;
            }
        }

        //更新右侧信息栏 
        this._RankUpdateTimer -= dt;
        if (this._RankUpdateTimer < 0) {
            this._RankUpdateTimer = 1.2;

            var sortSnakeList = [];
            sortSnakeList.push(this._SnakeList[0], this._SnakeList[1], this._SnakeList[2], this._SnakeList[3], this._SnakeList[4]);
            sortSnakeList.push(this._SnakeList[5], this._SnakeList[6], this._SnakeList[7], this._SnakeList[8], this._SnakeList[9]);
            sortSnakeList.sort(function (a, b) {
                if (a == undefined && b == undefined) {
                    return 0;
                }
                if (a == undefined) {
                    return -1;
                }
                if (b == undefined) {
                    return 1;
                }
                return (b.getSnakeLength() - a.getSnakeLength());
            }
            )
            // for (var i = 0; i < sortSnakeList.length; ++i) {
            //     var snake = sortSnakeList[i];
            //     var color = cc.Color.WHITE;
            //     if (snake == this._SnakeList[0]) {
            //         color = cc.Color.GREEN;
            //     }
            //     var infoList = this._RankInfoList[i];
            //     infoList.IndexLabel.string = (i + 1) + "";
            //     infoList.NameLabel.string = snake._PlayerName;
            //     infoList.LenLabel.string = snake.getSnakeLength();
            //     infoList.IndexLabel.node.color = color;
            //     infoList.NameLabel.node.color = color;
            //     infoList.LenLabel.node.color = color;
            // }

        }

    },


});

module.exports.UIGame = UIGame;