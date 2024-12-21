<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="路线id" prop="routeId">
        <el-input
          v-model="queryParams.routeId"
          placeholder="请输入路线id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户id" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入用户id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="运动类型" prop="gender">
        <el-select v-model="queryParams.gender" placeholder="请选择运动类型" clearable>
          <el-option
            v-for="dict in dict.type.motion_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="routeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="路线id" align="center" prop="routeId"/>
      <el-table-column label="用户id" align="center" prop="userId"/>
      <el-table-column label="路线标题" align="center" prop="title"/>
      <el-table-column label="运动方式" align="center" prop="motionType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.motion_type" :value="scope.row.motionType"/>
        </template>
      </el-table-column>
      <el-table-column label="运动里程" align="center" prop="distance">
        <template slot-scope="scope">
          {{ scope.row.distance + '米' }}
        </template>
      </el-table-column>
      <el-table-column label="运动时间" align="center" prop="time"/>
      <el-table-column label="平均速度" align="center" prop="speed">
        <template slot-scope="scope">
          {{ scope.row.speed + '米/秒' }}
        </template>
      </el-table-column>
      >
      <el-table-column label="路线创建时间" align="center" prop="date">
        <template slot-scope="scope">
          {{ formatDate(parseInt(scope.row.date)) }}
        </template>
      </el-table-column>

      <el-table-column label="是否投稿" align="center" prop="isShare">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.is_share" :value="(scope.row.isShare)"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <router-link :to="'/footprint/route-map/index/' + scope.row.routeId +'/null'" class="link-type">
            <span>查看详情</span>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="parseInt(total)"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

  </div>
</template>

<script>
import {listRoute, getRoute} from "@/api/footprint/route";
import {formatDate} from "../../../utils";


export default {
  name: "Route",
  dicts: ['motion_type', 'is_disabled', 'is_share'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 足迹用户表格数据
      routeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        nickname: null,
        profile: null,
        birthday: null,
        openId: null,
        isDisabled: null,
        gender: null,
        avatarUrl: null,
        city: null,
        lastActiveIp: null,
        disabledPermissions: null,
        createTime: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        nickname: [
          {required: true, message: "用户昵称不能为空", trigger: "blur"}
        ],
        isDisabled: [
          {required: true, message: "是否禁用不能为空", trigger: "change"}
        ],
        gender: [
          {required: true, message: "性别不能为空", trigger: "change"}
        ],
      },
      center: {lng: 0, lat: 0},
      zoom: 3,
      routeInfo: {},
      map: {},
    };
  },
  created() {
    this.getList();
    // this.initMap();
  },

  methods: {
    formatDate,
    getList() {
      this.loading = true;
      listRoute(this.queryParams).then(response => {
        response = response.data;
        this.routeList = response.records;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    handleInfo(route) {
      getRoute(route.routeId).then(response => {
        this.routeInfo = response.data;
        this.markerLayer = new TMap.MultiMarker({});
        this.initMap();
        this.open = true;

      })
    },
    // 地图初始化函数
    initMap() {
      console.log("window", window);
      // 定义地图中心点坐标
      let center = new window.TMap.LatLng(31.271694, 118.362938);

      // 定义map变量，调用 TMap.Map() 构造函数创建地图
      let map = new window.TMap.Map(document.getElementById("mapContainer"), {
        center: center, // 设置地图中心点坐标
        zoom: 20, // 设置地图缩放级别
        pitch: 0, // 设置俯仰角
        rotation: 0, // 设置地图旋转角度
      });
      //如果不给地图添加坐标点,这里可以忽略了,如果要添加请继续看(重点关注***markerLayer***)
      this.map = map;
      map.on("click", (e) => {
        this.markerLayer.setGeometries([]);
        const position = e.latLng;
        this.addImgMarker(position);
      });
    },


    // handler({BMap, map}) {
    //   this.routeInfo.startPoint = bMapTransQQMap(this.routeInfo.startPoint.longitude, this.routeInfo.startPoint.latitude);
    //   this.routeInfo.endPoint = bMapTransQQMap(this.routeInfo.endPoint.longitude, this.routeInfo.endPoint.latitude);
    //
    //   let startPoint = new BMap.Point(this.routeInfo.startPoint.longitude, this.routeInfo.startPoint.latitude);//起点
    //   var endPoint = new BMap.Point(this.routeInfo.endPoint.longitude, this.routeInfo.endPoint.latitude);    //终点
    //   map.centerAndZoom(startPoint, 20);
    //   let marker = new BMap.Marker(startPoint);               // 创建标注
    //   // 将标注添加到地图中
    //   let points = this.routeInfo.points.map(point => {
    //     point = bMapTransQQMap(point.longitude, point.latitude);
    //     return (new BMap.Point(point.longitude, point.latitude))
    //   })
    //
    //   var polyline = new BMap.Polyline(points, {strokeColor: "yellow", strokeWeight: 10, strokeOpacity: 1});   //创建折线
    //   map.addOverlay(polyline);   //增加折线
    //   map.addOverlay(marker);
    //   console.log(points)
    //   // var myIcon = new BMap.Icon("https://lbsyun.baidu.com/jsdemo/img/Mario.png", new BMap.Size(32, 70), {    //小车图片
    //   //   //offset: new BMap.Size(0, -5),    //相当于CSS精灵
    //   //   imageOffset: new BMap.Size(0, 0)    //图片的偏移量。为了是图片底部中心对准坐标点。
    //   // });
    // }
  }
};
</script>
<style>
.container {
  height: 600px;
  width: 1000px;
}
</style>
