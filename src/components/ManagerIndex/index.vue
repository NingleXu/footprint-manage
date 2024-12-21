<template>
  <div>
    <el-row :gutter="25">
      <el-col :xs="24" :sm="24" :md="12" :lg="9">
        <div class="info1">
          <userAvatar :user="user" style="margin-left: 20px"/>
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
      <el-col :span="5">
        <el-card style="height: 210px">
          <i class="head-tit">场地使用率</i>
          <div class="rate">
            <div class="icon-rate fl">
              <img src="../../assets/images/site0.png" alt="">
            </div>
            <div class="rate-number fr">
              {{ siteUsePercentage }}%
            </div>
          </div>
          <div class="rate-compare">
            <i class="fl">周同比20%</i>
            <i class="fr">日环比2%</i>
          </div>
          <el-progress
            :percentage="siteUsePercentage"
            style="margin-top: 56px; width: 230px"
            color="rgb(208, 155, 91)"
          ></el-progress>
        </el-card>
      </el-col>
      <el-col :span="5">
        <el-card style="height: 210px">
          <i class="head-tit">器材租借率</i>
          <div class="rate">
            <div class="icon-rate fl">
              <img src="../../assets/images/equipment.png" alt=""/>
            </div>
            <div class="rate-number fr">{{ equipmentUsePercentage }}%</div>
          </div>
          <div class="rate-compare">
            <i class="fl">周同比20%</i>
            <i class="fr">日环比2%</i>
          </div>
          <el-progress
            :percentage="equipmentUsePercentage"
            style="margin-top: 56px; width: 230px"
            color="green"
          ></el-progress>
        </el-card>
      </el-col>
      <el-col :span="5">
        <el-card style="height: 100px; position: relative">
          <div class="img">
            <img src="../../assets/images/appoint.png" alt=""/>
          </div>
          <div class="appoint-tit tit" @click="gotoPage('appoint')">
            <i class="fl">场地预约</i>
            <i class="fr">&gt;</i>
          </div>
        </el-card>
        <el-card style="height: 100px; position: relative; margin-top: 10px">
          <div class="img">
            <img src="../../assets/images/rent.png" alt=""/>
          </div>
          <div class="rent-tit tit" @click="gotoPage('rent')">
            <i class="fl">器材租借</i>
            <i class="fr">&gt;</i>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card style="margin-top: 20px">
          <div class="output" @click="openDialog">
            <img src="../../assets/images/output.png" alt=""/>
          </div>
          <!-- 这个 div 就会被解析为 echarts图 -->
          <div class="barChart" ref="barChart"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="compete">
          <!--<<<<<<< HEAD-->
          <!--               &lt;!&ndash; 赛事标题 &ndash;&gt;-->
          <!--               <div slot="header" class="clearfix">-->
          <!--                <div class="rate">-->
          <!--                 <i>本周赛事</i>-->
          <!--                 <div class="icon-rate fl">-->
          <!--                  <img src="../../assets/images/site2.png" alt="" />-->
          <!--                 </div>-->
          <!--                </div>-->
          <!--               </div>-->
          <!--               &lt;!&ndash; 赛事内容 &ndash;&gt;-->
          <!--               <div class="body">-->
          <!--                <div class="text tableTitle" style="margin-bottom:3px">-->
          <!--                 <div class="time">-->
          <!--                  <img src="../../assets/images/time.webp" alt="">-->
          <!--                 <span>时间</span>-->
          <!--                 </div>-->
          <!--                 <span>名称</span>-->
          <!--                 <span>地点</span>-->
          <!--                 <div class="referee">-->
          <!--                  <span>裁判</span>-->
          <!--                 <img src="../../assets/images/referee.jpg" alt="">-->
          <!--                 </div>-->
          <!--                </div>-->
          <!--                <div v-for="item in events" :key="item.id" class="text item textStyle" style="margin-top:15px">-->
          <!--                   <img src="../../assets/images/event_2.jpg" alt="" style="weight:25px;height:20px;margin-top:8px">-->
          <!--                   <span>{{ item.eventTime }}</span>-->
          <!--                   <span>{{ item.eventName }}</span>-->
          <!--                   <span>{{ item.eventSite }}</span>-->
          <!--                   <span>{{ item.eventReferee }}</span>-->
          <!--                  </div>-->
          <!--               </div>-->
          <!--              </el-card>-->
          <!--      </el-col>-->
          <!--    </el-row>-->
          <!--     <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">-->
          <!--       <div>-->
          <!--       <span style="font-size:20px;">请你选择要导出的时间段</span>-->
          <!--        <el-radio-group v-model="days" size="middle" style="margin-top:20px;">-->
          <!--         <el-radio-button label="7">-->
          <!--          近一星期-->
          <!--         </el-radio-button>-->
          <!--         <el-radio-button label="30">-->
          <!--          近一个月-->
          <!--         </el-radio-button>-->
          <!--         <el-radio-button label="180">-->
          <!--          近半年-->
          <!--         </el-radio-button>-->
          <!--         <el-radio-button label="360">-->
          <!--          近一年-->
          <!--         </el-radio-button>-->
          <!--        </el-radio-group>-->
          <!--       </div>-->


          <!--       <el-button type="success" @click="outputRevenueExcel" style="margin-top:30px;margin-left:340px;">导出</el-button>-->

          <!--      </el-dialog>-->
          <!--=======-->
          <!-- 赛事标题 -->
          <div slot="header" class="clearfix">
            <div class="rate">
              <i>本周赛事</i>
              <div class="icon-rate fl">
                <img src="../../assets/images/site2.png" alt=""/>
              </div>
            </div>
          </div>
          <!-- 赛事内容 -->
          <div class="body">
            <div class="text tableTitle" style="margin-bottom: 3px">
              <div class="time">
                <img src="../../assets/images/time.webp" alt=""/>
                <span>时间</span>
              </div>
              <span>名称</span>
              <span>地点</span>
              <div class="referee">
                <span>裁判</span>
                <img src="../../assets/images/referee.jpg" alt=""/>
              </div>
            </div>
            <div
              v-for="item in events"
              :key="item.id"
              class="text item textStyle"
              style="
                margin-top: 20px;
                display: flex;
                justify-content: flex-end;
                align-items: center;
              "
            >
              <img
                src="../../assets/images/event_2.jpg"
                alt=""
                style="weight: 25px; height: 20px; margin-top: 8px"
              />
              <span>{{ item.eventTime }}</span>
              <span>{{ item.eventName }}</span>
              <span>{{ item.eventSite }}</span>
              <span class="referee1" @click="displayInfo($event)">{{ item.eventReferee }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <div>
        请你选择要导出的时间段
        <el-radio-group v-model="days" size="middle">
          <el-radio-button label="7"> 近一星期</el-radio-button>
          <el-radio-button label="30"> 近一个月</el-radio-button>
          <el-radio-button label="180"> 近半年</el-radio-button>
          <el-radio-button label="360"> 近一年</el-radio-button>
        </el-radio-group>
      </div>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="outputRevenueExcel">确 定</el-button>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="dialogVisibleReferee" width="30%">
      <el-card class="box-card refereeinfo">
        <div class="text item">
          <ul>
            <li><img :src="refereeInfo.gymRefereePicture" alt=""></li>
            <li>姓名：{{ refereeInfo.gymRefereeName }}</li>
            <li>性别：{{ refereeInfo.gymRefereeSex }}</li>
            <li>裁判类型：{{ refereeInfo.gymRefereeType }}</li>
            <li>个人介绍：{{ refereeInfo.gymRefereeIntroduction }}</li>
          </ul>
        </div>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import userAvatar from "@/views/system/user/profile/userAvatar.vue";
import {getManagerIndexInfo, outputRevenueExcel} from "@/api/gym/home";
import {getUserProfile} from "@/api/system/user";
import {getSevenList} from "@/api/gym/event";
import {getRefereeList} from '@/api/gym/referee';

export default {
  name: "Index",
  components: {userAvatar},
  data() {
    return {
      siteUsePercentage: 0,
      equipmentUsePercentage: 0,
      user: {},
      days: 30,
      option: {
        title: {
          text: '近七天运营报表'
        },
        // 鼠标放到图上展示的数据样式，trigger: 'axis'   (有axis/item/none三个值,axis是一条竖线)
        tooltip: {},
        // 用来标志图表数据，data字段的数组需要对应每个柱条的名称，鼠标hover到最顶部的legend标志，可以标志对应的图，点击legend标志会隐藏对应的图
        legend: {
          data: ["器材收益", "场地收益", "流水净额"],
        },
        // 配置x轴数据、样式、名称
        xAxis: {
          type: "category", // 可以不写，默认type就是category
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"], // x轴数据
          name: "日期", // x轴名称
          // x轴名称样式
          // nameTextStyle: {
          //   fontWeight: 300,
          //   fontSize: 18
          // }
        },
        // 配置y轴名称，样式
        yAxis: {
          name: "CNY 1,000", // y轴名称
        },
        // y轴数据，每个柱条的名称
        series: [
          {
            name: "器材收益",
            type: "bar", // 类型为柱状图
            barMinHeight: 2,
            data: [600, 700, 800, 1000, 1100, 800, 100],
            barWidth: "10%", // 柱条宽度 每个柱条的宽度就是类目宽度的 20%
            // 柱子的样式
            itemStyle: {
              color: "#4c84fc",
            },
          },
          {
            name: "场地收益",
            type: "bar",
            data: [600, 700, 800, 1000, 1100, 800],
            barMinHeight: 2,
            barWidth: "10%", // 柱条宽度 每个柱条的宽度就是类目宽度的 20%
            // 柱子的样式
            itemStyle: {
              color: "#fcb41c",
            },
          },
          {
            name: "流水净额",
            type: "line",
            // 平滑折线
            smooth: true,
            data: [600, 700, 800, 1000, 200, 800],
            barWidth: "10%", // 柱条宽度 每个柱条的宽度就是类目宽度的 20%
            // 柱子的样式
            itemStyle: {
              color: "#58b671",
            },
          },
        ],
      },
      events: [
        {
          id: 1,
          eventTime: "周三2:30-4:30",
          eventName: "数计院篮球赛-初赛",
          eventSite: "A6-篮球场",
          eventReferee: "张三",
        },
        {
          id: 2,
          eventTime: "周五2:30-4:30",
          eventName: "数计院篮球赛-半决赛",
          eventSite: "A6-篮球场",
          eventReferee: "李四",
        },
        {
          id: 3,
          eventTime: "周六2:30-4:30",
          eventName: "数计院篮球赛-决赛",
          eventSite: "A6-篮球场",
          eventReferee: "王五",
        },
      ],
      dialogVisible: false,
      dialogVisibleReferee: false,
      refereeInfo: {},
    };
  },
  created() {
    this.initTime();
    this.getUser();
    this.displayEvent();
  },
  mounted() {
    this.displayEvent();
    this.getManagerIndexInfo();

  },
  methods: {
    initTime() {
      var dates = [];
      var today = new Date(); // 获取当前日期

      for (var i = 6; i >= 0; i--) {
        var pastDate = new Date(today);
        pastDate.setDate(pastDate.getDate() - i); // 减去相应天数

        var year = pastDate.getFullYear();
        var month = String(pastDate.getMonth() + 1).padStart(2, "0"); // 月份从0开始，需要+1，并且补零
        var day = String(pastDate.getDate()).padStart(2, "0"); // 补零

        dates.push(year + "-" + month + "-" + day);
      }
      this.option.xAxis.data = dates;
    },
    openDialog() {
      this.dialogVisible = true;
    },
    outputRevenueExcel() {
      outputRevenueExcel(this.days).then((res) => {
        this.$message.success("获取成功！正在下载请耐心等待！");
        let filename = "";
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(res.headers["content-disposition"]);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, "");

          // 解码中文乱码
          filename = decodeURIComponent(filename);
        }
        const link = document.createElement("a");
        let blob = new Blob([res.data], {type: "multipary/form-data"});
        link.style.display = "none";
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
      this.dialogVisible = false;
    },
    initBarChart() {
      let myChart = this.$echarts.init(this.$refs.barChart);
      myChart.setOption(this.option);
    },
    gotoPage(str) {
      this.$router.push("/gym/" + str);
    },
    getManagerIndexInfo() {
      getManagerIndexInfo(this.days).then((res) => {
        this.siteUsePercentage = res.data.siteUsePercentage;
        this.equipmentUsePercentage = res.data.equipmentUsePercentage;
        for (var i = 0; i < 7; i++) {
          res.data.amountStatic[0][i] = res.data.amountStatic[0][i] === 0 ? 0 : res.data.amountStatic[0][i] /= 10;
          res.data.amountStatic[1][i] = res.data.amountStatic[1][i] === 0 ? 0 : res.data.amountStatic[1][i] /= 10;
        }
        this.option.series[1].data = res.data.amountStatic[0];
        this.option.series[0].data = res.data.amountStatic[1];
        const total = [];
        for (var i = 0; i < 7; i++)
          total[i] = this.option.series[0].data[i] + this.option.series[1].data[i];
        this.option.series[2].data = total;
        this.$nextTick(() => {
          this.initBarChart();
        });
      });
      this.dialogVisible = false;
    },
    getUser() {
      getUserProfile().then((response) => {
        this.user = response.data.user;
      });
    },
    displayInfo(e) {
      this.dialogVisibleReferee = true;
      const refereeName = e.currentTarget.innerHTML;
      console.log(e.currentTarget.innerHTML);
      getRefereeList().then((res) => {
        this.refereeInfo = res.data.rows.find((item) => {
          return item.gymRefereeName === refereeName

        })
      })
    },
    displayEvent() {
      console.log(this.events)
      // getSevenList().then((res) => {
      //   this.events = res.data.rows;
      // })
    },

  },
};
</script>

<style>
li {
  list-style: none;
}

.fl {
  float: left;
}

.fr {
  float: right;
}

.info1 {
  display: flex;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  margin-left: 10px;
  height: 210px;
  align-items: center;
}

.info1 ul {
  font-size: 16px;
}

.rate {
  margin-top: 10px;
  width: 100%;
  overflow: hidden;
}

.rate .icon-rate {
  width: 70px;
  height: 70px;
}

.rate .icon-rate img {
  width: 100%;
  height: 100%;
}

.rate .rate-number {
  font-size: 32px;
  margin-top: 20px;
  margin-right: 35px;
}

.rate-compare {
  margin-top: 10px;
  font-size: 13px;
  color: rgb(85, 85, 85);
}

.img {
  position: absolute;
  left: 13px;
  top: 13px;
  width: 70px;
  height: 70px;
}

.img img {
  width: 100%;
  height: 100%;
}

.tit {
  position: absolute;
  top: 40px;
  left: 100px;
  width: 110px;
  font-size: 20px;
  font-weight: bold;
  font-family: "fangsong";
}

.appoint-tit {
  color: rgb(67, 143, 26);
}

.appoint-tit:hover {
  transition: transform 0.5s ease; /* 设置过渡效果 */
  transform: translateX(15px); /* 鼠标悬停时向右移动50像素 */
}

.rent-tit {
  color: rgb(208, 155, 91);
}

.rent-tit:hover {
  transition: transform 0.5s ease; /* 设置过渡效果 */
  transform: translateX(15px); /* 鼠标悬停时向右移动50像素 */
}

.barChart {
  width: 100%;
  height: 335px;
}

.compete {
  margin-top: 20px;
  height: 370px;
}

.compete .rate {
  margin-top: 0px;
}

.compete .icon-rate {
  width: 42px;
  height: 42px;
}

.compete .rate i {
  font-size: 21px;
  margin-left: 15px;
  color: #4251a5;
  font-weight: 600;
}

.textStyle {
  font-size: 16px;
  font-family: "华文新魏";
  color: black;
}

.item {
  margin-bottom: 20px;
}

.compete .body span {
  margin-left: 8px;
}

.tableTitle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 22px;
  color: #495ab5;
  font-weight: 800;
}

