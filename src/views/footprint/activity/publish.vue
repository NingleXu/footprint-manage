<template>
  <div class="page">
    <el-steps class="steps" align-center :active="activeStep">
      <el-step title="活动基本信息" description="" icon="el-icon-edit"></el-step>
      <el-step title="编写活动内容" description="" icon="el-icon-upload"></el-step>
      <el-step title="选择活动地点" description="" icon="el-icon-picture"></el-step>
    </el-steps>

    <div v-if="activeStep===1" class="div">
      <div class="inner">
        <el-form ref="form" :model="activityInfoForms" label-width="80px">
          <el-form-item label="活动名称">
            <el-input v-model="activityInfoForms.activityTitle"></el-input>
          </el-form-item>
          <el-form-item label="活动时间">
            <el-date-picker
              v-model="activityInfoForms.activityTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="上传封面">
            <image-upload class="uploadActivityPicture" v-model="activityInfoForms.activityCoverUrl"
                          :limit="1"
                          :fileSize="1"
                          :fileType="['png', 'jpg', 'jpeg']"
                          :isShowTip="true"></image-upload>
          </el-form-item>

          <el-form-item label="添加实体礼品" label-width="100px">
            <el-switch
              v-model="hasExtraPrize"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </el-form-item>
          <el-form-item label="礼品名称" v-if="hasExtraPrize">
            <el-input v-model="activityInfoForms.extraGiftName"></el-input>
          </el-form-item>
          <el-form-item label="奖品图片" v-if="hasExtraPrize">
            <image-upload class="uploadActivityPicture" v-model="activityInfoForms.extraGiftUrl"
                          :limit="1"
                          :fileSize="1"
                          :fileType="['png', 'jpg', 'jpeg']"
                          :isShowTip="true"></image-upload>
          </el-form-item>
          <el-form-item label="奖品数量" v-if="hasExtraPrize">
            <el-input-number v-model="activityInfoForms.extraGiftCount" :min="0" :max="100"
                             label="额外奖品数量"></el-input-number>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div v-if="activeStep===2" class="div">
      <div class="inner">
        <editor v-model="activityContent" :min-height="300"></editor>
      </div>

    </div>
    <div v-if="activeStep===3" class="div">
      <el-form :model="locationForms" size="small" :inline="true" label-width="68px">
        <el-row :gutter="20">
          <el-col :span="6" :offset="1">
            <el-form-item label="搜索地址">
              <el-input
                v-model="searchVal"
                placeholder="请输入地点名称"
                @keyup.enter.native="MapSearch"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="1">
            <el-form-item label="地点名称" prop="locationName">
              <el-input
                class="locationNameInput"
                v-model="locationForms.locationName"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="1">
            <el-form-item label="半径/米" prop="range">
              <el-select v-model="locationForms.range" placeholder="请选择是否删除" clearable @change="selectedRange">
                <el-option
                  v-for="dict in dict.type.activity_range"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>

          </el-col>
        </el-row>

      </el-form>

      <el-row :gutter="20">
        <el-col :span="18" :offset="3">
          <TMmap class="map" ref="map" :position="list" :locationForms="locationForms" @setPoints="setPoints"></TMmap>
        </el-col>
      </el-row>


    </div>
    <div class="button-group">
      <el-button v-if="activeStep !== 1" @click="last">上一步</el-button>
      <el-button v-if="activeStep !== 3" @click="next">下一步</el-button>
      <el-button v-if="activeStep === 3" @click="submit">发布</el-button>
    </div>

  </div>

</template>
<script>
import TMmap from "../../../components/TMmap/TMmap.vue";
import {publishActivity} from "../../../api/footprint/activity";
import {getInfo} from "../../../api/login";

