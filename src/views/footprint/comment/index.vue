<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="帖子id" prop="postId">
        <el-input
          v-model="queryParams.postId"
          placeholder="请输入帖子id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户id" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入用户id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="commentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="用户id" align="center" prop="userId"/>
      <el-table-column label="用户昵称" align="center" prop="nickname"/>
      <el-table-column label="帖子标题" align="center" prop="title"/>
      <el-table-column label="评论内容" align="center" prop="commentContent"/>
      <el-table-column label="发布时间" align="center" prop="commentTime">
        <template slot-scope="scope">
          {{ formatDate(scope.row.commentTime) }}
        </template>
      </el-table-column>
      <el-table-column label="是否删除" align="center" prop="isDelete">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.is_deleted" :value="scope.row.isDelete"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            v-if="scope.row.isDelete === 0"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-refresh-right"
            v-else
            @click="handleRecover(scope.row)"
          >恢复
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="删除原因" prop="reason">
              <el-input v-model="form.reason" placeholder="请输入删除评论的原因" maxlength="30"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
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
import {formatDate} from "../../../utils";
import {delComment, listComment, recoverComment} from "../../../api/footprint/comment";


export default {
  name: "comment",
  dicts: ['is_deleted'],
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
      // 足迹评论表格数据
      commentList: [],
      // 表单校验
      rules: {
        reason: [
          {required: true, message: "原因不能为空", trigger: "blur"},
          {min: 2, max: 20, message: '删除原因的长度必须介于 2 和 20 之间', trigger: 'blur'}
        ],
      },
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 待删除的评论
      delComment: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        postId: null,
      },
      // 表单参数
      form: {},
      center: {lng: 0, lat: 0},
      zoom: 3,
      routeInfo: {},
      map: {},
    };
  },
  created() {
    this.getList();
  },

  methods: {
    formatDate,
    getList() {
      this.loading = true;
      listComment(this.queryParams).then(response => {
        response = response.data;
        this.commentList = response.records;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
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
    handleRecover(row) {
      const commentId = row.commentId;
      this.$modal.confirm('恢复帖子【' + row.title + '】？').then(function () {
        return recoverComment(commentId);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("恢复成功！");
      }).catch(() => {
      });
    },
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          delComment({commentId: this.delComment.commentId, reason: this.form.reason}).then(res => {
            this.getList();
            this.$modal.msgSuccess("删除成功！");
            this.open = false;
            this.reset();
          })
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.delComment = row;
      this.open = true;
      this.title = "删除评论【" + row.commentContent + "】";
    },
  }
};
</script>
<style>
.container {
  height: 600px;
  width: 1000px;
}
</style>
