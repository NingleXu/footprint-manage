<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="礼品名称" prop="giftName">
        <el-input
          v-model="queryParams.giftName"
          placeholder="请输入礼品的名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否禁用" prop="isDisabled">
        <el-select v-model="queryParams.isDisabled" placeholder="请选择是否禁用" clearable>
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
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['footprint:gift:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['footprint:gift:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['footprint:gift:remove']"
        >删除
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="giftList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="礼品id" align="center" prop="giftId"/>
      <el-table-column label="礼品的图片" align="center" prop="giftPictureUrl" width="100">
        <template slot-scope="scope">
          <image-preview :src="scope.row.giftPictureUrl" :width="100" :height="100"/>
        </template>
      </el-table-column>
      <el-table-column label="礼品的名称" align="center" prop="giftName"/>
      <el-table-column
        prop="giftIntroduce"
        header-align="center"
        align="center"
        label="礼品介绍"
        min-width="120"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column label="库存数量" align="center" prop="stockQuantity"/>
      <el-table-column label="兑换量" align="center" prop="exchangeNum"/>
      <el-table-column label="礼品价格 单位/积分" align="center" prop="giftPrice"/>
      <el-table-column label="是否被禁用 0 否 1是" align="center" prop="isDisabled">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.is_disabled" :value="scope.row.isDisabled"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['footprint:gift:edit']"
          >修改
          </el-button>
          <el-button
            v-if="scope.row.isDisabled === 0"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleDisabled(scope.row)"
            v-hasPermi="['footprint:gift:remove']"
          >禁用
          </el-button>
          <el-button
            v-else
            size="mini"
            type="text"
            icon="el-icon-refresh-right"
            @click="handleRecover(scope.row)"
            v-hasPermi="['footprint:gift:remove']"
          >恢复
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['footprint:gift:remove']"
          >删除
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

    <!-- 添加或修改footprint对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="礼品图片" prop="giftPictureUrl">
          <image-upload :limit="1"
                        :fileSize="1"
                        :fileType="['png', 'jpg', 'jpeg']" v-model="form.giftPictureUrl"/>
        </el-form-item>
        <el-form-item label="礼品名称" prop="giftName">
          <el-input v-model="form.giftName" placeholder="请输入礼品的名称"/>
        </el-form-item>

        <el-form-item label="礼品介绍" prop="giftIntroduce">
          <editor v-model="form.giftIntroduce" :min-height="300"></editor>
        </el-form-item>
        <el-form-item label="库存数量" prop="stockQuantity">
          <el-input v-model="form.stockQuantity" placeholder="请输入库存数量"/>
        </el-form-item>
        <el-form-item label="礼品价格 单位/积分" prop="giftPrice">
          <el-input-number v-model="form.giftPrice" :min="1" label="礼品价格 单位/积分"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addGift,
  deleteGift,
  disabledGift,
  getGiftInfo,
  getGiftList,
  recoverGift,
  updateGift
} from "../../../api/footprint/gift";

export default {
  name: "Gift",
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
      // footprint表格数据
      giftList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        giftName: null,
        isDisabled: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        giftPictureUrl: [
          {required: true, message: "礼品的图片不能为空", trigger: "blur"}
        ],
        giftName: [
          {required: true, message: "礼品的名称不能为空", trigger: "blur"}
        ],
        giftIntroduce: [
          {required: true, message: "礼品介绍不能为空", trigger: "blur"}
        ],
        stockQuantity: [
          {required: true, message: "库存数量不能为空", trigger: "blur"}
        ],
        isDisabled: [
          {required: true, message: "是否被禁用 0 否 1是不能为空", trigger: "change"}
        ],
        giftPrice: [
          {required: true, message: "礼品价格 单位/积分不能为空", trigger: "blur"}
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询footprint列表 */
    getList() {
      this.loading = true;
      getGiftList(this.queryParams).then(response => {
        this.giftList = response.data.records;
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
        giftId: null,
        giftPictureUrl: null,
        giftName: null,
        giftIntroduce: null,
        stockQuantity: null,
        exchangeNum: null,
        isDisabled: null,
        createTime: null,
        updateTime: null,
        isDeleted: null,
        giftPrice: null
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.giftId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加礼品";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const giftId = row.giftId || this.ids
      getGiftInfo(giftId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改礼品详情";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.giftId != null) {
            updateGift(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addGift(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const giftIds = row.giftId || this.ids;
      this.$modal.confirm('是否确认删除礼品编号为"' + giftIds + '"的数据项？').then(function () {
        return deleteGift(giftIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    handleDisabled(row) {
      this.$modal.confirm('是否确认禁用礼品名称为"' + row.giftName + '"的数据项？').then(function () {
        return disabledGift(row.giftId);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("禁用成功");
      }).catch(() => {
      });
    },
    handleRecover(row) {
      this.$modal.confirm('是否确认恢复礼品名称为"' + row.giftName + '"的数据项？').then(function () {
        return recoverGift(row.giftId);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("恢复成功");
      }).catch(() => {
      });
    },
  }
};
</script>
