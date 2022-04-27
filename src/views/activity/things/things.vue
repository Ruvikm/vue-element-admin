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
      <el-form-item label="物品名称">
        <el-input v-model="parms.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="searchList" icon="el-icon-search">查询</el-button>
        <el-button @click="addItem" type="primary" icon="el-icon-plus"
          >新增</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 收入表格 -->
    <el-table :height="tableHeight" :data="ThingsList" border stripe>
      <el-table-column prop="name" label="物品名"> </el-table-column>
      <!-- <el-table-column prop="startTime" label="租/借时间" sortable>
      </el-table-column> -->
      <el-table-column prop="lessor" label="租借人"> </el-table-column>
      <el-table-column prop="endTime" label="应归还时间" sortable>
      </el-table-column>
      <el-table-column prop="LastTime" label="剩余时间" sortable>
      </el-table-column>
      <el-table-column
        prop="state"
        label="物品状态"
        align="center"
        :filters="[
          { text: '已归还', value: 0 },
          { text: '租借中', value: 1 },
          { text: '已逾期', value: 2 },
        ]"
        :filter-method="filterTag"
        filter-placement="bottom-end"
      >
        <template slot-scope="scope">
          <el-tag
            size="normal"
            v-if="scope.row.state == '0'"
            disable-transitions
            >已归还</el-tag
          >
          <el-tag
            size="normal"
            type="success"
            v-if="scope.row.state == '1'"
            disable-transitions
            >租借中</el-tag
          >
          <el-tag
            size="normal"
            type="danger"
            v-if="scope.row.state == '2'"
            disable-transitions
            >已逾期</el-tag
          >
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="action"
        label="动作"
        align="center"
        :filters="[
          { text: '租', value: 0 },
          { text: '借', value: 1 },
        ]"
        :filter-method="filterActionTag"
        filter-placement="bottom-end"
      >
        <template slot-scope="scope">
          <el-tag
            size="normal"
            v-if="scope.row.action == '0'"
            disable-transitions
            >借</el-tag
          >
          <el-tag
            size="normal"
            type="success"
            v-if="scope.row.action == '1'"
            disable-transitions
            >租</el-tag
          >
        </template>
      </el-table-column> -->

      <el-table-column label="操作" align="center" width="320">
        <template slot-scope="scope">
          <el-button
           v-if="scope.row.state != '0'"
            icon="el-icon-edit"
            type="primary"
            size="small"
            @click="editThings(scope.row)"
            >编辑</el-button
          >
          <el-button
            icon="el-icon-delete"
            type="danger"
            size="small"
            @click="deleteThings(scope.row)"
            >删除</el-button
          >
          <el-button
            v-if="scope.row.state == '1'"
            icon="el-icon-delete"
            type="primary"
            size="small"
            @click="ThingsBack(scope.row)"
            >归还</el-button
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
    <!-- 新增或编辑弹窗 -->
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
          ref="addExForm"
          :rules="rules"
          label-width="80px"
          :inline="true"
          size="small"
        >
          <el-col :span="24">
            <el-form-item prop="name" label="物品名称">
              <el-input v-model="addModule.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="time" label="时间范围">
              <el-date-picker
                v-model="addModule.time"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="24">
            <el-form-item prop="action" label="租/借">
              <el-radio-group v-model="addModule.action">
                <el-radio v-model="addModule.action" label="0">借</el-radio>
                <el-radio v-model="addModule.action" label="1">租</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col> -->
          <el-col :span="24">
            <el-form-item prop="lessor" label="租借人">
              <el-input v-model="addModule.lessor"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="activityName" label="活动(可选)">
              <el-select
                v-model="addModule.activityName"
                filterable
                placeholder="请选择"
                @focus="getActChoiceList"
              >
                <el-option
                  v-for="item in ActOptions"
                  :key="item.value"
                  :label="item.activityName"
                  :value="item.activityName"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
    </sys-dialog>
  </el-main>
</template>

