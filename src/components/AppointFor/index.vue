<template>
  <div class="main">
    <div class="date">
      <ul>
        <li
          v-for="date in appointTimeList"
          :key="date.dayOfWeek"
          @click="activeChoose(date)"
          :class="{ active: date.dayOfWeek === currentDayOfWeek }"
          
        >
          {{ formatDate(date.time) }} 周{{ date.dayOfWeek }}
        </li>
      </ul>

    </div>
    <div class="descript">
      <!-- <el-button
        type="primary"
        plain
        class="fl"
        style="width: 80px"
        @click="openMyAppoint"
        v-hasPermi="['gym:site:appoint']"
        >我的预约
      </el-button> -->
      <div class="color">
        <div class="status status0">
          <div></div>
          免费
        </div>
        <div class="status status1">
          <div></div>
          可预约
        </div>
        <div class="status status2">
          <div></div>
          不开放
        </div>
        <div class="status status3">
          <div></div>
          普通预约
        </div>
        <div class="status status4">
          <div></div>
          上课征用
        </div>
        <div class="status status5">
          <div></div>
          校队预约
        </div>
        <div class="status status6">
          <div></div>
          比赛征用
        </div>
      </div>
      <el-button
        type="primary"
        
        size="medium"
        style="width: 60px"
        class="fr"
        @click="handlePreViewAppoint"
        v-hasPermi="['gym:site:appoint']"
        :disabled="!isChoose"
        >确认
      </el-button>
    </div>
    <div class="detail_time">
      <div class="time_slot">
        <ul>
          <li></li>
          <li>8:30-9:30</li>
          <li>9:30-10:30</li>
          <li>10:30-11:30</li>
          <li>11:30-12:30</li>
          <li>12:30-13:30</li>
          <li>13:30-14:30</li>
          <li>14:30-15:30</li>
          <li>15:30-16:30</li>
          <li>16:30-17:30</li>
          <li>17:30-18:30</li>
          <li>18:30-19:30</li>
          <li>19:30-20:30</li>
          <li>20:30-21:30</li>
        </ul>
      </div>
      <div
        class="site"
        v-for="siteType in AppointSiteTypeList"
        :key="siteType.siteId"
      >
        <ul>
          <li :title="siteType.siteName">{{ siteType.siteName }}</li>
          <li
            v-for="siteAppointTime in siteType.dayOfSiteAppointTime"
            :key="siteAppointTime.siteAppointTimeId"
            :class="{
              free: siteAppointTime.appointStatus === '0',
              unable: siteAppointTime.appointStatus === '2',
              rented: siteAppointTime.appointStatus === '3',
              lesson: siteAppointTime.appointStatus === '4',
              schoolTeam: siteAppointTime.appointStatus === '5',
              compete: siteAppointTime.appointStatus === '6',
              choose:
                chooseAppointTime !== undefined &&
                chooseAppointTime.siteAppointTimeId ===
                  siteAppointTime.siteAppointTimeId,
            }"
            @click="setAppointTime(siteAppointTime)"
          >
            <div class="icon-flag">
              <img src="../../assets/images/flag1.png" alt="" />
            </div>
          </li>
        </ul>
      </div>
      
    </div>
    <!-- 场地预约信息对话框 -->
    <!-- <el-dialog
      title="预约信息"
      :visible.sync="open"
      width="560px"
      append-to-body
      :before-close="cancelAppointInfoDialog"
    >
      <el-descriptions :column="2" v-if="open">
        <el-descriptions-item label="场地名称"
          >{{ this.chooseAppointTime.siteName }}
        </el-descriptions-item>
        <el-descriptions-item label="预约类型"
          >{{ getAppointTypeLabel(this.chooseAppointTime.appointType) }}
        </el-descriptions-item>
        <el-descriptions-item label="场地费率"
          >{{
            this.chooseAppointTime.appointType === "1"
              ? this.chooseAppointTime.chargeRate / 10 + "元/小时"
              : "免费"
          }}
        </el-descriptions-item>
        <el-descriptions-item label="预约时间">
          {{
            formatDate(this.chooseAppointTime.beginTime) +
            " " +
            getHourAndMinute(this.chooseAppointTime.beginTime) +
            "~" +
            getHourAndMinute(this.chooseAppointTime.endTime)
          }}
        </el-descriptions-item>
        <el-descriptions-item
          label="注意事项"
          v-if="
            this.chooseAppointTime.appointType === '0' ||
            this.chooseAppointTime.appointType === '1'
          "
          ><div style="line-height: 25px">
            请按时签到，保证场地使用时间不小于预约时间的50%。<br />不满50%的按违约处理：七天内不得进行场地预约。
          </div>
        </el-descriptions-item>
      </el-descriptions>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" size="medium "
          >确 定
        </el-button>
        <el-button @click="cancelAppointInfoDialog">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="一卡通验证"
      :visible.sync="CartInfoOpen"
      width="400px"
      append-to-body
    >
      <el-form
        ref="form"
        :model="chooseAppointTime"
        :rules="rules"
        label-width="100px"
        v-if="CartInfoOpen"
      >
        <el-form-item label="一卡通账号" prop="cartId">
          <el-input
            v-model="chooseAppointTime.cartId"
            placeholder="一卡通账号"
          />
        </el-form-item>
        <el-form-item label="密码" prop="cartPassword">
          <el-input
            v-model="chooseAppointTime.cartPassword"
            placeholder="一卡通密码"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="siteAppoint" size="medium"
          >确 定
        </el-button>
        <el-button @click="cancelCartDialog">取 消</el-button>
      </div>
    </el-dialog> -->

    <!-- <MyAppoint
      ref="MyAppoint"
      @closeMyAppoint="closeMyAppoint"
      :openDrawer="drawer"
    ></MyAppoint> -->
  </div>
