<template>
  <div class="dashboard-editor-container">

    <panel-group @handleSetLineChartData="handleSetLineChartData"/>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData"/>
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart/>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart/>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart/>
        </div>
      </el-col>
    </el-row>


  </div>
</template>

<script>
import PanelGroup from './dashboard/PanelGroup'
import LineChart from './dashboard/LineChart'
import RaddarChart from './dashboard/RaddarChart'
import PieChart from './dashboard/PieChart'
import BarChart from './dashboard/BarChart'
import {getDistanceStats, getPostStats, getRouteStats, getUserStats} from "../api/footprint/home";

export default {
  name: 'Index',
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart
  },
  data() {
    return {
      lineChartDatas: {
        users: {
          data: [0, 0, 0, 0, 0]
        },
        routes: {
          data: [0, 0, 0, 0, 0]
        },
        distances: {
          data: [0, 0, 0, 0, 0]
        },
        posts: {
          data: [0, 0, 0, 0, 0]
        },
      },
      lineChartData: {}
    }
  },
  mounted() {
    getUserStats().then(res => {
      this.lineChartDatas.users.data = res.data;
      this.lineChartData = this.lineChartDatas.users;
    })
    getRouteStats().then(res => {
      this.lineChartDatas.routes.data = res.data;
    })
    getDistanceStats().then(res => {
      this.lineChartDatas.distances.data = res.data;
    })
    getPostStats().then(res => {
      this.lineChartDatas.posts.data = res.data;
    })
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = this.lineChartDatas[type]
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
