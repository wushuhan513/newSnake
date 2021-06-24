
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    // onLoad () {}

    start () {
        cc.tween(this.node)
        .bezierTo(1,cc.v2(0,0),cc.v2(30,70),cc.v2(100,100))
        .start()
    }

    // update (dt) {}
}
