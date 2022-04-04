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
      <el-form-item label="支出名称">
        <el-input v-model="parms.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="searchList" icon="el-icon-search">查询</el-button>
        <el-button
          v-if="hasPerm('exlist:add')"
          @click="addExItem"
          type="primary"
          icon="el-icon-plus"
          >新增</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 支出表格 -->
    <el-table :height="tableHeight" :data="ExpenseList" border stripe>
      <el-table-column prop="outName" label="支出名"> </el-table-column>
      <el-table-column prop="money" label="支出金额"> </el-table-column>
      <el-table-column prop="outTypeName" label="支出类型"> </el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" sortable>
      </el-table-column>
      <el-table-column prop="remark" label="备注"> </el-table-column>
      <el-table-column label="操作" align="center" width="220">
        <template slot-scope="scope">
          <el-button
            v-if="hasPerm('exlist:edit')"
            icon="el-icon-edit"
            type="primary"
            size="small"
            @click="editMoney(scope.row)"
            >编辑</el-button
          >
          <el-button
            v-if="hasPerm('exlist:del')"
            icon="el-icon-delete"
            type="danger"
            size="small"
            @click="deleteMoney(scope.row)"
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
          :model="addExModule"
          ref="addExForm"
          :rules="rules"
          label-width="80px"
          :inline="true"
          size="small"
        >
          <el-form-item prop="outName" label="支出名称">
            <el-input v-model="addExModule.outName"></el-input>
          </el-form-item>
          <el-form-item prop="outTypeName" label="支出类型">
            <!-- <el-input v-model="addExModule.outTypeName"></el-input> -->
            <el-select
              v-model="addExModule.outTypeName"
              placeholder="请选择"
              @focus="getChoiceList"
              @change="getSelect(addExModule.outTypeName)"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.typeName"
                :value="item.typeName"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="money" label="支出金额">
            <el-input v-model="addExModule.money"></el-input>
          </el-form-item>
          <el-form-item prop="remark" label="备注">
            <el-input v-model="addExModule.remark"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </sys-dialog>
  </el-main>
</template>

<script>
import { mapGetters } from "vuex";
import SysDialog from "@/components/system/SysDialog";
import {
  getExListApi,
  addExListApi,
  editExListApi,
  deleteExListApi,
  getExChoiceListApi,
} from "@/api/expense";
export default {
  components: {
    SysDialog,
  },
  data() {
    return {
      // 选项tab数据
      activeName: "first",

      // 选择支出类型数据
      options: [],
      value: "",

      // 表单数据源
      ExpenseList: [],
      tableHeight: 0,
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
      addExModule: {
        id: "", //编辑时候使用
        editType: "", //标识新增或编辑  0：新增 1：编辑
        outName: "",
        outTypeName: "",
        outTypeId: "",
        money: "",

        //createTime: "",
        //updateTime: "",
        remark: "",
      },
      // 新增弹窗验证规则
      rules: {
        outName: [
          {
            required: true,
            trigger: "change",
            message: "请填写支出名称",
          },
        ],
        outTypeName: [
          {
            required: true,
            trigger: "change",
            message: "请填写支出类型名称",
          },
        ],
        money: [
          {
            required: true,
            trigger: "change",
            message: "请填写支出金额",
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
    // 获取选中的值
    getSelect() {},

    //获取选项列表
    async getChoiceList() {
      let res = await getExChoiceListApi(this.parms);
      if (res && res.code == 200) {
        console.log(res.data);
        this.options = res.data;
      }
    },

    //编辑
    editMoney(row) {
      //清空表单
      this.$resetForm("addExForm", this.addExModule);
      //设置弹框属性
      this.addDialog.title = "编辑角色";
      this.addDialog.visible = true;
      //标识 编辑
      this.addExModule.editType = "1";
      //把当前点击的行数据复制到表单数据域
      this.$objCoppy(row, this.addExModule);
      console.log(row);
    },
    //删除
    async deleteMoney(row) {
      console.log(row);
      let confirm = await this.$myconfirm("确认删除该数据吗?");
      if (confirm) {
        let parm = {
          id: row.id,
        };
        let res = await deleteExListApi(parm);
        if (res && res.code == 200) {
          this.$message.success(res.msg);
          //新增成功刷新列表
          this.getExList();
        }
      }
    },
    //获取列表
    async getExList() {
      let res = await getExListApi(this.parms);
      if (res && res.code == 200) {
        this.ExpenseList = res.data.records;
        this.parms.total = res.data.total;
      }
    },
    // 分页相关
    currentChange(val) {
      this.parms.currentPage = val;
      this.getExList(this.parms);
      console.log("当前页");
      console.log(val);
    },
    sizeChange(val) {
      console.log("页容量");
      console.log(val);
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
    addExItem() {
      //清空表单数据
      this.$resetForm("addExForm", this.addExModule);
      this.addExModule.editType = "0";
      //设置弹框属性
      this.addDialog.title = "新增支出";
      this.addDialog.visible = true;
    },
    onClose() {
      this.addDialog.visible = false;
    },
    //新增或编辑确认事件
    onConfirm() {
      this.$refs.addExForm.validate(async (valid) => {
        if (valid) {
          let res = null;
          if (this.addExModule.editType == "0") {
            console.log(this.addExModule);
            //新增
            res = await addExListApi(this.addExModule);
          } else {
            res = await editExListApi(this.addExModule);
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
