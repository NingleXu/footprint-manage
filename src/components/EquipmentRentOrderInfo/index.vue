<template>
  <div>
    <el-dialog
      title="租借详情"
      :visible.sync="isOpen"
      width="40%"
      :before-close="handleClose"
    >
      <span
        >拟定租借时间: {{ orderDateFormat(this.rentOrder.startLeaseTime) }} -
        {{ orderDateFormat(this.rentOrder.rationalEndLeaseTime) }}</span
      >
      <span
        >是否逾期:
        <el-tag type="success" v-if="this.rentOrder.isOverdue === '0'">
          未逾期
        </el-tag>
        <el-tag type="danger" v-else> 已逾期 </el-tag>
      </span>
      <span class="orderStatus">
        订单状态:<dict-tag
          :options="dict.type.gym_rent_status"
          :value="this.rentOrder.status"
          class="orderStatus-tag"
        />
      </span>
      <el-table :data="rentOrderInfoList" border style="width: 100%;margin:10px 0;">
        <el-table-column prop="equipmentName" label="器材名称">
        </el-table-column>
        <el-table-column prop="rentQuantity" label="租借数量">
        </el-table-column>
        <el-table-column
          prop="compensationAmount"
          label="赔偿单价"
          v-if="rentOrder.status === '1' && isOpenByManager"
        >
          <template slot-scope="scope">
            {{ scope.row.compensationAmount / 10 }} 元
          </template>
        </el-table-column>
        <el-table-column
          prop="damageQuantity"
          label="损坏个数"
          v-if="rentOrder.status === '1' && isOpenByManager"
        >
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.damageQuantity"
              οnkeyup="value=value.replace(/[^\d]/g,' ')"
              @change="handleDamageQuantity(scope.row)"
            >
            </el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="damageRate"
          label="损坏程度"
          v-if="rentOrder.status === '1' && isOpenByManager"
        >
          <template slot-scope="scope">
            <el-select
              :disabled="scope.row.damageQuantity === 0"
              v-model="scope.row.damageRate"
              placeholder="请选择"
              style="width: 100px"
              @change="calculateDamageTotalPrice"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          prop="damageQuantity"
          label="损坏个数"
          v-if="rentOrder.status === '2' || rentOrder.status === '3'"
        >
        </el-table-column>
        <el-table-column
          prop="damageRate"
          label="损坏程度"
          v-if="rentOrder.status === '2' || rentOrder.status === '3'"
        >
          <template slot-scope="scope">
            <el-select
              disabled
              v-model="scope.row.damageRate"
              placeholder="请选择"
              style="width: 100px"
              disabled
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
      <span style="margin-left:5px;">赔偿金：{{ damageTotalPrice / 10 }} 元</span>
      <el-button
        type="warning"
        v-if="rentOrder.status === '1' && isOpenByManager"
        @click="handleReview(rentOrder)"
        class="checked"
        v-hasPermi="['gym:equipment:rent:review']"
        >审查完毕</el-button
      >
    </el-dialog>
  </div>
</template>

<script>
import {
  getEquipmentRentOrderInfo,
  reviewRentEquipment,
} from "@/api/gym/equipmentRentOrder";

export default {
  dicts: ["gym_rent_status"],
  name: "index",
  props: {
    isOpen: Boolean,
  },
  data() {
    return {
      rentOderInfo: undefined,
      rentOrder: {},
      rentOrderInfoList: [],
      isOpenByManager: false,
      options: [
        {
          value: 0,
          label: "无损",
        },
        {
          value: 1,
          label: "10%",
        },
        {
          value: 2,
          label: "20%",
        },
        {
          value: 3,
          label: "30%",
        },
        {
          value: 4,
          label: "40%",
        },
        {
          value: 5,
          label: "50%",
        },
        {
          value: 6,
          label: "60%",
        },
        {
          value: 7,
          label: "70%",
        },
        {
          value: 8,
          label: "80%",
        },
        {
          value: 9,
          label: "90%",
        },
        {
          value: 10,
          label: "完全损坏",
        },
      ],
      damageTotalPrice: 0,
    };
  },
  methods: {
    getEquipmentRentOrderInfo(rentOrderInfoId) {
      getEquipmentRentOrderInfo(rentOrderInfoId).then((response) => {
        this.rentOrder = response.data;
        this.rentOrderInfoList = response.data.rentOrderInfoList;
        this.isOpenByManager = this.$route.path === "/gym/rentManage/list";
        this.damageTotalPrice = this.rentOrder.totalCompensationAmount;
      });
    },
    handleDamageQuantity(equipment) {
      if (equipment.damageQuantity > equipment.rentQuantity)
        equipment.damageQuantity = equipment.rentQuantity;
      this.calculateDamageTotalPrice();
    },
    //计算需要赔付的金额
    calculateDamageTotalPrice() {
      this.damageTotalPrice = this.rentOrder.totalCompensationAmount;
      this.rentOrderInfoList.forEach((orderInfo) => {
        this.damageTotalPrice +=
          (orderInfo.damageQuantity *
            orderInfo.compensationAmount *
            orderInfo.damageRate) /
          10;
      });
    },
    handleReview(rentOrder) {
      this.$modal
        .confirm(
          "您确定提交对订单号【" +
            rentOrder.equipmentRentOrderId +
            "】的审查吗？"
        )
        .then(function () {
          return reviewRentEquipment(rentOrder);
        })
        .then(() => {
          this.$modal.msgSuccess("审查成功！");
          this.handleClose();
        })
        .catch(() => {});
    },
    handleClose() {
      this.damageTotalPrice = 0;
      (this.rentOrder = {}), this.$emit("closeRentOrderInfo");
    },
    orderDateFormat(dateStr) {
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
  },
};
</script>

<style scoped>
.orderStatus{
  position: relative;
}
.orderStatus-tag{
  position: absolute;
  top: -5px;
  right: -60px;
}
.checked{
  position: absolute;
  right: 20px;
}
</style>
