const global = require('./../global')
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        checkButton: {
            default: null,
            type: cc.Toggle
        },
        label: {
            default: null,
            type: cc.Label
        }
    },

    // use this for initialization
    onLoad: function () {

        global.event.on('choose_bezier',this.chooseBezier.bind(this));
        this.checkButton.interactable = false;
    },

    chooseBezier: function (bezierId) {
        console.log('选中了一条曲线' + bezierId);
        this.checkButton.isChecked = false;
        if (bezierId === this.bezierId){
            this.checkButton.isChecked = true;
        }
    },
    init: function (data) {
        this.bezierId = data.bezierId;
        this.label.string = this.bezierId;
    },
    onButtonClick: function (event ,customData) {
        global.event.fire('choose_bezier', this.bezierId);
    },
    getCellId: function () {
        return this.bezierId;
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
