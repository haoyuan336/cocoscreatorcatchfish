const defines = require("./../defines");
const AddFishState = {
    Invalide: -1,
    RandomFish: 1,
    ArrayFish: 2,
};
cc.Class({
    extends: cc.Component,
    properties: {
    },
    onLoad: function () {
        this.addRandomFishTime = 0;
        this.stateAddFish = 0;
        this.addFishStateTime = 0;

        let configCount = 0;
        const loadConfig = (resPath)=>{
            cc.loader.loadRes(resPath, (err, result)=>{
                if (err){
                    cc.log("load err " + resPath +" = " + err);
                }
                this[resPath] = result;
                configCount ++;
                if (configCount === Object.keys(defines.configMap).length){
                    cc.log('系统加载完毕');
                    //系统加载完毕，开始出鱼
                    this.setAddFishState(AddFishState.RandomFish);
                }
            });
        };
        for (let i in defines.configMap){
            loadConfig(defines.configMap[i]);
        }
    },
    update: function(dt){
        this.addFishStateTime += dt;
        switch (this.stateAddFish){
            case AddFishState.RandomFish:
                this.addRandomFish(dt);

                if (this.addFishStateTime > 10){
                    this.addFishStateTime = 0;
                    this.setAddFishState(AddFishState.ArrayFish);
                }
                break;
            case AddFishState.ArrayFish:

                if (this.addFishStateTime > 10){
                    this.addFishStateTime = 0;
                    this.setAddFishState(AddFishState.RandomFish);
                }
                break;
            default:
                break;
        }

    },
    addRandomFish: function (dt) {
        this.addRandomFishTime += dt;
        if (this.addRandomFishTime > 1){
            this.addRandomFishTime = 0;
            //从配置里面随机一个鱼群出来
            //首先拿到鱼群的配置
            let fishGroupConfig = this[defines.configMap.fishGroupConfig];
            //然后随机一组鱼群
            let groupIdList = Object.keys(fishGroupConfig);
            let fishGroupId = Math.floor(Math.random() * (groupIdList.length));
            cc.log('fishGroudId = ' + groupIdList[fishGroupId]);
            this.addFishGroup(fishGroupConfig[groupIdList[fishGroupId]]);

        }
    },
    addFishGroup: function (config) {

        let fishTypeList = config.fish_type;
        let array = config.array;
        //首先随机一条鱼type

        let fishType = fishTypeList[Math.floor(Math.random() * fishTypeList.length)];
        cc.log('fish type = ' + fishType);
        //随机一条贝塞尔曲
        //取出贝塞尔曲线的配置
        let bezierConfig = this[defines.configMap.bezierConfig];
        console.log("bezier config = " + JSON.stringify(bezierConfig));
        let bezier = bezierConfig[Object.keys(bezierConfig)[Math.floor(Math.random() * Object.keys(bezierConfig).length)]];
        cc.log('bezier id = ' + JSON.stringify(bezier));
        //根据鱼的type + 一条贝塞尔曲线 + 阵列数据 初始化一条鱼
        this.addOneFish(fishType, array, bezier);
    },
    addOneFish: function (fishType, array, bezier) {
        //取出鱼的配置
        let fishConfigMap = this[defines.configMap.fishConfig];
        let fishConfig = fishConfigMap[fishType];
        for (let i = 0 ; i < array.length ; i ++){
            //根据整列取出鱼的位置信息
            //调整贝塞尔曲线的位置
            let newBezier = [];
            for (let j in bezier){
                newBezier.push({
                    x: bezier[j].x + array[i].x * fishConfig.width,
                    y: bezier[j].y + array[i].y * fishConfig.height
                })
            }
            let data = {
                "config": fishConfig,
                "bezier": newBezier
            };
            this.getComponent('game-manager').addFishNode(data);
        }
    },
    setAddFishState: function (state) {
        if (this.stateAddFish === state){
            return
        }
        switch (state){
            case AddFishState.RandomFish:
                break;
            case AddFishState.ArrayFish:
                break;
            default:
                break;
        }
        this.stateAddFish = state;
    }

});

