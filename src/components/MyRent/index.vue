<template>
  <div>
    <el-drawer
      title="我的器材租借订单"
      :visible.sync="openRentDrawer"
      direction="rtl"
      size="55%"
      :before-close="handleClose"
    >
      <el-table :data="rentOrderList" border style="width: 100%" height="350"
                :header-cell-style="{ textAlign: 'center' }"
                :cell-style="{ textAlign: 'center' }">
        <el-table-column prop="equipmentRentOrderId" label="单号" width="50"></el-table-column>
        <el-table-column prop="startLeaseTime" label="租借起始日" width="147">
          <template slot-scope="scope">
            {{ orderDateFormat(scope.row.startLeaseTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="rationalEndLeaseTime" label="约定归还日期" width="158">
          <template slot-scope="scope">
            {{ orderDateFormat(scope.row.rationalEndLeaseTime) }} 之前
          </template>
        </el-table-column>
        <el-table-column prop="endLeaseTime" label="实际归还日" width="122">
          <template slot-scope="scope"> S
            {{ orderDateFormat(scope.row.endLeaseTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="totalRentAmount" label="租借收费 单位(元)" width="85">
          <template slot-scope="scope">
            {{ scope.row.totalRentAmount / 10 }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="96">
          <template slot-scope="scope">
            <dict-tag
              :options="dict.type.gym_rent_status"
              :value="scope.row.status"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="returnRentEquipment(scope.row)"
                       v-if="scope.row.status === '0'">
              归还
            </el-button>
            <el-button type="warning" size="mini" v-if="scope.row.status === '3'" @click="openCartInfo(scope.row)">立即补费</el-button>
            <el-button type="primary" size="mini" @click="openRentOrderInfo(scope.row)">
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>
    <EquipmentRentOrderInfo ref="EquipmentRentOrderInfo" @closeRentOrderInfo="closeRentOrderInfo" :isOpen="openInfo"/>
    <el-dialog
      title="一卡通验证"
      :visible.sync="CartInfoOpen"
      width="400px"
      append-to-body
    >
      <el-form
        ref="form"
        :model="rentOrder"
        :rules="rules"
        label-width="100px"
        v-if="CartInfoOpen"
        :before-close="cancelCartInfo"
      >
        <el-form-item label="一卡通账号" prop="cartId">
          <el-input
            v-model="rentOrder.cartId"
            placeholder="一卡通账号"
          />
        </el-form-item>
        <el-form-item label="密码" prop="cartPassword">
          <el-input
            v-model="rentOrder.cartPassword"
            placeholder="一卡通密码"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="pendingFees" size="medium"
        >确 定
        </el-button
        >
        <el-button @click="CartInfoOpen = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getUserRentOrderList, returnRentEquipment,orderPendingFees} from "@/api/gym/equipmentRentOrder";
import EquipmentRentOrderInfo from "@/components/EquipmentRentOrderInfo";

export default {
  dicts: ["gym_rent_status"],
  props: {
    openRentDrawer: Boolean,
  },
  components: {
    EquipmentRentOrderInfo,
  },
  data() {
    return { // 表单校验
      rules: {
        cartId: [
          {required: true, message: "请输入一卡通账号", trigger: "blur"},
          {
            pattern: /^\d{12}$/,
            message: "一卡通账号必须为十二位数字",
            trigger: "blur",
          },
        ],
        cartPassword: [
          {required: true, message: "必须输入一卡通密码", trigger: "blur"},
        ],
      },
      // 是否输入一卡通
      CartInfoOpen: false,
      rentOrderList: [],
      rentOrder: {
        cartId : "",
        cartPassword : "",
      },
      //是否打开详情
      openInfo: false,
    };
  },
  methods: {
    getUserRentOrderList() {
      getUserRentOrderList().then(res => {
        this.rentOrderList = res.data;
      })
    },
    handleClose() {
      this.$emit("closeMyRent");
    },
    orderDateFormat(dateStr) {
      if (dateStr === null) return "暂未归还"
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}年${month}月${day}日`;
    },
    //打开租借订单详情
    openRentOrderInfo(rentOrder) {
      this.$refs.EquipmentRentOrderInfo.getEquipmentRentOrderInfo(rentOrder.equipmentRentOrderId);
      this.openInfo = true;
    },
    returnRentEquipment(rentOrder) {
      this.$modal.confirm('你确定要归还单号【' + rentOrder.equipmentRentOrderId + '】租借的器材吗？').then(function () {
        return returnRentEquipment(rentOrder);
      }).then(() => {
        this.getUserRentOrderList();
        this.$modal.msgSuccess("器材归还成功！");
      }).catch(() => {
      });
    },
    openCartInfo(rentOrder) {
      const _this = this;
      this.$modal.confirm('你确定对器材租借订单号【' + rentOrder.equipmentRentOrderId + '】补费【'
        + rentOrder.totalCompensationAmount/10 + '】元吗？').then(function () {
        _this.rentOrder = rentOrder;
        _this.CartInfoOpen = true;
      })
    },
    //进行补费
    pendingFees(){
      orderPendingFees(this.rentOrder).then(res =>{
        if (res.flag){
            this.$message.success("补费成功！");
        }
        this.getUserRentOrderList()
        this.cancelCartInfo();
      })
    },
    closeRentOrderInfo() {
      this.openInfo = false;
    },
    cancelCartInfo() {
      this.CartInfoOpen = false;
      this.reset();
      this.resetForm("form");
    },
    // 表单重置
    reset() {
      this.rentOrder.cartId = "";
      this.rentOrder.cartPassword = "";
    },
  },
};
</script>

<style scoped>
/deep/ .el-drawer__header {
  font-size: 18px;
  color: #6ca5f5;
}
</style>
