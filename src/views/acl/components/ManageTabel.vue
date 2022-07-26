<template>
  <div>
    <div>
      <el-input
        v-model="value"
        placeholder="请输入名称"
        style="width: 200px; margin-right: 10px"
      ></el-input>
      <el-button type="primary" icon="el-icon-search" @click="$emit('search', value)">查询</el-button>
      <el-button @click="value = '', $emit('search', value)">清空</el-button>
    </div>
    <div style="margin: 20px 0">
      <el-button type="primary" icon="el-icon-plus" @click="$emit('handleAdd')">添加</el-button>
      <el-button type="danger" icon="el-icon-delete-solid" :disabled="deleteAble" @click="$emit('handleDelete')">批量删除</el-button>
    </div>
    <slot name="table">
      <el-table border>
        <el-table-column label="col.label"> </el-table-column>
      </el-table>
    </slot>
    <el-pagination
      style="margin-top:20px;"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "ManageTabel",
  props: {
    page: {
      type: Number,
      default: 1,
    },
    limit: {
      type: Number,
      default: 1,
    },
    total: {
      type: Number,
      default: 0,
    },
    deleteAble: {
      type: Boolean,
      default: true,
    }
  },
  data() {
    return {
      value: ""
    };
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('handleSizeChange', val)
    },
    handleCurrentChange(val) {
      this.$emit('handleCurrentChange', val)
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