export default {
  name: "publish",
  components: {TMmap},
  dicts: ['activity_range'],

  data() {
    return {
      list: {},
      activeStep: 1,
      activityContent: '<div>\n' +
        '  <h2 style="color: #295BFF;">精彩活动：户外运动嘉年华</h2>\n' +
        '  <p>🌟 加入我们的户外运动嘉年华，感受身心的愉悦和活力！ 🏞️</p>\n' +
        '  <p>活动亮点：</p>\n' +
        '  <ul>\n' +
        '    <li>🚴 自行车骑行探险</li>\n' +
        '    <li>🧗 岩壁攀登挑战</li>\n' +
        '    <li>🏃‍♂️ 跑步马拉松</li>\n' +
        '  </ul>\n' +
        '  <p>活动时间：<span style="font-weight: bold;">2024年5月15日</span></p>\n' +
        '  <p>地点：<span style="color: #00CC66;">美丽的自然风景区</span></p>\n' +
        '  <p>赶紧报名参与，与自然亲密接触，释放激情！🌿</p>\n' +
        '</div>\n',
      locationForms: {
        locationName: '', // 地点名称
        locationLatLng: null, // 地点经纬度
        range: 1000, // 以中心为半径 向外 x m
      },
      activityInfoForms: {
        activityTitle: '',
        activityCoverUrl: null,
        activityTime: [],
        extraGiftName: null,
        extraGiftUrl: null,
        extraGiftCount: 0,
      },
      searchVal: '',
      hasExtraPrize: false,
    }
  },
  methods: {
    seeMap() {
      this.list.lng = 116.404
      this.list.lat = 39.915
      // 加载完成调用
      this.$nextTick(() => {
        this.$refs.map.MapResetting()
      })
    },
    // 地图搜索
    MapSearch() {
      this.$refs.map.MapSearch(this.searchVal)
    },
    // 设置地点名称 和 地理坐标
    setPoints(val) {
      this.locationForms.locationName = val.locationName;
      this.locationForms.locationLatLng = new TMap.LatLng(val.latLng.lat, val.latLng.lng);
    },
    submit() {
      var t = new Date(this.activityInfoForms.activityTime[0]);
      t.setHours(t.getHours() + 8);
      this.activityInfoForms.activityTime[0] = t;
      t = new Date(this.activityInfoForms.activityTime[1]);
      t.setHours(t.getHours() + 8);
      this.activityInfoForms.activityTime[1] = t;
      let _that = this;
      getInfo().then(res => {
        publishActivity({
          activityTitle: _that.activityInfoForms.activityTitle,
          activityContent: _that.activityContent,
          sponsorName: res.data.user.nickName,
          sponsorAvatarUrl: res.data.user.avatar,
          activityCoverUrl: _that.activityInfoForms.activityCoverUrl,
          extraGiftName: _that.activityInfoForms.extraGiftName,
          extraGiftUrl: _that.activityInfoForms.extraGiftUrl,
          extraGiftCount: _that.activityInfoForms.extraGiftCount,
          startTime: _that.activityInfoForms.activityTime[0],
          endTime: _that.activityInfoForms.activityTime[1],
          lat: _that.locationForms.locationLatLng.lat,
          lng: _that.locationForms.locationLatLng.lng,
          locationName: _that.locationForms.locationName,
          activityRange: _that.locationForms.range,
        }).then(res => {
          if (res.success) {
            this.$message({
              message: '活动发布成功！',
              type: 'success',
              onClose: () => {
                this.$router.push('/footprint/activity/list');
              },
              duration: 1000
            });
          } else {
            this.$message.error(res.message);
          }
        })
      })

    },
    last() {
      this.activeStep--;
    },
    next() {
      this.activeStep++;
      if (this.activeStep === 3) {
        this.seeMap();
      }
    },
    selectedRange(val) {
      this.$refs.map.MapUpdateCircle(val);
    }
  }
}
</script>
<style scoped>
.page {
  width: 100%;
  height: 100%;

  .steps {
    margin-top: 30px;
    margin-left: 15%;
    width: 70%;
  }

  .div {
    width: 70%;
    margin-left: 15%;
    height: 60%;
    padding-top: 50px;

    .map {
      height: 600px;
    }

    .locationNameInput {
      width: 300px;
    }
  }

  .button-group {
    position: absolute;
    right: 10%;
    bottom: 10%;
  }
}


</style>