<script>
import SysDialog from "@/components/system/SysDialog";
import {
  getThingsListApi,
  addThingsApi,
  editThingsApi,
  deleteThingsApi,
} from "@/api/things";
import { getActChoiceListApi } from "@/api/activity";
export default {
  components: {
    SysDialog,
  },
  data() {
    return {
      //活动选项数据
      ActOptions: [],
      // 选项tab数据
      activeName: "first",

      // 选择收入类型数据
      options: [],
      value: "",

      // 表单数据源
      ThingsList: [],
      tableHeight: 0,
      // 分页数据
      parms: {
        currentPage: 1, //当前是第几页
        pageSize: 10, //每页查询条数
        // userId: this.$store.getters.userId,
        total: 0,
        deptId: this.$store.getters.deptId,
      },
      // 新增或编辑弹窗数据
      addDialog: {
        title: "",
        height: 250,
        width: 610,
        visible: false,
      },
      // 新增弹窗数据源
      addModule: {
        id: "", //编辑时候使用
        editType: "", //标识新增或编辑  0：新增 1：编辑
        name: "",
        endTime: "",
        startTime: "",
        action: "",
        lessor: "",
        activityName: "",
        deptId: "",
        state: "",
        time: "", //时间范围
      },
      // 新增弹窗验证规则
      rules: {
        name: [
          {
            required: true,
            trigger: "change",
            message: "请填写物品名称",
          },
        ],
        time: [
          {
            required: true,
            trigger: "change",
            message: "请填写时间范围",
          },
        ],
        action: [
          {
            required: true,
            trigger: "change",
            message: "请选择租/借",
          },
        ],
        lessor: [
          {
            required: true,
            trigger: "change",
            message: "请添加租借人",
          },
        ],
      },
    };
  },
  computed: {},
  created() {
    this.getExList();
  },
  methods: {
    filterActionTag(value, row) {
      return row.state === value;
    },

    //状态筛选函数
    filterTag(value, row) {
      return row.state === value;
    },
    //获取活动列表
    async getActChoiceList() {
      let parms = {
        deptId: this.$store.getters.deptId,
      };
      let res = await getActChoiceListApi(parms);
      if (res && res.code == 200) {
        this.ActOptions = res.data;
      }
    },

    // 获取选中的值
    getSelect() {},

    async ThingsBack(row) {
      let confirm = await this.$myconfirm("确认已归还该物品吗?");
      if (confirm) {
        this.$resetForm("addExForm", this.addModule);
        this.$objCoppy(row, this.addModule);
        this.addModule.id = row.id;
        this.addModule.state = "0";
        let res = await editThingsApi(this.addModule);
        if (res && res.code == 200) {
          //刷新列表
          this.getExList(this.parms);
          this.$message.success(res.msg);
        }
      }
    },

    //编辑
    editThings(row) {
      //清空表单
      this.time = null;
      this.$resetForm("addExForm", this.addModule);
      //设置弹框属性
      this.addDialog.title = "编辑物品";
      this.addDialog.visible = true;
      //标识 编辑
      //由于radio默认返回了String值，所以要把其转为int类型
      this.addModule.editType = "1";
      let action = row.action.toString();
      row.action = action;
      //把当前点击的行数据复制到表单数据域
      this.$objCoppy(row, this.addModule);
      let newTime = new Array();
      //时间范围数据回显
      newTime.push(row.startTime);
      newTime.push(row.endTime);
      this.addModule.time = newTime;
      console.log(this.addModule);
    },
    //删除
    async deleteThings(row) {
      console.log(row);
      let confirm = await this.$myconfirm("确认删除该数据吗?");
      if (confirm) {
        let parm = {
          id: row.id,
        };
        let res = await deleteThingsApi(parm);
        if (res && res.code == 200) {
          this.$message.success(res.msg);
          //新增成功刷新列表
          this.getExList();
        }
      }
    },
    //获取列表
    async getExList() {
      let res = await getThingsListApi(this.parms);
      if (res && res.code == 200) {
        this.ThingsList = res.data.records;
        this.parms.total = res.data.total;
        let newList = this.ThingsList;
        //数据动态处理
        for (let item in newList) {
          let LastTime = this.GetNumberOfDays(
            new Date(),
            newList[item].endTime
          );
          newList[item].LastTime = LastTime;
          if (LastTime <= 0) {
            newList[item].LastTime = 0;
            newList[item].state = "2";
          }
        }
        this.ThingsList = newList;
      }
    },
    // 分页相关
    currentChange(val) {
      this.parms.currentPage = val;
      this.getExList(this.parms);
      // console.log("当前页");
      // console.log(val);
    },
    sizeChange(val) {
      // console.log("页容量");
      // console.log(val);
      this.parms.currentPage = 1;
      this.parms.pageSize = val;
      this.getExList(this.parms);
    },
    // 搜索
    searchList() {
      // this.parms.currentPage = 1;
      // this.getRoleList(this.parms);
    },
    //新增按钮
    addItem() {
      //清空表单数据
      this.$resetForm("addExForm", this.addModule);
      this.time = null;
      this.addModule.editType = "0";
      //设置弹框属性
      this.addDialog.title = "新增收入";
      this.addDialog.visible = true;
    },
    onClose() {
      this.addDialog.visible = false;
    },
    //新增或编辑确认事件
    onConfirm() {
      this.$refs.addExForm.validate(async (valid) => {
        if (valid) {
          this.addModule.deptId = this.$store.getters.deptId;
          this.addModule.startTime = this.addModule.time[0];
          this.addModule.endTime = this.addModule.time[1];
          console.log(this.addModule);
          let res = null;
          if (this.addModule.editType == "0") {
            //新增
            res = await addThingsApi(this.addModule);
          } else {
            res = await editThingsApi(this.addModule);
          }
          if (res && res.code == 200) {
            //刷新列表
            this.getExList(this.parms);
            this.$message.success(res.msg);
            this.addDialog.visible = false;
          }
        }
      });
    },
    //日期计算
    GetNumberOfDays(date1, date2) {
      //date1：开始日期，date2结束日期
      var a1 = Date.parse(new Date(date1));
      var a2 = Date.parse(new Date(date2));
      var day = parseInt((a2 - a1) / (1000 * 60 * 60 * 24)); //核心：时间戳相减，然后除以天数
      return day;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 210;
    });
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
