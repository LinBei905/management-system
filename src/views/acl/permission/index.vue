<template>
  <div>
    <el-table
      :data="permissionList"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      :expand-row-keys="expandKeys"
    >
      <el-table-column prop="name" label="名称" sortable> </el-table-column>
      <el-table-column prop="code" label="权限值" sortable> </el-table-column>
      <el-table-column prop="toCode" label="跳转权限值" sortable>
      </el-table-column>
      <el-table-column prop="id" label="操作" align="center">
        <template slot-scope="{ row }">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-plus"
            :disabled="row.level === 4"
            @click="showAddDialog(row)"
          ></el-button>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            :disabled="row.level === 1"
            @click="(isEdit = true), showAddDialog(row)"
          ></el-button>
          <el-popconfirm
            :title="`确定删除${row.name}吗?`"
            @onConfirm="deletePermission(row.id)"
          >
            <el-button
              slot="reference"
              type="danger"
              size="mini"
              icon="el-icon-delete"
              style="margin-left: 10px"
              :disabled="row.level === 1"
            ></el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加对话框 -->
    <el-dialog
      :title="`${isEdit ? '修改' : '添加'}${title}`"
      :visible.sync="addDialog"
      width="50%"
    >
      <el-form
        ref="addForm"
        label-width="120px"
        :model="permission"
        :rules="rules"
      >
        <el-form-item v-if="permission.level > 1 && !isEdit" label="父级名称">
          <el-input v-model="permission.pname" disabled></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="permission.name"></el-input>
        </el-form-item>
        <el-form-item label="功能权限值" prop="code">
          <el-input v-model="permission.code"></el-input>
        </el-form-item>
        <el-form-item v-if="permission.level === 4" label="跳转路由权限值">
          <el-input v-model="permission.toCode" type="password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetPermissions">取 消</el-button>
        <el-button
          type="primary"
          @click="addOrUpdatePermission"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Permission",
  data() {
    return {
      permissionList: [],
      expandKeys: [],
      title: "",
      permission: {
        code: "",
        level: 0,
        name: "",
        toCode: "",
        pid: "",
        pname: "",
        id: null,
      },
      isEdit: false,
      addDialog: false,
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        code: [
          { required: true, message: "请输入功能权限值", trigger: "blur" },
        ],
      },
    };
  },
  computed: {},
  watch: {
    permission: {
      deep: true,
      handler(val) {
        if (val.level === 2) this.title = "一级菜单";
        else if (val.level === 3) this.title = "二级菜单";
        else if (val.level === 4) this.title = "功能";
        else this.title = "";
      },
    },
  },
  mounted() {
    this.getPermissionList();
  },
  methods: {
    async getPermissionList() {
      try {
        this.permissionList = (
          await this.$API.permission.getPermissionList()
        ).data.children;
        this.expandKeys = [this.permissionList[0].id];
      } catch (error) {
        this.$message({
          message: "获取权限列表失败!",
          type: "info",
          showClose: true,
        });
      }
    },
    showAddDialog(row) {
      const { level, id, pid, name, code, toCode } = row;
      if (this.isEdit) {
        this.permission.level = level;
        this.permission.pid = pid;
        this.permission.id = id;
        this.permission.name = name;
        this.permission.code = code;
        this.permission.toCode = toCode;
      } else {
        this.permission.level = level + 1;
        this.permission.pid = id;
        this.permission.pname = name;
      }
      this.permission.type = level < 4 ? 1 : 2;
      this.addDialog = true;
    },
    async addOrUpdatePermission() {
      try {
        await this.$API.permission[
          `${this.isEdit ? "updatePermission" : "addPermission"}`
        ](this.permission);
        this.$message({
          message: `${this.isEdit ? "修改权限信息成功" : "添加权限信息成功"}`,
          type: "success",
          showClose: true,
        });
        this.resetPermissions();
        this.getPermissionList();
      } catch (error) {
        this.$message({
          message: `${this.isEdit ? "修改权限信息失败" : "添加权限信息失败"}`,
          type: "error",
          showClose: true,
        });
      }
    },
    resetPermissions() {
      this.addDialog = false;
      this.isEdit = false;
      this.permission = {
        code: "",
        level: 0,
        name: "",
        toCode: "",
        pid: "",
        pname: "",
        id: null,
      };
    },
    async deletePermission(id) {
      try {
        await this.$API.permission.removePermission(id);
        this.$message({
          message: "删除权限成功",
          type: "success",
          showClose: true,
        });
        this.getPermissionList();
      } catch (error) {
        this.$message({
          message: "删除权限失败",
          type: "error",
          showClose: true,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
