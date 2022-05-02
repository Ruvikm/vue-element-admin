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
      <el-form-item label="奖项列表"> </el-form-item>
      <el-form-item>
        <!-- <el-button @click="searchList" icon="el-icon-search">查询</el-button> -->
        <el-button @click="addItem" type="primary" icon="el-icon-plus"
          >新增</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 会议表格 -->
    <el-table :data="tableData" style="width: 100%" border stripe>
      <el-table-column prop="name" label="奖项名称"> </el-table-column>
      <el-table-column prop="awardTime" label="获奖时间" sortable>
      </el-table-column>
      <el-table-column
        prop="type"
        label="奖项类型"
        :filters="[
          { text: '社会公益类', value: '社会公益类' },
          { text: '学术类', value: '学术类' },
          { text: '竞赛类', value: '竞赛类' },
          { text: '创新创业类', value: '创新创业类' },
          { text: '文娱类', value: '文娱类' },
        ]"
        :filter-method="filterTag"
        filter-placement="bottom-end"
      >
      </el-table-column>
      <el-table-column label="操作" align="center" width="220">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-edit"
            type="primary"
            size="small"
            @click="editItem(scope.row)"
            >编辑</el-button
          >
          <el-button
            icon="el-icon-delete"
            type="danger"
            size="small"
            @click="deleteItem(scope.row)"
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
          <el-form-item prop="name" label="奖项名称">
            <el-input v-model="addModule.name"></el-input>
          </el-form-item>
          <el-form-item prop="type" label="奖项类型">
            <!-- <el-input v-model="addModule.type"></el-input> -->
            <el-select v-model="addModule.type" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="awardTime" label="获奖时间">
            <el-date-picker
              v-model="addModule.awardTime"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
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
  getAwardsListApi,
  addAwardsApi,
  editAwardsApi,
  deleteAwardsApi,
} from "@/api/award";
import SysDialog from "@/components/system/SysDialog";
export default {
  components: {
    SysDialog,
  },
  data() {
    return {
      options: [
        {
          value: "社会公益类",
          label: "社会公益类",
        },
        {
          value: "学术类",
          label: "学术类",
        },
        {
          value: "竞赛类",
          label: "竞赛类",
        },
        {
          value: "创新创业类",
          label: "创新创业类",
        },
        {
          value: "文娱类",
          label: "文娱类",
        },
      ],
      tableData: [],

      // 分页数据
      parms: {
        currentPage: 1, //当前是第几页
        pageSize: 10, //每页查询条数
        total: 0,
        deptId: this.$store.getters.deptId,
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
        name: "",
        type: "",
        awardTime: "",
        deptId: "",
      },
      // 新增弹窗验证规则
      rules: {
        name: [
          {
            required: true,
            trigger: "change",
            message: "请填写获奖名称",
          },
        ],
        type: [
          {
            required: true,
            trigger: "change",
            message: "请选择获奖类型",
          },
        ],
        awardTime: [
          {
            required: true,
            trigger: "change",
            message: "请选择获奖时间",
          },
        ],
      },
    };
  },
  created() {
    this.getAwardsList();
  },
  methods: {
    //筛选函数
    filterTag(value, row) {
      return row.type === value;
    },

    //弹窗
    onConfirm() {
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          let res = null;
          if (this.addModule.editType == "0") {
            this.addModule.deptId = this.$store.getters.deptId;
            console.log(this.addModule);
            //新增
            res = await addAwardsApi(this.addModule);
          } else {
            res = await editAwardsApi(this.addModule);
          }
          if (res && res.code == 200) {
            //刷新列表
            this.getAwardsList(this.parms);
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
      this.addDialog.title = "新增奖项";
      this.addDialog.visible = true;
    },

    //获取会议列表
    async getAwardsList() {
      let res = await getAwardsListApi(this.parms);
      if (res && res.code == 200) {
        this.tableData = res.data.records;
        this.parms.total = res.data.total;
      }
    },
    // 分页相关
    currentChange(val) {
      this.parms.currentPage = val;
      this.getAwardsList(this.parms);
      //   console.log("当前页");
      //   console.log(val);
    },
    sizeChange(val) {
      //   console.log("页容量");
      //   console.log(val);
      this.parms.currentPage = 1;
      this.parms.pageSize = val;
      this.getAwardsList(this.parms);
    },
    //管理会议相关
    editItem(row) {
      //清空表单
      this.$resetForm("addForm", this.addModule);
      //设置弹框属性
      this.addDialog.title = "编辑奖项";
      this.addDialog.visible = true;
      //标识 编辑
      this.addModule.editType = "1";
      //把当前点击的行数据复制到表单数据域
      this.$objCoppy(row, this.addModule);
      console.log(row);
    },
    async deleteItem(row) {
      console.log(row);
      let confirm = await this.$myconfirm("确认删除该数据吗?");
      if (confirm) {
        let parm = {
          id: row.id,
        };
        let res = await deleteAwardsApi(parm);
        if (res && res.code == 200) {
          this.$message.success(res.msg);
          //新增成功刷新列表
          this.getAwardsList();
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