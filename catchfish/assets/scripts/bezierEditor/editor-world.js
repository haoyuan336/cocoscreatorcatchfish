import Bezier from './../utility/math/bezier'
cc.Class({
    extends: cc.Component,

    properties: {
        pointPrefab: {
            default: null,
            type: cc.Prefab
        },
        controlPointPrefab: {
            default: null,
            type: cc.Prefab
        }
    },

    // use this for initialization
    onLoad: function () {
        this.bezier = undefined;
        this.pointPool = [];
        this.controlPointList = [];
        this.linePointList = [];
        let touchPoint = undefined;
        this.node.on(cc.Node.EventType.TOUCH_START, (event)=>{
            console.log("touch start");
            for (let i in this.controlPointList){
               let point = this.controlPointList[i];
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
        let point = cc.instantiate(this.controlPointPrefab);
        point.parent = this.node.parent;
        point.position = pos;
        this.controlPointList.push(point);
    },
    update: function (dt) {

        //根据控制点，生成一条贝塞尔曲线
        if (this.controlPointList.length !== 0){
            let bezier = Bezier(this.controlPointList, 200,10);
            let pointList = bezier.getPoints();

            for (let i in this.linePointList){
                this.node.removeChild(this.linePointList[i]);
            }
            this.linePointList = [];
            for (let i = 0 ; i < pointList.length ;  i ++){
                let point;
                if (i < this.pointPool.length){
                    point = this.pointPool[i];
                }else {
                    point = cc.instantiate(this.pointPrefab);
                    this.pointPool.push(point);
                }
                point.parent = this.node;
                point.position = pointList[i];
                this.linePointList.push(point);

            }
        }

        
    }
});
