<template>
  <div>
    <!-- 我的预约 弹出抽屉 -->
    <el-drawer
      title="我的预约"
      :visible.sync="openDrawer"
      direction="rtl"
      :before-close="handleClose"
    >
      <div class="reputation">
        信誉状态:
        <el-tag v-if="isDefault" type="danger" style="width: 70px">
          违约处罚中
        </el-tag>
        <el-tag v-else> 信誉良好</el-tag>
      </div>

      <el-collapse v-model="activeNames">
        <el-collapse-item title="当前预约" name="1">
          <el-col
            :span="23"
            v-for="unCompletedAppointOrder in unCompletedAppointOrderList"
          >
            <el-card shadow="always" class="appointing">
              <img :src="siteTypeImg(unCompletedAppointOrder)" alt=""/>
              <div class="information">
                <p>场地名称：{{ unCompletedAppointOrder.siteName }}</p>
                <p>场地费率：{{ unCompletedAppointOrder.chargeRate/10 }} 元</p>
                <p>
                  预约类型：{{
                    getAppointTypeLabel(unCompletedAppointOrder.appointType)
                  }}
                </p>
                <p>
                  预约状态：
                  <el-tag
                    v-if="unCompletedAppointOrder.noStart"
                    effect="dark"
                    type="info"
                    size="mini"
                  >
                    未开始
                  </el-tag>
                  <el-tag v-else effect="dark" type="warning" size="mini">
                    进行中
                  </el-tag>
                </p>
                <p>
                  预约时间：{{ getAppointTimeFormat(unCompletedAppointOrder) }}
                </p>
                <div
                  class="countTime"
                  v-if="
                    unCompletedAppointOrder.needSignIn &&
                    unCompletedAppointOrder.isSignIn &&
                    !unCompletedAppointOrder.isSignOut
                  "
                >
                  使用时间：{{ unCompletedAppointOrder.useTime }}
                </div>
                <div class="btn">
                  <el-button
                    type="primary"
                    size="mini"
                    v-if="!unCompletedAppointOrder.noStart"
                    style="width: 80px; height: 26px;"
                    @click="presentAppointmentInformation(unCompletedAppointOrder)"
                  >
                    出示预约信息
                  </el-button>
                  <el-button
                    type="primary"
                    @click="siteAppointSignIn(unCompletedAppointOrder)"
                    size="mini"
                    v-if="
                      unCompletedAppointOrder.needSignIn &&
                      !unCompletedAppointOrder.isSignIn
                    "
                  >
                    签到
                  </el-button>
                  <el-button
                    type="primary"
                    @click="checkIsEnoughTime(unCompletedAppointOrder)"
                    size="mini"
                    v-if="
                      unCompletedAppointOrder.needSignIn &&
                      unCompletedAppointOrder.isSignIn &&
                      !unCompletedAppointOrder.isSignOut
                    "
                  >
                    签退
                  </el-button>
                  <el-button
                    type="primary"
                    disabled
                    size="mini"
                    v-if="
                      unCompletedAppointOrder.needSignIn &&
                      unCompletedAppointOrder.isSignIn &&
                      unCompletedAppointOrder.isSignOut
                    "
                  >
                    已签退
                  </el-button>
                  <el-button
                    type="danger"
                    @click="cancelAppointOrder(unCompletedAppointOrder)"
                    size="mini"
                    style="width: 60px; height: 26px; margin-right: -30px"
                    v-if="unCompletedAppointOrder.noStart"
                    v-hasPermi="['gym:site:appoint:cancel']"
                  >取消预约
                  </el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-collapse-item>
        <el-collapse-item title="预约历史" name="2">
          <el-col
            :span="11"
            v-for="completedAppointOrder in completedAppointOrderList"
            :key="completedAppointOrder.siteAppointOrderId"
          >
            <el-card :body-style="{ padding: '0px' }" class="appointed">
              <img
                :src="siteTypeImg(completedAppointOrder)"
                style="width: 184px;height: 122px"
              />
              <div style="padding: 14px">
                <span>{{ completedAppointOrder.siteName }}</span>
                <div class="bottom clearfix">
                  <time class="time">
                    {{ getAppointTimeFormat(completedAppointOrder) }}
                  </time
                  >
                  <el-tag
                    v-if="completedAppointOrder.siteAppointOrderStatus === '2'"
                    type="success"
                    class="tag"
                  >已完成
                  </el-tag>
                  <el-tag
                    v-if="completedAppointOrder.siteAppointOrderStatus === '3'"
                    type="info"
                    class="tag"
                  >已取消
                  </el-tag>
                  <el-tag
                    v-if="completedAppointOrder.siteAppointOrderStatus === '4'"
                    type="danger"
                    class="tag"
                  >已违约
                  </el-tag>
                  <el-button
                    type="primary"
                    class="button"
                    @click="openAppointInfo(completedAppointOrder)"
                  >预约详情
                  </el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-collapse-item>
        <el-collapse-item title="违约记录" name="3">
          <div v-for="item in defaultRecordList">
            {{ item.defaultDescribe }}
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-drawer>
    <el-dialog
      title="预约凭证"
      :visible.sync="openVoucher"
      width="340px"
      append-to-body
    >
      <el-image style="width: 300px; height: 300px" :src="voucherSrc"></el-image>
    </el-dialog>
    <!-- 预约详情 弹框 -->
    <AppointInfo
      @closeAppointInfo="closeAppointInfo"
      :appointInfo="this.chooseCompletedAppointOrder"
      :openDialog="this.AppointInfoOpen"
    ></AppointInfo>
  </div>
