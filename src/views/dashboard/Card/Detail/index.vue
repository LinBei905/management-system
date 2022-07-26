<template>
  <div>
    <div class="header">
      {{ title }}
      <i class="el-icon-info" />
    </div>
    <div class="content">
      {{ content }}
    </div>
    <div class="chart"><slot name="chart">图表</slot></div>
    <div class="footer">
      <slot name="footer">底部</slot>
    </div>
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
      default: "内容",
    }
  },
};
</script>

<style lang="scss" scoped>
.header {
  color: #d9d9d9;
  display: flex;
  justify-content: space-between;
}
.content {
  font-size: 30px;
  padding: 10px 0px;
}
.chart {
  height: 50px;
}
.footer {
  border-top: 1px solid rgb(218, 215, 215);
  padding-top: 10px;
}
</style>
