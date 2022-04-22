<template>
  <el-main>
    <!-- 搜索，新增按钮 -->
    <el-form
      :model="parms"
      ref="seachform"
      label-width="80px"
      :inline="true"
      size="small"
    >
      <el-form-item label="活动名称">
        <!-- <el-input v-model="parms.name"></el-input> -->
      </el-form-item>
      <!-- <el-form-item>
        <el-button @click="searchList" icon="el-icon-search">查询</el-button>
      </el-form-item> -->
    </el-form>
    <!-- 活动表格 -->
    <el-table
      :data="ActData"
      stripe
      style="width: 100%"
      border
      empty-text="暂无待审批活动"
    >
      <el-table-column prop="deptName" label="社团名称"> </el-table-column>
      <el-table-column prop="activityName" label="活动名称"> </el-table-column>
      <el-table-column prop="activityType" label="活动类型"> </el-table-column>
      <el-table-column prop="activityTime" label="活动时间" sortable>
      </el-table-column>
      <el-table-column prop="activityPlace" label="活动地点"> </el-table-column>
      <el-table-column label="操作" align="center" width="220">
        <template slot-scope="scope">
          <el-button
            v-if="hasPerm('activity:edit')"
            icon="el-icon-edit"
            type="primary"
            size="small"
            @click="Approval(scope.row)"
            >通过</el-button
          >
          <el-button
            v-if="hasPerm('activity:edit')"
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
import { getActProveListApi, editActivityApi } from "@/api/activity";
export default {
  data() {
    return {
      seachform: [],
      // 分页数据
      parms: {
        currentPage: 1, //当前是第几页
        pageSize: 10, //每页查询条数
        // userId: this.$store.getters.userId,
        total: 0,
      },
      ActData: [],
      // 新增或编辑弹窗数据
      // 新增弹窗数据源
      addModule: {
        id: "", //编辑时候使用
        state: "",
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
      //console.log("当前页");
      //console.log(val);
    },
    sizeChange(val) {
      //console.log("页容量");
      //console.log(val);
      this.parms.currentPage = 1;
      this.parms.pageSize = val;
      this.getData(this.parms);
    },
    //获取活动列表
    async getData() {
      let res = await getActProveListApi(this.parms);
      if (res && res.code == 200) {
        this.ActData = res.data.records;
        this.parms.total = res.data.total;
      }
    },
    searchList() {},
    async Approval(row) {
      this.addModule.id = row.id;
      this.addModule.state = 1;
      let res = await editActivityApi(this.addModule);
      if (res && res.code == 200) {
        //刷新列表
        this.getData(this.parms);
        this.$message.success(res.msg);
      }
    },
    async Rejection(row) {
      this.addModule.id = row.id;
      this.addModule.state = 2;
      let res = await editActivityApi(this.addModule);
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
</style>
