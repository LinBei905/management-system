<template>
  <div>
    <el-row :gutter="30">
      <el-col :span="12" :offset="0"><Search /></el-col>
      <el-col :span="12" :offset="0"><Catagory /></el-col>
    </el-row>
  </div>
</template>

<script>
import Search from "./Search";
import Catagory from "./Catagory";
export default {
  name: "Observe",
  components: {
    Search,
    Catagory,
  },
};
</script>

<style lang="scss" scoped>
</style>
