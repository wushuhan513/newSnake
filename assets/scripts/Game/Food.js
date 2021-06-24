var UIType = require('UIType');
cc.Class({
    extends: cc.Component,

    properties: {

        Atlas: {
            default: null,
            type: cc.SpriteAtlas,
        },

        specialType: {
            default: [],
            type: [cc.SpriteFrame]
        },

        _Type: 1,
        _Game: null,
        _foodLife: true,
        _foodStatus: false,
        _foodType: null,
        _score:0,
    },

    // onLoad () {},

    start() {

    },

    //
    setType(foodType, game) {
        this._Game = game;
        // this._Type = foodType;
        // this._foodLife = true;
        // var sprite = this.node.getComponent(cc.Sprite);
        // var atlasName = 'food_' + foodType;
        // var spriteFrame = this.Atlas.getSpriteFrame(atlasName);
        // if (spriteFrame) {
        //     sprite.spriteFrame = spriteFrame;
        // }
        if (this._Game) {
            this._foodStatus = true;
        }
        this._foodLife = true;
        this.node.getComponent(cc.Sprite).spriteFrame = this.specialType[foodType];
        this._foodType = "normal";
        if(foodType !=  4) {
            this.node.width = 20;
            this.node.height = 20;
        }
        this._score = foodType;
    },

    setSpecialType(game) {
        this._Game = game;
        this._foodLife = true;
        let type = Math.floor(Math.random() * 3);
        type = type > 2 ? 1 : type;
        let text;
        switch (type) {
            case 0:
                text = "magnet";
                break;
            case 1:
                text = "double";
                break;
            case 2:
                text = "accelerate";
                break;
        }

        this._foodType = "special";
        this._Type = text;
        this.node.getComponent(cc.Sprite).spriteFrame = this.specialType[type];
        this.moveFood();
        this._foodStatus = true;
    },

    moveFood() {
        let width = this._Game.node.getChildByName("map").width - 40;
        let height = this._Game.node.getChildByName("map").height - 40;
        let x, y;
        if (Math.random() > 0.5) {
            x = -this.node.x;
            y = Math.random() * height - height / 2;
        } else {
            x = Math.random() * width - width / 2;
            y = -this.node.y;
        }
        let time = Math.sqrt((this.node.x - x) * (this.node.x - x) + (this.node.y - y) * (this.node.y - y)) / 250;
        cc.tween(this.node)
            .to(time, {
                position: cc.v2(x, y)
            })
            .call(() => {
                this.moveFood();
            })
            .start()
    },

    //食物增加的重量,重量影响长度
    getAddWeight() {
        // return 3;
        return this._score * 0.5;
    },
    //
    update(dt) {
        //监听蛇头是否有磁铁效果
        if (this._foodStatus) {
            this.absorbFood();
        }
    },

    absorbFood() {
        var self = this;
        let snakeList = this._Game._SnakeList;
        snakeList.forEach((s, i) => {
            let head = s._SnakeHead;
            let times = 1;
            if (head.getChildByName("magnet").active == true) {
                times = 1.5;
            } else {
                times = 1;
            }
            let posH = head.getPosition();
            let x = posH.x - this.node.x;
            let y = posH.y - this.node.y;
            let distance = Math.sqrt(x * x + y * y);
            if (distance < times * (head.width + this.node.width) && this._foodLife == true) {
                this._foodLife = false;
                this.node.stopAllActions();
                cc.tween(this.node)
                    .to(0.15, {
                        position: cc.v2(posH.x, posH.y)
                    })
                    .call(() => {
                        if (self._foodType == "normal") {
                            self.putFood(head);
                        } else {
                            self.getSpecialFood(head);
                        }
                    })
                    .start()
            }
        })
    },
    putFood(head) {
        var isExist = GameGlobal.Game.DelUseFood(this.node);
        let snake = head.getComponent("SnakeHead")._Snake;
        if (isExist) {
            var addWeight = this.getAddWeight();
            snake.addWeight(addWeight,this._score);
        }
        //生成新食物
        var uiGame = GameGlobal.UIManager.getUI(UIType.UIType_Game);
        if (uiGame) {
            uiGame.onSnakeHitFood(snake);
            uiGame.checkAddFood();
        }
    },

    //加速效果
    getAccelerate(s) {
        if (s._double_speed_status == false) {
            s._double_speed_status = true;
            s.addSpeed(true);
        }
        s._speed_interval = 10;
    },
    //双倍积分
    getDouble(s) {
        if (s._double_score_status == false) {
            s._double_score_status = true;
            s._score_times = 2;
        }
        s._double_interval = 10;
    },
    //磁铁效果
    getmagnet(head, s) {
        if (s._magnet_status == false) {
            s._magnet_status = true;
            head.getChildByName("magnet").active = true;
        }
        s._magnet_interval = 10;
    },
    getSpecialFood(head) {
        GameGlobal.Game.DelUseFood(this.node);
        let snake = head.getComponent("SnakeHead")._Snake;
        var uiGame = GameGlobal.UIManager.getUI(UIType.UIType_Game);
        GameGlobal.VoiceManager.playEffect("吃道具音效",snake);
        switch (this._Type) {
            case "magnet":
                this.getmagnet(head, snake);
                break;
            case "double":
                this.getDouble(snake);
                break;
            case "accelerate":
                this.getAccelerate(snake);
                break;
        }
        //生成新食物
        if (uiGame) {
            uiGame.onSnakeHitFood(snake);
            uiGame.checkAddSpecailFood();
        }
    }
});