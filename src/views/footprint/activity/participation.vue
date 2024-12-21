<template>
  <div class="app-container">
    <div class="title">
      {{ activityInfo.activityTitle }}
    </div>
    <div class="activityInfo">
      <el-descriptions class="margin-top" title="活动详情" :column="4" border>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            活动名称
          </template>
          {{ activityInfo.activityTitle }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            赞助商名称
          </template>
          {{ activityInfo.sponsorName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            开始时间
          </template>
          <span>{{ parseTime(activityInfo.startTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-tickets"></i>
            结束时间
          </template>
          <span>{{ parseTime(activityInfo.endTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building"></i>
            活动状态
          </template>
          <dict-tag :options="dict.type.activity_status" :value="activityInfo.status"/>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building"></i>
            报名人数
          </template>
          {{ recordList.length + '人' }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building"></i>
            已打卡人数
          </template>
          {{ submitCount + '人' }}
        </el-descriptions-item>
        <el-descriptions-item span="2">
          <template slot="label">
            <i class="el-icon-office-building"></i>
            打卡位置
          </template>
          {{ activityInfo.locationName }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <el-descriptions v-if="activityInfo.extraGiftName !== null" class="giftInfo" title="活动奖品" :column="5" border>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-office-building"></i>
          奖品名称
        </template>
        {{ activityInfo.extraGiftName }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-office-building"></i>
          奖品图片
        </template>
        <image-preview :src="activityInfo.extraGiftUrl" :height="60" :width="60">
        </image-preview>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-office-building"></i>
          奖品数量
        </template>
        {{ activityInfo.extraGiftCount }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-office-building"></i>
          奖品是否分发
        </template>
        <el-tag
          v-if="activityInfo.giftDistribute === 0 && activityInfo.extraGiftCount!==0"
          type="danger"
          effect="dark">
          {{ '未分配' }}
        </el-tag>
        <el-tag
          v-if="activityInfo.giftDistribute === 1"
          type="success"
          effect="dark">
          {{ '已分配' }}
        </el-tag>
        <el-tag
          v-if="activityInfo.extraGiftCount===0"
          type="info"
          effect="dark">
          {{ '无需分配' }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-office-building"></i>
          操作
        </template>
        <el-button type="danger" size="mini" @click="distributeGift">奖品分配</el-button>
        <el-button type="primary" size="mini" @click="distributeRecord">分配记录</el-button>
      </el-descriptions-item>
    </el-descriptions>

    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="90px">
      <el-form-item label="用户id" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="用户id"
          clearable
          @keyup.enter.native="getList"
        />
      </el-form-item>
      <el-form-item label="运动最短距离" prop="distance" label-width="auto">
        <el-input
          v-model="queryParams.distance"
          placeholder="请输入最短距离 单位/米"
          clearable
          @keyup.enter.native="getList"
        />
      </el-form-item>
      <el-form-item label="提交路线" prop="submitRoute">
        <el-select v-model="queryParams.submitRoute" placeholder="请选择提交状态" clearable>
          <el-option
            v-for="dict in dict.type.activity_route_submit"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="路线起始被活动范围覆盖" prop="inRange" label-width="auto">
        <el-select v-model="queryParams.inRange" placeholder="请选择路线状态" clearable>
          <el-option
            v-for="dict in dict.type.activity_points_inrange"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="getList">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="recordList" @selection-change="handleSelectionChange">
      <template slot="empty">
        <el-empty :image-size="200"></el-empty>
      </template>
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="用户id" align="center" prop="userId"/>
      <el-table-column label="用户昵称" align="center" prop="nickname"/>
      <el-table-column label="用户头像" align="center" prop="avatarUrl">
        <template slot-scope="scope">
          <image-preview :src="scope.row.avatarUrl" :height="100" :width="100">
          </image-preview>
        </template>
      </el-table-column>
      <el-table-column label="参与活动时间" align="center" prop="date">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.participationTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="路线起始被活动范围覆盖" align="center" prop="isCovered">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.activity_route_covered" :value="scope.row.isCovered"/>
        </template>
      </el-table-column>
      <el-table-column label="运动方式" align="center" prop="motionType">
        <template slot-scope="scope">
          <dict-tag v-if="scope.row.motionType !== null" :options="dict.type.motion_type"
                    :value="scope.row.motionType"/>
          <div v-else> 未提交路线</div>
        </template>
      </el-table-column>
      <el-table-column label="运动里程" align="center" prop="distance">
        <template slot-scope="scope">
          {{ scope.row.distance === null ? '未提交路线' : scope.row.distance + '米' }}
        </template>
      </el-table-column>
      <el-table-column label="运动时间" align="center" prop="time">
        <template slot-scope="scope">
          {{ scope.row.time === null ? '未提交路线' : scope.row.time }}
        </template>
      </el-table-column>
      >
      <el-table-column label="平均速度" align="center" prop="speed">
        <template slot-scope="scope">
          {{ scope.row.speed === null ? '未提交路线' : scope.row.speed + '米/秒' }}
        </template>
      </el-table-column>
      <el-table-column label="提交时间" align="center" prop="date">
        <template slot-scope="scope">
          <span>{{
              scope.row.speed === null ? '未提交路线' : parseTime(scope.row.submitRouteTime, '{y}-{m}-{d} {h}:{i}:{s}')
            }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.motionType !== null">
          <router-link :to="'/footprint/route-map/index/' + scope.row.routeId +'/' +  queryParams.activityId"
                       class="link-type">
            <i class="el-icon-place"></i>
            <span>打卡路线</span>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="礼品发放记录" :visible.sync="showDistributeRecordTable" width="500px">
      <el-table :data="distributeRecordList">
        <el-table-column property="nickname" label="用户昵称" width="150"></el-table-column>
        <el-table-column property="giftName" label="礼品名称" width="200"></el-table-column>
        <el-table-column property="count" label="数量">
          <template slot-scope="scope">
            1
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import {
  activityGiftDistribute,
  getActivityGiftDistributeRecord,
  getActivityInfo,
  listRecordList
} from "../../../api/footprint/activity";

export default {
  name: "Participation",
  dicts: ['activity_route_submit', 'activity_points_inrange', 'motion_type', 'activity_route_covered', 'activity_status'],
  data() {
    return {
      // 查询参数
      queryParams: {
        userId: null,
        activityId: null,
        distance: null,
        inRange: null,
        submitRoute: null
      },
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
      recordList: [],
      activityInfo: {},
      activityId: null,
      submitCount: 0,
      distributeRecordList: [],
      showDistributeRecordTable: false,
    }
  },
  created() {
    this.queryParams.activityId = this.$route.query && this.$route.query.activityId;
    this.getList();
    this.getCurActivityInfo();
  },
  methods: {

    getCurActivityInfo() {
      getActivityInfo(this.queryParams.activityId).then(res => {
        this.activityInfo = res.data;
      })
    },
    /** 查询参与活动列表 */
    getList() {
      this.loading = true;
      listRecordList(this.queryParams).then(response => {
        this.recordList = response.data;
        let count = 0;
        this.recordList.forEach(record => {
          if (record.motionType !== null) ++count;
        })
        this.submitCount = count;
        this.loading = false;
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.recordId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.getList();
    },
    /**
     * 分配
     */
    distributeGift() {
      // 判断活动是已取消
      if (this.activityInfo.status === 0) {
        this.$message.error("活动已取消！无法分配奖品!")
        return;
      }
      // 判断活动是否结束
      if (this.activityInfo.status !== 4) {
        this.$message.error("活动结束后才能进行奖品分配！")
        return;
      }
      let extraGiftCount = this.activityInfo.extraGiftCount;
      if (extraGiftCount === 0) {
        this.$message.info("奖品数量为0，无需发放")
        return;
      }
      // 判断是否选取了足够的打卡记录
      let length = this.ids.length;
      if (length === 0) {
        this.$message.error("请选择获得奖品的用户！")
        return;
      }
      if (length > extraGiftCount) {
        this.$message.error({
          title: "奖品数量不足",
          message: '活动奖品有' + extraGiftCount + '份！您已选择了' + length + '位用户'
        })
        return;
      }
      if (this.activityInfo.giftDistribute === 1) {
        this.$message.error({
          title: "错误",
          message: "奖品已经发放了！"
        })
        return;
      }
      this.$confirm('活动奖品有' + extraGiftCount + '份，您已经选择了' +
        length + '位用户, 奖品分配只能进行一次，是否确定分配?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          // 进行礼品分配
          activityGiftDistribute(this.ids, this.activityInfo.activityId).then(res => {
            if (res.success) {
              this.getList();
              this.getCurActivityInfo();
              this.$message({
                type: 'success',
                message: '礼品发放成功！'
              });
            }
          })
        }
      ).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消奖品分配'
        });
      });

    },
    /**
     * 查询分配记录
     */
    distributeRecord() {
      if (this.activityInfo.giftDistribute !== 1) {
        this.$message.error({
          title: "错误",
          message: "该活动还未分配过奖品！"
        })
        return;
      }
      getActivityGiftDistributeRecord(this.activityInfo.activityId).then(res => {
        this.distributeRecordList = res.data;
        this.showDistributeRecordTable = true;
      })

    }
  }
}
</script>


<style>
.title {
  text-align: center;
  font-size: 30px;
  font-weight: bold;
}

.activityInfo {
  margin-bottom: 20px;
}

.giftInfo {

  margin-bottom: 40px;
}
</style>
