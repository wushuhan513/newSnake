
//通用的消息提示框

cc.Class({
    extends: cc.Component,

    properties: 
    {
        showBg:
        {
            default: null,
            type: cc.Sprite,
        },

        showLabel:
        {
            default: null,
            type: cc.Label,
        },


    },


    // onLoad () {},

    start ()
    {
        
    },

    //显示消息
    showMessage(msg)
    {
        this.node.active = true;
        //兼容 2.0
        if(this.showLabel)
        {
            this.showLabel.node.active = true;
            this.showLabel.string = msg;

            this.showLabel.node.stopAllActions();

            var delayTime = cc.delayTime(1.5);
            var callfunc = cc.callFunc(this.actionFinish, this,  this.showLabel);
            this.showLabel.node.runAction(cc.sequence(delayTime, callfunc));
        }
        if(this.showBg)
        {
            this.showBg.node.active = true;
            this.showBg.node.width = this.showLabel.node.width + 50;
            this.showBg.node.height = this.showLabel.node.height + 20;

            this.showBg.node.stopAllActions();

            var delayTime = cc.delayTime(1.5);
            var callfunc = cc.callFunc(this.actionFinish, this,  this.showBg);
            this.showBg.node.runAction(cc.sequence(delayTime, callfunc));
        }   
    },

    actionFinish(data)
    {

        this.node.active = false;
        data.active = false;   
    }
    // update (dt) {},
});
