<template>
  <el-main>
    <!-- 搜索，新增按钮 -->
    <el-form label-width="80px" :inline="true" size="small">
      <el-form-item>
        <span style="font-size: 20px; font-weight: 700">创建社团审批</span>
      </el-form-item>
    </el-form>
    <!-- 活动表格 -->
    <el-table
      :data="ApplyData"
      stripe
      style="width: 100%"
      border
      empty-text="暂无待审批社团"
    >
      <el-table-column prop="deptName" label="社团名称"> </el-table-column>
      <el-table-column prop="deptCode" label="社团编码"> </el-table-column>
      <el-table-column prop="deptAddress" label="社团地址"> </el-table-column>
      <el-table-column prop="deptPhone" label="社团电话"> </el-table-column>
      <el-table-column prop="introduction" label="社团介绍"> </el-table-column>
      <el-table-column prop="applyTime" label="申请时间"> </el-table-column>
      <el-table-column label="操作" align="center" width="220">
        <template slot-scope="scope">
          <el-button
            slot="reference"
            v-if="hasPerm('clubApply:edit')"
            icon="el-icon-edit"
            type="primary"
            size="small"
            @click="Approval(scope.row)"
            >通过</el-button
          >

          <el-button
            slot="reference"
            v-if="hasPerm('clubApply:edit')"
            icon="el-icon-delete"
            type="danger"
            size="small"
            @click="Rejection(scope.row)"
            >拒绝</el-button
          >
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
import { getCreateDeptListApi, PassApplyApi } from "@/api/department";
export default {
  data() {
    return {
      ApplyData: [],
      // 分页数据
      parms: {
        currentPage: 1, //当前是第几页
        pageSize: 10, //每页查询条数
        // userId: this.$store.getters.userId,
        total: 0,
      },
      ApplyData: [],
      ApplyModule: {
        id:"",
        username: "",
        introduction: "",
        deptName: "",
        state: "",
        deptCode: "",
        deptAddress: "",
        deptPhone:"",
        applyTime:""
      },
    };
  },
  created() {
    this.getApplyList();
  },
  methods: {
    // 分页相关
    currentChange(val) {
      this.parms.currentPage = val;
      this.getApplyList(this.parms);
      console.log("当前页");
      console.log(val);
    },
    sizeChange(val) {
      console.log("页容量");
      console.log(val);
      this.parms.currentPage = 1;
      this.parms.pageSize = val;
      this.getApplyList(this.parms);
    },
    async Approval(row) {
      let confirm = await this.$myconfirm("确认该用户创建社团？");
      if (confirm) {
        this.$objCoppy(row, this.ApplyModule);
        this.ApplyModule.id = row.id;
        this.ApplyModule.state = 1;
        let res = await PassApplyApi(this.ApplyModule);
        if (res && res.code == 200) {
          //刷新列表
          this.getApplyList(this.parms);
          this.$message.success(res.msg);
        }
      }
    },
    async Rejection(row) {
      let confirm = await this.$myconfirm("拒绝该用户创建社团？");
      if (confirm) {
        this.$objCoppy(row, this.ApplyModule);
        this.ApplyModule.id = row.id;
        this.ApplyModule.state = 2;
        let res = await PassApplyApi(this.ApplyModule);
        if (res && res.code == 200) {
          //刷新列表
          this.getApplyList(this.parms);
          this.$message.success(res.msg);
        }
      }
    },
    async getApplyList() {
      let res = await getCreateDeptListApi(this.parms);
      if (res && res.code == 200) {
        this.ApplyData = res.data.records;
      }
    },
  },
  components: {},
};
</script>

<style scoped>
</style>
