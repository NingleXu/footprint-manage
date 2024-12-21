<template>
  <div class="page">
    <div class="show">
      <div class="routeTitle">
        {{ '路线标题: ' + routeInfo.title }}
      </div>
      <div class="data">
        <el-statistic title="运动方式">
          <template slot="formatter">
            {{
              routeInfo.motionType === 0 ? '跑步' :
                routeInfo.motionType === 1 ? '骑行' : '徒步'
            }}
          </template>
        </el-statistic>
        <el-statistic title="运动距离">
          <template slot="formatter">
            {{ routeInfo.distance + '米' }}
          </template>
        </el-statistic>

        <el-statistic title="运动时间"
        >
          <template slot="formatter">
            {{ routeInfo.time }}
          </template>
        </el-statistic>

        <el-statistic title="平均配速"
        >
          <template slot="formatter">
            {{ routeInfo.speed + '米/秒' }}
          </template>
        </el-statistic>

      </div>

    </div>
    <div class="container" id="mapContainer" style="width:60%;height:600px;"></div>

  </div>

</template>
<script>

import {getRoute} from "@/api/footprint/route";
import {getActivityInfo} from "../../../api/footprint/activity";

export default {
  name: "Map",
  data() {
    return {
      routeInfo: {},
      activityInfo: null
    };
  },
  async created() {
    const routeId = this.$route.params && this.$route.params.routeId;
    const activityId = this.$route.params && this.$route.params.activityId;
    await getRoute(routeId).then(response => {
      this.routeInfo = response.data;
      this.markerLayer = new TMap.MultiMarker({});
      this.open = true;
    })
    if ('null' !== activityId) {
      // 查询活动信息
      await getActivityInfo(activityId).then(res => {
        this.activityInfo = res.data;
      })
    }
    this.initMap();
  },

  methods: {
    // 地图初始化函数
    initMap() {
      let routeInfo = this.routeInfo;
      // 定义地图中心点坐标
      let center = new window.TMap.LatLng(routeInfo.startPoint.latitude, routeInfo.startPoint.longitude);

      // 定义map变量，调用 TMap.Map() 构造函数创建地图
      let map = new window.TMap.Map(document.getElementById("mapContainer"), {
        center: center, // 设置地图中心点坐标
        zoom: 14, // 设置地图缩放级别
        pitch: 0, // 设置俯仰角
        rotation: 0, // 设置地图旋转角度
      });
      //如果不给地图添加坐标点,这里可以忽略了,如果要添加请继续看(重点关注***markerLayer***)
      this.map = map;
      let points = this.routeInfo.points.map(point => {
        return new TMap.LatLng(point.latitude, point.longitude);
      })
      // 起点和终点
      let initPoint = [{
        "id": "1",   //点标记唯一标识，后续如果有删除、修改位置等操作，都需要此id
        "styleId": 'start',  //指定样式id
        "position": new TMap.LatLng(routeInfo.startPoint.latitude, routeInfo.startPoint.longitude),  //点标记坐标位置
        "content": '起点',
        "properties": {//自定义属性
          "title": "marker1"
        }
      },
        {//第二个点标记
          "id": "2",
          "styleId": 'end',
          "position": new TMap.LatLng(routeInfo.endPoint.latitude, routeInfo.endPoint.longitude),
          "content": '终点',
          "properties": {
            "title": "marker2"
          }
        }
      ];
      // 如果活动存在 再加一个活动的中心
      if (this.activityInfo != null) {
        initPoint.push({
          "id": "3",
          "styleId": 'center',
          "content": '活动中心',
          "position": new TMap.LatLng(this.activityInfo.lat, this.activityInfo.lng),
        })
      }
      //创建并初始化MultiMarker
      var markerLayer = new TMap.MultiMarker({
        map: map,  //指定地图容器
        //样式定义
        styles: {
          //创建一个styleId为"myStyle"的样式（styles的子属性名即为styleId）
          "start": new TMap.MarkerStyle({
            "width": 25,  // 点标记样式宽度（像素）
            "height": 35, // 点标记样式高度（像素）
            "src": 'https://edu-1010xzh.oss-cn-shenzhen.aliyuncs.com/start.png',  //图片路径
            //焦点在图片中的像素位置，一般大头针类似形式的图片以针尖位置做为焦点，圆形点以圆心位置为焦点
            "anchor": {x: 16, y: 32}
          }),
          "end": new TMap.MarkerStyle({
            "width": 25,  // 点标记样式宽度（像素）
            "height": 35, // 点标记样式高度（像素）
            "src": 'https://edu-1010xzh.oss-cn-shenzhen.aliyuncs.com/end.png',  //图片路径
            //焦点在图片中的像素位置，一般大头针类似形式的图片以针尖位置做为焦点，圆形点以圆心位置为焦点
            "anchor": {x: 16, y: 32}
          }),
          "center": new TMap.MarkerStyle({
            "width": 25,  // 点标记样式宽度（像素）
            "height": 35, // 点标记样式高度（像素）
            "src": 'https://edu-1010xzh.oss-cn-shenzhen.aliyuncs.com/activity_center.png',  //图片路径
            //焦点在图片中的像素位置，一般大头针类似形式的图片以针尖位置做为焦点，圆形点以圆心位置为焦点
            "anchor": {x: 16, y: 32}
          })
        },
        //点标记数据数组
        geometries: initPoint
      });

      //创建 MultiPolyline
      var polylineLayer = new TMap.MultiPolyline({
        id: 'polyline-layer', //图层唯一标识
        map: map,//设置折线图层显示到哪个地图实例中
        //折线样式定义
        styles: {
          'style_blue': new TMap.PolylineStyle({
            'color': '#FCD700', //线填充色
            'width': 6, //折线宽度
            'borderWidth': 1, //边线宽度
            'borderColor': '#FFF', //边线颜色
            'lineCap': 'butt' //线端头方式
          })
        },
        //折线数据定义
        geometries: [
          {//第1条线
            'id': 'pl_1',//折线唯一标识，删除时使用
            'styleId': 'style_blue',//绑定样式名
            'paths': points
          },
        ]
      });
      if (this.activityInfo != null) {
        // 画一个圆
        let circle = new TMap.MultiCircle({
          map: map,
          styles: { // 设置圆形样式
            'circle': new TMap.CircleStyle({
              'color': 'rgba(41,91,255,0.16)',
              'showBorder': true,
              'borderColor': 'rgba(41,91,255,1)',
              'borderWidth': 2,
            }),
          },
          geometries: [{
            id: "100",
            styled: 'circle',
            center: new TMap.LatLng(this.activityInfo.lat, this.activityInfo.lng),
            radius: parseInt(this.activityInfo.activityRange)
          }],
        })
      }

    },
  }
}

</script>

<style>
.page {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column; /* 元素垂直排列 */
  justify-content: center; /* 水平方向上居中对齐 */
  align-items: center; /* 垂直方向上居中对齐 */

  .container {
    margin-top: 40px;
    margin-left: 200px;
  }

  .show {
    padding-top: 20px;

    .routeTitle {
      text-align: center;
      font-size: 32px;
      font-weight: bold;
    }

    .data {
      margin-top: 20px;
      display: flex;
    }

    margin-top: 60px;
    margin-left: 100px;
    width: 30%;
  }
}

</style>
