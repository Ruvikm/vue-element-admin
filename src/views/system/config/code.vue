<template>
  <el-main>
    <el-form
      :model="parms"
      ref="seachform"
      label-width="80px"
      :inline="true"
      size="small"
    >
      <el-form-item label="系统日志"> </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="getExceptions"
          >查看系统异常</el-button
        >
        <el-button type="primary" @click="reFlash"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <el-table :data="logList" border stripe>
      <el-table-column
        align="center"
        prop="userName"
        label="登录用户"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="title"
        label="执行操作"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="requestUri"
        label="请求URL"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="createTime"
        label="请求时间"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="exception"
        label="异常"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="remoteAddr"
        label="IP"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="ipRegion"
        label="地址"
      ></el-table-column>
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
import { getLogListApi } from "@/api/log";
export default {
  data() {
    return {
      logList: [],
      parms: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        exception: "",
      },
    };
  },
  created() {
    this.getLogList();
  },
  methods: {
    reFlash(){
      this.parms.exception = "";
      this.getLogList();
    },
    getExceptions() {
      this.parms.exception = "异常";
      this.getLogList();
    },
    // 分页相关
    currentChange(val) {
      this.parms.currentPage = val;
      this.getLogList(this.parms);
    },
    sizeChange(val) {
      this.parms.currentPage = 1;
      this.parms.pageSize = val;
      this.getLogList(this.parms);
    },
    async getLogList() {
      let res = await getLogListApi(this.parms);
      if (res && res.code == 200) {
        this.parms.total = res.data.total;
        this.logList = res.data.records;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
