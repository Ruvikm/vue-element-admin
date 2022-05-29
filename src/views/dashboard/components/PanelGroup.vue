<template>
  <el-row :gutter="40" class="panel-group">
    <!-- 登录角色信息 -->
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="people" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{ name }}，你好！</div>
          <div class="card-panel-text">角色：{{ roleName }}</div>
        </div>
      </div>
    </el-col>

    <el-row v-if="roleName == '超级管理员'">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="people" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">用户数量</div>
            <count-to :start-val="0" :end-val= userNum :duration= userNum/2
            class="card-panel-num" />
          </div>
        </div>
      </el-col>

      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="people" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">角色数量</div>
            <count-to :start-val="0" :end-val= roleNum :duration= roleNum/2
            class="card-panel-num" />
          </div>
        </div>
      </el-col>

      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="people" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">权限数量</div>
            <count-to :start-val="0" :end-val= menuNum :duration= menuNum/2
            class="card-panel-num" />
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row v-else-if="roleName == '社长'">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="peoples" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">社团人数</div>
            <count-to
              :start-val="userNum"
              :end-val="userNum"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>

      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="peoples" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">申请人数</div>
            <count-to
              :start-val="0"
              :end-val="peopleApplyNum"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>

      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="peoples" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">近一个月收入</div>
            <count-to
              :start-val="income * 0.9"
              :end-val="income"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>

      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('purchases')">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="money" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">近一个月开支</div>
            <count-to
              :start-val="expense * 0.9"
              :end-val="expense"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row v-else-if="roleName == '财务部长'">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="peoples" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">近一个月收入</div>
            <count-to
              :start-val="income * 0.9"
              :end-val="income"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>

      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('purchases')">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="money" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">近一个月开支</div>
            <count-to
              :start-val="expense * 0.9"
              :end-val="expense"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>

      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('purchases')">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="money" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">待归还物品数量</div>
            <count-to
              :start-val="revertNum * 0.9"
              :end-val="revertNum"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row v-else-if="roleName == '审核员'">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="peoples" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">待批准活动</div>
            <count-to :start-val="0" :end-val= actApplyNum :duration=
            actApplyNum/2 class="card-panel-num" />
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row v-else-if="roleName == '宣传部长'">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="peoples" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">文章数量</div>
            <count-to :start-val="0" :end-val= articleNum :duration=
            articleNum/2 class="card-panel-num" />
          </div>
        </div>
      </el-col>
    </el-row>
  </el-row>
</template>

<script>
import CountTo from "vue-count-to";
import {
  getUserNumApi,
  getDeptUserNumApi,
  getApplyUserNumApi,
} from "@/api/user";
import { getRoleNumApi } from "@/api/role";
import { getMenuNumApi } from "@/api/menu";
import { getProveActNumApi } from "@/api/activity";
import { getIncomeSumApi } from "@/api/income";
import { getExpenseSumApi } from "@/api/expense";
import { getRevertNumApi } from "@/api/things";
import { GetArticleNumApi } from "@/api/article";

export default {
  components: {
    CountTo,
  },
  computed: {
    // roleName() {
    //   return this.$store.getters.roleName;
    // },
  },
  data() {
    return {
      parms: {
        deptId: this.$store.getters.deptId,
      },
      name: this.$store.getters.name,
      roleName: this.$store.getters.roleName,
      userNum: 1,
      menuNum: 1,
      roleNum: 1,
      peopleApplyNum: 1,
      actApplyNum: 1,
      income: 2,
      expense: 2,
      revertNum: 2,
      articleNum: 1,
    };
  },
  created() {
    this.getData();
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit("handleSetLineChartData", type);
    },

    async getData() {
      //获取用户数量
      let res = null;
      let _this = this;
      if (this.roleName == "超级管理员") {
        _this.getAdminData();
      } else if (this.roleName == "社长") {
        _this.getPresidentData();
      } else if (this.roleName == "财务部长") {
        _this.getTreasurerData();
      } else if (this.roleName == "审核员") {
        _this.getAuditorsData();
      } else {
        _this.getPublicityData();
      }
    },
    async getAdminData() {
      let res = null;
      res = await getUserNumApi();
      if (res && res.code == 200) {
        this.userNum = res.data;
      }

      //获取角色数量
      res = await getRoleNumApi();
      if (res && res.code == 200) {
        this.roleNum = res.data;
      }
      //获取权限数量
      res = await getMenuNumApi();
      if (res && res.code == 200) {
        this.menuNum = res.data;
      }
    },
    async getPresidentData() {
      let res = null;
      //获取社团人数
      res = await getDeptUserNumApi(this.parms);
      if (res && res.code == 200) {
        this.userNum = res.data;
      }
      //获取近一个月收入
      res = await getIncomeSumApi(this.parms);
      if (res && res.code == 200) {
        this.income = res.data;
      }
      //获取近一个月支出
      res = await getExpenseSumApi(this.parms);
      if (res && res.code == 200) {
        this.expense = res.data;
      }
      //获取申请社团人数量
      res = await getApplyUserNumApi(this.parms);
      if (res && res.code == 200) {
        this.peopleApplyNum = res.data;
      }
    },
    async getTreasurerData() {
      let res = null;
      //获取近一个月收入
      res = await getIncomeSumApi(this.parms);
      if (res && res.code == 200) {
        this.income = res.data;
      }
      //获取近一个月支出
      res = await getExpenseSumApi(this.parms);
      if (res && res.code == 200) {
        this.expense = res.data;
      }

      //获取待归还物品数量
      res = await getRevertNumApi(this.parms);
      if (res && res.code == 200) {
        this.revertNum = res.data;
      }
    },
    async getAuditorsData() {
      let res = null;
      //获取待审批活动数量
      res = await getProveActNumApi();
      if (res && res.code == 200) {
        this.actApplyNum = res.data;
      }
    },
    async getPublicityData() {
      let res = null;
      //获取待审批活动数量
      res = await GetArticleNumApi(this.parms);
      if (res && res.code == 200) {
        this.articleNum = res.data;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3;
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
