/**
 * Created by chuhaoyuan on 2017/11/22.
 */
const EventListener = function (obj) {
  let Register = {};
  obj.on = function (type, method) {
    if (!Register.hasOwnProperty(type)){
      Register[type] = [method];
    }else {
      Register[type].push(method);
    }
  };
  obj.fire = function (type) {
    if (Register.hasOwnProperty(type)){
      let handlerList = Register[type];
      for (let i = 0 ; i < handlerList.length ; i ++){
        let args = [];
        let handler = handlerList[i];
        for (let j = 1 ; j < arguments.length ; j ++){
          args.push(arguments[j]);
        }
        handler.apply(this, args);
      }
    }
  };
  obj.removeListener = function (type, method) {
    if (Register.hasOwnProperty(type)){
      let handler = Register[type];
      for (let i = handler.length -1 ; i >=0 ; i --){
        if (handler[i] === method){
          handler.splice(i, 1);
        }
      }
    }
  };
  Object.removeAllListeners = function () {
    Register = {};
  };
  
  return obj;
};
module.exports = EventListener;