<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import * as echarts from 'echarts';

require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import {getDistanceBarStats} from "../../api/footprint/home";

const animationDuration = 6000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null,
      series: [],
    }
  },
  mounted() {
    getDistanceBarStats().then(res => {
      this.series = res.data.map(val => {
        return {
          name: val.motionType,
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: val.distances,
          animationDuration
        }
      })
      this.$nextTick(() => {
        this.initChart()
      })
    })

  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: (() => {
            const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            const currentDate = new Date();
            const sevenDaysAgo = new Date(currentDate);
            sevenDaysAgo.setDate(currentDate.getDate() - 6);

            return daysOfWeek.map((day, index) => {
              const date = new Date(sevenDaysAgo);
              date.setDate(sevenDaysAgo.getDate() + index);

              // 格式化日期为 "YYYY年M月D日"
              return `${date.getMonth() + 1}月${date.getDate()}日`;
            });
          })(),
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          },
          axisLabel: {
            formatter: '{value} 米' // 添加单位
          },
        }],
        series: this.series
      })
    }
  }
}
</script>
