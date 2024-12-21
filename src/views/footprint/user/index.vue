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
      <el-form-item label="用户昵称" prop="nickname">
        <el-input
          v-model="queryParams.nickname"
          placeholder="请输入用户昵称"
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
      <el-form-item label="性别" prop="gender">
        <el-select v-model="queryParams.gender" placeholder="请选择性别" clearable>
          <el-option
            v-for="dict in dict.type.sys_user_sex"
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
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:user:edit']"
        >修改
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="用户id" align="center" prop="userId"/>
      <el-table-column label="微信登录open_id" align="center" prop="openId">
        <template #default="scoped">
        <span
          :title="scoped.row.openId"
          style="
                    display: -webkit-box;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    white-space: pre-line;
                "
        >
                {{ scoped.row.openId }}
        </span>
        </template>
      </el-table-column>
      <el-table-column label="用户昵称" align="center" prop="nickname"/>
      <el-table-column label="用户头像" align="center" prop="avatarUrl">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.avatarUrl"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="用户个性签名" align="center" prop="profile"/>
      <el-table-column label="是否禁用" align="center" prop="isDisabled">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.is_disabled" :value="scope.row.isDisabled"/>
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center" prop="gender">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_user_sex" :value="scope.row.gender"/>
        </template>
      </el-table-column>
      <el-table-column label="城市" align="center" prop="city"/>
      <el-table-column label="用户最后活跃ip地址" align="center" prop="lastActiveIp"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:user:edit']"
          >修改
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

    <!-- 添加或修改足迹用户对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入用户昵称"/>
        </el-form-item>
        <el-form-item label="用户个性签名" prop="profile">
          <el-input v-model="form.profile" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="用户生日" prop="birthday">
          <el-date-picker clearable
                          v-model="form.birthday"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="请选择用户生日">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="是否禁用" prop="isDisabled">
          <el-select v-model="form.isDisabled" placeholder="请选择是否禁用">
            <el-option
              v-for="dict in dict.type.is_disabled"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="form.gender">
            <el-radio
              v-for="dict in dict.type.sys_user_sex"
              :key="dict.value"
              :label="parseInt(dict.value)"
            >{{ dict.label }}
            </el-radio>
          </el-radio-group>
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
import {listUser, getUser, delUser, updateUser} from "@/api/footprint/user";

export default {
  name: "User",
  dicts: ['sys_user_sex', 'is_disabled'],
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
      // 足迹用户表格数据
      userList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        nickname: null,
        profile: null,
        birthday: null,
        openId: null,
        isDisabled: null,
        gender: null,
        avatarUrl: null,
        city: null,
        lastActiveIp: null,
        disabledPermissions: null,
        createTime: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        nickname: [
          {required: true, message: "用户昵称不能为空", trigger: "blur"}
        ],
        isDisabled: [
          {required: true, message: "是否禁用不能为空", trigger: "change"}
        ],
        gender: [
          {required: true, message: "性别不能为空", trigger: "change"}
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询足迹用户列表 */
    getList() {
      console.log(this.queryParams)
      this.loading = true;
      listUser(this.queryParams).then(response => {
        response = response.data;
        this.userList = response.records;
        this.total = response.total;
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
        userId: null,
        nickname: null,
        profile: null,
        birthday: null,
        openId: null,
        isDisabled: null,
        gender: null,
        avatarUrl: null,
        city: null,
        lastActiveIp: null,
        disabledPermissions: null,
        createTime: null,
        updateTime: null,
        isDisabledAccessForumsInfo: null,
        isDisabledAccessMotionInfo: null
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
      this.ids = selection.map(item => item.userId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const userId = row.userId || this.ids
      getUser(userId).then(response => {
        console.log(response.data)
        this.form = response.data;
        this.open = true;
        this.title = "修改足迹用户";
        console.log(this.form)
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.userId != null) {
            updateUser(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/user/export', {
        ...this.queryParams
      }, `user_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
