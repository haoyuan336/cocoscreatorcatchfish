import Bezier from './../utility/math/bezier'
import defines from './../defines'
import global from './../global'
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
        },
        scrollView: {
            default: null,
            type: cc.ScrollView
        },
        scrollViewContent: {
            default: null,
            type: cc.Node
        },
        scrollViewCellPrefab: {
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
        this.bezierConfig = undefined;
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
        });
        //取出贝塞尔曲线的配置
        cc.loader.loadRes(defines.configMap.bezierConfig, (err, result)=>{
            if (err){
                console.log("load bezier config err = " + err);
            }
            this.bezierConfig = result;
            this.initScrollView(result);
            let id = Object.keys(result)[0];
            this.showBezier(id);

        });

        global.event.on('choose_bezier', this.showBezier.bind(this));

    },
    addPoint: function (pos) {
        console.log('pos = ' + JSON.stringify(pos));
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
    },
    buttonClick: function (event, coustomData) {
        switch (coustomData){
            case 'build':
                console.log("保存");
                if (cc.sys.isBrowser){
                    console.log("浏览器");
                    this.saveBezier();
                    var textToWrite = JSON.stringify(this.bezierConfig);
                    var textFileAsBlob = new Blob([textToWrite], {type:'application/json'});
                    var fileNameToSaveAs = 'bezier-config.json';
                    var downloadLink = document.createElement("a");
                    downloadLink.download = fileNameToSaveAs;
                    downloadLink.innerHTML = "Download File";
                    if (window.webkitURL != null)
                    {
                        // Chrome allows the link to be clicked
                        // without actually adding it to the DOM.
                        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
                    }
                    else
                    {
                        // Firefox requires the link to be added to the DOM
                        // before it can be clicked.
                        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
                        downloadLink.onclick = destroyClickedElement;
                        downloadLink.style.display = "none";
                        document.body.appendChild(downloadLink);
                    }
                    downloadLink.click();
                    }
                break;
            case 'save':
                this.saveBezier();
                break;
            case 'new':
                //加一条新的贝塞尔曲线
                this.newBezier();
                break;
            default:
                break;
        }
    },
    newBezier: function () {
        let str = this.currentBezierId;
        console.log('str = ' + str);
        //取出第11个位置开始的字符
        let num = Object.keys(this.bezierConfig).length;
        let index = 0;
        for (let i in this.bezierConfig){
            let n = parseInt(i.substring(10, i.length));
            if (n != index){
                num = index;
            }
            index ++;
        }
        console.log('num = ' + num);
        //取出来之后
        let newBezierId = str.substring(0, 10) + num;
        this.bezierConfig[newBezierId] = [];
        console.log('new bezier id = ' + newBezierId);
        this.addScrollViewCell(newBezierId);
        this.showBezier(newBezierId);

    },
    saveBezier: function () {
        let config = [];
        for (let i = 0 ; i < this.controlPointList.length ; i ++){
            config.push({
                x: this.controlPointList[i].position.x,
                y: this.controlPointList[i].position.y
            })
        }
        this.bezierConfig[this.currentBezierId] = config;
    },
    showBezier: function (id) {
        let bezierId = id;
        this.currentBezierId = bezierId;
        let posList = this.bezierConfig[bezierId];
        console.log('pos list = ' + posList.length);
        for (let i = 0 ; i < this.controlPointList.length ; i ++){
            this.controlPointList[i].destroy();
        }
        for (let i = 0 ; i < this.linePointList.length ; i ++){
            this.node.removeChild(this.linePointList[i]);
            //线的节点也删掉
        }
        this.controlPointList = [];
        for (let i = 0 ; i < posList.length ; i ++){
            this.addPoint(posList[i]);
        }

    },
    initScrollView: function (data) {
        for (let i in data){
            this.addScrollViewCell(i);
        }
    },
    addScrollViewCell: function (id) {
        console.log(' i = ' + id);
        let node = cc.instantiate(this.scrollViewCellPrefab);
        this.scrollViewContent.addChild(node);
        node.position = cc.p(0, - this.scrollViewContent.children.length * 40);
        node.getComponent('scroll-view-cell').init({bezierId: id});
        // node.id = id;
        // node.on('click', this.cellClick.bind(this));
    }
    // ,

});
