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
export default {
  data() {
    return {
      ApplyData:[]
    };
  },
  methods: {
    Approval(){

    },
    Rejection(){
      
    }
  },
  components: {},
};
</script>

<style scoped>
</style>
