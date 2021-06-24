var SnakeBody = require('SnakeBody');
var Food = require('Food');
var UIType = require('UIType');

cc.Class({
    extends: cc.Component,

    properties: {
        Atlas:
        {
            default: null,
            type: cc.SpriteAtlas,
        },
        //所属 Snake 索引
        _Snake: null,
        _Game: null,
    },

    onLoad() { },

    start() {
        this._Game = GameGlobal.Game;
    },

    //设置外型(1-20)
    setType(headType) {
        
        // if (headType < 1 || headType > 16) {
        //     headType = 1;
        // }
        // var sprite = this.node.getComponent(cc.Sprite);
        // var atlasName = 'biaoqing_' + headType;
        // var spriteFrame = this.Atlas.getSpriteFrame(atlasName);
        // if (spriteFrame) {
        //     sprite.spriteFrame = spriteFrame;
        // }
    },

    //设置Snake
    setSnake(snake) {
        this._Snake = snake;
    },

    //碰撞的回调
    onCollisionEnter(other, self) {
        if (this._Game == null) {
            return;
        }
        //头部
        if (self.tag == 0) {
            var groupName = other.node.group;
            //碰到了蛇身
            if (groupName == 'body') {
                //同一条蛇的，不做处理
                var snakeBody = other.node.getComponent(SnakeBody);
                if (this._Snake === snakeBody._Snake) {
                    return;
                }
                //一方无敌时(刚复活时)，不做处理
                if (this._Snake._State == 1 || snakeBody._Snake._State == 1) {
                    return;
                }

                //自己被杀
                if (this._Snake._PlayerSelf) {
                    if (this._Snake._State == 0) {
                        var eventObj = new cc.Event.EventCustom('meKill', true);

                        this.node.dispatchEvent(eventObj);
                    }
                }
                //其它玩家被杀
                else {
                    var eventObj = new cc.Event.EventCustom('otherKill', true);
                    eventObj.detail =
                    {
                        killed: snakeBody._Snake,
                        beKilled: this._Snake,
                    };
                    this.node.dispatchEvent(eventObj);
                }

            }
            //碰到了食物
            // else if (groupName == 'food') {
            //     //返回到池中
            //     other.node.stopAllActions();
            //     var isExist = this._Game.DelUseFood(other.node);
            //     if (isExist) {
            //         var addWeight = other.node.getComponent(Food).getAddWeight();
            //         this._Snake.addWeight(addWeight);
            //     }
            //     //生成新食物
            //     var uiGame = GameGlobal.UIManager.getUI(UIType.UIType_Game);
            //     if (uiGame) {
            //         uiGame.onSnakeHitFood(this._Snake);
            //         uiGame.checkAddFood();
            //     }
            // }
        }
        //头部警界盒
        else if (self.tag == 1000) {
            var groupName = other.node.group;
            //碰到了蛇身
            if (groupName == 'body') {
                //同一条蛇的，不做处理
                var snakeBody = other.node.getComponent(SnakeBody);
                if (this._Snake === snakeBody._Snake) {
                    return;
                }
                //
                if (this._Snake._PlayerSelf == false) {
                    var hitRate = Math.random() * 100;
                    if (hitRate > 99) {
                        return;
                    }
                    this._Snake.changeAI(6);
                }
            }
            //碰到了食物
            else if (groupName == 'food') {
                if (this._Snake._PlayerSelf == false) {
                    this._Snake.changeAI(7, other.node.position);
                }
            }
        }
    },

});
