<template>
  <div>
    <el-table :data="logList" border stripe>
      <el-table-column align="center" prop="userName" label="登录用户"></el-table-column>
      <el-table-column align="center" prop="title" label="执行操作"></el-table-column>
      <el-table-column align="center" prop="requestUri" label="请求URL"></el-table-column>
      <el-table-column align="center" prop="createTime" label="请求时间"></el-table-column>
      <el-table-column align="center" prop="exception" label="异常"></el-table-column>
      <el-table-column align="center" prop="remoteAddr" label="IP"></el-table-column>
      <el-table-column align="center" prop="ipRegion" label="地址"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getLogListApi } from "@/api/log";
export default {
  data() {
    return {
      logList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
    };
  },
  created() {
    this.getLogList();
  },
  methods: {
    async getLogList() {
      let parm = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
      };
      let res = await getLogListApi(parm);
      if (res && res.code == 200) {
        this.total = res.data.total;
        this.logList = res.data.records;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
