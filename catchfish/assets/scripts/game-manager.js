import global from './global'
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
        this.addFishTime = 0;
        cc.loader.loadRes("./configs/fish-config.json", (err, result)=>{
            this.fishConfig = result;
        });
        cc.ff = {} || cc.ff;
        global.getSpriteFrameByName = (name)=>{
            return this.atlasFrames.getSpriteFrame(name);
        };
    },
    update: function(){
        // if (this.fishConfig){
        //     if (this.addFishTime > 1){
        //         this.addFishTime = 0;
        //         this.addFish(this.fishConfig[Object.keys(this.fishConfig)[0]]);
        //     }else{
        //         this.addFishTime ++;
        //     }
        // }
       
    },
    addFish: function(config){
        // console.log("add fish" + JSON.stringify(config));
        let fishNode = cc.instantiate(this.fishPrefab);
        fishNode.parent = this.node;
        fishNode.getComponent("fish").initWithData(config);
    }

});
