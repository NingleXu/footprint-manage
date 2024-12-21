<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="90px">
      <el-form-item label="赞助商名称" prop="sponsorName">
        <el-input
          v-model="queryParams.sponsorName"
          placeholder="请输入赞助商名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="活动标题" prop="activityTitle">
        <el-input
          v-model="queryParams.activityTitle"
          placeholder="请输入活动标题"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="地点名称" prop="locationName">
        <el-input
          v-model="queryParams.locationName"
          placeholder="请输入活动地点名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="活动状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择活动状态" clearable>
          <el-option
            v-for="dict in dict.type.activity_status"
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

    <el-table v-loading="loading" :data="activityList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="活动id" align="center" prop="activityId"/>
      <el-table-column label="赞助商名称" align="center" prop="sponsorName"/>
      <el-table-column label="赞助商图标" align="center" prop="sponsorAvatarUrl">
        <template slot-scope="scope">
          <image-preview :src="scope.row.sponsorAvatarUrl" :height="120" :width="120">
          </image-preview>
        </template>
      </el-table-column>
      <el-table-column label="活动标题" align="center" prop="activityTitle"/>
      <el-table-column label="活动封面" align="center" prop="activityCoverUrl">
        <template slot-scope="scope">
          <el-image
            style="width: 200px; height: 100px"
            :src="scope.row.activityCoverUrl"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="活动开始时间" align="center" prop="startTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="活动结束时间" align="center" prop="endTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="活动状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.activity_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="发放实体礼物" align="center">
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.extraGiftName != null"
            type="warning"
          >
            {{ '发放' }}
          </el-tag>
          <el-tag
            v-else
            type="info"
          >
            {{ '不发放' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="地理坐标名称" align="center" prop="locationName"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <router-link :to="`/footprint/activity/participation?activityId=${scope.row.activityId}` " class="link-type">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-right"
            >报名记录
            </el-button>
          </router-link>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleInfo(scope.row)"
          >活动详情
          </el-button>
          <el-button
            v-if="scope.row.status !== 0 && scope.row.status!==4"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['footprint:activity:remove']"
          >取消
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

    <!-- 添加或修改活动对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="activityInfoTitle" :visible.sync="isOpenInfo" width="700px" append-to-body v-if='isOpenInfo'>
      <div class="title">活动内容</div>
      <div class="editor" ref="editor"></div>
      <div class="box">
        <div class="title">活动地点</div>
        <div id="infoMap"></div>
      </div>
      <div class="box" v-if="activityInfo.extraGiftName !== null">
        <div class="title">活动奖品</div>
        <div class="gift">
          <div>
            <image-preview :src="activityInfo.extraGiftUrl" :height="100" :width="100">
            </image-preview>
          </div>
          <div>
            {{ activityInfo.extraGiftName + " " + activityInfo.extraGiftCount + "个" }}
          </div>
        </div>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import {listActivity, getActivity, cancelActivity, addActivity, updateActivity} from "@/api/footprint/activity";
import Quill from "quill";
import {getActivityInfo} from "../../../api/footprint/activity";

export default {
  name: "ActivityList",
  dicts: ['activity_status'],
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
      // 活动表格数据
      activityList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        sponsorName: null,
        activityTitle: null,
        status: null,
        locationName: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        sponsorId: [
          {required: true, message: "赞助商id不能为空", trigger: "blur"}
        ],
        sponsorName: [
          {required: true, message: "赞助商名称不能为空", trigger: "blur"}
        ],
        activityTitle: [
          {required: true, message: "活动标题不能为空", trigger: "blur"}
        ],
        activityContent: [
          {required: true, message: "活动正文不能为空", trigger: "blur"}
        ],
        activityCoverUrl: [
          {required: true, message: "活动封面不能为空", trigger: "blur"}
        ],
        startTime: [
          {required: true, message: "活动开始时间不能为空", trigger: "blur"}
        ],
        endTime: [
          {required: true, message: "活动结束时间不能为空", trigger: "blur"}
        ],
        status: [
          {required: true, message: "是否被禁用 0 否 1是不能为空", trigger: "blur"}
        ],
        locationName: [
          {required: true, message: "地理坐标名称不能为空", trigger: "blur"}
        ]
      },
      // 弹窗标题
      activityInfo: {},
      activityInfoTitle: '',
      activityInfoPosition: {},
      activityRange: 0,
      isOpenInfo: false,
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
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询活动列表 */
    getList() {
      this.loading = true;
      listActivity(this.queryParams).then(response => {
        this.activityList = response.data.records;
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
        activityId: null,
        sponsorId: null,
        sponsorName: null,
        activityTitle: null,
        activityContent: null,
        activityCoverUrl: null,
        startTime: null,
        endTime: null,
        status: null,
        createTime: null,
        updateTime: null,
        locationName: null
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
      this.ids = selection.map(item => item.activityId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    handleInfo(activityData) {
      getActivityInfo(activityData.activityId).then(res => {
        this.activityInfoPosition = new TMap.LatLng(res.data.lat, res.data.lng);
        this.activityRange = res.data.activityRange;
        this.activityInfoTitle = "【" + res.data.activityTitle + "】活动内容"
        this.activityInfo = res.data;
        this.isOpenInfo = true;
        this.$nextTick(() => {
          // 初始化帖子内容
          const editor = this.$refs.editor;
          this.Quill = new Quill(editor, this.options);
          this.Quill.pasteHTML(res.data.activityContent);
          // 初始化地图内容
          this.initMap();
        })
      })
    },
    initMap() {
      const map = new TMap.Map(document.getElementById('infoMap'), {
        center: this.activityInfoPosition, //设置地图中心点坐标
        zoom: 13, //设置地图缩放级别
        pitch: 0, //设置俯仰角
        rotation: 0 //设置地图旋转角度
      });
      // 初始化中心点
      let markerLayer = new TMap.MultiMarker({
        map: map, //指定地图容器
        //样式定义
        styles: {
          //创建一个styleId为"myStyle"的样式（styles的子属性名即为styleId）
          "myStyle": new TMap.MarkerStyle({
            "width": 25, // 点标记样式宽度（像素）
            "height": 35, // 点标记样式高度（像素）
            //焦点在图片中的像素位置，一般大头针类似形式的图片以针尖位置做为焦点，圆形点以圆心位置为焦点
            "anchor": {x: 16, y: 32}
          })
        },
        //点标记数据数组
        geometries: [{
          "id": "1", //点标记唯一标识，后续如果有删除、修改位置等操作，都需要此id
          "styleId": 'myStyle', //指定样式id
          "position": this.activityInfoPosition, //点标记坐标位置
          "properties": { //自定义属性
            "title": "marker1"
          }
        }]
      });
      // 画一个圆
      let circle = new TMap.MultiCircle({
        map: map,
        styles: { // 设置圆形样式
          'circle': new TMap.CircleStyle({
            'color': 'rgba(41,91,255,0.16)',
            'showBorder': true,
            'borderColor': 'rgba(41,91,255,1)',
            'borderWidth': 2,
          }),
        },
        geometries: [{
          id: "1",
          styled: 'circle',
          center: this.activityInfoPosition,
          radius: parseInt(this.activityRange)
        }],
      })
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加活动";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const activityId = row.activityId || this.ids
      getActivity(activityId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改活动";
      });
    },

    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.activityId != null) {
            updateActivity(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addActivity(this.form).then(response => {
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
      this.$modal.confirm('是否确认取消活动:' + row.activityTitle + '？取消后无法恢复！').then(function () {
        return cancelActivity(row.activityId);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("取消成功！");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('footprint/activity/export', {
        ...this.queryParams
      }, `activity_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>

<style>
.box {
  margin-top: 20px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.gift {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
