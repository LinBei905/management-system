<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>线上热门搜索</span>
      <el-dropdown>
        <span class="el-dropdown-link">
          <i class="el-icon-more el-icon--right" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>黄金糕</el-dropdown-item>
          <el-dropdown-item>狮子头</el-dropdown-item>
          <el-dropdown-item>螺蛳粉</el-dropdown-item>
          <el-dropdown-item>双皮奶</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="12" :offset="0">
          <Deatil title="搜索用户数">
            <template slot="content">
              <p>
                12321
                <span
                  style="font-size: 16px; color: gray"
                >17.1<i
                  class="el-icon-caret-top"
                  style="color: red"
                /></span>
              </p>
            </template>
            <template slot="chart">
              <div ref="lineChart1" class="charts" />
            </template>
          </Deatil>
        </el-col>
        <el-col :span="12" :offset="0">
          <Deatil title="人均搜索次数">
            <template slot="content">
              <p>
                2.7
                <span
                  style="font-size: 16px; color: gray"
                >26.2<i
                  class="el-icon-caret-bottom"
                  style="color: green"
                /></span>
              </p>
            </template>
            <template slot="chart">
              <div ref="lineChart2" class="charts" />
            </template>
          </Deatil>
        </el-col>
      </el-row>
      <el-table border stripe>
        <el-table-column label="排名" :width="80"> </el-table-column>
        <el-table-column label="搜索关键字"> </el-table-column>
        <el-table-column label="用户数"> </el-table-column>
        <el-table-column label="周涨幅"> </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination layout="->, prev, pager, next" :total="1000">
        </el-pagination>
      </div>
    </div>
  </el-card>
</template>

<script>
import Deatil from "./Detail";
export default {
  name: "Search",
  components: {
    Deatil,
  },
  data() {
    return {
      options: {
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
            color: "#769EE7",
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
                  color: "#769EE7", // 0% 处的颜色
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
      },
    };
  },
  mounted() {
    this.$echarts.init(this.$refs.lineChart1).setOption(this.options);
    this.$echarts.init(this.$refs.lineChart2).setOption(this.options);
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
  position: relative;
  height: 19px;
  & > span {
    position: absolute;
    left: 0;
  }
  & > .el-dropdown {
    position: absolute;
    right: 0;
  }
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
.el-dropdown-link {
  cursor: pointer;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.charts {
  width: 100%;
  height: 100%;
}
</style>
