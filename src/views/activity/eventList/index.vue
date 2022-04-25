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
        <el-input v-model="parms.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="searchList" icon="el-icon-search">查询</el-button>
        <el-button
          v-if="hasPerm('activity:add')"
          @click="addItem"
          type="primary"
          icon="el-icon-plus"
          >新增</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 活动表格 -->
    <el-table :data="ActData" stripe style="width: 100%" border>
      <el-table-column
        prop="activityName"
        label="活动名称"
        @click="Details(row)"
      >
      </el-table-column>
      <el-table-column prop="activityType" label="活动类型"> </el-table-column>
      <el-table-column prop="activityTime" label="活动时间" sortable>
      </el-table-column>
      <el-table-column prop="activityPlace" label="活动地点"> </el-table-column>
      <el-table-column
        prop="state"
        label="活动状态"
        :filters="[
          { text: '待审核中', value: 0 },
          { text: '审核通过', value: 1 },
          { text: '审核失败', value: 2 },
        ]"
        :filter-method="filterTag"
        filter-placement="bottom-end"
      >
        <template slot-scope="scope">
          <el-tag
            size="normal"
            v-if="scope.row.state == '0'"
            disable-transitions
            >待审核中</el-tag
          >
          <el-tag
            size="normal"
            type="success"
            v-if="scope.row.state == '1'"
            disable-transitions
            >审核通过</el-tag
          >
          <el-tag
            size="normal"
            type="danger"
            v-if="scope.row.state == '2'"
            disable-transitions
            >审核失败</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="220">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-edit"
            type="primary"
            size="small"
            @click="CheckDetails(scope.row)"
            >查看详情</el-button
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

    <!-- 新增或编辑 -->
    <sys-dialog
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
          :rules="rules"
          label-width="80px"
          :inline="true"
          size="small"
        >
          <el-form-item prop="activityName" label="活动名称">
            <el-input v-model="addModule.activityName"></el-input>
          </el-form-item>
          <el-form-item prop="activityPlace" label="活动地点">
            <el-input v-model="addModule.activityPlace"></el-input>
          </el-form-item>

          <el-form-item prop="money" label="申请金额">
            <el-input-number v-model="addModule.money"></el-input-number>
          </el-form-item>

          <el-form-item prop="applicant" label="申办人">
            <el-input v-model="addModule.applicant"></el-input>
          </el-form-item>

          <el-form-item label="活动类型" prop="activityType">
            <el-radio-group v-model="addModule.activityType">
              <el-radio label="团建类"></el-radio>
              <el-radio label="学术交流类"></el-radio>
              <el-radio label="公益活动类"></el-radio>
              <el-radio label="政治觉悟类"></el-radio>
              <el-radio label="运动比赛类"></el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item prop="activityTime" label="活动时间">
            <el-date-picker
              v-model="addModule.activityTime"
              type="datetime"
              placeholder="选择日期"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="details" label="具体内容">
            <el-input
              type="textarea"
              maxlength="100"
              show-word-limit
              v-model="addModule.details"
              :autosize="{ minRows: 6, maxRows: 8 }"
              size="medium"
              style="width: 350px"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </sys-dialog>
    <sys-dialog
      :title="DetailsDialog.title"
      :height="DetailsDialog.height"
      :width="DetailsDialog.width"
      :visible="DetailsDialog.visible"
      @onClose="DetailsonClose"
      @onConfirm="DetailsonConfirm"
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
          <el-col :span="24">
            <el-form-item prop="details" label="租借物品:">
              <span>占位符</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="财务支出:">
              <el-table :data="ExList" stripe style="width: 100%" border >
                <el-table-column prop="outName" label="支出名称:" align="center" width="250">
                </el-table-column>
                <el-table-column prop="money" label="支出金额:" align="center" width="250" >
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
    </sys-dialog>
  </el-main>
</template>

<script>
import { getActListApi, addActivityApi, editActivityApi } from "@/api/activity";
import { getExpenseListApi } from "@/api/expense";
import SysDialog from "@/components/system/SysDialog";
export default {
  components: {
    SysDialog,
  },
  data() {
    return {
      ExList: [],
      seachform: [],

      // 分页数据
      parms: {
        currentPage: 1, //当前是第几页
        pageSize: 10, //每页查询条数
        // userId: this.$store.getters.userId,
        total: 0,
        name: "",
        deptId: this.$store.getters.deptId,
      },
      ActData: [],
      // 新增或编辑弹窗数据
      addDialog: {
        title: "",
        height: 400,
        width: 610,
        visible: false,
      },
      DetailsDialog: {
        title: "",
        height: 500,
        width: 610,
        visible: false,
      },
      // 新增弹窗数据源
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
      DetailsModule: {},
      // 新增弹窗验证规则
      rules: {
        activityName: [
          {
            required: true,
            trigger: "change",
            message: "请填写名称",
          },
        ],
        activityPlace: [
          {
            required: true,
            trigger: "change",
            message: "请填写地点",
          },
        ],
        activityTime: [
          {
            required: true,
            trigger: "change",
            message: "请选择时间",
          },
        ],
        activityType: [
          {
            required: true,
            trigger: "change",
            message: "请选择类型",
          },
        ],
      },
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            },
          },
        ],
      },
    };
  },
  created() {
    this.getData();
  },
  methods: {
    //详情弹窗的功能
    DetailsonClose() {
      this.DetailsDialog.visible = false;
    },
    DetailsonConfirm() {
      this.DetailsDialog.visible = false;
    },

    //获取支出列表
    async getExpenList(row) {
      let parms = {
        deptId: this.$store.getters.deptId,
        activityId: row.id,
      };
      let res = await getExpenseListApi(parms);
      console.log(res);
      if (res && res.code == 200) {
        this.ExList = res.data;
      }
    },
    //查看细节
    CheckDetails(row) {
      this.$resetForm("addForm", this.addModule);
      this.$objCoppy(row, this.addModule);
      this.getExpenList(row);
      this.DetailsDialog.title = "活动详情";
      this.DetailsDialog.visible = true;
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
      let res = await getActListApi(this.parms);
      if (res && res.code == 200) {
        this.ActData = res.data.records;
        this.parms.total = res.data.total;
      }
    },
    searchList() {},
    addItem() {
      //清空表单数据
      this.$resetForm("addForm", this.addModule);
      this.addModule.editType = "0";
      //设置弹框属性
      this.addDialog.title = "新增活动";
      this.addDialog.visible = true;
    },
    filterTag(value, row) {
      return row.state === value;
    },
    //关闭弹窗
    onClose() {
      this.addDialog.visible = false;
    },
    //关闭弹窗
    onConfirm() {
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          let res = null;
          if (this.addModule.editType == "0") {
            this.addModule.deptId = this.$store.getters.deptId;
            console.log(this.addModule);
            //新增
            res = await addActivityApi(this.addModule);
          } else {
            res = await editActivityApi(this.addModule);
          }
          if (res && res.code == 200) {
            //刷新列表
            this.getData(this.parms);
            this.$message.success(res.msg);
            this.addDialog.visible = false;
          }
        }
      });
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
