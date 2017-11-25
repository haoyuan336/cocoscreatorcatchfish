const global = require('./global');
cc.Class({
    extends: cc.Component,
    properties: {
        fishPrefab: {
            default: null,
            type: cc.Prefab
        }
    },
    onLoad: function () {

    },
    update: function(dt){

    },
    addFishNode: function (data) {
        // cc.log('add fish node = ' + JSON.stringify(data));
        let fishNode = cc.instantiate(this.fishPrefab);
        fishNode.parent = this.node;
        fishNode.getComponent('fish').initWithData(data);
    }
});
