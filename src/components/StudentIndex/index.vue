<template>
  <div class="app-container home">
    <el-row :gutter="20" style="height: 220px">
      <!-- 个人信息 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="9">
        <div class="info1">
          <userAvatar :user="user" style="margin-left: 20px" />
          <ul>
            <li>
              <h3>用户名：{{ user.nickName }}</h3>
            </li>
            <li v-if="user.roles">
              <h3>用户身份：{{ user.roles[0].roleName }}</h3>
            </li>
          </ul>
        </div>
      </el-col>
      <!-- 轮播图 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="14">
        <el-carousel>
          <el-carousel-item
            v-for="item in indexImg"
            :key="item"
            style="height: 210px"
          >
            <img :src="item" />
          </el-carousel-item>
        </el-carousel>
        <!-- <hr /> -->
      </el-col>
    </el-row>
    <!-- 空场地与器材剩余情况 -->
    <el-row :gutter="20" style="height: 400px">
      <el-col
        :xs="24"
        :sm="24"
        :md="12"
        :lg="9"
        style="margin-top: -60px; margin-left: 10px"
      >
        <el-card class="update-log">
          <div slot="header" class="clearfix">
            <div class="rate">
                  <i style="color:#eeae58">公告</i>
                  <div class="icon-rate fl" style="width:42px">
                    <img src="../../assets/images/notice.jpg" alt="" />
                  </div>
                </div>
          </div>
          <div class="body" style="height: 520px;">
            <div class="icon_1 fr">
              <img src="../../assets/images/notice_1.jpg" alt="">
            </div>
                <div v-for="item in notices1" :key="item" class="text item">
                  <img src="../../assets/images/xing.png" alt="" style="weight:25px;height:20px;margin-top:5px">
                  {{ item }}
                </div>
                <hr>
                <div v-for="item in notices2" :key="item" class="text item">
                  <img src="../../assets/images/xing.png" alt="" style="weight:25px;height:20px;margin-top:5px">
                  {{ item }}
                </div>
                <hr>
                <div v-for="item in notices3" :key="item" class="text item">
                  <img src="../../assets/images/xing.png" alt="" style="weight:25px;height:20px;margin-top:5px">
                  {{ item }}
                </div>
                <div class="icon_1 fl">
                  <img src="../../assets/images/notice_2.png" alt="">
                </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="14" style="margin-top: -60px">
        <el-row>
          <!-- 柱形图 -->
          <el-col :xs="24" :sm="24" :md="12" :lg="14">
            <el-card style="margin-top: 0px; height: 321px">
              <!-- 这个 div 就会被解析为 echarts图 -->
              <div id="c1" class="barChart" ref="barChart"></div>
            </el-card>
          </el-col>
          <!-- 剩余器材与场地总数 -->
          <el-col :xs="24" :sm="24" :md="12" :lg="10">
            <el-card class="qicai1">
              <i style="margin: 0">剩余体育用品</i>
              <div class="rate">
                <div class="icon-rate fl">
                  <img src="../../assets/images/studentEquipment.jpg" alt="" />
                </div>
                <div class="rate-number fr">
                  {{canRentEquipmentCount}}
                </div>
              </div>
            </el-card>
            <el-card class="qicai1">
              <i class="head-tit">剩余体育场地</i>
              <div class="rate">
                <div class="icon-rate fl">
                  <img src="../../assets/images/tiyusite.jpg" alt="" />
                </div>
                <div class="rate-number fr" style="color: #36b106">
                  {{canAppointSizeCount}}
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin: auto; margin-top: 21px">
          <!-- 规则 -->
          <el-col :xs="24" :sm="24" :md="12" :lg="14" style="padding-left: 0">
            <el-card class="update-log">
              <div slot="header" class="clearfix">
                <div class="rate">
                  <i>规则</i>
                  <div class="icon-rate fl">
                    <img src="../../assets/images/fagui.png" alt="" />
                  </div>
                </div>
              </div>
              <div class="body" style="height: 175px">
                <div v-for="o in rules" :key="o" class="text item">
                  <img src="../../assets/images/warn1.jpg" alt="" style="weight:25px;height:20px;margin-top:5px">
                  {{ o }}
                </div>
              </div>
            </el-card>
          </el-col>
          <!-- 快捷入口 -->
          <el-col :xs="24" :sm="24" :md="12" :lg="9" style="margin-top:15px;margin-left: 30px;">
            <el-card style="height: 110px; position: relative">
              <div class="img">
                <img src="../../assets/images/appoint.png" alt="" />
              </div>
              <div class="appoint-tit tit" @click="gotoPage('appoint')">
                <i class="fl">场地预约</i>
                <i class="fr">&gt;</i>
              </div>
            </el-card>
            <el-card
              style="height: 110px; position: relative; margin-top: 26px"
            >
              <div class="img">
                <img src="../../assets/images/rent.png" alt="" />
              </div>
              <div class="rent-tit tit" @click="gotoPage('rent')">
                <i class="fl">器材租借</i>
                <i class="fr">&gt;</i>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <!-- 公告、规则 -->
    <!-- <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="12" :lg="10" style="margin-right:20px">
        <el-card class="update-log">
          <div slot="header" class="clearfix">
            <span>公告赛事</span>
          </div>
          <div class="body" style="height:150px">
<<<<<<< HEAD

          </div>
        </el-card>
      </el-col>

=======

          </div>
        </el-card>
      </el-col>

>>>>>>> 01062faec25d033536c9d05c175d71192ebd9f58
      <el-col :xs="24" :sm="24" :md="12" :lg="10">
        <el-card class="update-log">
          <div slot="header" class="clearfix">
            <span>规则</span>
          </div>
          <div class="body" style="height:150px">
