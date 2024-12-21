<template>
  <div class="page">
    <div class="left">
      <div class="title">
        抽奖转盘预览
      </div>

      <LuckyWheel
        ref="myLucky"
        width="400px"
        height="400px"
        :prizes="showPrizes"
        :blocks="blocks"
        :buttons="buttons"
      />
    </div>
    <div class="right">
      <div class="giftBox">
        <div class="top">
          抽奖系统开启状态：
          <el-switch
            v-model="isOpenLottery"
            @change="onChangeSwitch"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
          <el-tag
            v-if="isOpenLottery"
            effect="dark">
            已开启
          </el-tag>
          <el-tag
            v-else
            type="danger"
            effect="dark">
            已关闭
          </el-tag>
          <el-button type="success" @click="handleAdd()">添加礼品</el-button>
        </div>
        <div class="table">
          <el-table
            :data="lotteryPrizes"
            border
            max-height="550"
            style="width: 100% ">
            <el-table-column
              prop="prizeName"
              label="礼品名称"
              align="center"
              width="120">
            </el-table-column>
            <el-table-column
              prop="prizePictureUrl"
              label="图片"
              align="center"
              width="=160">
              <template slot-scope="scope">
                <el-image
                  style="width: 70px; height: 70px"
                  :src="scope.row.prizePictureUrl"
                  :fit="'fill'"></el-image>
              </template>
            </el-table-column>
            <el-table-column
              prop="awardPointsCount"
              label="奖励积分数"
              align="center"
              width="120">
              <template slot-scope="scope">
                {{ scope.row.awardPointsCount === -1 ? 0 : scope.row.awardPointsCount }}
              </template>
            </el-table-column>
            <el-table-column
              prop="lotProbability"
              label="中奖概率"
              align="center"
              width="120">
              <template slot-scope="scope">
                {{ (scope.row.lotProbability / 1000) + '%' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="stock"
              label="库存"
              align="center"
              width="130">
              <template slot-scope="scope">
                {{ scope.row.stock === -1 ? '不限量' : scope.row.awardPointsCount }}
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleUpdate(scope.row)"
                >修改
                </el-button>
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)"
                >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <el-dialog title="修改礼品中奖信息" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :rules="rules" :model="form" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="礼品名称" prop="prizeName">
              <el-input v-model="form.prizeName" placeholder="请输入礼品名称" maxlength="30"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="礼品图片" prop="prizePictureUrl">
              <div class="img">
                <el-upload
                  ref="upload"
                  class="avatar-uploader"
                  :action="uploadUrl"
                  :before-upload="beforeImgUpload"
                  :on-success="handleImgSuccess"
                  :show-file-list="false"
                  :headers="headers">
                  <img style="height: 60px;width: 60px" v-if="form.prizePictureUrl" :src="form.prizePictureUrl"
                       class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </div>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="中奖概率" prop="lotProbability">
              <el-slider v-model="lotProbability" show-input :step="0.001" :min="0.001"
                         :max="100"></el-slider>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="奖励积分" prop="awardPointsCount">
              <el-input v-model="form.awardPointsCount" placeholder="-1代表不奖励积分" maxlength="10"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="库存数" prop="stock">
              <el-input v-model="form.stock" placeholder="-1代表不限量" maxlength="20"/>
            </el-form-item>
          </el-col>
        </el-row>

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
  getLotteryPrizes,
  getLotteryStatus,
  startLottery,
  stopLottery,
  updateLottery
} from "../../../api/footprint/points";
import userAvatar from "../../system/user/profile/userAvatar.vue";
import {getToken} from "../../../utils/auth";

