<template>
  <div>
    <el-tree
      ref="tree"
      :data="authList"
      show-checkbox
      default-expand-all
      node-key="id"
      highlight-current
      :props="defaultProps"
      @check="
        (_, { checkedKeys:keys }) => {
          checkedKeys = keys;
        }
      "
    >
    </el-tree>
    <el-button type="primary" size="default" @click="submit">保存</el-button>
    <el-button
      size="default"
      @click="$router.replace({ name: 'Role' })"
    >返回</el-button>
  </div>
</template>

<script>
export default {
  name: "Auth",
  data() {
    return {
      authList: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      checkedKeys: [],
    };
  },
  computed: {
    isChecked() {
      const recur = (pre, item) => {
        if (item.select) {
          pre.push(item.id);
        }
        if (item.children.length) {
          item.children.reduce(recur, pre);
        }
        return pre;
      };
      return this.authList.reduce(recur, []);
    },
    roleId() {
      return this.$route.query.roleId;
    },
  },
  async mounted() {
    try {
      this.authList = (
        await this.$API.permission.toAssign(this.roleId)
      ).data.children;
      this.$refs.tree.setCheckedKeys(this.isChecked);
    } catch (error) {
      this.$message({
        message: "获取角色权限信息失败!",
        type: "error",
        showClose: true,
      });
    }
  },
  methods: {
    async submit() {
      try {
        await this.$API.permission.doAssign(
          this.roleId,
          this.checkedKeys.join(",")
        );
        this.$message({
          message: "修改角色权限成功!",
          type: "success",
          showClose: true,
        });
        this.$router.replace({ name: "Role" });
      } catch (error) {
        this.$message({
          message: "修改角色权限失败!",
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
