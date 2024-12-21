<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <!--      <el-form-item label="帖子Id" prop="postId">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.postId"-->
      <!--          placeholder="请输入帖子Id"-->
      <!--          clearable-->
      <!--          @keyup.enter.native="handleQuery"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="作者Id" prop="userId">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.userId"-->
      <!--          placeholder="请输入作者Id"-->
      <!--          clearable-->
      <!--          @keyup.enter.native="handleQuery"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <el-form-item label="帖子分类" prop="postCategory">
        <el-select v-model="queryParams.postCategory" placeholder="请选择帖子分类" clearable>
          <el-option
            v-for="dict in dict.type.帖子分类"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="帖子标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入帖子标题"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!--      <el-form-item label="创建时间" prop="createTime">-->
      <!--        <el-date-picker clearable-->
      <!--                        v-model="queryParams.createTime"-->
      <!--                        type="date"-->
      <!--                        value-format="yyyy-MM-dd HH:mm:ss"-->
      <!--                        placeholder="请选择创建时间">-->
      <!--        </el-date-picker>-->
      <!--      </el-form-item>-->
      <el-form-item label="是否推荐" prop="isRecommend">
        <el-select v-model="queryParams.isRecommend" placeholder="请选择是否删除" clearable>
          <el-option
            v-for="dict in dict.type.post_recommend"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否精品" prop="isBetter">
        <el-select v-model="queryParams.isBetter" placeholder="请选择是否删除" clearable>
          <el-option
            v-for="dict in dict.type.post_better"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否删除" prop="isDelete">
        <el-select v-model="queryParams.isDelete" placeholder="请选择是否删除" clearable>
          <el-option
            v-for="dict in dict.type.is_deleted"
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

    <el-table v-loading="loading" :data="postList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <!--      <el-table-column label="帖子Id" align="center" prop="postId"/>-->
      <el-table-column label="作者昵称" align="center" prop="nickname"/>
      <el-table-column label="帖子标题" align="center" prop="title"/>
      <el-table-column label="帖子分类" align="center" prop="postCategory">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.帖子分类" :value="scope.row.postCategory"/>
        </template>
      </el-table-column>
      <el-table-column label="点赞数" align="center" width="60" prop="likeCount"/>
      <el-table-column label="评论数" align="center" width="60" prop="commentCount"/>
      <el-table-column label="收藏次数" align="center" width="80" prop="bookmarkCount"/>
      <el-table-column label="最后一次回复时间" align="center" prop="lastReplyTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.lastReplyTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否推荐" align="center" prop="isRecommend">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.post_recommend" :value="scope.row.isRecommend"/>
        </template>
      </el-table-column>
      <el-table-column label="是否精品" align="center" prop="isBetter">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.post_better" :value="scope.row.isBetter"/>
        </template>
      </el-table-column>
      <el-table-column label="是否删除" align="center" prop="isDelete">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.is_deleted" :value="scope.row.isDelete"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="180">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-medal"
            v-if="scope.row.isRecommend === 0"
            @click="setRecommend(scope.row)"
          >设为推荐
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-medal"
            v-else
            @click="setRecommend(scope.row)"
          >取消推荐
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-star-off"
            v-if="scope.row.isBetter === 0"
            @click="setBetter(scope.row)"
          >设为精品
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-star-off"
            v-else
            @click="setBetter(scope.row)"
          >取消精品
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="openInfo(scope.row)"
          >详情
          </el-button>
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

    <pagination
      v-show="total>0"
      :total="parseInt(total)"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改post对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="删除原因" prop="reason">
              <el-input v-model="form.reason" placeholder="请输入删除帖子的原因" maxlength="30"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="postInfoTitle" :visible.sync="isOpenInfo" width="500px" append-to-body v-if='isOpenInfo'>
      <div class="editor" ref="editor" :style="styles"></div>
    </el-dialog>
  </div>
</template>

<script>
import {delPost, listPost, recoverPost, setPostBetter, setPostRecommend} from "@/api/footprint/post";
import Quill from "quill";

export default {
  name: "Post",
  dicts: ['is_deleted', '帖子分类', 'post_better', 'post_recommend'],
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
      // post表格数据
      postList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        postId: null,
        userId: null,
        postCategory: null,
        title: null,
        createTime: null,
        isDelete: null,

      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        reason: [
          {required: true, message: "原因不能为空", trigger: "blur"},
          {min: 2, max: 20, message: '删除原因的长度必须介于 2 和 20 之间', trigger: 'blur'}
        ],
      },
      delPost: {},
      isOpenInfo: false,
      infoPost: {},
      Quill: null,
      currentValue: "",
      options: {
        theme: "snow",
        bounds: document.body,
        debug: "warn",
        modules: {
          // 工具栏配置
          toolbar: false
        },
        placeholder: "请输入内容",
        readOnly: true,
      },
      postInfoTitle: ''
    };
  },
  computed: {
    styles() {
      let style = {};
      if (this.minHeight) {
        style.minHeight = `${this.minHeight}px`;
      }
      if (this.height) {
        style.height = `${this.height}px`;
      }
      return style;
    },
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询post列表 */
    getList() {
      this.loading = true;
      listPost(this.queryParams).then(response => {
        this.postList = response.data.records;
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
        reason: null,
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
      this.ids = selection.map(item => item.postId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    setBetter(row) {
      const postId = row.postId;
      const msg = row.isBetter === 0 ? '是否设置【' + row.title + '】为精品贴，获得更多浏览推荐！' : '取消设置【' + row.title + '】为精品贴？';
      this.$modal.confirm(msg).then(function () {
        return setPostBetter(postId);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("操作成功！");
      }).catch(() => {
      });
    },
    setRecommend(row) {
      const postId = row.postId;
      const msg = row.isRecommend === 0 ? '是否设置【' + row.title + '】为推荐贴，获得更多浏览推荐！' : '取消设置【' + row.title + '】为推荐贴？';
      this.$modal.confirm(msg).then(function () {
        return setPostRecommend(postId);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("操作成功！");
      }).catch(() => {
      });
    },
    handleRecover(row) {
      const postId = row.postId;
      this.$modal.confirm('恢复帖子【' + row.title + '】？').then(function () {
        return recoverPost(postId);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("恢复成功！");
      }).catch(() => {
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.delPost = row;
      this.open = true;
      this.title = "删除帖子【" + row.title + "】";
    },
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          delPost({postId: this.delPost.postId, reason: this.form.reason}).then(res => {
            this.getList();
            this.$modal.msgSuccess("删除成功！");
            this.open = false;
            this.reset();
          })
        }
      })
    },
    openInfo(row) {
      this.infoPost = row;
      this.postInfoTitle = "帖子【" + row.title + "】的正文"
      this.isOpenInfo = true;
      this.$nextTick(() => {
        const editor = this.$refs.editor;
        this.Quill = new Quill(editor, this.options);
        this.Quill.pasteHTML(row.content);
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('post/post/export', {
        ...this.queryParams
      }, `post_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
<style>
.editor {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
