<template>
  <div class="app-container">
    <ManagerIndex v-if="isManager"/>
<!--    <StudentIndex v-else/>-->
  </div>
</template>

<script>

import ManagerIndex from '@/components/ManagerIndex'
import StudentIndex from "@/components/StudentIndex"
// import userAvatar from "@/views/system/user/profile/userAvatar.vue";
import {getUserProfile} from "@/api/system/user";

export default {
  name: "Index",
  components: {
    ManagerIndex,
    StudentIndex
  },
  data() {
    return {
      // 版本号
      user: {},
      isManager: false,
    };
  },
  methods: {
    getRouter() {
      console.log(this.$route.path);
    },
    getUser() {
      getUserProfile().then(response => {
        this.user = response.data.user;
        this.isManager = this.user.roles[0].roleId === 1
        // this.roleGroup = response.data.roleGroup;
      });
    }
  },
  created() {
    this.getRouter();
    this.getUser();
  }
};
</script>

<style scoped lang="scss">

</style>

