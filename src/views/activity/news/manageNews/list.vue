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
        <router-link :to="'/write/'">
          <el-button
            v-if="hasPerm('news:add')"
            type="primary"
            icon="el-icon-plus"
            >新增</el-button
          >
        </router-link>
      </el-form-item>
    </el-form>
    <!-- 活动表格 -->
    <el-table :data="ArticleList" stripe style="width: 100%" border>
      <el-table-column prop="author" label="作者"> </el-table-column>
      <el-table-column prop="title" label="文章标题">
        <template slot-scope="{ row }">
          <router-link :to="'/edit/' + row.id" class="link-type">
            <span>{{ row.title }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="文章类型"> </el-table-column>
      <el-table-column prop="createTime" label="创作时间"> </el-table-column>
      <el-table-column label="操作" align="center" width="220">
        <template slot-scope="scope">
          <router-link :to="'/edit/' + scope.row.id">
            <el-button
              v-if="hasPerm('news:edit')"
              icon="el-icon-edit"
              type="primary"
              size="small"
              >编辑</el-button
            >
          </router-link>

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
import { getArticleListApi, deleteArticleApi } from "@/api/article";
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
        deptId: this.$store.getters.deptId
      },
      ArticleList: [],
      // 新增弹窗数据源
    };
  },
  created() {
    this.getData();
  },
  methods: {
    //删除文章
    async deleteArticle(row) {
      console.log(row);
      let confirm = await this.$myconfirm("确认删除该数据吗?");
      if (confirm) {
        let parm = {
          id: row.id,
        };
        let res = await deleteArticleApi(parm);
        if (res && res.code == 200) {
          this.$message.success(res.msg);
          //新增成功刷新列表
          this.getData();
        }
      }
    },

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
      let res = await getArticleListApi(this.parms);
      if (res && res.code == 200) {
        this.ArticleList = res.data.records;
        this.parms.total = res.data.total;
      }
    },
    searchList() {},
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
