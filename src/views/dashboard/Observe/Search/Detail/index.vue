<template>
  <div>
    <div class="header">
      {{ title }}
      <i class="el-icon-info" />
    </div>
    <div class="content">
      <slot name="content">{{ content }}</slot>
    </div>
    <div class="chart"><slot name="chart">图表</slot></div>
  </div>
</template>

<script>
export default {
  name: "Detail",
  props: {
    title: {
      type: String,
      default: "标题",
    },
    content: {
      type: String,
      default: "内容"
    }
  },
};
</script>

<style lang="scss" scoped>
.header {
  color: #d9d9d9;
}
.content {
  font-size: 20px;
}
.chart {
  height: 50px;
}
</style>
