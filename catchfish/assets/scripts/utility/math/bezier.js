/**
 * Created by chuhaoyuan on 2017/11/22.
 */
const Bezier = function (controllerPoints, count, all_time) {
  var that = {};
  // that._pointList = controllerPoints;
  // that._time = all_time;
  // that._count = count;

  var _pointList = controllerPoints;
  var _time = all_time;
  var _count = count;

  function Point2D(x,y){
    this.x=x||0.0;
    this.y=y||0.0;
  }
  function PointForBezier(cp, t)
  {
    let result = new Point2D;
    let n = cp.length;
    for (let i = 0; i < n; i++) {
      var b = formula(n - 1, i, t);
      result.x += cp[i].x * b;
      result.y += cp[i].y * b;
    }
    return result;
  }

  function ComputeBezier( cp, numberOfPoints, curve )
  {
    var   dt;
    var   i;

    dt = 1.0 / ( numberOfPoints - 1 );

    for( i = 0; i < numberOfPoints; i++)
      curve[i] = PointForBezier( cp, i*dt );
  }

  that.getPoints = function (count) {
    var curve=[];
    var currentCount = _count;
    if (count){
      currentCount = count;
    }
    ComputeBezier(_pointList , currentCount, curve);
    return curve
  };

  that.getPoint = function (t) {

    if (t > _time){
      console.log('time is out');

      return null;
    }
    let result = new Point2D;
    let n = _pointList.length;
    for (let i = 0; i < n; i++) {
      var b = formula(n - 1, i, t/_time);
      result.x += _pointList[i].x * b;
      result.y += _pointList[i].y * b;
    }
    return result;
  };

  //基函数
  function formula(n, k, t) {
    return c(n,k) * Math.pow(t, k) * Math.pow(1-t, n-k);
  }

  // 组合排序
  function c(n, k) {
    let son = factorial(n);
    let mother = factorial(k) * factorial(n - k);
    return son/mother;
  }

  //阶乘
  function factorial(i)
  {
    let n = 1;
    for (let j = 1; j <= i; j++)
      n *= j;
    return n;
  }

  return that
};

module.exports = Bezier;