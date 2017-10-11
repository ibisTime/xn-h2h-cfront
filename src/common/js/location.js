/**
 * 获取定位信息
 * */
export function getPosition() {
  return new Promise((resolve, reject) => {
    // 调用浏览器定位服务
    let map = new AMap.Map('', {
      resizeEnable: true
    });
    map.plugin('AMap.Geolocation', function() {
      let geolocation = new AMap.Geolocation({
        enableHighAccuracy: true, // 是否使用高精度定位，默认:true
        timeout: 5e3 // 超过5秒后停止定位，默认：无穷大
      });
      map.addControl(geolocation);
      geolocation.getCurrentPosition();
      AMap.event.addListener(geolocation, 'complete', (data) => {
        resolve(data);
      });
      AMap.event.addListener(geolocation, 'error', (msg) => {
        reject(msg);
      }); // 定位出错信息
    });
  });
}