<<<<<<< HEAD

=======

>>>>>>> 01062faec25d033536c9d05c175d71192ebd9f58
          </div>
        </el-card>
      </el-col>
    </el-row> -->
  </div>
</template>

<script>
// import { Chart } from "@antv/g2";
import userAvatar from "@/views/system/user/profile/userAvatar.vue";
import { getUserProfile } from "@/api/system/user";
import { getStudentIndexInfo } from "@/api/gym/home";

export default {
  name: "Index",
  components: { userAvatar },
  data() {
    const chart = null;
    return {
      indexImg: [
        require("@/assets/index/tiyuguan.jpg"),
        require("@/assets/index/lanqiu.jpg"),
        require("@/assets/index/paiqiu.jpg"),
        require("@/assets/index/pingpangqiu.jpg"),
        require("@/assets/index/wangqiu.jpg"),
        require("@/assets/index/yumaoqiu.jpg"),
      ],
      option: {
        title: {
          text: "学生喜爱运动柱状图",
        },
        // 鼠标放到图上展示的数据样式，trigger: 'axis'   (有axis/item/none三个值,axis是一条竖线)
        tooltip: {},
        // 用来标志图表数据，data字段的数组需要对应每个柱条的名称，鼠标hover到最顶部的legend标志，可以标志对应的图，点击legend标志会隐藏对应的图
        legend: {
          x:"right",
          y:"top",
          data: ["喜爱度"],
        },
        // 配置x轴数据、样式、名称
        xAxis: {
          type: "category", // 可以不写，默认type就是category
          data: ["篮球", "足球", "羽毛球", "排球", "台球"], // x轴数据
          name: "体育项目", // x轴名称
          // x轴名称样式
          nameTextStyle: {
            fontWeight: 300,
            fontSize: 8,
          },
        },
        // 配置y轴名称，样式
        yAxis: {
          name: "喜爱度", // y轴名称
        },
        series: [
          {
            name: "喜爱度",
            type: "bar", // 类型为柱状图
            barMinHeight: 2,
            data: [50, 70, 55, 40, 45],
            barWidth: "25%", // 柱条宽度 每个柱条的宽度就是类目宽度的 20%
            // 柱子的样式
            itemStyle: {
              color: "#4c84fc",
            },
          },
        ],
      },
      rules: [
        "在未经许可和未履行有关手续的情况下不得擅自使用。",
        "爱护公共财物，有责任恢复设备设施、器械的完整性、原样性。",
        "开展高强度的体育运行或比赛之前须提前做好各项热身准备。",
      ],
      notices1:[],
      notices2:[],
      notices3:[],
      user: {},
      canAppointSizeCount: undefined,
      canRentEquipmentCount:undefined,
    };
  },

  created() {
    this.getNotices();
    this.getUser();
  },
  mounted() {
    // this.getNotices();
    this.getStudentIndexInfo();
    this.$nextTick(() => {
      this.initBarChart();
    });
  },

  methods: {
    goTarget(href) {
      window.open(href, "_blank");
    },
    getUser() {
      getUserProfile().then((response) => {
        this.user = response.data.user;
        console.log(this.user);
        this.roleGroup = response.data.roleGroup;
      });
    },
    initBarChart() {
      let myChart = this.$echarts.init(document.querySelector("#c1"));
      myChart.setOption(this.option);
    },
    getStudentIndexInfo() {
      getStudentIndexInfo().then((res) => {
        this.canAppointSizeCount = res.data.canAppointSizeCount;
        this.canRentEquipmentCount = res.data.canRentEquipmentCount;
    })
  },
    gotoPage(str) {
      this.$router.push("/gym/" + str);
    },
    getNotices(){
      getStudentIndexInfo().then((res)=>{
        for(var i = 0;i<2;i++){
          this.notices1[i] = res.data.notices[0][1+i].noticeInfo
        }
        for(var i = 0;i<2;i++){
          this.notices2[i] = res.data.notices[1][i].noticeInfo
        }
        for(var i = 0;i<2;i++){
          this.notices3[i] = res.data.notices[2][i].noticeInfo
        }
      })
    }

  },
};
</script>

<style lang="scss" scoped>
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}

.el-carousel__item img {
  height: 200px;
  width: 100%;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.changdi1 {
  height: 140px;

  // margin-top: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  margin: auto;
  margin-top: 28px;
  margin-left: 45px;
  font-size: 16px;
}
.qicai1 {
  height: 140px;
  // padding-right: 123px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  // margin-top:40px;
  margin: auto;
  margin-top: 15px;
  margin-left: 45px;
  font-size: 16px;
}
.info1 {
  display: flex;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  margin-left: 10px;
  height: 210px;
  align-items: center;
}
.info1 ul {
  margin-left: 20px;
  font-size: 17px;
}
.gonggao {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
#c1 {
  width: 100%;
  // height: 379px;
}
.rate-number {
  margin: 0;
  -webkit-animation: bounce 2s 2; /*设置动画*/
  font: 36px "微软雅黑";
  color: #e93b24;
  appearance: none;
}
.update-log .rate {
  margin-top: 0px;
}
.update-log .icon-rate {
  width: 38px;
  height: 38px;
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}
.update-log .rate i {
  font-size: 22px;
  margin-left: 15px;
  color: #e93b24;
  font-weight: 600;
}
.icon_1 img{
  width: 100px;
  height: 100px;
}

@-webkit-keyframes bounce {
  /*创建动画*/
  0%,
  100%,
  20%,
  50%,
  80% {
    -webkit-transform: translateY(0);
  }
  40% {
    -webkit-transform: translateY(-30px);
  }
  60% {
    -webkit-transform: translateY(-15px);
  }
}
</style>

