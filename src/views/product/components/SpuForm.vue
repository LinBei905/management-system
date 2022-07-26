<template>
  <el-form ref="spuForm" :model="spuForm" label-width="80px">
    <el-form-item label="SPU名称">
      <el-input v-model="spuForm.spuName" placeholder="请输入名称"></el-input>
    </el-form-item>
    <el-form-item label="品牌">
      <el-select v-model="spuForm.tmId" placeholder="请选择品牌">
        <el-option
          v-for="mark in tradeMarks"
          :key="mark.id"
          :label="mark.tmName"
          :value="mark.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input
        v-model="spuForm.description"
        type="textarea"
        placeholder="描述"
        rows="5"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU图片">
      <el-upload
        action="/dev-api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :file-list="spuImageList"
        :on-success="handleAvatarSuccess"
      >
        <i class="el-icon-plus" />
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-select
        v-model="baseSaleAttr"
        :placeholder="`还有${unSelectAttrs.length}项未选择`"
      >
        <el-option
          v-for="attr in unSelectAttrs"
          :key="attr.id"
          :label="attr.name"
          :value="`${attr.id}:${attr.name}`"
        ></el-option>
      </el-select>
      <el-button
        type="primary"
        icon="el-icon-plus"
        :disabled="!baseSaleAttr"
        @click="addSpuSaleAttr()"
      >添加销售属性</el-button>
      <el-table
        border
        stripe
        style="margin: 20px 0"
        :data="spuForm.spuSaleAttrList"
      >
        <el-table-column
          label="序号"
          width="80"
          align="center"
          prop="baseSaleAttrId"
        />
        <el-table-column :label="`属性名称`" width="150" prop="saleAttrName" />
        <el-table-column
          :label="`属性值名称列表`"
          width="col.width"
          prop="spuSaleAttrValueList"
        >
          <template slot-scope="{ row }">
            <el-tag
              v-for="(tag, index) in row.spuSaleAttrValueList"
              :key="tag.id"
              style="margin: 0px 5px"
              closable
              @close="row.spuSaleAttrValueList.splice(index, 1)"
            >
              {{ tag.saleAttrValueName }}
            </el-tag>
            <el-input
              v-if="row.inputVisible"
              ref="saveTagInput"
              v-model="row.inputValue"
              class="input-new-tag"
              size="small"
              placeholder="名称"
              @keyup.enter.native="handleInputConfirm(row)"
              @blur="handleInputConfirm(row)"
            >
            </el-input>
            <el-button
              v-else
              class="button-new-tag"
              size="small"
              @click="showInput(row)"
            >+ 添加</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" prop="id">
          <template slot-scope="{ $index }">
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              title="删除"
              @click="spuForm.spuSaleAttrList.splice($index, 1)"
            >
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="saveSpu">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      spuForm: {
        category3Id: null,
        description: "",
        id: null,
        spuName: "",
        tmId: null,
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "",
          //   imgUrl: "",
          //   spuId: 0
          // }
        ],
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "",
          //       saleAttrName: "",
          //       saleAttrValueName: "",
          //       spuId: 0
          //     }
          //   ]
          // }
        ],
      },
      baseSaleAttr: null,
      tradeMarks: [],
      baseSaleAttrlist: [],
      spuImageList: [],
      dialogImageUrl: "",
      dialogVisible: false,
    };
  },
  computed: {
    unSelectAttrs() {
      return this.baseSaleAttrlist.filter((item) =>
        this.spuForm.spuSaleAttrList.every(
          (attr) => attr.saleAttrName !== item.name
        )
      );
    },
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.spuImageList = fileList;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleAvatarSuccess(res, file, fileList) {
      console.log(res, file, fileList);
      const arr = res.data.split("/");
      this.spuImageList.push({
        url: res.data,
        name: arr[arr.length - 1],
        spuId: this.spuForm.id,
        id: null,
      });
    },
    async initUpdateFormData(row) {
      try {
        // 获取spu信息
        this.spuForm = (await this.$API.spu.reqSpu(row.id)).data;
        this.spuForm.spuSaleAttrList.forEach((item) => {
          this.$set(item, "inputVisible", false);
          this.$set(item, "inputValue", "");
        });
        // 获取spu图片
        this.spuImageList = (
          await this.$API.spu.reqSpuImageList(row.id)
        ).data.map((item) => ({
          ...item,
          url: item.imgUrl,
          name: item.imgName,
        }));

        // 获取品牌信息
        this.tradeMarks = (await this.$API.tradeMarks.getTrademarkList()).data;
        // 获取基础销售属性信息
        this.baseSaleAttrlist = (
          await this.$API.spu.reqBaseSaleAttrList()
        ).data;
      } catch (error) {
        console.log(error);
        this.$message({
          type: "error",
          message: "请求错误",
        });
      }
    },
    async initAddFormData(id) {
      try {
        this.spuForm.category3Id = id
        // 获取品牌信息
        this.tradeMarks = (await this.$API.tradeMarks.getTrademarkList()).data;
        // 获取基础销售属性信息
        this.baseSaleAttrlist = (
          await this.$API.spu.reqBaseSaleAttrList()
        ).data;
      } catch (error) {
        console.log(error);
        this.$message({
          type: "error",
          message: "请求错误",
        });
      }
    },
    addSpuSaleAttr() {
      const [baseSaleAttrId, saleAttrName] = this.baseSaleAttr.split(':');
      this.spuForm.spuSaleAttrList.push({
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
        inputVisible: false,
        inputValue: "",
      });
      this.baseSaleAttr = null;
    },
    cancel() {
      this.$emit("update:spuVisible", false);
      this.resetData();
    },
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.focus();
      });
    },
    handleInputConfirm(row) {
      // 当输入框不可见时直接返回
      if (!row.inputVisible) return;
      const { baseSaleAttrId, saleAttrName, inputValue: saleAttrValueName } = row;
      if (
        saleAttrValueName.trim() &&
        !row.spuSaleAttrValueList.find(
          (item) => item.saleAttrValueName === saleAttrValueName
        )
      ) {
        row.spuSaleAttrValueList.push({
          saleAttrName,
          baseSaleAttrId,
          saleAttrValueName,
        });
        row.inputVisible = false;
        row.inputValue = "";
      } else {
        this.$message.info("属性值不能为空或重复!");
      }
    },
    async saveSpu() {
      const { spuForm, spuImageList } = this;
      spuForm.spuImageList = spuImageList.map((item) => {
        const { name: imgName, url: imgUrl, spuId, id } = item;
        return {
          imgName,
          imgUrl,
          spuId,
          id,
        };
      });
      try {
        await this.$API.spu.reqAddOrUpdateSpu(spuForm);
        this.$message.success("保存成功!");
        this.$emit("update:spuVisible", false);
        this.$emit("successBack");
        this.resetData();
      } catch (error) {
        this.$message.error("保存失败!");
      }
    },
    resetData() {
      this.spuForm = {
        category3Id: null,
        description: "",
        id: null,
        spuName: "",
        tmId: null,
        spuImageList: [],
        spuSaleAttrList: [],
      };
      this.baseSaleAttr = null;
      this.tradeMarks = [];
      this.baseSaleAttrlist = [];
      this.spuImageList = [];
      this.dialogImageUrl = "";
      this.dialogVisible = false;
    },
  },
};
</script>
<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
