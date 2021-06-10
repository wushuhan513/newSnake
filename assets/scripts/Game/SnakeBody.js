
cc.Class({
    extends: cc.Component,

    properties: {

        Atlas: cc.SpriteAtlas,

        //Use index
        _Snake: null,
        _lastMoveVec: cc.v2(1, 0),
        _moveVec: cc.v2(1, 0),
        _moveSpeed: 0,
        _IsFirstUpdate: true,
        _CurStartPos: cc.v2(0, 0),
        _CurMoveDistance: 0,
        _CurBodyIndex: -1,
        _MoveStartPos: cc.v2(0, 0),
        _lastPos: cc.v2(0, 0),

    },


    // onLoad () {},

    start() {
        this._IsFirstUpdate = true;
    },

    //设置外型
    setType(bodyType) {
        if (bodyType < 1 || bodyType > 16) {
            bodyType = 1;
        }
        var sprite = this.node.getComponent(cc.Sprite);
        var atlasName = 'body_' + bodyType;
        var spriteFrame = this.Atlas.getSpriteFrame(atlasName);
        if (spriteFrame) {
            sprite.spriteFrame = spriteFrame;
        }
    },

    //设置Snake
    setSnake(snake) {
        this._Snake = snake;
    },

    //设置初始化移动方向
    setInitMoveDir(moveVec) {
        this._lastMoveVec = moveVec;
        this._moveVec = moveVec;

    },
    //设置移动方向
    setMoveDir(moveDir) {
        //this._moveVec = moveDir;
    },

    //获取移动方向
    getMoveDir() {
        return this._moveVec;
    },
    //获取上一个移动方向
    getLastMoveDir() {
        return this._lastMoveVec;
    },
    //设置移动速度
    setMoveSpeed(speed) {
        this._moveSpeed = speed;
    },

    //设置索引
    setBodyIndex(index) {
        this._CurBodyIndex = index;
    },

    //重置所有,以回收
    reset() {
        this._IsFirstUpdate = true;
        this.node.width = 30;
        this.node.height = 30;
    },


    getBodyPrePos1(delta, snakeHead, bodyList, headMoveDir, isFirst, headPos) {
        //cc.log("pre body width ", this.node.width);
        if (this._CurBodyIndex == 0) {
            var interval = this.node.width / 3;
            return headPos.add(headMoveDir.mul(interval));
            //return headPos;
        } else {
            var lastBody = bodyList[this._CurBodyIndex - 1];
            if (lastBody == undefined) {
                cc.log('lastBody == undefined');
            }
            var interval = -this.node.width / 2;
            var lastSnakeBody = lastBody.getComponent('SnakeBody');
            // return  cc.pAdd(lastSnakeBody._lastPos, cc.p.mul(lastSnakeBody._lastMoveVec, interval));
            return lastSnakeBody._lastPos.add(lastSnakeBody._lastMoveVec.mul(interval));
        }
    },

    getBodyPrePos(delta, snakeHead, bodyList, headMoveDir, isFirst, headPos) {
        //cc.log("pre body width ", this.node.width);
        if (this._CurBodyIndex == 0) {
            var interval = this.node.width / 3;
            return headPos.add(headMoveDir.mul(interval));
            //return headPos;
        } else {
            var lastBody = bodyList[this._CurBodyIndex - 1];
            if (lastBody == undefined) {
                cc.log('lastBody == undefined');
            }
            var interval = -this.node.width / 2;
            var lastSnakeBody = lastBody.getComponent('SnakeBody');
            // return  cc.pAdd(lastSnakeBody._lastPos, cc.p.mul(lastSnakeBody._lastMoveVec, interval));
            return lastSnakeBody._lastPos.add(lastSnakeBody._lastMoveVec.mul(interval));
        }
    },

    getBodyPreDir(snakeHead, bodyList, headMoveDir, isFirst, headPos) {
        if (this._CurBodyIndex == 0) {
            return headMoveDir;
            //return headPos;
        } else {
            var lastBody = bodyList[this._CurBodyIndex - 1];
            if (lastBody == undefined) {
                cc.log('lastBody == undefined');
            }
            var interval = -this.node.width;
            var lastSnakeBody = lastBody.getComponent('SnakeBody');
            return lastSnakeBody._lastMoveVec;
        }
    },
    //更新身子位置
    updateBody(delta, snakeHead, bodyList, headMoveDir, headPos, needUpdate) {
        //cc.log("body speed",  this._moveSpeed, this._CurMoveDistance);
        //if(needUpdate || this._IsFirstUpdate)
        {
            this._lastMoveVec = this._moveVec;
            this._lastPos = this.node.position;

            var destPos = this.getBodyPrePos(delta, snakeHead, bodyList, headMoveDir, this._IsFirstUpdate, headPos);

            this._IsFirstUpdate = false;

            var subMove = destPos.sub(this.node.position);
            var moveLen = subMove.mag();
            if (moveLen < 1) {
                subMove = this._moveVec;
                moveLen = this.node.width / 2;
            }

            this._CurMoveDistance = moveLen;
            this._MoveStartPos = this._lastPos;
            this._moveVec = subMove.normalize();

        }

        var curDistance = cc.pDistance(this.node.position, this._MoveStartPos);
        if (curDistance > this._CurMoveDistance) {
            console.log("invalid distance------------------");
            //return;
        }

        this.node.position = this.node.position.add(this._moveVec.mul(this._moveSpeed * delta));
    }
});
