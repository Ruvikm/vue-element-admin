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
      <el-form-item label="会议名称">
        <el-input v-model="parms.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="searchList" icon="el-icon-search">查询</el-button>
        <el-button
          v-if="hasPerm('meeting:add')"
          @click="addItem"
          type="primary"
          icon="el-icon-plus"
          >新增</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 会议表格 -->
    <el-table :data="tableData" style="width: 100%" border stripe>
      <el-table-column prop="meetingName" label="会议名称"> </el-table-column>
      <el-table-column prop="meetingTime" label="会议时间"> </el-table-column>
      <el-table-column prop="meetingPlace" label="会议地点"> </el-table-column>
      <el-table-column label="操作" align="center" width="220">
        <template slot-scope="scope">
          <el-button
            v-if="hasPerm('meeting:edit')"
            icon="el-icon-edit"
            type="primary"
            size="small"
            @click="editMeeting(scope.row)"
            >编辑</el-button
          >
          <el-button
            v-if="hasPerm('meeting:delete')"
            icon="el-icon-delete"
            type="danger"
            size="small"
            @click="deleteMeeting(scope.row)"
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
          <el-form-item prop="meetingName" label="会议名称">
            <el-input v-model="addModule.meetingName"></el-input>
          </el-form-item>
          <el-form-item prop="meetingPlace" label="会议地点">
            <el-input v-model="addModule.meetingPlace"></el-input>
          </el-form-item>
          <el-form-item prop="meetingTime" label="会议时间">
            <!-- <el-input v-model="addModule.meetingTime"></el-input> -->
            <el-date-picker
              v-model="addModule.meetingTime"
              type="datetime"
              placeholder="选择日期"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </sys-dialog>
  </el-main>
</template>



<script>
import {
  getMeetingListApi,
  addMeetingApi,
  editMeetingApi,
  deleteMeetingApi,
} from "@/api/meeting";
import SysDialog from "@/components/system/SysDialog";
export default {
  components: {
    SysDialog,
  },
  data() {
    return {
      tableData: [],

      // 分页数据
      parms: {
        currentPage: 1, //当前是第几页
        pageSize: 10, //每页查询条数
        // userId: this.$store.getters.userId,
        total: 0,
        name: "",
      },
      // 新增或编辑弹窗数据
      addDialog: {
        title: "",
        height: 150,
        width: 610,
        visible: false,
      },
      // 新增弹窗数据源
      addModule: {
        id: "", //编辑时候使用
        editType: "", //标识新增或编辑  0：新增 1：编辑
        meetingName: "",
        meetingPlace: "",
        meetingTime: "",
      },
      // 新增弹窗验证规则
      rules: {
        meetingName: [
          {
            required: true,
            trigger: "change",
            message: "请填写会议名称",
          },
        ],
        meetingPlace: [
          {
            required: true,
            trigger: "change",
            message: "请填写会议地点",
          },
        ],
        meetingTime: [
          {
            required: true,
            trigger: "change",
            message: "请选择会议时间",
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
    this.getMeetingList();
  },
  methods: {
    //弹窗
    onConfirm() {
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          let res = null;
          if (this.addModule.editType == "0") {
            console.log(this.addModule);
            //新增
            res = await addMeetingApi(this.addModule);
          } else {
            res = await editMeetingApi(this.addModule);
          }
          if (res && res.code == 200) {
            //刷新列表
            this.getMeetingList(this.parms);
            this.$message.success(res.msg);
            this.addDialog.visible = false;
          }
        }
      });
    },

    //关闭弹窗
    onClose() {
      this.addDialog.visible = false;
    },

    //搜索
    searchList() {},
    //添加
    addItem() {
      //清空表单数据
      this.$resetForm("addForm", this.addModule);
      this.addModule.editType = "0";
      //设置弹框属性
      this.addDialog.title = "新增会议";
      this.addDialog.visible = true;
    },

    //获取会议列表
    async getMeetingList() {
      let res = await getMeetingListApi(this.parms);
      if (res && res.code == 200) {
        this.tableData = res.data.records;
        this.parms.total = res.data.total;
      }
    },
    // 分页相关
    currentChange(val) {
      this.parms.currentPage = val;
      this.getMeetingList(this.parms);
      console.log("当前页");
      console.log(val);
    },
    sizeChange(val) {
      console.log("页容量");
      console.log(val);
      this.parms.currentPage = 1;
      this.parms.pageSize = val;
      this.getMeetingList(this.parms);
    },
    //管理会议相关
    editMeeting(row) {
      //清空表单
      this.$resetForm("addForm", this.addModule);
      //设置弹框属性
      this.addDialog.title = "编辑会议";
      this.addDialog.visible = true;
      //标识 编辑
      this.addModule.editType = "1";
      //把当前点击的行数据复制到表单数据域
      this.$objCoppy(row, this.addModule);
      console.log(row);
    },
    async deleteMeeting(row) {
      console.log(row);
      let confirm = await this.$myconfirm("确认删除该数据吗?");
      if (confirm) {
        let parm = {
          id: row.id,
        };
        let res = await deleteMeetingApi(parm);
        if (res && res.code == 200) {
          this.$message.success(res.msg);
          //新增成功刷新列表
          this.getMeetingList();
        }
      }
    },
  },
};
</script>

<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>