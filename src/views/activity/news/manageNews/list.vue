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
      <el-form-item label="文章名称">
        <el-input v-model="parms.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="searchList" icon="el-icon-search">查询</el-button>
        <el-button
          v-if="hasPerm('news:add')"
          @click="addItem"
          type="primary"
          icon="el-icon-plus"
          >新增</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 活动表格 -->
    <el-table :data="ActData" stripe style="width: 100%" border>
      <el-table-column prop="activityType" label="作者"> </el-table-column>
      <el-table-column prop="activityName" label="文章名称"> </el-table-column>
      <el-table-column prop="activityType" label="文章类型"> </el-table-column>
      <el-table-column prop="activityType" label="创作时间"> </el-table-column>
      <el-table-column label="操作" align="center" width="220">
        <template slot-scope="scope">
          <el-button
            v-if="hasPerm('news:edit')"
            icon="el-icon-edit"
            type="primary"
            size="small"
            @click="editArticle(scope.row)"
            >编辑</el-button
          >
          <el-button
            v-if="hasPerm('news:delete')"
            icon="el-icon-delete"
            type="danger"
            size="small"
            @click="deleteArticle(scope.row)"
            >删除</el-button
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
      seachform: [],

      // 分页数据
      parms: {
        currentPage: 1, //当前是第几页
        pageSize: 10, //每页查询条数
        // userId: this.$store.getters.userId,
        total: 0,
        name: "",
      },
      ActData: [],
      // 新增弹窗数据源
    };
  },
  created() {
    // this.getData();
  },
  methods: {
    //编辑文章
    editArticle() {},
    //删除文章
    deleteArticle() {},

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
      // let res = await getActListApi(this.parms);
      // if (res && res.code == 200) {
      //   this.ActData = res.data.records;
      //   this.parms.total = res.data.total;
      // }
    },
    searchList() {},
    addItem() {
      // //清空表单数据
      // this.$resetForm("addForm", this.addModule);
      // this.addModule.editType = "0";
      // //设置弹框属性
      // this.addDialog.title = "新增活动";
      // this.addDialog.visible = true;
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
