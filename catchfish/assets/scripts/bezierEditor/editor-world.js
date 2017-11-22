import Bezier from './../utility/math/bezier'
cc.Class({
    extends: cc.Component,

    properties: {
        pointPrefab: {
            default: null,
            type: cc.Prefab
        }
    },

    // use this for initialization
    onLoad: function () {
        this.bezier = undefined;
        this.touchPointList = [];
        let touchPoint = undefined;
        this.node.on(cc.Node.EventType.TOUCH_START, (event)=>{
            console.log("touch start");
            for (let i in this.touchPointList){
               let point = this.touchPointList[i];
                let dis = cc.pDistance(point.position, this.node.parent.convertTouchToNodeSpace(event));
                if (dis < 10){
                    touchPoint = point;
                }
            }

        });
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event)=>{
            if (touchPoint){
                touchPoint.position = this.node.parent.convertTouchToNodeSpace(event);
            }
        });
        this.node.on(cc.Node.EventType.TOUCH_END, (event)=>{
            if (touchPoint === undefined){
                let touchPos = this.node.parent.convertTouchToNodeSpace(event);
                this.addPoint(touchPos);
            }else {
                touchPoint = undefined;
            }

        })
    },
    addPoint: function (pos) {
        let point = cc.instantiate(this.pointPrefab);
        point.parent = this.node.parent;
        point.position = pos;
        this.touchPointList.push(point);


    },
    update: function (dt) {
        
    }
});
