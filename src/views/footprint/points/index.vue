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
      <el-form-item label="是否禁用" prop="isDisabled">
        <el-select v-model="queryParams.isDisabled" placeholder="请选择是否删除" clearable>
          <el-option
            v-for="dict in dict.type.is_disabled"
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

    <el-table v-loading="loading" :data="accountList">
      <el-table-column label="用户id" width="180" align="center" prop="userId"/>
      <el-table-column label="用户昵称" width="180" align="center" prop="nickname"/>
      <el-table-column label="用户头像" align="center" prop="avatarUrl">
        <template slot-scope="scope">
          <el-image
            style="width: 50px; height: 50px"
            :src="scope.row.avatarUrl"
           ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="拥有积分数" align="center" prop="points"/>
      <el-table-column label="账户状态" align="center" prop="isDisabled">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.is_disabled" :value="scope.row.isDisabled"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <router-link :to="'/footprint/points-info/index/' + scope.row.userId" class="link-type">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-right"
              v-hasPermi="['footprint:log:remove']"
            >积分明细
            </el-button>
          </router-link>
          <el-button
            v-if="scope.row.isDisabled === 0"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDisabled(scope.row)"
            v-hasPermi="['footprint:log:remove']"
          >账号禁用
          </el-button>
          <el-button
            v-else
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleRecover(scope.row)"
            v-hasPermi="['footprint:log:remove']"
          >账号恢复
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
import {accountDisabled, accountRecover, getAccountPointsList} from "../../../api/footprint/points";

export default {
  name: "pointsList",
  dicts: ['is_disabled'],
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
      accountList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 5,
        userId: null,
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
    /** 查询抽奖记录列表 */
    getList() {
      this.loading = true;
      getAccountPointsList(this.queryParams).then(response => {
        this.accountList = response.data.records;
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
      this.form = {
        id: null,
        userId: null,
        prizeName: null,
        prizePictureUrl: null,
        lotteryTime: null,
        createTime: null,
        updateTime: null,
        isDeleted: null
      };
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
  }
};
</script>
