<template>
  <el-container :style="{ height: containerHeight + 'px' }">
    <!-- 部门树 -->
    <el-aside
      style="
        padding: 10px 0px 0px 0px;
        background: #fff;
        border-right: 1px solid #dfe6ec;
      "
      width="200px"
    >
      <el-tree
        style="font-size: 14px"
        ref="leftTree"
        :data="deptList"
        node-key="id"
        :props="defaultProps"
        default-expand-all
        empty-text="暂无数据"
        :show-checkbox="false"
        :highlight-current="true"
        :expand-on-click-node="false"
        @node-click="handleNodeClick"
      >
        <div class="custom-tree-node" slot-scope="{ node, data }">
          <div>
            <!-- 没有子元素时显示的图标 (即是最后一层) -->
            <span v-if="data.children.length == 0">
              <i
                class="el-icon-document"
                style="color: #8c8c8c; margin-right: 3px"
              ></i>
            </span>
            <!-- 有子元素显示的图标 -->
            <span v-else @click.stop="openBtn(data)">
              <!-- 这里的展开的显示隐藏即是 [+] [-]-->
              <svg-icon
                v-if="data.open"
                icon-class="add-s"
                style="margin-right: 4px; font-size: 18px"
              />
              <svg-icon v-else icon-class="sub-s" style="margin-right: 4px" />
            </span>
            <!-- 名称 -->
            <span>{{ node.label }}</span>
          </div>
        </div>
      </el-tree>
    </el-aside>
    <!-- 用户表格 -->
    <el-main>
      <el-form
        :model="searchParm"
        ref="searchform"
        label-width="80px"
        :inline="true"
        size="small"
      >
        <el-form-item label="用户名">
          <el-input v-model="searchParm.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search">查询</el-button>
          <el-button icon="el-icon-delete">重置</el-button>
          <el-button
            v-if="hasPerm('sys:user:add')"
            icon="el-icon-plus"
            size="small"
            type="primary"
            @click="addUser"
            >新增</el-button
          >
        </el-form-item>
      </el-form>

      <el-table :height="tableHeight" :data="userTableData" border stripe>
        <el-table-column prop="loginName" label="用户名"></el-table-column>
        <el-table-column prop="deptName" label="所属社团"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column align="center" width="290" label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="hasPerm('sys:user:edit')"
              icon="el-icon-edit"
              type="primary"
              size="small"
              @click="editUser(scope.row)"
              >编辑</el-button
            >
            <el-button
              v-if="hasPerm('sys:user:assign')"
              icon="el-icon-setting"
              type="primary"
              size="small"
              @click="assignRole(scope.row)"
              >分配角色</el-button
            >
            <el-button
              v-if="hasPerm('sys:user:delete')"
              icon="el-icon-delete"
              type="danger"
              size="small"
              @click="deleteUser(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="sizeChange"
        @current-change="currentChange"
        :current-page.sync="parms.currentPage"
        :page-sizes="[10, 20, 40, 80, 100]"
        :page-size="parms.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-main>
    <!-- 新增或编辑弹框 -->
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
          :model="addModel"
          ref="addForm"
          :rules="rules"
          label-width="80px"
          :inline="true"
          size="small"
        >
          <el-form-item prop="deptName" label="所属部门">
            <el-input
              @click.native="selectDept"
              v-model="addModel.deptName"
            ></el-input>
          </el-form-item>
          <el-form-item prop="loginName" label="姓名">
            <el-input v-model="addModel.loginName"></el-input>
          </el-form-item>
          <el-form-item prop="mobile" label="电话">
            <el-input v-model="addModel.mobile"></el-input>
          </el-form-item>
          <el-form-item label="昵称">
            <el-input v-model="addModel.nickName"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="addModel.email"></el-input>
          </el-form-item>
          <el-form-item prop="username" label="登录名">
            <el-input v-model="addModel.username"></el-input>
          </el-form-item>
          <el-form-item
            v-if="addModel.editType == '0'"
            prop="password"
            label="密码"
          >
            <el-input type="password" v-model="addModel.password"></el-input>
          </el-form-item>
          <el-form-item prop="sex" label="性别">
            <el-radio-group v-model="addModel.sex">
              <el-radio :label="'0'">男</el-radio>
              <el-radio :label="'1'">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
    </sys-dialog>
    <!-- 上级部门弹框 -->
    <sys-dialog
      :title="parentDialog.title"
      :width="parentDialog.width"
      :height="parentDialog.height"
      :visible="parentDialog.visible"
      @onClose="onParentClose"
      @onConfirm="onParentConfirm"
    >
      <div slot="content">
        <el-tree
          ref="parentTree"
          :data="parentList"
          default-expand-all
          node-key="id"
          :props="parentProps"
          :show-checkbox="false"
          :highlight-current="true"
          :expand-on-click-node="false"
          @node-click="parentClick"
        >
          <div class="customer-tree-node" slot-scope="{ node, data }">
            <!-- 长度为0说明没有下级 -->
            <span v-if="data.children.length == 0">
              <i
                class="el-icon-document"
                style="color: #8c8c8c; font-size: 20px"
              />
            </span>
            <span v-else @click.stop="openParentBtn(data)">
              <svg-icon
                style="font-size: 25px"
                v-if="data.open"
                icon-class="add-s"
              />
              <svg-icon style="font-size: 20px" v-else icon-class="sub-s" />
            </span>
            <span>{{ node.label }}</span>
          </div>
        </el-tree>
      </div>
    </sys-dialog>
    <!-- 分配角色弹框 -->
    <sys-dialog
      :title="assignDialog.title"
      :width="assignDialog.width"
      :height="assignDialog.height"
      :visible="assignDialog.visible"
      @onConfirm="onAssignConfirm"
      @onClose="onAssignClose"
    >
      <div slot="content">
        <el-table :height="assignWidth" :data="assginRoleList" border stripe>
          <el-table-column width="50" align="center" label="选中">
            <template slot-scope="scope">
              <el-radio
                v-model="selectRoleId"
                :label="scope.row.id"
                @change="getSlectRole(scope.row)"
              >
                {{ "" }}
              </el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="角色名称"></el-table-column>
          <el-table-column prop="remark" label="角色备注"></el-table-column>
        </el-table>
        <el-pagination
          @size-change="assignsizeChange"
          @current-change="assingcurrentChange"
          :current-page.sync="roleParm.currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="roleParm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="roleParm.total"
          background
        >
        </el-pagination>
      </div>
    </sys-dialog>
  </el-container>
