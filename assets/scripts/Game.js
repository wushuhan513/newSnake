
cc.Class({
    extends: cc.Component,

    properties: {
        //蛇头
        SnakeHeadPrefab: cc.Prefab,

        //蛇身
        SnakeBodyPrefab: cc.Prefab,


        //食物
        SnakeFoodPrefab: cc.Prefab,

        //名字
        SnakeNamePrefab: cc.Prefab,
        //保护罩
        GodSpritePrefab: cc.Prefab,

        //--------------------------
        //蛇头列表
        _SnakeHeadUseList: {
            default: [],
        },
        _SnakeHeadFreeList: {
            default: [],
        },

        //蛇身列表
        //正使用的
        _SnakeBodyUseList: {
            default: [],
        },
        //空闲的
        _SnakeBodyFreeList: {
            default: [],
        },

        //食物列表
        _SnakeFoodUseList: {
            default: [],
        },

        _SnakeFoodFreeList: {
            default: [],
        },


        //名字列表
        _SnakeNameFreeList: [],
        _SnakeNameUseList: [],
        _SnakeGodSpriteList: [],
        _SnakeGoldUseList: [],
    },

    //游戏中用到的对象缓存池
    onLoad() {
        cc.log('Game onLoad start ------------------------------------');

        //预创建 10个头，300个身子
        for (var i = 0; i < 11; ++i) {
            this._SnakeHeadFreeList.push(cc.instantiate(this.SnakeHeadPrefab));
        }

        for (var i = 0; i < 10; ++i) {
            this._SnakeNameFreeList.push(cc.instantiate(this.SnakeNamePrefab));
        }

        for (var i = 0; i < 300; ++i) {
            this._SnakeBodyFreeList.push(cc.instantiate(this.SnakeBodyPrefab));
        }
        //300个食物
        for (var i = 0; i < 300; ++i) {
            this._SnakeFoodFreeList.push(cc.instantiate(this.SnakeFoodPrefab));
        }

        for (var i = 0; i < 10; ++i) {
            this._SnakeGodSpriteList.push(cc.instantiate(this.GodSpritePrefab));
        }


        cc.log('Game onLoad end -------------------------------------');
    },

    start() {
        cc.log('Game start begin ------------------------------------');
        cc.log('Game start end --------------------------------------');
    },


    //获取空闲的头
    GetFreeHead() {
        return this.GetFree(this._SnakeHeadFreeList, this._SnakeHeadUseList, this.SnakeHeadPrefab);
    },

    //销毁头
    DelUseHead(delObj) {
        this.DelUse(this._SnakeHeadFreeList, this._SnakeHeadUseList, delObj);
    },

    //获取空闲的名字
    GetFreeNameLabel() {
        return this.GetFree(this._SnakeNameFreeList, this._SnakeNameUseList, this.SnakeNamePrefab);
    },

    //销毁名字
    DelUseNameLabel(delObj) {
        this.DelUse(this._SnakeNameFreeList, this._SnakeNameUseList, delObj);
    },

    //获取空闲的Body
    GetFreeBody() {
        return this.GetFree(this._SnakeBodyFreeList, this._SnakeBodyUseList, this.SnakeBodyPrefab);
    },

    //删除身体
    DelUseBody(delObj) {
        this.DelUse(this._SnakeBodyFreeList, this._SnakeBodyUseList, delObj);
    },

    //食物
    GetFreeFood() {
        return this.GetFree(this._SnakeFoodFreeList, this._SnakeFoodUseList, this.SnakeFoodPrefab)
    },

    //删除单个食物
    DelUseFood(delObj) {
        return this.DelUse(this._SnakeFoodFreeList, this._SnakeFoodUseList, delObj);
    },

    //保护罩
    GetFreeGodSprite() {
        return this.GetFree(this._SnakeGodSpriteList, this._SnakeGoldUseList, this.GodSpritePrefab)
    },

    //删除保护罩
    DelGodSprite(delObj) {
        return this.DelUse(this._SnakeGodSpriteList, this._SnakeGoldUseList, delObj);
    },

    //删除所有食物
    DelAllFood() {
        for (var i = 0; i < this._SnakeFoodUseList.length; ++i) {
            this._SnakeFoodFreeList.push(this._SnakeFoodUseList[i]);
            this._SnakeFoodUseList[i].parent = null;
        }
        this._SnakeFoodUseList.splice(0, this._SnakeFoodUseList.length);
    },

    GetFree(freeList, useList, prefab) {
        if (freeList.length == 0) {
            cc.log("GetFree new ");
            var newObj = cc.instantiate(prefab);
            freeList.push(newObj);
            return this.GetFree(freeList, useList, prefab);
        }
        var lastObj = freeList.pop();
        useList.push(lastObj);
        return lastObj;
    },

    DelUse(freeList, useList, delObj) {
        delObj.parent = null;
        var index = useList.indexOf(delObj);
        if (index < 0 || index >= useList.length) {
            //cc.log('error DelUse index invalid------');
            return false;
        }
        useList.splice(index, 1);
        freeList.push(delObj);
        return true;
    }


    // update (dt) {},
});