</template>

<script>
import AppointInfo from "@/components/AppointInfo";
import {
  getMyAppoint,
  appointSignIn,
  appointSignOut,
  cancelAppointOrder,
  presentAppointmentInformation
} from "@/api/gym/site";
import request from "../../utils/request";

export default {
  name: "MyAppoint",
  data() {
    return {
      voucherSrc: "",
      openVoucher: false,
      //查看完成的预约集合
      completedAppointOrderList: [],
      //查看进行中的预约集合
      unCompletedAppointOrderList: [],
      //违约记录
      defaultRecordList: [],
      // 是否弹出预约详情
      AppointInfoOpen: false,
      activeNames: ["1"],
      //定时器
      timer: null,
      //选择查看的详情
      chooseCompletedAppointOrder: undefined,
      isDefault: false,
      //执行的次数
      count : 10
    };
  },
  props: {
    openDrawer: Boolean,
  },
  components: {
    AppointInfo,
  },
  methods: {
    selectUserAppoint() {
      getMyAppoint().then((response) => {
        this.completedAppointOrderList =
          response.data.completedAppointOrderList;
        this.unCompletedAppointOrderList =
          response.data.unCompletedAppointOrderList;
        this.defaultRecordList = response.data.defaultRecordList;
        this.isDefault = response.data.isDefault;
        //手动获取一遍
        this.changeStatus();
        //开启自动执行
        this.autoChangeStatus();
      });
    },
    autoChangeStatus() {
      //清除定时器
      if (this.timer !== null) clearInterval(this.timer);
      //开启定时器
      this.timer = setInterval(() => {
        this.selectUserAppoint();
      }, 1000);
    },
    changeStatus() {
      this.unCompletedAppointOrderList.forEach((appoint) => {
        this.handlerAppointStatus(appoint);
      });
    },
    //判断一个未完成的预约的状态
    handlerAppointStatus(appoint) {
      const date = new Date();
      const beginUseTime = new Date(appoint.beginUseTime);
      const endUseTime = new Date(appoint.endUseTime);
      //说明未开始
      if (beginUseTime > date) {
        appoint.noStart = true;
      } else if (beginUseTime < date && date < endUseTime) {
        appoint.noStart = false;
        //正在进行中
        //判断是否需要签到
        if (appoint.appointType !== "0" && appoint.appointType !== "1") {
          //不需要签到
          appoint.needSignIn = false;
        } else {
          appoint.needSignIn = true;
          //需要签到 判断是否签到
          appoint.isSignIn = appoint.clockInTime !== null;
          //判断是否签退
          appoint.isSignOut = appoint.clockEndTime !== null;
          //已经签到未签退
          if (appoint.isSignIn && !appoint.isSignOut) {
            let diff = date - new Date(appoint.clockInTime);
            if (diff < 0) diff = 0;
            const diffDate = new Date(diff);
            const hours = diffDate.getUTCHours().toString().padStart(2, "0");
            const minutes = diffDate
              .getUTCMinutes()
              .toString()
              .padStart(2, "0");
            const seconds = diffDate
              .getUTCSeconds()
              .toString()
              .padStart(2, "0");
            appoint.useTime = hours + ":" + minutes + ":" + seconds;
          }
        }
      }
      //已经结束 重新查询数据 等待自动查询数据
      this.$forceUpdate(); // 手动触发视图更新
    },
    cancelAppointOrder(siteAppoint) {
      const _this = this;
      this.$confirm("确认取消预约？", "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass: "btn-custom-cancel",
        type: "warning",
      }).then(function () {
        //取消预约
        cancelAppointOrder(siteAppoint).then((response) => {
          if (response.flag) {
            _this.$message.success("预约取消成功！");
          } else {
            _this.$message.error(response.message);
          }
          _this.selectUserAppoint();
        });
      });
    },
    //进行签到
    siteAppointSignIn(siteAppoint) {
      appointSignIn(siteAppoint).then((response) => {
        if (response.flag) {
          this.$message.success("签到成功！");
        } else {
          this.$message.error(response.message);
        }
        this.selectUserAppoint();
      });
    },
    checkIsEnoughTime(siteAppoint) {
      //判断打卡时间和目前时间相差的分钟 是否大于30
      const diff = new Date() - new Date(siteAppoint.clockInTime);
      const diffDate = new Date(diff);
      if (diffDate.getUTCMinutes() > 30) {
        this.siteAppointSignOut(siteAppoint);
      } else {
        //不大于三十分钟 弹出
        const _this = this;
        this.$confirm(
          "当前打卡时间未满30分钟会造成违约，是否签退？",
          "系统提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            cancelButtonClass: "btn-custom-cancel",
            type: "warning",
          }
        ).then(function () {
          //取消预约
          _this.siteAppointSignOut(siteAppoint);
        });
      }
    },
    //进行签退
    siteAppointSignOut(siteAppoint) {
      appointSignOut(siteAppoint).then((response) => {
        if (response.flag) {
          this.$message.success("签退成功！");
        } else {
          this.$message.error(response.message);
        }
        this.selectUserAppoint();
      });
    },
    // 打开预约详情弹窗
    openAppointInfo(appointInfo) {
      this.chooseCompletedAppointOrder = appointInfo;
      this.AppointInfoOpen = true;
    },
    //关闭自己
    handleClose() {
      //关闭定时器
      if (this.timer !== null) clearInterval(this.timer);
      this.$emit("closeMyAppoint");
    },
    closeAppointInfo() {
      this.chooseCompletedAppointOrder = undefined;
      this.AppointInfoOpen = false;
    },
    //出示预约信息
    presentAppointmentInformation(appointInfo) {
      presentAppointmentInformation(appointInfo.siteAppointOrderId).then(res => {
        const fileReader = new FileReader()
        fileReader.readAsDataURL(res)
        fileReader.onload = e => {
          this.voucherSrc = e.target.result
        }
      })
      this.openVoucher = true;
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
    }
    ,
    getAppointTimeFormat(completedAppointOrder) {
      return (
        this.formatDate(completedAppointOrder.beginUseTime) +
        " " +
        this.getHourAndMinute(completedAppointOrder.beginUseTime) +
        "~" +
        this.getHourAndMinute(completedAppointOrder.endUseTime)
      );
    }
    ,
    formatDate(dateStr) {
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    ,
    getHourAndMinute(dateStr) {
      const date = new Date(dateStr);
      const hour = date.getHours().toString().padStart(2, "0");
      const minute = date.getMinutes().toString().padStart(2, "0");
      return hour + ":" + minute;
    }
    ,
    siteTypeImg(unCompletedAppointOrder) {
      let siteTypeName = unCompletedAppointOrder.siteTypeName;
      if (siteTypeName.includes("篮球场"))
        return "https://img1.baidu.com/it/u=781345439,3734384356&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500";
      if (siteTypeName.includes("足球场"))
        return "https://img0.baidu.com/it/u=667402682,1653496193&fm=253&fmt=auto&app=138&f=JPEG?w=736&h=477";
      if (siteTypeName.includes("乒乓球场"))
        return "https://img0.baidu.com/it/u=840960531,532427480&fm=253&fmt=auto&app=138&f=JPEG?w=742&h=456";
      if (siteTypeName.includes("羽毛球场"))
        return "https://p0.meituan.net/shaitu/e97a58e1ddff395e95bc1600dfea4adf1319687.jpg";
      if (siteTypeName.includes("排球场"))
        return "https://pic15.qiyeku.com/qiyeku_pic/2014/7/23/wuxibogao/product/product_pic/image/2015_10_15/20151015033203272.jpg";
      if (siteTypeName.includes("保龄球"))
        return "https://hkis.centanet.com/p/_uH6Wf6NkTe1QQmdCR6k7AX9_C78Lv6u.jpg";
      if (siteTypeName.includes("体操"))
        return "https://img2.baidu.com/it/u=2707050979,3319568416&fm=253&fmt=auto&app=138&f=JPEG?w=750&h=500";
      if (siteTypeName.includes("台球"))
        return "https://p0.meituan.net/shaitu/123752af39d59974002193afcf804051550506.jpg";
    }
    ,
  },
};
</script>

