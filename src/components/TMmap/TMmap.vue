<template>
  <div>
    <!-- 定义地图显示容器 -->
    <div id="container"></div>
  </div>
</template>

<script>
export default {
  name: 'TMmap',
  props: ['position', 'locationForms'],
  data() {
    return {
      map: '',
      markerLayer: '',
      curPointsInfo: new TMap.InfoWindow({
        map: this.map,
        position: new TMap.LatLng(39.915, 116.404),
        content: `未知`,
        offset: {x: 0, y: -50},
      }),
      circle: '',
      curPoint: null,
      range: 1000,
    }
  },
  mounted() {
    this.initMap()
  },
  methods: {
    // 初始化
    initMap() {
      const _this = this;
      const center = null === this.locationForms.locationLatLng ?
        new TMap.LatLng(this.position.lat, this.position.lng) :
        this.locationForms.locationLatLng;
      const map = new TMap.Map(document.getElementById('container'), {
        center: center, //设置地图中心点坐标
        zoom: 13, //设置地图缩放级别
        pitch: 0, //设置俯仰角
        rotation: 0 //设置地图旋转角度
      });
      this.map = map;
      //创建并初始化MultiMarker
      let markerLayer = new TMap.MultiMarker({
        map: map, //指定地图容器
        //样式定义
        styles: {
          //创建一个styleId为"myStyle"的样式（styles的子属性名即为styleId）
          "myStyle": new TMap.MarkerStyle({
            "width": 25, // 点标记样式宽度（像素）
            "height": 35, // 点标记样式高度（像素）
            //焦点在图片中的像素位置，一般大头针类似形式的图片以针尖位置做为焦点，圆形点以圆心位置为焦点
            "anchor": {x: 16, y: 32}
          })
        },
        //点标记数据数组
        geometries: [{
          "id": "1", //点标记唯一标识，后续如果有删除、修改位置等操作，都需要此id
          "styleId": 'myStyle', //指定样式id
          "position": new TMap.LatLng(this.position.lat, this.position.lng), //点标记坐标位置
          "properties": { //自定义属性
            "title": "marker1"
          }
        }]
      });
      let geometries = [];
      if (null !== this.locationForms.locationLatLng) {
        geometries = [{
          id: "1",
          styled: 'circle',
          center: this.locationForms.locationLatLng,
          radius: parseInt(this.locationForms.range)
        }]
      }
      let circle = new TMap.MultiCircle({
        map: this.map,
        styles: { // 设置圆形样式
          'circle': new TMap.CircleStyle({
            'color': 'rgba(41,91,255,0.16)',
            'showBorder': true,
            'borderColor': 'rgba(41,91,255,1)',
            'borderWidth': 2,
          }),
        },
        geometries: geometries,
      })
      this.markerLayer = markerLayer
      this.circle = circle
      this.curPointsInfo.close();
      //绑定点击事件
      map.on("click", function (evt) {
        let lat = evt.latLng.getLat().toFixed(6);
        let lng = evt.latLng.getLng().toFixed(6);
        _this.curPoint = new TMap.LatLng(lat, lng);
        new TMap.service.Geocoder().getAddress({location: new TMap.LatLng(lat, lng)}).then(res => {
          let val = {
            latLng: evt.latLng,
            locationName: res.result.formatted_addresses.standard_address
          }
          _this.$emit('setPoints', val)
        })
        //修改点标记的位置
        markerLayer.updateGeometries([
          {
            "styleId": "myStyle",
            "id": "1",
            "position": new TMap.LatLng(lat, lng),
          }
        ])
        // 画圆圈
        //创建圆形覆盖物
        circle.updateGeometries([
          {
            id: "1",
            styleId: "circle",
            center: new TMap.LatLng(lat, lng),
            radius: parseInt(_this.range),
          }
        ])
      })
    },

    // 修改初始化中心点
    MapResetting() {
      const center = null === this.locationForms.locationLatLng ?
        new TMap.LatLng(this.position.lat, this.position.lng) :
        this.locationForms.locationLatLng;
      this.map.setCenter(center) // 修改地图中心点坐标
      this.map.setZoom(13) // 设置地图缩放级别

      //修改点标记的位置
      this.markerLayer.updateGeometries([
        {
          "styleId": "myStyle",
          "id": "1",
          "position": center,
        }
      ])
    },

    // 初始化搜索
    MapSearch(val) {
      console.log(val + ".,,,,,,,,,,,")
      let markers = new TMap.MultiMarker({
        map: this.map,
        geometries: [],
      });
      let infoWindowList = Array(10);
      let suggest = new TMap.service.Suggestion({
        pageSize: 10, // 返回结果每页条目数
      });

      suggest.getSuggestions({keyword: val, location: this.map.getCenter()}).then((res) => {
        if (res.data != []) {
          res.data.forEach((item, index) => {
            // let geometries = markers.getGeometries();
            let geometries = [];
            let infoWindow = new TMap.InfoWindow({
              map: this.map,
              position: item.location,
              content: `<h3>${item.title}</h3><p>地址：${item.address}</p>`,
              offset: {x: 0, y: -50},
            }); // 新增信息窗体显示地标的名称与地址、电话等信息
            infoWindow.close();
            infoWindowList[index] = infoWindow;
            geometries.push({
              id: String(index), // 点标注数据数组
              position: item.location,
            });
            markers.updateGeometries(geometries); // 绘制地点标注
            markers.on('click', (e) => {
              infoWindowList[Number(e.geometry.id)].open();
            }); // 点击标注显示信息窗体
          })

          this.map.setCenter(res.data[0].location) // 修改地图中心点坐标
        }
      });
    },

    // 修改 圆形大小
    MapUpdateCircle(val) {
      if (null != this.curPoint) {
        this.circle.updateGeometries([
          {
            id: "1",
            styleId: "circle",
            center: this.curPoint,
            radius: parseInt(val),
          }
        ])
      }
      this.range = val;
    },
  }
}
</script>

<style>
#container {
  width: 100%;
  height: 100%;
}
</style>
