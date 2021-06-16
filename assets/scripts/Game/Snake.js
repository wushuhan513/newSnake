const {
    log
} = require('console');
var SnakeBody = require('SnakeBody');
var SnakeHead = require('SnakeHead');

var UIType = require('UIType');

cc.Class({
    //蛇头
    properties: {
        _VoiceMgr:null,
        _SnakeIndex: 0,
        _HeadType: -1,
        _BodyTypeList: [],
        _SnakeHead: cc.Node,
        _HeadBodyList: [cc.Node],
        _Game: null,
        _LastMoveVec: cc.v2(1, 0),
        _MoveVec: cc.v2(1, 0),
        _MoveSpeed: 0,
        _BodyWidth: 0,
        //增加的重量
        _GrowingWeight: 0,
        _Camera: null,
        _PlayerSelf: false,
        _PlayerName: "",
        _MapWidth: 0,
        _MapHeight: 0,
        // _BodyTypeList: [],
        //击杀
        _KillCount: 0,
        //更新时间
        _PosUpdateTime: 0,
        _HeadPrePositon: cc.v2(1, 0),
        //AI 类型
        _CurAIType: 1,
        _CurAITimer: 2,
        _CurAIMoveCount: 0,
        _CurTargetDestDir: cc.v2(1, 0),
        _CurTargetChangeDir: cc.v2(0, 0),
        _CurAITurnSpeed: 3.14,
        _State: 0,
        _StateTimer: 3,

        _AttachLabel: null,

        //大厅展示用
        _CurShowMoveDistance: 0,
        _CurShowMoveStartPos: cc.v2(0, 0),
        _ShowMovePosList: [],
        _CurMoveIndex: 0,
        //躲避概率

        //蛇移动路径列表
        _MovePath: [],
        _BodySpace: 30,
        //保护罩
        _GodSprite: null,
        _light_status: false,
        _light_time: 0,
        _doubleSpeed: 200,
        _magnet_status: false,
        _magnet_interval: 0,
        _double_speed_status: false,
        _double_score_status: false,
        _score: 0,
        _score_times: 1,
    },

    init(headType, bodyTypeList, parent, bornPos, camera, isSelf, mapWidth, mapHeight, index) {
        this._VoiceMgr = GameGlobal.VoiceManager;
        this._SnakeIndex = index;
        this._State = 0;
        this._KillCount = 0;
        this._Game = GameGlobal.Game;
        this._Camera = camera;
        this._PlayerSelf = isSelf;
        this._light_status = false;
        this._doubleSpeed = 200;
        this._magnet_status = false;
        this._double_score_status = false;
        this._double_score_status = false;
        this._MapWidth = mapWidth;
        this._MapHeight = mapHeight;

        //初始化所有头部样式
        this._HeadType = headType;
        //初始化所有身体样式
        this._BodyTypeList = bodyTypeList;

        //蛇头
        this._SnakeHead = this._Game.GetFreeHead();
        this._SnakeHead.parent = parent;
        this._SnakeHead.position = bornPos;
        this._SnakeHead.setSiblingIndex(1);
        var snakeHead = this._SnakeHead.getComponent(SnakeHead);
        snakeHead.setSnake(this);
        snakeHead.setType(headType);
        if (camera) {
            // camera.addTarget(this._SnakeHead)
            // cullingMask
        }
        this._CurTargetChangeDir = cc.v2(0.996, 0.0871);
        //初始化蛇身
        for (var i = 0; i < 5; ++i) {
            var body = this._Game.GetFreeBody();
            if (body) {
                this._HeadBodyList.push(body);
                body.parent = parent;
                var snakeBody = body.getComponent(SnakeBody);
                snakeBody.setSnake(this);
                snakeBody.setBodyIndex(i);
                body.zIndex = -i - 1;
                // if (camera) {
                //     camera.addTarget(body);
                // }
                var typeIndex = (Math.floor(i / 3)) % 2;
                snakeBody.setType(bodyTypeList[typeIndex]);

                this._BodyWidth = body.width;
            }
        }
        if (index < 10) {
            this._GodSprite = GameGlobal.Game.GetFreeGodSprite();
            this._GodSprite.parent = parent;
            this._GodSprite.active = false;
            // camera.addTarget(this._GodSprite)
        }
    },

    setName(name, parentNode) {
        this._PlayerName = name;
        this._AttachLabel = this._Game.GetFreeNameLabel();
        this._AttachLabel.getComponent(cc.Label).string = name;
        this._AttachLabel.parent = parentNode;
        this._AttachLabel.position = this._SnakeHead.position;
        // if (this._Camera) {
        //     this._Camera.addTarget(this._AttachLabel);
        // }

    },

    addKillCount() {
        this._KillCount += 1;
    },

    //获取展示分数: 
    getSnakeLength() {
        var len = this._HeadBodyList.length;
        //return  len * 5;
        return 5 * len + (len - 5) * (len - 5) * 5;
    },

    //死亡生成食物
    deadFood(Game) {
        let parentNode = Game.FoodBaseNode;
        var len = this._HeadBodyList.length;
        for (var i = 0; i < len; ++i) {
            //if(i % 2 == 0)
            {
                var food = this._Game.GetFreeFood();
                food.parent = parentNode;
                food.x = this._HeadBodyList[i].position.x;
                food.y = this._HeadBodyList[i].position.y;
                food.getComponent("Food").setType(4, Game);
                //food.setLocalZOrder(-500);
                // this._Camera.addTarget(food);
            }
        }
    },

    initStatus() {
        this._light_status = false;
        this._light_time = 0;
        this._doubleSpeed = 0;
        this._magnet_status = false;
        this._magnet_interval = 0;
        this._double_speed_status = false;
        this._double_score_status = false;
        this._score = 0;
        this._score_times = 1;
    },

    //0:普通状态 1:无敌状态 (死亡刚复活时，给予2秒的无敌，不参与碰撞检测)
    setState(state) {
        this._State = state;

        this.initStatus();
        if (state == 1) {
            this._StateTimer = 3;
            // this._GodSprite.active = true;
            this.updateGodSpritePos();

            //console.log("first ", this._GodSprite.width, this._SnakeIndex);
        } else {
            this._GodSprite.active = false;
        }
    },
    //死亡重置
    deadReset() {
        //将头与身体返回到对象池中,并重置数据
        this._Game.DelUseHead(this._SnakeHead);
        this._Game.DelGodSprite(this._GodSprite);
        //TODO:待优化
        var len = this._HeadBodyList.length;
        for (var i = 0; i < len; ++i) {

            this._Game.DelUseBody(this._HeadBodyList[i]);
        }

        this._HeadBodyList.splice(0, len);
        this._SnakeHead = null;

        this._Game.DelUseNameLabel(this._AttachLabel);
    },
    //
    resetPos(bornPos) {
        this._SnakeHead.position = bornPos;
    },
    initMoveDir(moveDir) {
        moveDir.normalizeSelf();

        var len = this._HeadBodyList.length;
        var body;
        var snakeBody;
        for (var i = 0; i < len; ++i) {
            body = this._HeadBodyList[i];
            var bodyWidth = body.getContentSize().width;
            //cc.log('bodyWidth ', bodyWidth);
            snakeBody = body.getComponent(SnakeBody);
            snakeBody.setInitMoveDir(moveDir);
            if (i == 0) {
                var interval = bodyWidth / 3; //this._SnakeHead.width / 2 + body.width / 2;
                // body.position = cc.pAdd(this._SnakeHead.position, cc.p.mul(moveDir, interval)); //this._SnakeHead.position; 
            } else {
                var interval = -bodyWidth;
                //body.position =  cc.pAdd(this._HeadBodyList[i - 1].position, cc.p.mul(moveDir, interval));   
            }
        }
        this._LastMoveVec = moveDir;
        this._MoveVec = moveDir;
        //头的方向
        var curAngle = Math.atan2(moveDir.y, moveDir.x) * (180 / Math.PI);
        this._SnakeHead.angle = curAngle - 90;

        var startPos = this._SnakeHead.position;
        //初始化path
        this._MovePath = [];
        for (let i = 0; i < len * this._BodySpace; ++i) {
            // this._MovePath.push(cc.pAdd(startPos, cc.p.mul(moveDir, -(i + 1) + 15)));
            this._MovePath.push(startPos.add(moveDir.mul(-(i + 1) + 15)));
        }
    },
    //用于展示用
    initMoveDest(posList) {
        this._CurMoveIndex = 0;
        this._CurShowMoveStartPos = this._SnakeHead.position

        var moveDir = posList[0].sub(this._CurShowMoveStartPos);
        this._CurShowMoveDistance = moveDir.mag();
        this.initMoveDir(moveDir);
        this._ShowMovePosList = posList;
        this._CurMoveIndex += 1;
    },

    hideMagnet() {
        this.node.getChildByName("magnet").active = false;
    },

    //设置移动速度
    setMoveSpeed(speed) {
        var newSpeed = Math.floor(speed);
        if (newSpeed == this._MoveSpeed) {
            return;
        }
        this._PosUpdateTime = 0;

        this._MoveSpeed = newSpeed;

        var bodyLen = this._HeadBodyList.length;
        for (var i = 0; i < bodyLen; ++i) {
            this._HeadBodyList[i].getComponent(SnakeBody).setMoveSpeed(newSpeed);
        }
    },

    addSpeed(type) {
        if (type == true) {
            this.setMoveSpeed(this._MoveSpeed + this._doubleSpeed);
        } else {
            this.setMoveSpeed(this._MoveSpeed - this._doubleSpeed);
        }
    },

    //主角的 移动方向 angle:角度 由操作驱动
    setMoveDir(offX, offY, delta, angle) {
        if (offX == 0 && offY == 0) {
            return;
        }

        this._MoveVec.x = offX;
        this._MoveVec.y = offY;

        this._SnakeHead.angle = angle - 90;
        //cc.log("setMoveDirangle", angle);
    },

    //其它玩家的
    setOtherMoveDir(x, y) {
        if (x == 0 && y == 0) {
            x = 1;
        }

        this._MoveVec.x = x;
        this._MoveVec.y = y;

        this._MoveVec.normalizeSelf();
        //头的方向
        var curAngle = Math.atan2(y, x) * (180 / Math.PI);
        this._SnakeHead.angle = curAngle - 90;
    },

    //增加重量
    addWeight(weight, score) {
        this._GrowingWeight += weight * this._score_times;

        //增加body的判定
        var addCount = this._GrowingWeight / 20;
        if (addCount > 1) {
            addCount = Math.floor(addCount);

            this._GrowingWeight = this._GrowingWeight % 20;

            //向尾部追加 body
            for (var i = 0; i < addCount; ++i) {
                var body = this._Game.GetFreeBody();
                if (body) {
                    // console.log("------add body------");
                    var len = this._HeadBodyList.length;
                    body.parent = this._SnakeHead.parent;
                    var snakeBody = body.getComponent(SnakeBody);
                    snakeBody.reset();
                    snakeBody.setSnake(this)
                    snakeBody.setBodyIndex(len);
                    snakeBody.setMoveSpeed(this._MoveSpeed);
                    body.zIndex = -len - 1;

                    // this._Camera.addTarget(body);

                    var typeIndex = Math.floor(len / 3) % 2;
                    //设置增加的身体外形
                    snakeBody.setType(this._BodyTypeList[typeIndex]);
                    // console.log(this._BodyTypeList[typeIndex]);

                    //位置
                    var preBody = this._HeadBodyList[len - 1];
                    var prepreBody = this._HeadBodyList[len - 2];
                    var moveDir = preBody.position.sub(prepreBody.position);
                    if (preBody && prepreBody) {
                        body.position = preBody.position.add(moveDir);
                    }
                    this._HeadBodyList.push(body);
                    //path
                    for (let i = 0; i < this._BodySpace; ++i) {
                        this._MovePath.push(preBody.position.add(moveDir.normalize().mul((i + 1))));
                    }
                }
            }
            this.changeSnakeSize();
        }
        this._score += score * this._score_times;
        var uiGame = GameGlobal.UIManager.getUI(UIType.UIType_Game);
        uiGame.updateMainRank();
        this._VoiceMgr.playEffect("吃中金币",this);
    },

    //更新蛇的粗细
    changeSnakeSize() {
        return;
        var snakeLen = this._HeadBodyList.length;

        var scaleFactor = 1;
        if (snakeLen > 5) {
            scaleFactor = 1 + snakeLen / 100;
        }

        if (scaleFactor > 2.5) {
            scaleFactor = 2.5;
        }

        var newSize = Math.floor(55 * scaleFactor);
        if (newSize == this._SnakeHead.width) {
            return;
        }

        this._SnakeHead.width = newSize;
        this._SnakeHead.height = newSize;
        var hCollider = this._SnakeHead.getComponent(cc.CircleCollider);
        if (hCollider) {
            hCollider.radius = newSize / 2;
        }

        var bodySize = Math.floor(30 * scaleFactor);

        for (var i = 0; i < snakeLen; ++i) {
            var body = this._HeadBodyList[i].getComponent(SnakeBody);

            body.node.width = bodySize;
            body.node.height = bodySize;
            var collider = body.getComponent(cc.CircleCollider);
            if (collider) {
                collider.radius = bodySize / 2;
            }
        }
    },

    aiUpdate(delta) {
        this._CurAITimer -= delta;
        //随机方向移动一定时间
        if (this._CurAIType == 0) {
            if (this._CurAITimer < 0) {
                var aiType = Math.floor(Math.random() * 3);
                this.changeAI(aiType);
            }
        }
        //circle
        else if (this._CurAIType == 1) {
            this._MoveVec.rotateSelf(this._CurAITurnSpeed * delta);
            this.setOtherMoveDir(this._MoveVec.x, this._MoveVec.y);

            if (this._CurAITimer < 0) {
                var aiType = Math.floor(Math.random() * 3);
                this.changeAI(aiType);
            }
        } else if (this._CurAIType == 2) {
            this._MoveVec.rotateSelf(this._CurAITurnSpeed * delta);
            this.setOtherMoveDir(this._MoveVec.x, this._MoveVec.y);

            if (this._CurAITimer < 0) {
                var aiType = Math.floor(Math.random() * 3);
                this.changeAI(aiType);
            }
        }
        //朝目标反方向
        else if (this._CurAIType == 6) {
            var addDir = this._CurTargetChangeDir.mul(50 * delta);
            var destDir = addDir.add(this._MoveVec);
            this.setOtherMoveDir(destDir.x, destDir.y);
            if (this._CurAITimer < 0) {
                var aiType = Math.floor(Math.random() * 3);
                this.changeAI(aiType);
            }
        }
        //转向食物
        else if (this._CurAIType == 7) {
            // var addDir = cc.p.mul(this._CurTargetChangeDir, 50 * delta);
            // var destDir = cc.pAdd(addDir, this._MoveVec);
            // var offVec = cc.v2();
            // this._CurTargetDestDir.sub(this._MoveVec, offVec);
            // if(offVec.magSqr() > 2500)
            // {
            //     this.setOtherMoveDir(destDir.x, destDir.y);  
            // }

            // if(this._CurAITimer < 0)
            // {
            //     var aiType = Math.floor(Math.random() * 2);
            //     this.changeAI(aiType);       
            // }       
            if (this._CurAITimer < 0) {
                var aiType = Math.floor(Math.random() * 3);
                this.changeAI(aiType);
            }

        }
        //边界
        else if (this._CurAIType == 10) {
            var addDir = this._CurTargetChangeDir.mul(300 * delta);
            var destDir = addDir.add(this._MoveVec);
            this.setOtherMoveDir(destDir.x, destDir.y);

            if (this._CurAITimer < 0) {
                var aiType = Math.floor(Math.random() * 3);
                this.changeAI(aiType);
            }
        }
    },
    //
    changeAI(aiType, destDir) {
        if (this._CurAIType === aiType && (aiType == 6 || aiType == 7)) {
            return;
        }


        this._CurAIType = aiType;

        //随机
        if (this._CurAIType == 0) {
            this._CurAITimer = 2.5 + Math.random() * 2;
        }
        //O
        else if (this._CurAIType == 1) {
            this._CurAITimer = 3 + Math.random() * 2;
            this._CurAITurnSpeed = 1 + Math.random() * 1.14;
        }
        //
        else if (this._CurAIType == 2) {
            this._CurAITimer = 0.5 + Math.random() * 1;

            this._CurAITurnSpeed = 2 + Math.random() * 1.14;

        }
        //躲避目标
        else if (this._CurAIType == 6) {
            this._CurAITimer = 2.5 + Math.random() * 1;
            if (Math.abs(this._MoveVec.y) >= Math.abs(this._MoveVec.x)) {
                this._CurTargetDestDir = cc.v2(-this._MoveVec.x, this._MoveVec.y);
            } else {
                this._CurTargetDestDir = cc.v2(this._MoveVec.x, -this._MoveVec.y);
            }
            this._CurTargetChangeDir = this.FixDir(this._CurTargetDestDir.sub(this._MoveVec)).normalize();

        }
        //寻找食物
        else if (this._CurAIType == 7) {
            this._CurAITimer = 3 + Math.random() * 2;
            var dir = destDir.sub(this._SnakeHead.position);
            this.setOtherMoveDir(dir.x, dir.y);

        }
        //边界折回
        else if (this._CurAIType == 10) {
            this._CurAITimer = 3 + Math.random() * 2;

            this._CurTargetDestDir = destDir;

            this._CurTargetChangeDir = this.FixDir(this._CurTargetDestDir.sub(this._MoveVec)).normalize();
            this._CurAITimer = 3 + Math.random() * 2;
        }

    },

    showSnakeLight(type) {
        this._light_time = 0;
        this._light_status = type;
        if (type == false) {
            this._HeadBodyList.forEach((s) => {
                s.getChildByName("light").active = false;
            })
        }
    },

    lightShow(dt) {
        let body_list = this._HeadBodyList;
        let count = Math.ceil(body_list.length / 10);
        if (this._light_time < 10) {
            this._light_time += dt * 20;
        } else {
            this._light_time = 0;
        }
        for (let i = 0; i < body_list.length; i++) {
            body_list[i].getChildByName("light").active = false;
            for (let o = 0; o < count; o++) {
                if (body_list[o * 10 + Math.floor(this._light_time)]) {
                    body_list[o * 10 + Math.floor(this._light_time)].getChildByName("light").active = true;
                }
            }
        }
    },

    showSpecialState(delta) {
        //计算双份积分时长
        if (this._double_score_status == true) {
            if (this._double_interval > 0) {
                this._double_interval -= delta;
            } else {
                this._double_score_status = false;
                this._score_times = 1;
            }
        }
        //计算磁铁时间时长
        if (this._magnet_status == true) {
            if (this._magnet_interval > 0) {
                this._magnet_interval -= delta;
            } else {
                this._SnakeHead.getChildByName("magnet").active = false;
                this._magnet_status = false;
            }
        }
        if (this._double_speed_status == true) {
            //计算加速时间时长
            if (this._speed_interval > 0) {
                this._speed_interval -= delta;
            } else {
                this.addSpeed(false);
                this._double_speed_status = false;
            }
        }
        if (this._light_status == true) {
            this.lightShow(delta);
        }
    },

    FixDir(dir) {
        if (dir.x == 0 && dir.y == 0) {
            dir.x = 0.001;
        }
        return dir;
    },

    //帧更新
    update1(delta) {
        if (delta == 0) {
            delta = 0.017;
        }

        if (this._SnakeHead == null) {
            return false;
        }

        //状态重置
        this._StateTimer -= delta;
        if (this._State == 1) {
            if (this._StateTimer < 0) {
                this._StateTimer = 0;

                this._State = 0;
            }
        }

        //边界位置判定
        if (this._PlayerSelf) {
            if (Math.abs(this._SnakeHead.x) > this._MapWidth / 2 || Math.abs(this._SnakeHead.y) > this._MapHeight / 2) {
                var eventObj = new cc.Event.EventCustom('meBound', true);
                this._SnakeHead.dispatchEvent(eventObj);
                return false;
            }
        } else {
            //其它玩家
            if (Math.abs(this._SnakeHead.x) > this._MapWidth / 2 - 200) {
                if (Math.abs(this._SnakeHead.y) > this._MapHeight / 2 - 200) {
                    this.changeAI(10, cc.v2(-this._MoveVec.x, -this._MoveVec.y));
                } else {
                    this.changeAI(10, cc.v2(-this._MoveVec.x, this._MoveVec.y));
                }

            } else if (Math.abs(this._SnakeHead.y) > this._MapHeight / 2 - 200) {
                this.changeAI(10, cc.v2(this._MoveVec.x, -this._MoveVec.y));
            }

            this.aiUpdate(delta);
        }

        this._PosUpdateTime -= delta;

        var needUpdateBody = false;

        if (this._PosUpdateTime <= 0) {
            // this._PosUpdateTime = 0.1;
            //记录上次位置
            this._LastMoveVec = this._MoveVec;
            this._HeadPrePositon = this._SnakeHead.position;

            needUpdateBody = true;
        }

        //更新头位置
        var moveVec = this._MoveVec.mul(this._MoveSpeed * delta);

        this._SnakeHead.position = this._SnakeHead.position.addSelf(moveVec); // cc.pAdd(this._SnakeHead.position, moveVec);
        this._AttachLabel.x = this._SnakeHead.x /* * (moveVec.x >= 0 ? -1 : 1)*/ ;
        this._AttachLabel.y = this._SnakeHead.y + 80 /** (moveVec.y >= 0 ? -1 : 1) */ ;

        //更新身体位置
        var bodyLen = this._HeadBodyList.length;
        for (var i = 0; i < bodyLen; ++i) {
            var snakeBody = this._HeadBodyList[i].getComponent(SnakeBody);
            snakeBody.updateBody(delta, this._SnakeHead, this._HeadBodyList, this._LastMoveVec, this._SnakeHead.position /*this._HeadPrePositon*/ , needUpdateBody);
        }

        return true;
    },

    updateGodSpritePos() {
        var minX = this._SnakeHead.x;
        var minY = this._SnakeHead.y;
        var maxX = this._SnakeHead.x;
        var maxY = this._SnakeHead.y;

        var bodyLen = this._HeadBodyList.length;
        for (let i = 0; i < bodyLen; ++i) {
            var curBody = this._HeadBodyList[i];
            if (curBody.x < minX) {
                minX = curBody.x;
            }
            if (curBody.y < minY) {
                minY = curBody.y;
            }
            if (curBody.x > maxX) {
                maxX = curBody.x;
            }
            if (curBody.y > maxY) {
                maxY = curBody.y;
            }
        }
        //更新
        this._GodSprite.x = (maxX - minX) / 2 + minX;
        this._GodSprite.y = (maxY - minY) / 2 + minY;

        var width = Math.abs(maxX - minX);
        var height = Math.abs(maxY - minY);
        var radius = Math.max(width, height) + 100;
        this._GodSprite.width = radius;
        this._GodSprite.height = radius;
    },


    //新的更新
    update(delta) {
        if (delta == 0) {
            delta = 0.017;
        }

        if (this._SnakeHead == null) {
            return false;
        }

        //边界位置判定
        if (this._PlayerSelf) {
            if (Math.abs(this._SnakeHead.x) > this._MapWidth / 2 || Math.abs(this._SnakeHead.y) > this._MapHeight / 2) {
                var eventObj = new cc.Event.EventCustom('meBound', true);
                this._SnakeHead.dispatchEvent(eventObj);
                return false;
            }
        } else {
            //其它玩家
            // if(Math.abs(this._SnakeHead.x) > this._MapWidth / 2 - 200)
            // {
            //     if(Math.abs(this._SnakeHead.y) > this._MapHeight / 2 - 200)
            //     {
            //         this.changeAI(10, cc.v2(-this._MoveVec.x, -this._MoveVec.y));    
            //     }else
            //     {
            //         this.changeAI(10, cc.v2(-this._MoveVec.x, this._MoveVec.y));
            //     }

            // } else if(Math.abs(this._SnakeHead.y) > this._MapHeight / 2 - 200)
            // {
            //     this.changeAI(10, cc.v2(this._MoveVec.x, -this._MoveVec.y));    
            // }

            if (Math.abs(this._SnakeHead.x) > this._MapWidth / 2 - 200 || Math.abs(this._SnakeHead.y) > this._MapHeight / 2 - 200) {
                if (this._SnakeHead.x > this._MapWidth / 2 - 200) {
                    this._SnakeHead.x = this._MapWidth / 2 - 200 - 10;
                } else if (this._SnakeHead.x < -(this._MapWidth / 2 - 200)) {
                    this._SnakeHead.x = -(this._MapWidth / 2 - 200) + 10;
                }

                if (this._SnakeHead.y > this._MapHeight / 2 - 200) {
                    this._SnakeHead.y = this._MapHeight / 2 - 200 - 10;
                } else if (this._SnakeHead.y < -(this._MapHeight / 2 - 200)) {
                    this._SnakeHead.y = -(this._MapHeight / 2 - 200) + 10;
                }
                this.changeAI(10, cc.v2(-this._MoveVec.x, -this._MoveVec.y));
            }

            this.aiUpdate(delta);
        }

        this._PosUpdateTime -= delta;

        var needUpdateBody = false;


        // if(this._PosUpdateTime <= 0)
        // {
        // this._PosUpdateTime = 0.1;
        //记录上次位置
        this._LastMoveVec = this._MoveVec;
        this._HeadPrePositon = this._SnakeHead.position;

        needUpdateBody = true;
        // }

        //更新头位置
        var moveDis = this._MoveSpeed * delta;
        var oldPos = this._SnakeHead.position;

        // var moveVec = cc.p.mul(this._MoveVec, moveDis);
        var moveVec = this._MoveVec.mul(moveDis);

        this._SnakeHead.position = this._SnakeHead.position.addSelf(moveVec); // cc.pAdd(this._SnakeHead.position, moveVec);
        this._AttachLabel.x = this._SnakeHead.x /* * (moveVec.x >= 0 ? -1 : 1)*/ ;
        this._AttachLabel.y = this._SnakeHead.y + 80 /** (moveVec.y >= 0 ? -1 : 1) */ ;

        var newPos;
        //更新身体位置
        for (let i = 0; i < moveDis; ++i) {

            newPos = oldPos.add(this._MoveVec.mul(i));
            this._MovePath.unshift(newPos);

        }
        var bodyLen = this._HeadBodyList.length;
        for (var i = 0; i < bodyLen; ++i) {
            var snakeBody = this._HeadBodyList[i].getComponent(SnakeBody);
            if ((i + 1) * this._BodySpace < this._MovePath.length) {
                snakeBody.node.position = this._MovePath[(i + 1) * this._BodySpace];
            }

            if (this._MovePath.length > bodyLen * (1 + this._BodySpace)) {
                this._MovePath.pop();
            }
            // snakeBody.updateBody(delta, this._SnakeHead, this._HeadBodyList, this._MoveVec, this._SnakeHead.position /*this._HeadPrePositon*/, needUpdateBody);
        }

        this.showSpecialState(delta);

        //状态重置
        this._StateTimer -= delta;
        if (this._State == 1) {
            //更新保护罩位置
            this.updateGodSpritePos();

            if (this._GodSprite.active == false) {
                this._GodSprite.active = true;
                //console.log("second ", this._GodSprite.width, this._SnakeIndex);
            }

            if (this._StateTimer < 0) {
                this._StateTimer = 0;

                this.setState(0);
            }
        }

        return true;
    },

    hideMagnet() {
        this._SnakeHead.getChildByName("magnet").active = false;
    },

    updateShow(delta) {
        if (delta == 0) {
            delta = 0.017;
        }
        if (this._SnakeHead == null) {
            return false;
        }

        //状态重置
        this._StateTimer -= delta;
        if (this._State == 1 && this._StateTimer < 0) {
            this._StateTimer = 0;

            this._State = 0;
        }

        this._PosUpdateTime -= delta;

        var needUpdateBody = false;

        if (this._PosUpdateTime <= 0) {
            // this._PosUpdateTime = 0.1;
            //记录上次位置
            this._LastMoveVec = this._MoveVec;
            this._HeadPrePositon = this._SnakeHead.position;

            needUpdateBody = true;
        }
        //判断当前位置是否到达目标
        var curDistance = this._SnakeHead.position.sub(this._CurShowMoveStartPos).magSqr();
        if (curDistance > this._CurShowMoveDistance * this._CurShowMoveDistance) {
            //重新指定一个位置
            var destPos;
            if (this._CurMoveIndex >= this._ShowMovePosList.length) {
                this._CurMoveIndex = 0;
            }
            destPos = this._ShowMovePosList[this._CurMoveIndex];
            this._CurMoveIndex++;

            this._CurShowMoveStartPos = this._SnakeHead.position;
            var moveDir = destPos.sub(this._CurShowMoveStartPos);
            this._CurShowMoveDistance = moveDir.mag();
            this.setOtherMoveDir(moveDir.x, moveDir.y);
        }
        //更新头位置
        var moveVec = this._MoveVec.mul(this._MoveSpeed * delta);

        this._SnakeHead.position = this._SnakeHead.position.addSelf(moveVec); // cc.pAdd(this._SnakeHead.position, moveVec);
        this._AttachLabel.x = this._SnakeHead.x /* * (moveVec.x >= 0 ? -1 : 1)*/ ;
        this._AttachLabel.y = this._SnakeHead.y + 80 /** (moveVec.y >= 0 ? -1 : 1) */ ;


        //更新身体位置
        var bodyLen = this._HeadBodyList.length;
        for (var i = 0; i < bodyLen; ++i) {
            var snakeBody = this._HeadBodyList[i].getComponent(SnakeBody);
            snakeBody.updateBody(delta, this._SnakeHead, this._HeadBodyList, this._LastMoveVec, this._HeadPrePositon, needUpdateBody);
        }

        return true;
    }
})