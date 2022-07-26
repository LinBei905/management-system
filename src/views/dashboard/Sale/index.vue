<template>
  <el-card class="box-card sale-box">
    <div slot="header" class="clearfix">
      <el-tabs v-model="type" class="tab">
        <el-tab-pane label="销售额" name="sales"></el-tab-pane>
        <el-tab-pane label="访问量" name="views"></el-tab-pane>
      </el-tabs>
      <div class="timeSelect">
        <span @click="date = [new Date(), new Date()]">今日</span>
        <span
          @click="
            date = [new Date().getTime() - 3600 * 1000 * 24 * 7, new Date()]
          "
        >本周</span>
        <span
          @click="
            date = [new Date().getTime() - 3600 * 1000 * 24 * 30, new Date()]
          "
        >本月</span>
        <span
          @click="
            date = [new Date().getTime() - 3600 * 1000 * 24 * 365, new Date()]
          "
        >本年</span>
        <el-date-picker
          v-model="date"
          size="mini"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-DD"
        >
        </el-date-picker>
      </div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col
          :span="18"
          :offset="0"
        ><div ref="saleChart" class="chart" />
        </el-col>
        <el-col :span="6" :offset="0">
          <h3>门店{{ title }}排名</h3>
          <el-table :data="saleList" :show-header="false">
            <el-table-column type="index" width="30">
              <template slot-scope="{ $index }">
                <span :class="$index < 3 ? 'bgCircle' : ''">{{
                  $index + 1
                }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="name"> </el-table-column>
            <el-table-column prop="sales"> </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "Sale",
  data() {
    return {
      date: "",
      type: "sales",
      saleList: [
        { name: "abc", sales: 123456 },
        { name: "abc", sales: 123456 },
        { name: "abc", sales: 123456 },
        { name: "abc", sales: 123456 },
        { name: "abc", sales: 123456 },
        { name: "abc", sales: 123456 },
        { name: "abc", sales: 123456 },
      ],
      options: {
        title: {
          show: true,
          text: `销售额趋势`,
        },
        xAxis: {
          type: "category",
          data: new Array(12).fill(0).map((item, index) => index + 1 + "月"),
          axisTick: {
            alignWithLabel: true,
          },
          axisPointer: {
            show: true,
          },
        },
        yAxis: {
          type: "value",
        },
        series: {
          type: "bar",
          data: [400, 52, 200, 334, 390, 330, 220, 150, 350, 450, 130, 360],
          itemStyle: {
            color: "#5172CA",
          },
          barWidth: 30,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: 50,
          right: 50,
          bottom: 30,
        },
      },
    };
  },
  computed: {
    title() {
      return this.type === "sales" ? "销售额" : "访问量";
    },
  },
  watch: {
    type(value) {
      let data = null;
      if (value === "sales") {
        data = [400, 52, 200, 334, 390, 330, 220, 150, 350, 450, 130, 360];
      } else {
        data = [100, 350, 180, 230, 90, 120, 400, 330, 210, 360, 480, 170];
      }
      this.options.title.text = this.title + "趋势";
      this.saleChart.setOption({
        title: {
          text: this.title + "趋势",
        },
        series: {
          data
        }
      });
    },
  },
  mounted() {
    this.saleChart = this.$echarts.init(this.$refs.saleChart);
    this.saleChart.setOption(this.options);
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.box-card {
  width: 100%;
  margin: 10px 0px;
  .clearfix {
    height: 40px;
    .timeSelect {
      line-height: 40px;
      float: right;
      span {
        margin-right: 10px;
      }
    }
  }
  .chart {
    width: 100%;
    height: 300px;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both;
  }
  .bgCircle {
    display: inline-block;
    color: white;
    width: 20px;
    height: 20px;
    border-radius: 100%;
    background: #000;
    text-align: center;
    transform: translateX(-30%);
  }
}
</style>
<style lang="scss">
.sale-box {
  .el-card__header {
    padding-bottom: 0;
  }
  .el-tabs {
    display: inline-block;
  }
  .el-tabs__nav-wrap::after {
    width: 0% !important;
  }
  .el-tabs__header {
    margin: 0;
  }
  .el-table__row {
    td {
      height: 30px;
      padding: 0;
    }
  }
}
</style>