<style scoped>
* {
  margin: 0px;
  padding: 0px;
}

/deep/ .el-drawer__header {
  font-size: 18px;
  color: #6ca5f5;
}

.reputation {
  margin-left: 20px;
  margin-bottom: 10px;
  font-size: 16px;
  color: #5b5b5b;
}

.reputation .el-tag {
  margin-left: 6px;
  width: 60px;
  text-align: center;
}

.el-collapse {
  margin-left: 20px;
}

/deep/ .el-collapse-item__header {
  font-size: 16px;
  /* font-weight: bold; */
  color: #5b5b5b;
}

.appointing {
  position: relative;
  height: 175px;
  margin-bottom: 10px;
}

.appointing img {
  width: 120px;
  height: 120px;
}

.appointing .information {
  position: absolute;
  top: 15px;
  left: 150px;
  height: 150px;
  font-size: 14px;
}

.information .countTime {
  position: absolute;
  bottom: 0px;
  left: -130px;
  color: #45a0e5;
}

.information .btn {
  position: absolute;
  right: 0px;
  bottom: 0px;
}

.information .btn .el-button {
  width: 40px;
  height: 20px;
}

.appointed {
  margin-left: 9px;
  margin-bottom: 10px;
}

.appointed img {
  width: 100%;
  display: block;
}

.appointed .time {
  font-size: 13px;
  color: #999;
}

.appointed .bottom {
  margin-top: 13px;
  line-height: 12px;
}

.tag {
  float: left;
  margin-top: 11px;
  padding: 0 5px;
}

.appointed .button {
  padding: 0;
  margin-top: 10px;
  float: right;
  width: 70px;
  height: 28px;
  text-align: center;
}

.appointed .button:hover {
  cursor: pointer;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
</style>
