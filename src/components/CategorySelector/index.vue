<template>
  <el-card>
    <el-form :inline="true" :model="form" class="demo-form-inline" :disabled="isEdit">
      <el-form-item label="一级分类">
        <el-select
          v-model="form.id1"
          placeholder="一级目录"
          @change="firstId"
        >
          <el-option
            v-for="item in category.c1"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          v-model="form.id2"
          placeholder="二级目录"
          @change="secondId"
        >
          <el-option
            v-for="item in category.c2"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="form.id3" placeholder="三级目录" @change="thirdId">
          <el-option
            v-for="item in category.c3"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: "CategorySelector",
  props: {
    category: {
      type: Object,
      default: () => {
        return {};
      },
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        id1: "",
        id2: "",
        id3: "",
      }
    };
  },
  methods: {
    firstId(value) {
      this.form.id1 = value;
      this.form.id2 = "";
      this.form.id3 = "";
      this.$emit("getList", 2, value);
    },
    secondId(value) {
      this.form.id2 = value;
      this.form.id3 = "";
      this.$emit("getList", 3, this.form.id2);
    },
    thirdId(value) {
      this.form.id3 = value;
      this.$emit("getAttrs", this.form);
    },
  },
};
</script>

<style scoped>
</style>
