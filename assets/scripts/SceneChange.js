cc.Class({
    extends: cc.Component,

    properties: {
    },


    // onLoad () {},

    start() {
        var onLaunched = function () {
            console.log('Scene ' + sceneName + ' launched');
        };
        var sceneName = 'SCS'
        // 第一个参数为场景的名字，第二个可选参数为场景加载后的回调函数
        cc.director.loadScene(sceneName, onLaunched);
    },

    // update (dt) {},
});