</template>

<script>
import {
  getAppointTime,
  getAppointBySiteType,
  getAppointPreView,
  siteAppoint,
} from "@/api/gym/site";
import { mapGetters } from "vuex";
// import MyAppoint from "@/components/MyAppoint";

export default {
  name: "appointTimeDetail",
  props: {
    siteTypeId: Number,
    openInner:Boolean,
  },
  // components: {
  //   MyAppoint,
  // },
  data() {
    return {
      beginTime:'',
      endTime:"",
      siteName:'',
      appointTimeList: [],
      currentDayOfWeek: 0,
      AppointSiteTypeList: [],
      chooseAppointTime: undefined,
      isChoose: false,
      // 是否显示弹出层
      open: false,
      // 是否输入一卡通
      CartInfoOpen: false,
      // 表单参数
      form: {},
      // 注意事项
      attention: "",
      // 表单校验
      rules: {
        cartId: [
          { required: true, message: "请输入一卡通账号", trigger: "blur" },
          {
            pattern: /^\d{12}$/,
            message: "一卡通账号必须为十二位数字",
            trigger: "blur",
          },
        ],
        cartPassword: [
          { required: true, message: "必须输入一卡通密码", trigger: "blur" },
        ],
      },
      //是否打开‘我的预约’
      drawer: false,
    };
  },
  computed: {
    ...mapGetters(["roles"]),
  },
  mounted() {
    this.initAppointTime();
    const day = new Date().getDay();
    this.currentDayOfWeek = day === 0 ? 7 : day;
    this.selectAppointDetailBySiteType();
  },
  methods: {
    // 表单重置
    reset() {
      this.chooseAppointTime.cartId = "";
      this.chooseAppointTime.cartPassword = "";
    },
    // openMyAppoint() {
    //   this.drawer = true;
    //   this.$refs.MyAppoint.selectUserAppoint();
    // },
    selectAppointDetailBySiteType() {
      getAppointBySiteType({
        dayOfWeek: this.currentDayOfWeek,
        siteTypeId: this.siteTypeId,
      }).then((response) => {
        console.log(response);
        this.AppointSiteTypeList = response.data;
      });
    },
    initAppointTime() {
      getAppointTime().then((response) => {
        console.log(response);
        this.appointTimeList = response.data;
        this.currentDayOfWeek = response.data[0].dayOfWeek;
      });
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      const year = (date.getFullYear())
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    getHourAndMinute(dateStr) {
      const date = new Date(dateStr);
      const hour = date.getHours().toString().padStart(2, "0");
      const minute = date.getMinutes().toString().padStart(2, "0");
      return hour + ":" + minute;
    },
    activeChoose(date) {
      this.currentDayOfWeek = date.dayOfWeek;
      this.selectAppointDetailBySiteType();
    },
    setAppointTime(siteAppointTime) {
      if (!this.checkAppointStatus(siteAppointTime)) {
        this.$message({ message: "当前时间段不可预约", type: "error" });
        return;
      }
      if (this.chooseAppointTime === undefined) {
        this.chooseAppointTime = siteAppointTime;
        this.isChoose = true;
      } else if (
        this.chooseAppointTime.siteAppointTimeId ===
        siteAppointTime.siteAppointTimeId
      ) {
        this.chooseAppointTime = undefined;
        this.isChoose = false;
      } else {
        this.chooseAppointTime = siteAppointTime;
      }
    },
    handlePreViewAppoint() {
      getAppointPreView(this.chooseAppointTime).then((response) => {
        console.log(response.data);
        if (!response.flag) {
          this.$message({ message: response.message, type: "error" });
          return;
        }
        this.beginTime = this.formatDate(response.data.beginTime) + " " 
                        +this.getHourAndMinute(response.data.beginTime)
        this.endTime = this.formatDate(response.data.endTime) + " " 
                        +this.getHourAndMinute(response.data.endTime)
        this.siteName = response.data.siteName
        // 判断用户，确定预约类型
        this.confirmAppointType();
        //打开预约窗口
        this.$emit("handlePreViewAppoint",this.openInner1,this.beginTime,
        this.endTime,this.siteName)
      });
    },
    checkAppointStatus(siteAppointTime) {
      return (
        siteAppointTime.appointStatus === "0" ||
        siteAppointTime.appointStatus === "1"
      );
    },
    // 根据用户身份，确定可预约场地类型
    confirmAppointType() {
      const role = this.roles[0];
      if (role === "student") {
        //学生
        this.chooseAppointTime.appointType =
          this.chooseAppointTime.appointStatus;
      } else if (role === "team") {
        this.chooseAppointTime.appointType = "5";
      } else {
        this.chooseAppointTime.appointType = "4";
      }
    },
    submitForm() {
      if (
        this.roles[0] === "student" &&
        this.chooseAppointTime.appointStatus === "1"
      ) {
        this.CartInfoOpen = true;
      } else {
        this.siteAppoint();
      }
    },
    //场地预定
    siteAppoint() {
      siteAppoint(this.chooseAppointTime).then((response) => {
        if (response.flag) {
          this.$message({ message: response.message, type: "success" });
        } else {
          this.$message({ message: response.message, type: "error" });
        }
        this.selectAppointDetailBySiteType();
        this.siteAppointSuccessReset();
      });
    },
    siteAppointSuccessReset() {
      this.CartInfoOpen = false;
      this.open = false;
      this.reset();
      this.isChoose = false;
      this.chooseAppointTime = undefined;
    },
    cancelCartDialog() {
      this.CartInfoOpen = false;
      this.reset();
    },
    cancelAppointInfoDialog() {
      this.open = false;
    },

    getAppointTypeLabel(appointType) {
      switch (appointType) {
        case "0":
          return "免费预约";
        case "1":
          return "付费预约";
        case "4":
          return "上课征用";
        case "5":
          return "校队预约";
      }
    },
    closeMyAppoint() {
      //每次关闭重新查询
      this.selectAppointDetailBySiteType();
      this.drawer = false;
    },
  },
};
</script>

<style scoped>
* {
  margin: 0px;
  padding: 0px;
}

.el-button {
  width: 60px;
  height: 30px;
}

li {
  list-style: none;
}

.main {
  width: 100%;
  margin-top: 5px;
}

.head {
  display: flex;
  justify-content: start;
}

.date ul {
  /* background-color: pink; */
  margin-bottom: 10px;
  width: 100%;
  height: 36px;
}

.date ul li {
  float: left;
  height: 36px;
  line-height: 36px;
  margin-left: 19px;
  background-color: rgba(163, 211, 253, 0.331);
  width: 13%;
  text-align: center;
}

.date ul li:nth-child(1) {
  margin-left: 0px;
}

.date ul li.active {
  color: #fff;
  background-color: #45a0e5;
}

.fl {
  float: left;
}

.fr {
  float: right;
}

.descript {
  position: relative;
  overflow: hidden;
}

.descript .color {
  position: absolute;
  left: 400px;
  display: flex;
  justify-content: start;
  /* background-color: pink; */
  width: 500px;
  height: 20px;
  font-size: 13px;
}

.status {
  width: 90px;
  display: flex;
  justify-content: start;
}

.color .status0 {
  width: 60px;
}

.color .status1,
.color .status2 {
  width: 75px;
}

.color .status div {
  width: 20px;
  height: 20px;
  margin-right: 2px;
}

.color .status0 div {
  background-color: rgb(25, 230, 223);
}

.status1 div {
  background-color: rgba(168, 213, 175, 0.628);
}

.status2 div {
  background-color: rgba(146, 146, 146, 0.628);
}

.status3 div {
  background-color: rgba(62, 132, 217, 0.628);
}

.status4 div {
  background-color: rgb(245, 245, 26);
}

.status5 div {
  background-color: rgb(16, 182, 113);
}

.status6 div {
  background-color: red;
}

.detail_time {
  position: relative;
  overflow-x: scroll;
  display: flex;
  justify-content: start;
  flex-wrap: no-wrap;
  margin-top: 13px;
  /* background-color: #45a0e5; */
  width: 100%;
  /* height: 600px; */
}

.detail_time div {
  width: 120px;
  flex-shrink: 0;
  margin-right: 7px;
}

.detail_time .time_slot {
  /* background-color: rgba(198, 190, 202, 0.331); */
  position: sticky;
  left: 0px;
  z-index: 99;
  margin-bottom: 5px;
  width: 120px;
  height: 100%;
}

.detail_time li {
  height: 42px;
  line-height: 42px;
  text-align: center;
  margin-top: 3px;
  background-color: rgba(114, 255, 173, 0.928);
}

.detail_time .time_slot li {
  background-color: rgb(242, 244, 245);
}

.detail_time .site {
  opacity: 1;
  width: 110px;
  height: 100%;
}
.detail_time .site li {
  position: relative;
}
.detail_time .site li .icon-flag {
  display: none;
  position: absolute;
  top: 5px;
  left: 38px;
  width: 30px;
  height: 30px;
}
.icon-flag img {
  width: 100%;
  height: 100%;
}
.detail_time .site li:nth-child(1) {
  background-color: rgb(242, 244, 245);
  overflow: hidden;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.detail_time li.free {
  background-color: rgb(25, 230, 223);
}

.detail_time li.unable {
  background-color: rgba(128, 128, 128, 0.384);
}

.detail_time li.rented {
  background-color: rgba(62, 132, 217, 0.628);
}

.detail_time li.lesson {
  background-color: rgba(250, 189, 57, 0.677);
}

.detail_time li.schoolTeam {
  background-color: rgb(15, 209, 128);
}

.detail_time li.compete {
  background-color: red;
}

.detail_time li.choose {
  /* position: relative; */
  box-shadow: 0 0 5px 1px rgba(28, 28, 27, 0.3);
}
.detail_time .site li.choose .icon-flag {
  display: block;
}
.el-form-item {
  margin-top: 25px;
}
</style>