</template>

<script>
import { getDeptListApi, getDepNameApi, getTopDepApi } from "@/api/department";
import {
  getUserListApi,
  addUserApi,
  editUserApi,
  deleteUserApi,
  assignRoleListApi,
  getRoleIdByUserIdApi,
  assignRoleSaveApi,
} from "@/api/user";
import SysDialog from "@/components/system/SysDialog";
export default {
  //注册组件
  components: {
    SysDialog,
  },
  data() {
    return {
      //分配时用的部门id
      assignDeptId: "",
      //用户名
      username: this.$store.getters.name,
      //社团名称
      deptName: "",
      //是否是管理员
      isAdmin: this.$store.getters.isAdmin,
      //被分配用户的id
      selectUserId: "",
      //角色列表高度
      assignWidth: 500,
      //被选中的角色id
      selectRoleId: "",
      assginRoleList: [],
      //分配角色列表查询参数
      roleParm: {
        currentPage: 1,
        pageSize: 10,
        userId: "",
        total: 0,
      },
      //分配角色弹框属性
      assignDialog: {
        title: "",
        width: 800,
        height: 400,
        visible: false,
      },
      //上级部门点击数据
      selectParentNode: {
        id: "",
        name: "",
      },
      //上级树属性绑定
      parentProps: {
        children: "children",
        label: "name",
      },
      //上级部门弹框属性
      parentDialog: {
        title: "选择上级部门",
        width: 300,
        height: 450,
        visible: false,
      },
      //上级部门数据域
      parentList: [],
      //表单验证规则
      rules: {
        deptName: [
          {
            required: true,
            trigger: "change",
            message: "请选择所属部门",
          },
        ],
        loginName: [
          {
            required: true,
            trigger: "change",
            message: "请填写姓名",
          },
        ],
        mobile: [
          {
            required: true,
            trigger: "change",
            message: "请填写电话号码",
          },
        ],
        username: [
          {
            required: true,
            trigger: "change",
            message: "请填写登录名",
          },
        ],
        password: [
          {
            required: true,
            trigger: "change",
            message: "请填写登录密码",
          },
        ],
        sex: [
          {
            required: true,
            trigger: "change",
            message: "请选择性别",
          },
        ],
      },
      //新增或编辑表单数据域
      addModel: {
        id: "",
        deptId: "",
        editType: "", //0新增 1：编辑
        deptName: "",
        email: "",
        loginName: "",
        mobile: "",
        nickName: "",
        password: "",
        username: "",
        sex: "",
      },
      //新增或编辑弹框属性
      addDialog: {
        title: "",
        height: 230,
        width: 610,
        visible: false,
      },
      //部门id
      deptId: "",
      //用户表格高度
      tableHeight: 0,
      //用户表格数据域
      userTableData: [],
      //分页参数
      total: 0,
      //搜索框数据域
      searchParm: {
        name: "",
      },
      parms: {
        deptId: "",
        currentPage: 1,
        pageSize: 10,
        searchName: "",
      },
      //container高度
      containerHeight: 0,
      //树属性配置
      defaultProps: {
        children: "children",
        label: "name",
      },
      //左侧部门树数据域
      deptList: [],
    };
  },
  created() {
    this.getDeptList();
  },
  computed: {},
  mounted() {
    this.$nextTick(() => {
      this.containerHeight = window.innerHeight - 85;
      this.tableHeight = window.innerHeight - 220;
      // this.assignWidth = window.innerHeight - 630;
    });
  },
  // computed() {
  //   // this.assignWidth = window.innerHeight - 630;
  // },
  methods: {
    //页容量改变的时候触发
    assignsizeChange(val) {
      //console.log(val);
      this.roleParm.pageSize = val;
      this.assignRoleList();
    },
    //页数改变的时候触发
    assingcurrentChange(val) {
      //console.log(val);
      this.roleParm.currentPage = val;
      this.assignRoleList();
    },
    //分配角色按钮
    async assignRole(row) {
      //防止回显时出问题
      this.selectRoleId = "";
      this.selectUserId = "";
      //被分配用户的id
      this.selectUserId = row.id;

      //设置弹框属性
      this.assignDialog.title = "为【" + row.loginName + "】分配角色";
      this.assignDialog.visible = true;
      //查询当前登录系统的用户的所有角色
      this.assignRoleList();
      //获取当前被分配用户的角色id
      let parms = {
        userId: row.id,
        deptId: this.assignDeptId,
        // deptId:this.$store.getters.deptId
      };
      let resIds = await getRoleIdByUserIdApi(parms);
      //console.log(resIds);
      if (resIds.data) {
        this.selectRoleId = resIds.data.roleId;
      }
    },
    //获取角色列表
    async assignRoleList() {
      this.roleParm.userId = this.$store.getters.userId;
      let res = await assignRoleListApi(this.roleParm);
      if (res && res.code == 200) {
        this.assginRoleList = res.data.records;
        this.roleParm.total = res.data.total;
      }
    },
    //角色选择事件
    getSlectRole(row) {
      //console.log(row);
      this.selectRoleId = row.id;
    },
    //分配角色弹框取消事件
    onAssignClose() {
      this.assignDialog.visible = false;
    },
    //分配角色弹框确认事件
    async onAssignConfirm() {
      if (!this.selectRoleId) {
        this.$message.warning("请分配角色！");
        return;
      }
      if (
        this.selectUserId == this.$store.getters.userId &&
        this.$store.getters.isAdmin != 1
      ) {
        this.$message.warning("不能给自己分配角色！");
        return;
      }
      let parm = {
        roleId: this.selectRoleId,
        userId: this.selectUserId,
        // deptId: this.$store.getters.deptId,
        deptId: this.assignDeptId,
      };
      // console.log(this.$store.getters.isAdmin);
      // console.log(this.$store.getters.userId);
      // console.log(parm);
      let res = await assignRoleSaveApi(parm);
      if (res && res.code == 200) {
        this.$message.success(res.msg);
        this.assignDialog.visible = false;
      }
    },
    //上级部门树加号 减号 图标点击事件
    openParentBtn(data) {
      data.open = !data.open;
      this.$refs.parentTree.store.nodesMap[data.id].expanded = !data.open;
    },
    //上级部门树节点点击事件
    parentClick(data) {
      //console.log(data);
      this.selectParentNode.id = data.id;
      this.selectParentNode.name = data.name;
    },
    //选择上级部门确认事件
    onParentConfirm() {
      this.addModel.deptId = this.selectParentNode.id;
      this.addModel.deptName = this.selectParentNode.name;
      this.parentDialog.visible = false;
    },
    //选择上级部门取消事件
    onParentClose() {
      this.parentDialog.visible = false;
    },
    //选择上级部门
    async selectDept() {
      //查询上级部门数据
      let parms = {
        deptName: this.deptName,
      };
      let res = await getDeptListApi(parms);
      if (res && res.code == 200) {
        this.parentList = res.data;
      }
      //设置弹框属性
      this.parentDialog.visible = true;
    },
    // 新增或编辑确认事件
    onConfirm() {
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          let res = null;
          if (this.addModel.editType == "0") {
            //新增
            res = await addUserApi(this.addModel);
          } else {
            res = await editUserApi(this.addModel);
          }
          if (res && res.code == 200) {
            this.$message.success(res.msg);
            this.addDialog.visible = false;
            //刷新用户列表
            this.getUserList(this.deptId);
          }
        }
      });
    },
    //新增或编辑弹框取消事件
    onClose() {
      this.addDialog.visible = false;
    },
    //新增按钮
    addUser() {
      //清空表单
      this.$resetForm("addForm", this.addModel);
      //设置标识
      this.addModel.editType = "0";
      //设置弹框属性
      this.addDialog.title = "新增用户";
      this.addDialog.visible = true;
    },
    //页数改变时触发
    currentChange(val) {
      this.parms.currentPage = val;
      this.getUserList(this.deptId);
    },
    //页容量改变时触发
    sizeChange(val) {
      this.parms.pageSize = val;
      this.parms.currentPage = 1;
      this.getUserList(this.deptId);
    },
    //删除按钮
    async deleteUser(row) {
      let parm = {
        userId: row.id,
      };
      let confirm = await this.$myconfirm("确定删除该数据吗？");
      if (confirm) {
        let res = await deleteUserApi(parm);
        if (res && res.code == 200) {
          this.$message.success(res.msg);
          //刷新列表数据
          this.getUserList(this.deptId);
        }
      }
    },

    //编辑按钮
    editUser(row) {
      //清空表单
      this.$resetForm("addForm", this.addModel);
      //设置弹框属性
      this.addDialog.title = "编辑用户";
      this.addDialog.visible = true;
      //把当前编辑的数据复制到表单数据域，供回显使用
      this.$objCoppy(row, this.addModel);
      //设置编辑状态
      this.addModel.editType = "1";
      console.log(row);
    },
    //获取用户列表
    async getUserList(deptId) {
      this.parms.deptId = deptId;
      let res = await getUserListApi(this.parms);
      //console.log(res.data.records);
      if (res && res.code == 200) {
        this.userTableData = res.data.records;
        this.total = res.data.total;
      }
    },
    //加减号图标点击事件
    openBtn(data) {
      //console.log(data);
      data.open = !data.open;
      this.$refs.leftTree.store.nodesMap[data.id].expanded = !data.open;
    },
    //左侧部门树节点点击事件
    async handleNodeClick(data) {
      this.deptId = data.id;
      let parms = {
        deptId: data.id,
      };
      //console.log(parms);
      let res = await getTopDepApi(parms);
      //console.log(res);
      if (res && res.code == 200) {
        this.assignDeptId = res.data.id;
      }
      //console.log(data);
      this.getUserList(data.id);
    },
    //获取左侧部门树数据
    async getDeptList() {
      let deptName = null;
      if (this.isAdmin != "1") {
        let parms = {
          deptId: this.$store.getters.deptId,
        };
        //console.log(parms);
        let res = await getDepNameApi(parms);
        //console.log(res);
        if (res && res.code == 200) {
          this.deptName = deptName = res.data;
        }
      }
      let parms = {
        deptName: deptName,
      };
      //console.log(deptName);
      let res = await getDeptListApi(parms);
      //console.log(res);
      if (res && res.code == 200) {
        this.deptList = res.data;
        //树加载完成后，默认点击第一个节点
        this.$nextTick(() => {
          const firstNode = document.querySelector(".el-tree-node");
          firstNode.click();
        });
      }
    },
    //判断是否为管理员
  },
};
</script>

