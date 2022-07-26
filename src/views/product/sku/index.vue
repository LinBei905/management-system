<template>
  <div>
    <el-table :data="skuList" border stripe>
      <el-table-column prop="id" label="序号" width="80"> </el-table-column>
      <el-table-column prop="skuName" label="名称"> </el-table-column>
      <el-table-column prop="skuDesc" label="描述"> </el-table-column>
      <el-table-column prop="skuDefaultImg" label="默认图片">
        <template slot-scope="{ row: { skuDefaultImg } }">
          <el-image
            :src="skuDefaultImg"
            style="width: 50px"
            fit="fill"
            :lazy="true"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="80"> </el-table-column>
      <el-table-column prop="price" label="价格" width="80"> </el-table-column>
      <el-table-column prop="id" label="操作">
        <template slot-scope="{ row: { isSale, id } }">
          <el-button
            type="success"
            size="mini"
            :icon="`el-icon-${isSale ? 'remove' : 'plus'}`"
            @click="upOrDownSku({ isSale, id })"
          >
          </el-button>
          <el-button type="warning" size="mini" icon="el-icon-edit">
          </el-button>
          <el-button
            type="info"
            size="mini"
            icon="el-icon-info"
            @click="getSkuDetail(id)"
          >
          </el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete">
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="text-align: center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
    <el-drawer :visible.sync="drawer" size="50%">
      <el-row :gutter="20">
        <el-col :span="6">名称</el-col>
        <el-col :span="18">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">描述</el-col>
        <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">价格</el-col>
        <el-col :span="18">{{ skuInfo.price }}</el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="6">平台属性</el-col>
        <el-col
          :span="18"
        ><el-tag
          v-for="tag in skuInfo.skuAttrValueList"
          :key="tag.id"
          type="success"
          size="normal"
          style="margin: 0px 5px"
        >
          {{ tag.attrId + "-" + tag.valueId }}
        </el-tag></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">商品图片</el-col>
        <el-col
          :span="18"
        ><div class="block">
          <el-carousel arrow="always">
            <el-carousel-item
              v-for="item in skuInfo.skuImageList"
              :key="item.id"
            >
              <el-image :src="item.imgUrl" fit="fill"></el-image>
            </el-carousel-item>
          </el-carousel>
        </div>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      skuList: [],
      page: 1,
      limit: 10,
      total: 0,
      drawer: false,
      skuInfo: {},
    };
  },
  watch: {
    limit() {
      this.getSkuList();
    },
    page() {
      this.getSkuList();
    },
  },
  mounted() {
    this.getSkuList();
  },
  methods: {
    async getSkuList() {
      try {
        const { total, records } = (
          await this.$API.sku.reqSkuList(this.page, this.limit)
        ).data;
        this.skuList = records;
        this.total = total;
      } catch (error) {
        this.$message({
          message: "获取sku数据失败",
          type: "error",
        });
      }
    },
    async upOrDownSku({ isSale, id }) {
      try {
        await this.$API.sku[`req${isSale ? "Cancel" : "Sale"}`](id);
        this.$message({
          message: `${isSale ? "下" : "上"}架成功!`,
          type: "success",
          showClose: true,
        });
        this.getSkuList();
      } catch (error) {
        this.$message({
          message: `${isSale ? "下" : "上"}架失败!`,
          type: "error",
          showClose: true,
        });
      }
    },
    async getSkuDetail(id) {
      try {
        this.drawer = true;
        this.skuInfo = (await this.$API.sku.reqSkuById(id)).data;
      } catch (error) {
        this.$message({
          message: "获取sku详情失败",
          type: "error",
          showClose: true,
        });
      }
    },
    handleSizeChange(val) {
      this.limit = val;
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;
  .el-col:first-child {
    text-align: right;
    font-size: 20px;
  }
}
// ::v-deep深度选择器
::v-deep .el-carousel__button {
  width: 10px !important;
  height: 10px !important;
  border-radius: 100% !important;
  background: orange;
}
::v-deep .el-carousel{
  border: 1px solid whitesmoke;
}
</style>
<style>

</style>
