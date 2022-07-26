<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card>
          <Detail title="总销售额" content="¥ 126560">
            <template slot="chart">
              <span>周同比 56.67%
                <i class="el-icon-caret-top" style="color: red" /> 日同比 19.96%
                <i class="el-icon-caret-bottom" style="color: green" />
              </span>
            </template>
            <template slot="footer">
              <span> 日销售额￥ 12423 </span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="访问量" content="88460">
            <template slot="chart">
              <div ref="lineChart" class="charts" />
            </template>
            <template slot="footer">
              <span> 日访问量 1234</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="支付笔数" content="88460">
            <template slot="chart">
              <div ref="barChart" class="charts" />
            </template>
            <template slot="footer">
              <span>转换率64%</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="运营活动效果" content="78%">
            <template slot="chart">
              <div ref="progressChart" class="charts" />
            </template>
            <template slot="footer">
              <span>周同比 56.67%
                <i class="el-icon-caret-top" style="color: red" /> 日同比 19.96%
                <i class="el-icon-caret-bottom" style="color: green" />
              </span>
            </template>
          </Detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from "./Detail";
export default {
  name: "Card",
  components: {
    Detail,
  },
  mounted() {
    // 折线图
    this.$echarts.init(this.$refs.lineChart).setOption({
      xAxis: {
        show: false,
        type: "category",
      },
      yAxis: {
        show: false,
      },
      series: {
        type: "line",
        data: [50, 25, 20, 60, 30, 15, 16, 35, 25, 65, 50, 40, 15, 35, 65],
        smooth: true,
        itemStyle: {
          opacity: 0,
        },
        lineStyle: {
          color: "#8F72D1",
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#8F72D1", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "white", // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
      },
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        width: "100%",
      },
    });
    // 柱状图
    this.$echarts.init(this.$refs.barChart).setOption({
      xAxis: {
        show: false,
        type: "category",
      },
      yAxis: {
        show: false,
      },
      series: {
        type: "bar",
        data: [50, 25, 20, 60, 30, 15, 16, 35, 25, 70, 55],
        itemStyle: {
          color: "#5172CA",
        },
      },
      tooltip: {},
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
    });
    // 进度条
    this.$echarts.init(this.$refs.progressChart).setOption({
      xAxis: {
        show: false,
        min: 0,
        max: 100,
      },
      yAxis: {
        type: "category",
        show: false,
      },
      series: {
        type: "bar",
        data: [78],
        itemStyle: {
          color: "#9ABF29",
        },
        showBackground: true,
        backgroundStyle: {
          color: "#eee",
        },
        barWidth: "10",
        label: {
          show: true,
          formatter: "|",
          position: "right",
        },
      },
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
    });
  },
};
</script>

<style lang="scss" scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>