<style lang="scss" scoped>
.el-aside ::v-deep .el-tree {
  // 将每一行的设置为相对定位 方便后面before after 使用绝对定位来固定位置
  .el-tree-node {
    position: relative;
    // padding-left: 10px;
  }
  // 子集像右偏移 给数线留出距离
  .el-tree-node__children {
    padding-left: 20px;
  }
  //这是竖线
  .el-tree-node :last-child:before {
    height: 40px;
  }
  .el-tree > .el-tree-node:before {
    border-left: none;
  }
  .el-tree > .el-tree-node:after {
    border-top: none;
  }
  //这自定义的线 的公共部分
  .el-tree-node:before,
  .el-tree-node:after {
    content: "";
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }
  .tree :first-child .el-tree-node:before {
    border-left: none;
  }
  // 竖线
  .el-tree-node:before {
    border-left: 1px solid #d9d9d9;
    bottom: 0px;
    height: 100%;
    top: -25px;
    width: 1px;
  }
  //横线
  .el-tree-node:after {
    border-top: 1px solid #d9d9d9;
    height: 20px;
    top: 14px;
    width: 12px;
  }
  .el-tree-node__expand-icon.is-leaf {
    width: 8px;
  }
  //去掉elementui自带的展开按钮  一个向下的按钮,打开时向右
  .el-tree-node__content > .el-tree-node__expand-icon {
    display: none;
  }
  //每一行的高度
  .el-tree-node__content {
    line-height: 30px;
    height: 30px;
    padding-left: 10px !important;
  }
}
//去掉最上级的before  after 即是去电最上层的连接线
.el-aside ::v-deep .el-tree > div {
  &::before {
    display: none;
  }
  &::after {
    display: none;
  }
}
//上级部门树
.el-dialog__wrapper ::v-deep .el-tree {
  // 将每一行的设置为相对定位 方便后面before after 使用绝对定位来固定位置
  .el-tree-node {
    position: relative;
    // padding-left: 10px;
  }
  // 子集像右偏移 给数线留出距离
  .el-tree-node__children {
    padding-left: 20px;
  }
  //这是竖线
  .el-tree-node :last-child:before {
    height: 40px;
  }
  .el-tree > .el-tree-node:before {
    border-left: none;
  }
  .el-tree > .el-tree-node:after {
    border-top: none;
  }
  //这自定义的线 的公共部分
  .el-tree-node:before,
  .el-tree-node:after {
    content: "";
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }
  .tree :first-child .el-tree-node:before {
    border-left: none;
  }
  // 竖线
  .el-tree-node:before {
    border-left: 1px solid #d9d9d9;
    bottom: 0px;
    height: 100%;
    top: -25px;
    width: 1px;
  }
  //横线
  .el-tree-node:after {
    border-top: 1px solid #d9d9d9;
    height: 20px;
    top: 14px;
    width: 12px;
  }
  .el-tree-node__expand-icon.is-leaf {
    width: 8px;
  }
  //去掉elementui自带的展开按钮  一个向下的按钮,打开时向右
  .el-tree-node__content > .el-tree-node__expand-icon {
    display: none;
  }
  //每一行的高度
  .el-tree-node__content {
    line-height: 30px;
    height: 30px;
    padding-left: 10px !important;
  }
}
//去掉最上级的before  after 即是去电最上层的连接线
.el-dialog__wrapper ::v-deep .el-tree > div {
  &::before {
    display: none;
  }
  &::after {
    display: none;
  }
}
</style>