export default {
  name: "Lottery",
  components: {userAvatar},
  data() {
    return {
      uploadUrl: process.env.VUE_APP_BASE_API + "/points/manage/imgUpload", // 上传的图片服务器地址
      headers: {
        Authorization: "Bearer " + getToken()
      },
      lotteryPrizes: [],
      showPrizes: [],
      blocks: [{
        padding: '45px',
        imgs: [{
          src: 'https://edu-1010xzh.oss-cn-shenzhen.aliyuncs.com/gp/bg.a4b976d5.png',
          width: '100%',
          height: '100%',
          rotate: true
        }]
      }],
      rules: {
        prizeName: [
          {required: true, message: "礼品名称不能为空", trigger: "blur"},
          {min: 2, max: 20, message: '礼品名称长度必须介于 2 和 20 之间', trigger: 'blur'}
        ],
        awardPointsCount: [
          {
            required: true,
            message: "奖励积分能为空",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              console.log(value)
              // 自定义验证逻辑，例如检查是否为负数或其他条件
              if (value === 0) {
                callback(new Error('奖励积分不能为0'));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        stock: [
          {
            required: true,
            message: "库存不能为空",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              // 自定义验证逻辑，例如检查是否为负数或其他条件
              if (value === 0) {
                callback(new Error('库存不能为0'));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        phonenumber: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      },
      isOpenLottery: false,
      buttons: [
        {
          radius: '45%',
          imgs: [{
            src: 'https://edu-1010xzh.oss-cn-shenzhen.aliyuncs.com/gp/start-lottery.png',
            width: '60%',
            top: '-100%'
          }]
        }
      ],
      open:
        false,
      // 表单参数
      form:
        {
          prizeName: null,
          prizePictureUrl: '',
          awardPointsCount: 0.0001,
          stock: 1
        },
      lotProbability: 0.0001,
      title: '',
    }
  },
  created() {
    // 获取礼品
    this.getLotteryPrizes();
    // 获取当前系统的礼品开启状态
    this.getStatus();
  },

  methods: {
    getLotteryPrizes() {
      getLotteryPrizes().then(res => {
        this.lotteryPrizes = res.data;
        let prizes = [];
        for (let i = 0; i < res.data.length; i++) {
          let prize = {
            id: res.data[i].prizeId,
            fonts: [{text: res.data[i].prizeName, top: '20%', fontSize: 18}],
            imgs: [{src: res.data[i].prizePictureUrl, width: '25%', top: '50%'}],
            background: i % 2 === 0 ? '#f1d09a' : ''
          }
          prizes.push(prize);
        }
        this.showPrizes = prizes;
      })
    },
    getStatus() {
      getLotteryStatus().then(res => {
        this.isOpenLottery = res.data;
      })
    },
    onChangeSwitch(val) {
      if (val) {
        this.openLottery()
      } else {
        this.closeLottery()
      }
    },
    closeLottery() {
      stopLottery().then(res => {
        if (res.success) {
          this.$message.success("抽奖活动已停止！")
        } else {
          this.$message.error(res.message)
        }
        this.getStatus();
      })
    },
    openLottery() {
      startLottery().then(res => {
        if (res.success) {
          this.$message.success("抽奖活动已开启！")
        } else {
          this.$message.error(res.message)
        }
        this.getStatus();
      })
    },
    handleDelete(prize) {
      const _this = this;
      let lotteryPrizes = [];
      this.lotteryPrizes.forEach(lotteryPrize => {
          if (lotteryPrize.prizeId !== prize.prizeId) {
            lotteryPrizes.push(lotteryPrize);
          }
        }
      )
      this.$confirm('删除礼品后需要再次手动开启抽奖系统，是否继续？', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn-custom-cancel',
        type: 'warning'
      }).then(function () {
        updateLottery(lotteryPrizes).then(res => {
          if (res.success) {
            _this.$message.success("修改成功！")
          } else {
            _this.$message.error(res.message);
          }
          _this.getLotteryPrizes();
          _this.getStatus();
        })
      })
    },
    handleUpdate(prize) {
      this.reset();
      this.form = prize;
      this.lotProbability = prize.lotProbability / 1000;
      this.open = true;
      this.title = "修改礼品";
    },
    handleImgSuccess(res) {
      this.form.prizePictureUrl = res.data;
      this.$forceUpdate();
    },
    beforeImgUpload(file) {
      return file.size / 1024 / 1024 < 2;
    },
    handleAdd() {
      this.reset();
      this.open = true;
    },
    reset() {
      this.form = {};
      this.resetForm("form");
    },
// 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    submitForm() {
      const _this = this;
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.$confirm('修改需要再次手动开启抽奖系统，是否继续？', '系统提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            cancelButtonClass: 'btn-custom-cancel',
            type: 'warning'
          }).then(function () {
            let lotteryPrizes = _this.lotteryPrizes;
            _this.form.lotProbability = _this.lotProbability * 1000;
            if (_this.form.prizeId == null) {
              lotteryPrizes.push(_this.form);
            }
            lotteryPrizes.forEach(prizes => {
              if (prizes.prizeId === _this.form.prizeId) {
                prizes.prizeId = _this.form.prizeId; // Update the specific property
              }
            });
            updateLottery(lotteryPrizes).then(res => {
              if (res.success) {
                _this.open = false;
                _this.$message.success("修改成功！")
              } else {
                _this.$message.error(res.message);
              }
              _this.getLotteryPrizes();
              _this.getStatus();
            })
          })
        }
      })
    }
  }
}
</script>
<style>
.page {
  width: 100%;
  height: 89.6vh;
  display: flex;

  .left {
    margin-left: 10%;
    margin-top: 10%;

    .title {
      display: flex; /* 设置为flex布局 */
      justify-content: center; /* 水平居中对齐 */
      align-items: center; /* 垂直居中对齐 */
      margin-bottom: 30px;
      font-size: 36px;
      font-weight: bold;
    }
  }

  .right {
    width: 100%;
    height: 100%;
    display: flex; /* 设置为flex布局 */
    justify-content: center; /* 水平居中对齐 */
    align-items: center; /* 垂直居中对齐 */

    .giftBox {
      width: 80%;
      height: 90%;
      padding: 2%;

      .top {
        height: 100px;
        display: flex; /* 设置为flex布局 */
        justify-content: center; /* 水平居中对齐 */
        align-items: center; /* 垂直居中对齐 */

        .el-tag {
          margin-left: 20px;
        }

        .el-button {
          margin-left: 60px;
        }
      }

    }
  }
}
</style>
