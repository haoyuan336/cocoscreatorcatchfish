import global from './global'
cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    // use this for initialization
    onLoad: function () {
        cc.loader.loadRes("./configs/fish-config", function(err, result){
            let animates = result["fish_red"];
            let animate = animates[0];
            let animateName = animate.pre;
            let spriteFrameNames = [];
            for (let i = animate.start; i <= animate.end ; i ++) {
                let name = animate.pre + '_' + i + '.png';
                console.log("name = " + name);
                spriteFrameNames.push(global.getSpriteFrameByName(name));
            }
            var clip = cc.AnimationClip.createWithSpriteFrames(spriteFrameNames, animate.speed);
            this.node.getComponent(cc.Animation).addClip(clip, "run");
            this.node.getComponent(cc.Animation).play();
            
    
            
        });
        // let animates = config.animates;
        // for (let i in animates){
        //     let animate = animates[i];
        //     let animateName = animate.pre;
        //     let spriteFrameNames = [];
        //     for (let i = animate.start; i <= animate.end ; i ++) {
        //         let name = animate.pre + '_' + i + '.png';
        //         console.log("name = " + name);
        //         spriteFrameNames.push(global.getSpriteFrameByName(name));
        //     }
        //     var clip = cc.AnimationClip.createWithSpriteFrames(spriteFrameNames, animate.speed);
        //     this.node.getComponent(cc.Animation).addClip(clip, "run");
        //     this.node.getComponent(cc.Animation).play();
        

        // }
    },
    initWithData: function(config){
        // console.log("init with data = " + JSON.stringify(config));
        // var clip = cc.AnimationClip.createWithSpriteFrames()
        let animates = config.animates;
        for (let i in animates){
            let animate = animates[i];
            let animateName = animate.pre;
            let spriteFrameNames = [];
            for (let i = animate.start; i <= animate.end ; i ++) {
                let name = animate.pre + '_' + i + '.png';
                console.log("name = " + name);
                spriteFrameNames.push(global.getSpriteFrameByName(name));
            }
            var clip = cc.AnimationClip.createWithSpriteFrames(spriteFrameNames, animate.speed);
            this.node.getComponent(cc.Animation).addClip(clip, "run");
            this.node.getComponent(cc.Animation).play();
        

        }
    }
});
