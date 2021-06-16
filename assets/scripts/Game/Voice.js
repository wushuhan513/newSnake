var UIType = require('UIType');
cc.Class({
    extends: cc.Component,

    properties: {
        
    },
    // onLoad () {},

    start () {
        cc.audioEngine.setEffectsVolume(0.2);
    },

    playEffect(voiceName,snake) {
        var uiGame = GameGlobal.UIManager.getUI(UIType.UIType_Game);
        if(uiGame._mySnake != snake){
            return
        }
        cc.resources.load("effect/" + voiceName, cc.AudioClip, function (err, clip) {
            var audioID = cc.audioEngine.playEffect(clip, false);
        });
    }

    // update (dt) {},
});
