import Bezier from './../utility/math/bezier'
const FishState = {
    Invalid: -1,
    Run: 1,
    RunFast: 2,
    Dead: 3
};
cc.Class({
    extends: cc.Component,

    properties: {
       spriteAtlas: {
           default: null,
           type: cc.SpriteAtlas
       }
    },

    // use this for initialization
    onLoad: function () {
        // this.getComponent(cc.Sprite).spriteFrame = this.spriteAtlas.getSpriteFrame('cannonPlus');
        this.state = FishState.Invalid;
        this.runTime = 0;
    },
    initWithData: function(data){
        // this.getComponent(cc.Sprite).spriteFrame = this.spriteAtlas.getSpriteFrame('cannonPlus');


        //首先取出动画
        let config = data.config;
        let bezier = data.bezier;
        let animation = this.getComponent(cc.Animation);

        //去除
        let clicpNameList = ['run','dead'];
        let animateConfig = config.animates;
        for (let i = 0 ; i < clicpNameList.length ; i ++){
            let spriteFrameList = this.getSpriteFrameList(animateConfig[clicpNameList[i]]);
            cc.log('sprite frame list = ' + spriteFrameList.length);
            let clicp = cc.AnimationClip.createWithSpriteFrames(spriteFrameList,5);
            if (clicpNameList[i] === 'run'){
                clicp.wrapMode = cc.WrapMode.Loop;
            }
            animation.defaultClip = clicp;
            animation.addClip(clicp, clicpNameList[i]);

        }
        //
        // this.getComponent(cc.Sprite).spriteFrame = this.spriteAtlas.getSpriteFrame("fish_bigred_dead_0");


        //创建一条贝塞尔曲线
        this.bezier = Bezier(bezier,100, 10);
        this.setState(FishState.Run);

    },
    getSpriteFrameList: function (animateConfig) {
        let pre = animateConfig.pre;
        let start = animateConfig.start;
        let end = animateConfig.end;
        let spriteFrameList = [];
        for (let i = start ; i < (end + 1) ; i ++){
            let str = pre + "_" + i;
            cc.log('str = ' + str);
            let spriteFrame = this.spriteAtlas.getSpriteFrame(str);
            spriteFrameList.push(spriteFrame);
        }
        return spriteFrameList;
    },
    setState: function (state) {
        if (this.state === state){
            return
        }
        switch (state){
            case FishState.Invalid:
                break;
            case FishState.Run:
                this.node.position = this.bezier.getPoint(0);
                this.getComponent(cc.Animation).play("run");
                break;
            case FishState.RunFast:
                break;
            case FishState.Dead:
                break;
            default:
                break;
        }
        this.state = state;
    },
    update: function (dt) {
        //开始运行
        this.runTime += dt;
        switch (this.state){
            case FishState.Run:
                let position = this.bezier.getPoint(this.runTime);
                let direction = cc.pAngle(cc.p(0,0), cc.pSub(position, this.node.position));
                cc.log('direction = ' + JSON.stringify(direction));
                this.node.position = position;



                break;
            case FishState.RunFast:
                break;
            default:
                break;
        }
    }
});