.tableTitle img {
  width: 40px;
  height: 40px;
}

.time,
.referee {
  display: flex;
  align-items: center;
}

.output {
  position: absolute;
  right: 470px;
  width: 20px;
  height: 20px;
  z-index: 999;
}

.output img {
  width: 100%;
  height: 100%;
}

/*<<<<<<< HEAD*/

/*.compete {*/
/*   margin-top: 20px;*/
/*   height: 370px;*/
/*}*/

/*.compete .rate {*/
/*   margin-top: 0px;*/
/*}*/
/*.compete .icon-rate {*/
/*   width: 42px;*/
/*   height: 42px;*/
/*}*/
/*.compete .rate i {*/
/*   font-size: 21px;*/
/*   margin-left: 15px;*/
/*   color: #4251a5;*/
/*   font-weight: 600;*/
/*}*/
/*.textStyle {*/
/*   font-size: 16px;*/
/*   font-family:"华文新魏";*/
/*   color: black;*/
/*}*/

/*.item {*/
/*   margin-bottom: 18px;*/
/*}*/
/*.compete .body span {*/
/*   margin-left: 8px;*/
/*}*/
/*.tableTitle {*/
/*   display: flex;*/
/*   justify-content: space-between;*/
/*   align-items: center;*/
/*   font-size: 22px;*/
/*   color: #495ab5;*/
/*   font-weight: 800;*/
/*}*/

/*.tableTitle img {*/
/*   width: 40px;*/
/*   height: 40px;*/
/*}*/

/*.time,*/
/*.referee {*/
/*   display: flex;*/
/*   align-items: center;*/
/*}*/
/*=======*/
.textStyle span {
  display: inline-block;
  width: 100px;
}

.referee1:hover {
  cursor: pointer;
  color: #fff;
  color: #485082;
  font-weight: 600;
}

.refereeinfo ul {
  padding-left: 0;
}

.refereeinfo li {
  list-style: none;
  margin-bottom: 20px;
  margin-bottom: 24px;
  font-size: 21px;
  color: #3d8588;
  font-weight: 600;
  font-family: "楷体";
}

.refereeList {
  display: flex;

  flex-wrap: wrap;


  justify-content: space-evenly;
}

.box-card img {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  margin-left: 25%;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.refereeinfo {
  width: 424px;
  height: 480px;
  margin-bottom: 30px;
}
</style>
