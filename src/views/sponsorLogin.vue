<template>
  <div>
    <vue-particles
      :number="10"
      :area="2000"
      :color="['#ff0000', '#00ff00', '#0000ff', '#ff6600', '#9900cc', '#ffcc00', '#66cc66', '#cc0066', '#3399ff', '#ff3399']"
      shape="star"
      :lineWidth="5"
      lineColor="#ff0000"
      :opacity="0.5"
      :speed="20"
      hoverMode="grab"
    ></vue-particles>
    <div class="goSponsor">
      <router-link class="link-type" :to="'/login'">
        <i class="el-icon-right"></i>
        <span> 前往足迹后台管理系统</span>
      </router-link>
    </div>
    <div class="loginDiv">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules">
        <div class="title">
          <h2>足迹赞助商系统</h2>
        </div>
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号">
            <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon"/>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="密码"
                    @keyup.enter.native="handleLogin">
            <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon"/>
          </el-input>
        </el-form-item>
        <el-checkbox v-model="loginForm.rememberMe">记住密码</el-checkbox>
        <el-form-item style="width: 100%">
          <el-button :loading="loading" size="medium" type="primary"
                     style="margin-top: 20px; width: 100%;font-size:16px;font-weight:800"
                     @click.native.prevent="handleLogin">
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
          <!-- <div style="float: right" v-if="register">
            <router-link class="link-type" :to="'/register'">立即注册</router-link>
          </div> -->
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {register} from "@/api/login";
import Cookies from "js-cookie";
import {encrypt, decrypt} from "@/utils/jsencrypt";

export default {
  name: "Login",
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.registerForm.password !== value) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      codeUrl: "",
      loginForm: {
        username: "admin",
        password: "123456",
        rememberMe: false,
        code: "",
        uuid: "",
      },
      loginRules: {
        username: [
          {required: true, trigger: "blur", message: "请输入您的账号"},
        ],
        password: [
          {required: true, trigger: "blur", message: "请输入您的密码"},
        ],
        code: [{required: true, trigger: "change", message: "请输入验证码"}],
      },
      registerForm: {
        username: "",
        password: "",
        confirmPassword: "",
        code: "",
        uuid: "",
      },
      registerRules: {
        username: [
          {required: true, trigger: "blur", message: "请输入您的账号"},
          {
            min: 2,
            max: 20,
            message: "用户账号长度必须介于 2 和 20 之间",
            trigger: "blur",
          },
        ],
        password: [
          {required: true, trigger: "blur", message: "请输入您的密码"},
          {
            min: 5,
            max: 20,
            message: "用户密码长度必须介于 5 和 20 之间",
            trigger: "blur",
          },
        ],
        confirmPassword: [
          {required: true, trigger: "blur", message: "请再次输入您的密码"},
          {required: true, validator: equalToPassword, trigger: "blur"},
        ],
        code: [{required: true, trigger: "change", message: "请输入验证码"}],
      },
      loading: false,
      // 验证码开关
      captchaEnabled: true,
      // 注册开关
      register: false,
      redirect: undefined,
      isClass: true,
      isStyle: false,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  created() {
    this.getCookie();
  },
  methods: {
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get("rememberMe");
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password:
          password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, {expires: 30});
            Cookies.set("password", encrypt(this.loginForm.password), {
              expires: 30,
            });
            Cookies.set("rememberMe", this.loginForm.rememberMe, {
              expires: 30,
            });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove("rememberMe");
          }
          this.$store
            .dispatch("Login", this.loginForm)
            .then(() => {
              this.$router.push({path: this.redirect || "/"}).catch(() => {
              });
            })
            .catch(() => {
              this.loading = false;
              // if (this.captchaEnabled) {
              //   this.getCode();
              // }
            });
        }
      });
    },
    handleRegister() {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          register(this.registerForm)
            .then((res) => {
              const username = this.registerForm.username;
              this.$alert(
                "<font color='red'>恭喜你，您的账号 " +
                username +
                " 注册成功！</font>",
                "系统提示",
                {
                  dangerouslyUseHTMLString: true,
                  type: "success",
                }
              )
                .then(() => {
                  this.$router.push("/login");
                  // this.isHidden()
                })
                .catch(() => {
                });
            })
            .catch(() => {
              this.loading = false;
              if (this.captchaEnabled) {
                this.getCode();
              }
            });
        }
      });
    },
    isHidden() {
      this.isStyle = !this.isStyle
      this.isClass = !this.isClass
    },
  },
  computed: {
    showArrow() {
      return this.isStyle ? "80%" : 0
    }
  }
};
</script>

<style scoped>
body, html {
  margin: 0;
  padding: 0;
}

.title {
  width: 100%;
  text-align: center;
}

.loginDiv {
  z-index: 12;
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 350px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15); /* 添加阴影 */
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px); /* 在动画的40%处向上移动10像素 */
  }
  60% {
    transform: translateY(-5px); /* 在动画的60%处向上移动5像素 */
  }
}

.goSponsor {
  z-index: 12;
  position: absolute;
  top: 3%;
  left: 2%;
  animation: bounce 1s infinite; /* 使用 bounce 动画，持续时间为1秒，无限循环 */
  cursor: pointer; /* 设置鼠标样式为小手 */

}

.goSponsor:hover {
  color: #0080ff; /* 鼠标悬停时改变文字颜色 */
  animation: none; /* 停止动画效果 */
}
</style>

