<template>
  <div>
    <CategorySelector
      :category="category"
      :is-edit="showSpuForm || showSkuForm"
      style="margin-bottom: 20px"
      @getList="getList"
      @getAttrs="getAttrs"
    />
    <el-card>
      <div v-show="!(showSpuForm || showSkuForm)">
        <!-- 显示表格 -->
        <el-button
          :disabled="addable"
          type="primary"
          icon="el-icon-plus"
          @click="showAddSpuForm"
        >添加Spu</el-button>
        <el-table border stripe style="margin: 20px 0" :data="list">
          <el-table-column label="序号" width="80" align="center" prop="id" />
          <el-table-column label="Spu名称" prop="spuName" />
          <el-table-column :label="`Spu描述`" prop="description" />
          <el-table-column label="操作" prop="id">
            <template slot-scope="{ row }">
              <el-button
                type="success"
                size="mini"
                icon="el-icon-plus"
                title="添加SKU"
                @click="addSku(row)"
              >
              </el-button>

              <el-button
                type="warning"
                size="mini"
                icon="el-icon-edit"
                title="修改SPU"
                @click="showUpdateSpuForm(row)"
              >
              </el-button>

              <el-button
                type="info"
                size="mini"
                icon="el-icon-info"
                title="查看SKU列表"
                @click="showSkuList(row)"
              >
              </el-button>

              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                title="删除SPU"
                @click="deleteItem(row)"
              >
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="text-align: center"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="prev, pager, next, jumper, ->, total, sizes"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
      <!-- sku列表 -->
      <el-dialog
        :title="`${skuList.spuName}的sku列表`"
        :visible.sync="isShowSkuList"
        width="80%"
        @close="isShowSkuList = false"
      >
        <el-table :data="skuList.list" border stripe>
          <el-table-column
            prop="skuName"
            label="名称"
          >
          </el-table-column>
          <el-table-column
            prop="price"
            label="价格"
          >
          </el-table-column>
          <el-table-column
            prop="weight"
            label="重量"
          >
          </el-table-column>
          <el-table-column
            prop="skuDefaultImg"
            label="默认图片"
          >
            <template slot-scope="{row:{skuDefaultImg}}">
              <el-image :src="skuDefaultImg" fit="fill" style="widtn:100px" :lazy="true"></el-image>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
      <!-- addorupdate spu form -->
      <SpuForm
        v-show="showSpuForm"
        ref="spu"
        :spu-visible.sync="showSpuForm"
        @successBack="successBack"
      />
      <!-- add sku form -->
      <SkuForm v-show="showSkuForm" ref="sku" :sku-visible.sync="showSkuForm" />
    </el-card>
  </div>
</template>

<script>
import SpuForm from "@/views/product/components/SpuForm.vue";
import SkuForm from "@/views/product/components/SkuForm.vue";
export default {
  name: "Spu",
  components: {
    SpuForm,
    SkuForm,
  },
  data() {
    return {
      category: {
        c1: "",
        c2: "",
        c3: "",
      },
      categoryId: {
        id1: null,
        id2: null,
        id3: null,
      },
      list: [],
      showSpuForm: false,
      showSkuForm: false,
      page: 1,
      limit: 3,
      total: 0,
      addable: true,
      flag: null,
      skuList: {
        spuName: "",
        list: [],
      },
      isShowSkuList: false,
    };
  },
  watch: {
    limit() {
      this.getAttrs(this.categoryId);
    },
    page() {
      this.getAttrs(this.categoryId);
    },
  },
  mounted() {
    this.getList(); // 初始化一级目录
  },
  methods: {
    // 获取目录列表
    async getList(Cid = 1, id) {
      if (Cid === 2) {
        this.category = {
          ...this.category,
          c3: "",
        };
      }
      try {
        this.page = 1
        const result = await this.$API.attr.getCategory(Cid, id);
        if (result.code === 200) {
          this.category[`c${Cid}`] = result.data;
          this.addable = true;
        } else {
          this.$message({
            type: "info",
            message: "获取属性失败",
          });
        }
      } catch (error) {
        this.$message({
          type: "error",
          message: "请求错误",
        });
      }
    },
    // 根据3级目录获取属性
    async getAttrs(categoryId) {
      const { id3 } = categoryId;
      this.categoryId = categoryId;
      try {
        const result = await this.$API.spu.reqSpuLst(
          this.page,
          this.limit,
          id3
        );
        if (result.code === 200) {
          this.list = result.data.records;
          this.total = result.data.total;
          this.addable = false;
        } else {
          this.$message({
            type: "info",
            message: "获取信息失败",
          });
        }
      } catch (error) {
        console.log(error);
        this.$message({
          type: "error",
          message: "请求错误",
        });
      }
    },
    // 显示添加修改spuForm
    showUpdateSpuForm(row) {
      this.flag = row.id;
      this.showSpuForm = true;
      this.$refs.spu.initUpdateFormData(row);
    },
    showAddSpuForm() {
      this.flag = null;
      this.$refs.spu.initAddFormData(this.categoryId.id3);
      this.showSpuForm = true;
    },
    // 删除属性
    deleteItem(row) {
      this.$confirm(`是否删除${row.spuName}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async() => {
          try {
            await this.$API.spu.reqDeleteSpu(row.id);
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            const num = Math.ceil((this.total - 1) / this.limit);
            this.page = num < this.page ? num : this.page;
            this.getAttrs(this.categoryId);
          } catch (error) {
            this.$message({
              type: "error",
              message: "请求失败!",
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 页面切换处理函数
    handleSizeChange(val) {
      this.limit = val;
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
    },
    addSku(row) {
      this.showSkuForm = true;
      const { spuName, id, tmId } = row;
      const { categoryId } = this;
      this.$refs.sku.initSku({ spuName, categoryId, spuId: id, tmId });
    },
    successBack() {
      this.categoryId;
      if (this.flag) {
        this.getAttrs(this.categoryId);
      } else {
        this.page = 1;
        this.getAttrs(this.categoryId);
      }
    },
    async showSkuList({ id, spuName }) {
      try {
        this.skuList.list = (await this.$API.spu.reqSkuList(id)).data;
        this.skuList.spuName = spuName;
        this.isShowSkuList = true;
      } catch (error) {
        this.$message({
          message: "获取sku列表失败",
          type: "error",
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
