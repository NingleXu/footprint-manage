<template>
  <div>
    <el-dialog
      title="预约详情"
      :visible.sync="openDialog"
      width="560px"
      class="appointInfo"
      :before-close="handleClose"
      append-to-body
    >
      <div class="image">
        <img
          src="https://img1.baidu.com/it/u=1397290655,1811466425&fm=253&fmt=auto&app=120&f=JPEG?w=1024&h=680"
        />
      </div>
      <el-descriptions :column="1" v-if="openDialog" class="appointDescipt">
        <el-descriptions-item label="场地名称">{{appointInfo.siteName}} </el-descriptions-item>
        <el-descriptions-item label="预约类型">{{getAppointTypeLabel(appointInfo.appointType)}}</el-descriptions-item>
        <el-descriptions-item label="预约人">{{appointInfo.userName}}</el-descriptions-item>
        <el-descriptions-item label="场地费率">{{appointInfo.appointType === '1' ? appointInfo.chargeRate/10+"元/小时" : "免费"}}</el-descriptions-item>
        <el-descriptions-item label="预约状态">
          <dict-tag
            :options="dict.type.gym_appoint_status"
            :value="appointInfo.siteAppointOrderStatus"
          />
        </el-descriptions-item>
        <el-descriptions-item label="预约时间">{{getAppointTimeFormat(appointInfo)}}</el-descriptions-item>
        <el-descriptions-item label="打卡时间" v-if="appointInfo.clockEndTime !== null && appointInfo.clockInTime !== null &&
                             ( appointInfo.appointType === '1'|| appointInfo.appointType === '2' )">
          {{getClockTimeFormat(appointInfo)}}
        </el-descriptions-item>
        <el-descriptions-item label="取消原因" v-if="appointInfo.siteAppointOrderStatus === '3'">{{appointInfo.cancelReason}}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>

</template>

<script>
export default {
  name: "AppointInfo",
  dicts: ["gym_appoint_status"],
  props: {
    openDialog: Boolean,
    appointInfo: Object,
  },
  methods: {
    handleClose() {
      this.$emit('closeAppointInfo');
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
    getClockTimeFormat(completedAppointOrder){
      return this.formatDate(completedAppointOrder.clockInTime) +
        " " +
        this.getHourAndMinute(completedAppointOrder.clockInTime) +
        "~" +
        this.getHourAndMinute(completedAppointOrder.clockEndTime)
    },
    getAppointTimeFormat(completedAppointOrder) {
      return this.formatDate(completedAppointOrder.beginUseTime) +
        " " +
        this.getHourAndMinute(completedAppointOrder.beginUseTime) +
        "~" +
        this.getHourAndMinute(completedAppointOrder.endUseTime)
    }
    , formatDate(dateStr) {
      const date = new Date(dateStr);
      const year = date.getFullYear();
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
  }
};
</script>
<style >
.appointInfo .el-dialog {
   position: relative;
   height: 330px;
}
.image {
   position: absolute;
   top: 70px;
   width: 180px;
   height: 170px;
}
.image img {
   width: 100%;
   height: 100%;
}
.appointDescipt {
   position: absolute;
   top: 60px;
   left: 240px;
}
.dialogbtn {
   position: absolute;
   top: 255px;
   right: 140px;
}
</style>
