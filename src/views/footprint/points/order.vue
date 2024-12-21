<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="用户id" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入用户id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单类型" prop="orderType">
        <el-select v-model="queryParams.orderType" placeholder="请选择订单类型" clearable>
          <el-option
            v-for="dict in dict.type.points_order_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="订单状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择订单状态" clearable>
          <el-option
            v-for="dict in dict.type.points_order_status"
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

    <el-table v-loading="loading" :data="orderList">
      <el-table-column label="订单id" width="180" align="center" prop="exchangeOrderId"/>
      <el-table-column label="用户id" width="180" align="center" prop="userId"/>
      <el-table-column label="礼品名称" width="180" align="center" prop="giftName"/>
      <el-table-column label="礼品图片" align="center" prop="giftPictureUrl">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.giftPictureUrl"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="兑换积分数" align="center" prop="giftPrice"/>
      <el-table-column label="收货人" align="center" prop="consignee"/>
      <el-table-column label="手机号" align="center" prop="phoneNumber"/>
      <el-table-column label="基本地址" align="center" prop="basicArea"/>
      <el-table-column label="详细地址" align="center" prop="addressDetail"/>
      <el-table-column label="订单类型" align="center" prop="orderType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.points_order_type" :value="scope.row.orderType"/>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center" prop="orderStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.points_order_status" :value="scope.row.orderStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.orderStatus === 0"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDeliver(scope.row)"
            v-hasPermi="['footprint:log:remove']"
          >标记发货
          </el-button>
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
import {getOrderList, markDeliver} from "../../../api/footprint/order";
import {parseTime} from "../../../utils/ruoyi";

export default {
  name: "order",
  dicts: ['points_order_type', 'points_order_status'],
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
      // 抽奖记录表格数据
      orderList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        orderType: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {}
    };
  },
  created() {
    this.getList();
  },
  methods: {
    parseTime,
    /** 查询抽奖记录列表 */
    getList() {
      this.loading = true;
      getOrderList(this.queryParams).then(response => {
        this.orderList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      });
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
    handleDeliver(row) {
      this.$modal.confirm('是否标记订单"' + row.exchangeOrderId + '"的为已发货？').then(function () {
        return markDeliver(row.exchangeOrderId);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("恢复成功");
      }).catch(() => {
      });
    },
  }
};
</script>
