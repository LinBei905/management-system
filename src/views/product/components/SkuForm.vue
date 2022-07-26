<template>
  <el-form ref="form" :model="skuForm" label-width="100px" size="normal">
    <el-form-item label="SPU名称">{{ spuName }}</el-form-item>
    <el-form-item label="SKU名称">
      <el-input v-model="skuForm.skuName" placeholder="SKU名称"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input
        v-model="skuForm.price"
        type="number"
        placeholder="价格(元)"
      ></el-input>
    </el-form-item>
    <el-form-item label="重量(千克)">
      <el-input
        v-model="skuForm.weight"
        type="number"
        placeholder="重量(千克)"
      ></el-input>
    </el-form-item>
    <el-form-item label="规格描述">
      <el-input
        v-model="skuForm.skuDesc"
        placeholder="sku规格描述"
        type="textarea"
      ></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true" class="demo-form-inline" label-width="100px">
        <el-form-item
          v-for="attr in attrInfoList"
          :key="attr.id"
          :label="attr.attrName"
        >
          <el-select v-model="attr.selectValue" placeholder="请选择">
            <el-option
              v-for="item in attr.attrValueList"
              :key="item.id"
              :label="item.valueName"
              :value="`${attr.id}:${item.id}`"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true" class="demo-form-inline" label-width="100px">
        <el-form-item
          v-for="saleAttr in spuSaleAttrList"
          :key="saleAttr.id"
          :label="saleAttr.saleAttrName"
        >
          <el-select v-model="saleAttr.selectValue" placeholder="请选择">
            <el-option
              v-for="item in saleAttr.spuSaleAttrValueList"
              :key="item.id"
              :label="item.saleAttrValueName"
              :value="`${saleAttr.id}:${item.id}`"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片列表" size="normal">
      <el-table
        :data="spuImageList"
        border
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column width="55" type="selection"> </el-table-column>
        <el-table-column label="图片">
          <template slot-scope="{ row: { imgUrl } }">
            <el-image
              style="width: 100px; height: 100px"
              :src="imgUrl"
              fit="fill"
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row: { imgUrl } }">
            <el-button
              v-if="imgUrl !== skuForm.skuDefaultImg"
              type="primary"
              size="default"
              @click="setDefault(imgUrl)"
            >设置默认</el-button>
            <el-button v-else size="default">默认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="saveSku">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      skuForm: {
        category3Id: null,
        price: "",
        skuDefaultImg: "",
        skuDesc: "",
        skuName: "",
        spuId: null,
        tmId: null,
        weight: "",
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0
          // }
        ],
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0
          // }
        ],
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   attrName: "string",
          //   id: 0,
          //   skuId: 0,
          //   valueId: 0,
          //   valueName: "string"
          // }
        ],
      },
      spuName: "",
      spuImageList: [],
      spuSaleAttrList: [],
      attrInfoList: [],
    };
  },
  computed: {
    saleAttrList() {
      return this.spuSaleAttrList.reduce((pre, item) => {
        if (item.selectValue) {
          const [saleAttrId, saleAttrValueId] = item.selectValue.split(":");
          pre.push({
            saleAttrId,
            saleAttrValueId,
          });
        }
        return pre
      }, []);
    },
    attrList() {
      return this.attrInfoList.reduce((pre, item) => {
        if (item.selectValue) {
          const [attrId, valueId] = item.selectValue.split(":");
          pre.push({
            attrId,
            valueId,
          });
        }
        return pre
      }, []);
    },
  },
  methods: {
    async initSku({ spuName, categoryId, spuId, tmId }) {
      this.spuName = spuName;
      this.skuForm.spuId = spuId;
      this.skuForm.tmId = tmId;
      const { id1, id2, id3 } = categoryId;
      this.skuForm.category3Id = id3;
      try {
        const p1 = this.$API.spu.reqSpuImageLIst(spuId);
        const p2 = this.$API.spu.reqSpuSaleAttrList(spuId);
        const p3 = this.$API.spu.reqAttrInfoList(id1, id2, id3);
        const [{ data: d1 }, { data: d2 }, { data: d3 }] = await Promise.all([
          p1,
          p2,
          p3,
        ]);
        this.spuImageList = d1;
        this.spuSaleAttrList = d2.map((item) => ({ ...item, selectValue: "" }));
        this.attrInfoList = d3.map((item) => ({ ...item, selectValue: "" }));
      } catch (error) {
        this.$message({
          message: "请求失败!",
          type: "error",
        });
      }
    },
    handleSelectionChange(row) {
      console.log(row);
      this.skuForm.skuImageList = row;
    },
    setDefault(imgUrl) {
      this.skuForm.skuDefaultImg = imgUrl;
    },
    cancel() {
      this.$emit("update:skuVisible", false);
      // 重置数据
      Object.assign(this._data, this.$options.data());
    },
    async saveSku() {
      this.skuForm.skuSaleAttrValueList = this.saleAttrList;
      this.skuForm.skuAttrValueList = this.attrList;
      try {
        await this.$API.spu.reqAddSku(this.skuForm);
        this.$message({
          message: "保存成功!",
          type: "success",
        });
        // 重置数据
        Object.assign(this._data, this.$options.data());
        this.$emit("update:skuVisible", false);
      } catch (error) {
        this.$message({
          message: "保存失败!",
          type: "error",
        });
      }
    },
  },
};
</script>
