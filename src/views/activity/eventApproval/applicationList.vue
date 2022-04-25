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
      <!-- <el-table-column prop="applicant" label="申办人"> </el-table-column> -->
      <el-table-column prop="activityName" label="活动名称"> </el-table-column>
      <!-- <el-table-column prop="activityType" label="活动类型"> </el-table-column> -->
      <el-table-column prop="activityTime" label="活动时间" sortable>
      </el-table-column>
      <el-table-column prop="activityPlace" label="活动地点"> </el-table-column>
      <!-- <el-table-column prop="money" label="申请金额"> </el-table-column> -->
      <el-table-column label="操作" align="center" width="220">
        <template slot-scope="scope">
          <!-- <el-button
            v-if="hasPerm('activity:edit')"
            icon="el-icon-edit"
            type="primary"
            size="small"
            @click="Approval(scope.row)"
            >通过</el-button
          > -->
          <el-button
            v-if="hasPerm('activity:edit')"
            icon="el-icon-edit"
            type="primary"
            size="small"
            @click="CheckDetails(scope.row)"
            >查看详情</el-button
          >
          <!-- <el-button
            v-if="hasPerm('activity:edit')"
            icon="el-icon-delete"
            type="danger"
            size="small"
            @click="Rejection(scope.row)"
            >拒绝</el-button
          > -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 查看活动详情 -->
    <DetailsDialog
      :title="addDialog.title"
      :height="addDialog.height"
      :width="addDialog.width"
      :visible="addDialog.visible"
      @onClose="onClose"
      @onConfirm="onConfirm"
    >
      <div slot="content">
        <el-form
          :model="addModule"
          ref="addForm"
          label-width="80px"
          :inline="true"
          size="small"
        >
          <el-col :span="24">
            <el-form-item prop="activityName" label="活动名称:">
              <span>{{ addModule.activityName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="activityPlace" label="活动地点:">
              <span>{{ addModule.activityPlace }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="money" label="申请金额:">
              <span>{{ addModule.money }} ¥</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="applicant" label="申办人:">
              <span>{{ addModule.applicant }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="活动类型:" prop="activityType">
              <span>{{ addModule.activityType }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="activityTime" label="活动时间:">
              <span>{{ addModule.activityTime }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="details" label="具体内容:">
              <span>{{ addModule.details }}</span>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
    </DetailsDialog>

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
import DetailsDialog from "@/components/system/DetailsDialog";
export default {
  components: {
    DetailsDialog,
  },
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
      //弹窗属性
      addDialog: {
        title: "",
        height: 450,
        width: 610,
        visible: false,
      },
      // 新增或编辑弹窗数据
      addModule: {
        id: "", //编辑时候使用
        editType: "", //标识新增或编辑  0：新增 1：编辑
        activityName: "",
        activityPlace: "",
        activityType: "",
        activityTime: "",
        state: 1,
        deptId: this.$store.getters.deptId,
        money: "",
        applicant: "",
        details: "",
      },
    };
  },
  created() {
    this.getData();
  },
  methods: {
    //弹窗的确认取消事件
    async onClose() {
      this.addModule.state = 2;
      let res = await editActivityApi(this.addModule);
      if (res && res.code == 200) {
        //刷新列表
        this.getData(this.parms);
        this.$message.success(res.msg);
      }
      this.addDialog.visible = false;
    },
    async onConfirm() {
       this.addModule.state = 1;
      let res = await editActivityApi(this.addModule);
      if (res && res.code == 200) {
        //刷新列表
        this.getData(this.parms);
        this.$message.success(res.msg);
      }
      this.addDialog.visible = false;
    },
    // 分页相关
    currentChange(val) {
      this.parms.currentPage = val;
      this.getData(this.parms);
    },
    sizeChange(val) {
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
    CheckDetails(row) {
      //清空表单
      this.$resetForm("addExForm", this.addModule);
      //设置弹框属性
      this.addDialog.title = "活动详情";
      this.addDialog.visible = true;
      //把当前点击的行数据复制到表单数据域
      this.$objCoppy(row, this.addModule);
      console.log(row);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
