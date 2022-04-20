<template>
  <el-main>
    <!-- 搜索，新增按钮 -->
    <el-form label-width="80px" :inline="true" size="small">
      <el-form-item>
        <span style="font-size: 20px; font-weight: 700">社团人员审批</span>
      </el-form-item>
    </el-form>
    <!-- 活动表格 -->
    <el-table
      :data="ApplyData"
      stripe
      style="width: 100%"
      border
      empty-text="暂无待审批人员"
    >
      <el-table-column prop="username" label="人员名称"> </el-table-column>
      <el-table-column prop="introduction" label="人员介绍"> </el-table-column>
      <el-table-column prop="applyTime" label="申请时间" sortable>
      </el-table-column>
      <el-table-column label="操作" align="center" width="220">
        <template slot-scope="scope">
          <el-popconfirm title="确认此成员加入社团吗？">
            <el-button
              slot="reference"
              v-if="hasPerm('userApprove:edit')"
              icon="el-icon-edit"
              type="primary"
              size="small"
              @click="Approval(scope.row)"
              >通过</el-button
            >
          </el-popconfirm>
          <el-popconfirm title="确认拒绝此成员吗？">
            <el-button
              slot="reference"
              v-if="hasPerm('userApprove:edit')"
              icon="el-icon-delete"
              type="danger"
              size="small"
              @click="Rejection(scope.row)"
              >拒绝</el-button
            >
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页相关 -->
    <el-pagination
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page.sync="parms.currentPage"
      :page-sizes="[10, 20, 40, 80, 100]"
      :page-size="parms.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="parms.total"
      background
    >
    </el-pagination>
  </el-main>
</template>

<script>
import { getApproveListApi, editUserProveApi } from "@/api/user";
import { getDepNameApi } from "@/api/department";
import SysDialog from "@/components/system/SysDialog";
export default {
  components: {
    SysDialog,
  },
  data() {
    return {
      // 分页数据
      parms: {
        currentPage: 1, //当前是第几页
        pageSize: 10, //每页查询条数
        // userId: this.$store.getters.userId,
        total: 0,
        deptName: "",
      },
      ApplyData: [],
      ApplyModule: {
        username: "",
        introduction: "",
        deptName: "",
        state: "",
        userid: "",
        deptId: "",
      },
    };
  },
  created() {
    this.getData();
  },
  methods: {
    // 分页相关
    currentChange(val) {
      this.parms.currentPage = val;
      this.getData(this.parms);
      console.log("当前页");
      console.log(val);
    },
    sizeChange(val) {
      console.log("页容量");
      console.log(val);
      this.parms.currentPage = 1;
      this.parms.pageSize = val;
      this.getData(this.parms);
    },
    //获取活动列表
    async getData() {
      let parms = {
        deptId: this.$store.getters.deptId,
      };
      let res = await getDepNameApi(parms);
      console.log(res);
      if (res && res.code == 200) {
        this.parms.deptName = res.data;
      }
      res = await getApproveListApi(this.parms);
      if (res && res.code == 200) {
        this.ApplyData = res.data.records;
        this.parms.total = res.data.total;
      }
    },
    async Approval(row) {
      // console.log("通过");
      this.$objCoppy(row, this.ApplyModule);
      this.ApplyModule.id = row.id;
      this.ApplyModule.state = 1;
      let res = await editUserProveApi(this.ApplyModule);
      if (res && res.code == 200) {
        //刷新列表
        this.getData(this.parms);
        this.$message.success(res.msg);
      }
    },
    async Rejection(row) {
      this.$objCoppy(row, this.ApplyModule);
      this.ApplyModule.id = row.id;
      this.ApplyModule.state = 2;
      let res = await editUserProveApi(this.ApplyModule);
      if (res && res.code == 200) {
        //刷新列表
        this.getData(this.parms);
        this.$message.success(res.msg);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
