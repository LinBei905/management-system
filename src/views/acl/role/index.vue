<template>
  <div>
    <ManageTable
      :page="page"
      :limit="limit"
      :total="total"
      :delete-able="selectedItems.length > 0 ? false : true"
      @handleAdd="addRole"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
      @search="search"
      @handleDelete="deleteRoles"
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
          <el-table-column prop="roleName" label="角色名称">
            <template slot-scope="{ row }">
              <div v-if="row.isEdit">
                <el-input
                  v-model="row.roleName"
                  style="width: 80%;margin-right:10px;"
                  placeholder="请输入角色名称"
                  clearable
                ></el-input><el-button
                  type="warning"
                  icon="el-icon-refresh"
                  @click="row.isEdit = false"
                >取消</el-button>
              </div>
              <span v-else>{{ row.roleName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="id" width="400" label="操作" align="center">
            <template slot-scope="{ row }">
              <el-button
                type="info"
                size="mini"
                icon="el-icon-info"
                @click="$router.push({path:'/acl/role/auth',query:{roleId:row.id}})"
              ></el-button>
              <el-button
                v-if="row.isEdit"
                type="primary"
                size="mini"
                icon="el-icon-check"
                @click="editRole(row)"
              ></el-button>
              <el-button
                v-else
                type="primary"
                size="mini"
                icon="el-icon-edit"
                @click="row.isEdit = true"
              ></el-button>
              <el-popconfirm
                :title="`确定删除${row.roleName}吗?`"
                @onConfirm="deleteRole(row.id)"
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
  </div>
</template>

<script>
import ManageTable from "@/views/acl/components/ManageTabel.vue";
export default {
  name: "Role",
  components: {
    ManageTable,
  },
  data() {
    return {
      page: 1,
      limit: 5,
      total: 0,
      // 用于页面显示的用户列表
      items: [],
      // 所选择的用户
      selectedItems: [],
      isIndeterminate: true,
      // 是否已调用 getPageList 方法的标志，防止短时间内重复调用
      onGet: false,
      role: {},
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
      this.page = 1;
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
        } = await this.$API.role.getPageList(page, limit, searchParam || "");
        this.items = items.map((item) => ({ ...item, isEdit: false }));
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
      this.getPageList({ roleName: val });
    },
    // 添加角色
    async addRole() {
      this.$prompt("请输入角色名称", "添加角色", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(async({ value: roleName }) => {
          try {
            await this.$API.role.save({ roleName });
            this.$message({
              message: "新增角色成功",
              type: "success",
              showClose: true,
            });
            this.getPageList();
          } catch (error) {
            this.$message({
              message: "新增角色失败",
              type: "error",
              showClose: true,
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消添加",
          });
        });
    },
    // 修改用户方法
    async editRole(row) {
      try {
        row.isEdit = false;
        await this.$API.role.updateById(row);
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
    // 删除用户
    async deleteRole(id) {
      try {
        await this.$API.role.removeById(id);
        this.$message({
          message: "删除角色成功!",
          type: "success",
          showClose: true,
        });
        this.getPageList();
      } catch (error) {
        this.$message({
          message: "删除角色失败!",
          type: "error",
          showClose: true,
        });
      }
    },
    // 删除多位用户
    deleteRoles() {
      this.$confirm("确定删除选中的角色吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async() => {
          try {
            await this.$API.role.removeRoles(
              this.selectedItems.map((item) => item.id)
            );
            this.$message({
              message: "删除角色成功!",
              type: "success",
              showClose: true,
            });
            this.getPageList();
          } catch (error) {
            this.$message({
              message: "删除角色失败!",
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
