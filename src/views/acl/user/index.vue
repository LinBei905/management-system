<template>
  <div>
    <ManageTable
      :page="page"
      :limit="limit"
      :total="total"
      :delete-able="selectedItems.length > 0 ? false : true"
      @handleAdd="addDialog = true"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
      @search="search"
      @handleDelete="deleteUsers"
    >
      <template slot="table">
        <el-table
          :data="items"
          border
          stripe
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column type="index" label="序号" width="100">
          </el-table-column>
          <el-table-column prop="username" label="用户名"> </el-table-column>
          <el-table-column prop="nickName" label="用户昵称"> </el-table-column>
          <el-table-column prop="roleName" label="权限列表"> </el-table-column>
          <el-table-column prop="gmtCreate" label="创建时间"> </el-table-column>
          <el-table-column prop="gmtModified" label="修改时间">
          </el-table-column>
          <el-table-column prop="id" label="操作">
            <template slot-scope="{ row }">
              <el-button
                type="info"
                size="mini"
                icon="el-icon-user-solid"
                @click="editRole(row)"
              ></el-button>
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                @click="
                  (editDialog = true), (editForm = Object.assign({}, row))
                "
              ></el-button>
              <el-popconfirm
                :title="`确定删除${row.username}吗?`"
                @onConfirm="deleteUser(row.id)"
              >
                <el-button
                  slot="reference"
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  style="margin-left: 10px"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </ManageTable>
    <!-- 添加对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialog" width="50%">
      <el-form ref="addForm" label-width="80px" :model="addForm" :rules="rules">
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="addForm.username"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户昵称">
          <el-input
            v-model="addForm.nickName"
            placeholder="请输入昵称"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input
            v-model="addForm.password"
            placeholder="请输入用户密码"
            type="password"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelSubmit">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialog" width="50%">
      <el-form
        ref="addForm"
        label-width="80px"
        :model="editForm"
        :rules="rules"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="editForm.username"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户昵称">
          <el-input
            v-model="editForm.nickName"
            placeholder="请输入昵称"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitEdit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 权限对话框 -->
    <el-dialog title="设置角色" :visible.sync="roleDialog" width="50%">
      <el-form ref="addForm" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="editForm.username"
            placeholder="请输入用户名"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
          >全选</el-checkbox>
          <div style="margin: 15px 0" />
          <el-checkbox-group
            v-model="checkedRoles"
            @change="handleCheckedCitiesChange"
          >
            <el-checkbox
              v-for="role in roles"
              :key="role.id"
              :label="role"
              :checked="checkedRolesId.includes(role.id)"
            >{{ role.roleName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <!-- roles数据必须清空,否则编辑权限时会出现已有角色未勾选的bug -->
        <el-button @click="(roleDialog = false), (roles = [])">取 消</el-button>
        <el-button type="primary" @click="submitRoleChange">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ManageTable from "@/views/acl/components/ManageTabel.vue";
export default {
  name: "User",
  components: {
    ManageTable,
  },
  data() {
    return {
      page: 1,
      limit: 3,
      total: 0,
      // 用于页面显示的用户列表
      items: [],
      // 所选择的用户
      selectedItems: [],
      // 添加对话框显示的标志
      addDialog: false,
      // 编辑对话框显示的标志
      editDialog: false,
      // 用户角色对话框显示的标志
      roleDialog: false,
      // 添加表单
      addForm: {
        username: "",
        nickName: "",
        password: "",
      },
      // 编辑表单
      editForm: {},
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 8,
            max: 20,
            message: "长度在 8 到 20 个字符",
            trigger: "blur",
          },
        ],
      },
      checkAll: false,
      // 所选择的用户角色
      checkedRoles: [],
      // 所有可选择的角色
      roles: [],
      isIndeterminate: true,
      // 是否已调用 getPageList 方法的标志，防止短时间内重复调用
      onGet: false,
    };
  },
  computed: {
    // 用户权限编辑时所选择的角色ID
    checkedRolesId() {
      return this.checkedRoles.map((item) => item.id);
    },
  },
  watch: {
    page() {
      this.getPageList();
    },
    limit() {
      this.page = 1
      this.getPageList();
    },
    total(val) {
      const { page, limit } = this;
      const num = Math.ceil(val / limit);
      if (num < page) this.page = num;
    },
  },
  mounted() {
    this.getPageList();
  },
  methods: {
    // 获取用户列表数据
    async getPageList(searchParam) {
      // 短时间内重复调用直接返回
      if (this.onGet) return;
      this.onGet = true;
      try {
        const { page, limit } = this;
        const {
          data: { items, total },
        } = await this.$API.user.getPageList(page, limit, searchParam || "");
        this.items = items;
        this.total = total;
      } catch (error) {
        this.$message({
          message: "获取用户信息失败!",
          type: "error",
          showClose: true,
        });
      }
      this.onGet = false;
    },
    // 表格选择
    handleSelectionChange(val) {
      this.selectedItems = val;
    },
    // 页面数据量
    handleSizeChange(val) {
      this.limit = val;
    },
    // 页面切换
    handleCurrentChange(val) {
      this.page = val;
    },
    search(val) {
      // 搜索page必须为1
      this.page = 1;
      this.getPageList({ username: val });
    },
    // 添加用户方法
    async submitForm() {
      try {
        await this.$API.user.add(this.addForm);
        this.addDialog = false;
        this.$message({
          message: "新增用户成功",
          type: "success",
          showClose: true,
        });
        this.getPageList();
      } catch (error) {
        this.$message({
          message: "新增用户失败",
          type: "error",
          showClose: true,
        });
      }
    },
    // 取消提交方法
    cancelSubmit() {
      this.addDialog = false;
      this.addForm = {
        username: "",
        nickname: "",
        password: "",
      };
    },
    // 修改用户方法
    async submitEdit() {
      try {
        await this.$API.user.update(this.editForm);
        this.editDialog = false;
        this.$message({
          message: "修改数据成功",
          type: "success",
          showClose: true,
        });
        this.getPageList();
      } catch (error) {
        this.$message({
          message: "修改数据失败",
          type: "error",
          showClose: true,
        });
      }
    },
    // 用户权限选择框处理方法
    handleCheckAllChange(val) {
      this.checkedRoles = val ? this.roles : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      console.log(value);
      const checkedCount = value.length;
      this.checkAll = checkedCount === this.checkedRoles.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.roles.length;
    },
    // 编辑用户角色
    async editRole(row) {
      try {
        const { allRolesList, assignRoles } = (
          await this.$API.user.getRoles(row.id)
        ).data;
        this.roles = allRolesList;
        this.checkedRoles = assignRoles;
        this.editForm = Object.assign({}, row);
        this.roleDialog = true;
      } catch (error) {
        this.$message({
          message: "获取用户权限失败",
          type: "error",
          showClose: true,
        });
      }
    },
    // 提交用户角色修改
    async submitRoleChange() {
      const { id } = this.editForm;
      try {
        await this.$API.user.assignRoles(id, this.checkedRolesId.join(","));
        this.roleDialog = false;
        this.$message({
          message: "修改权限成功",
          type: "success",
          showClose: true,
        });
        this.getPageList();
      } catch (error) {
        this.$message({
          message: "修改权限失败",
          type: "error",
          showClose: true,
        });
      }
    },
    // 删除用户
    async deleteUser(id) {
      try {
        await this.$API.user.removeById(id);
        this.$message({
          message: "删除用户成功!",
          type: "success",
          showClose: true,
        });
        this.getPageList();
      } catch (error) {
        this.$message({
          message: "删除用户失败!",
          type: "error",
          showClose: true,
        });
      }
    },
    // 删除多位用户
    deleteUsers() {
      this.$confirm("确定删除选中的用户吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async() => {
          try {
            await this.$API.user.removeUsers(
              this.selectedItems.map((item) => item.id)
            );
            this.$message({
              message: "删除用户成功!",
              type: "success",
              showClose: true,
            });
            this.getPageList();
          } catch (error) {
            this.$message({
              message: "删除用户失败!",
              type: "error",
              showClose: true,
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
