<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>销售额类别占比</span>
      <el-button-group style="float: right; padding: 3px 0">
        <el-button type="primary" size="mini">全部渠道</el-button>
        <el-button size="mini">线上</el-button>
        <el-button size="mini">门店</el-button>
      </el-button-group>
    </div>
    <div>
      <div ref="barChart" class="charts" />
    </div>
  </el-card>
</template>

<script>
export default {
  name: "Catagory",
  data() {
    return {
      options: {
        title: {
          text: "Search Engine",
          subtext: "1048",
          left: "center",
          top: "center",
        },
        series: {
          name: "Access From",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: true,
          },
          labelLine: {
            show: true,
          },
          data: [
            { value: 1048, name: "Search Engine" },
            { value: 735, name: "Direct" },
            { value: 580, name: "Email" },
            { value: 484, name: "Union Ads" },
            { value: 300, name: "Video Ads" },
          ],
        },
        tooltip: {
          trigger: "item",
        },
      },
    };
  },
  mounted() {
    const barChart = this.$echarts.init(this.$refs.barChart);
    barChart.setOption(this.options);
    barChart.on("mouseover", ({ name, value }) => {
      barChart.setOption({
        title: {
          text: name,
          subtext: value,
        },
      });
    });
  },
};
</script>

<style lang="scss" scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}
.clearfix {
  line-height: 34px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 100%;
}
.charts {
  width: 100%;
  height: 300px;
}
</style>
