import global from './global'
import defines from './defines'
const AddFishState = {
    Invalide: -1,
    RandomFish: 1,
    ArrayFish: 2,
};
cc.Class({
    extends: cc.Component,
    properties: {
      fishPrefab: {
          default: null,
          type: cc.Prefab
      },
      atlasFrames: {
          default: null,
          type: cc.SpriteAtlas
      }
    },
    onLoad: function () {
        this.addRandomFishTime = 0;
        this.stateAddFish = 0;
        this.addFishStateTime = 0;

        let configCount = 0;
        const loadConfig = (name, resPath)=>{
            console.log('load res = ' + name + "res = " + resPath);
            cc.loader.loadRes(resPath, (err, result)=>{
                if (err){
                    cc.log("load err " + resPath +" = " + err);
                }
                this[name] = result;
                configCount ++;
                if (configCount === defines.configMap.length){
                    cc.log('系统加载完毕');
                    //系统加载完毕，开始出鱼
                    this.setAddFishState(AddFishState.RandomFish);
                }
            });
        };




        for (let i in defines.configMap){
            loadConfig(i, defines.configMap[i]);
        }

        // cc.loader.loadRes("./configs/fish-config.json", (err, result)=>{
        //     this.fishConfig = result;
        //     this.setAddFishState(AddFishState.RandomFish);
        //
        // });




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
    addFish: function(config){
        // // console.log("add fish" + JSON.stringify(config));
        // let fishNode = cc.instantiate(this.fishPrefab);
        // fishNode.parent = this.node;
        // fishNode.getComponent("fish").initWithData(config);
    },
    addRandomFish: function (dt) {
        this.addRandomFishTime += dt;
        if (this.addRandomFishTime > 1){
            this.addRandomFishTime = 0;
            //从配置里面 随机一条鱼，
            let keys = Object.keys(this.fishConfig);
            let fishType = keys[Math.floor(Math.random() * (keys.length - 1 ))];
            cc.log('fish type = ' + fishType);

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
