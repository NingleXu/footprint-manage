<template>
  <div class="app-container">
    <el-table v-loading="loading" :data="historyList">
      <el-table-column label="积分变动数量" align="center" prop="changeNum"/>
      <el-table-column label="来源模块" align="center" prop="sourceModule"/>
      <el-table-column label="变动类型" align="center" prop="changeType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.points_change_reason" :value="scope.row.changeType"/>
        </template>
      </el-table-column>
      <el-table-column label="变动原因" align="center" prop="changeReason"/>
      <el-table-column label="变动时间" align="center" prop="changeTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.changeTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
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
import {accountDisabled, accountRecover, getAccountPointsHistory} from "../../../api/footprint/points";
import {parseTime} from "../../../utils/ruoyi";

export default {
  name: "Log",
  dicts: ['is_disabled', 'points_change_reason'],
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
      historyList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      userId: null,
    };
  },
  created() {
    this.userId = this.$route.params && this.$route.params.userId;
    this.getList();
  },
  methods: {
    parseTime,
    /** 查询抽奖记录列表 */
    getList() {
      this.loading = true;
      getAccountPointsHistory(this.queryParams, this.userId).then(response => {
        this.historyList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {};
      this.resetForm("form");
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
    handleDisabled(row) {
      accountDisabled(row.accountId).then(res => {
        this.getList();
        this.$modal.msgSuccess("禁用成功！");
        this.open = false;
        this.reset();
      })
    },
    handleRecover(row) {
      accountRecover(row.accountId).then(res => {
        this.getList();
        this.$modal.msgSuccess("恢复成功！");
        this.open = false;
        this.reset();
      })
    },
    toDetail(row) {

    }
  }
};
</script>
