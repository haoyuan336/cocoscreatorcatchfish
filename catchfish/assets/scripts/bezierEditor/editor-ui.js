cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
        this.isDown = true;

    },
    buttonClick: function (event, customData) {
        switch (customData){
            case 'upDown':

                this.upDown(event);

                break;

            default:
                break;
        }
    },
    upDown: function (event) {
        let str = 'up';
        let offsetY = 520;
        if (this.isDown){
            str = 'down';
            offsetY = 520;
            this.isDown = false;
        }else {
            str = 'up';
            offsetY = -520;
            this.isDown = true;
        }
        let action = cc.moveTo(0.3,this.node.position.x, this.node.position.y + offsetY);
        this.node.runAction(action);
        event.target.getChildByName('Label').getComponent(cc.Label).string = str;
    }
});
