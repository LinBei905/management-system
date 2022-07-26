<template>
  <div>
    <CategorySelector
      :category="category"
      :is-edit="showEditTable"
      style="margin-bottom: 20px"
      @getList="getList"
      @getAttrs="getAttrs"
    />
    <el-card>
      <div v-show="!showEditTable">
        <!-- 显示表格 -->
        <el-button :disabled="addable" type="primary" icon="el-icon-plus" @click="addOrUpdate(false)">添加属性</el-button>
        <el-table border stripe style="margin: 20px 0" :data="list">
          <el-table-column label="序号" width="80" align="center" prop="id" />
          <el-table-column :label="`属性值名称`" width="150" prop="attrName" />
          <el-table-column
            :label="`属性值列表`"
            width="col.width"
            prop="attrValueList"
          >
            <template slot-scope="{ row }">
              <el-tag v-for="tag in row.attrValueList" :key="tag.id" type="success" style="margin:0px 5px">
                {{ tag.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" prop="id">
            <template slot-scope="{ row }">
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-edit"
                @click="addOrUpdate(row)"
              >
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div v-show="showEditTable">
        <!-- 添加或修改表格 -->
        <el-form ref="form" :model="attrForm" label-width="80px">
          <el-form-item label="属性名">
            <el-input v-model="attrForm.attrName" style="width:200px" placeholder="请输入属性名"></el-input>
          </el-form-item>
        </el-form>
        <el-button :disabled="!attrForm.attrName" type="primary" icon="el-icon-plus" @click="addItem(attrForm)">添加属性值</el-button>
        <el-table border stripe style="margin: 20px 0" :data="attrForm.attrValueList">
          <el-table-column label="序号" width="80" align="center" type="index" />
          <el-table-column
            :label="`属性值名称`"
            width="col.width"
            prop="valueName"
          >
            <template slot-scope="{ row, $index }">
              <p v-show="!row.isEdit" style="margin:0px" @click="toEdit(row, $index)">{{ row.valueName }}</p>
              <el-input
                v-show="row.isEdit"
                :ref="$index"
                v-model="row.valueName"
                :autofocus="true"
                size="mini"
                placeholder="请输入属性名"
                @keyup.enter="leaveEdit(row, $index)"
                @blur="leaveEdit(row, $index)"
              >
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="col.width" prop="id">
            <template slot-scope="{ row, $index }">
              <el-popover
                v-model="row.isDelete"
                placement="bottom"
                width="160"
              >
                <p><i style="color:#E6A23C" class="el-icon-question" /> 确定删除{{ row.valueName }}吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="row.isDelete = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="deleteItem(row, $index)">确定</el-button>
                </div>
                <el-button
                  slot="reference"
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                >
                </el-button>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="saveChange">保存</el-button>
        <el-button @click="cancelChange">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { cloneDeep } from "lodash"
export default {
  name: "Attr",
  data() {
    return {
      category: {
        c1: "",
        c2: "",
        c3: ""
      },
      list: [],
      addable: true,
      attrForm: {
        attrName: "",
        attrValueList: [],
        categoryId: undefined,
        categoryLevel: 3,
        id: undefined
      },
      idForm: {},
      showEditTable: false,
    };
  },
  mounted() {
    this.getList() // 初始化一级目录
  },
  methods: {
    // 获取目录列表
    async getList(Cid = 1, id) {
      if (Cid === 2) {
        this.category = {
          ...this.category,
          c3: ""
        }
      } else if (Cid === 3) {
        this.attrForm.categoryId = id
      }
      try {
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
    async getAttrs(form) {
      this.idForm = form
      try {
        const result = await this.$API.attr.getAttrs(this.idForm);
        if (result.code === 200) {
          this.list = result.data;
          this.addable = false;
        } else {
          this.$message({
            type: "info",
            message: "获取信息失败",
          });
        }
      } catch (error) {
        this.$message({
          type: "error",
          message: "请求错误",
        });
      }
    },
    // 添加或修改属性
    async addOrUpdate(data) {
      this.showEditTable = true;
      if (data) {
        this.attrForm = cloneDeep(data)
        this.attrForm.attrValueList.forEach(item => {
          this.$set(item, 'isEdit', false)
          this.$set(item, 'isDelete', false)
        });
      }
    },
    // 删除属性
    deleteItem(row, index) {
      row.isDelete = false // 使再次确认提示框消失
      this.attrForm.attrValueList.splice(index, 1)
    },
    addItem(attrForm) {
      // 新增属性值
      attrForm.attrValueList.push({
        valueName: "",
        isEdit: true,
        id: undefined,
        attrId: attrForm.id
      })
      // 使新增输入框获得焦点
      this.$nextTick(() => {
        this.$refs[`${attrForm.attrValueList.length - 1}`].focus()
      })
    },
    // 点击编辑,切换成输入框
    toEdit(row, index) {
      row.isEdit = true;
      // 在数据更新后,dom渲染完成变成输入框后,使输入框获得焦点
      this.$nextTick(() => {
        this.$refs[`${index}`].focus()
      })
    },
    // 退出编辑,切换成字段
    leaveEdit(row, index) {
      // 检查新增属性是否与先前属性重复,重复则无法退出编辑状态
      if (this.attrForm.attrValueList.find(item => !item.isEdit & item.valueName === row.valueName) || row.valueName === '') {
        this.$message({
          type: "info",
          message: "请输入有效数据",
        });
        row.isEdit = true;
      } else {
        row.isEdit = false;
      }
    },
    // 保存对属性的修改操作
    async saveChange() {
      // 隐藏属性编辑表格
      this.showEditTable = false;
      try {
        const result = await this.$API.attr.addOrUpdateAttr(this.attrForm);
        if (result.code === 200) {
          this.$message({
            type: "success",
            message: `${this.attrForm.id === undefined ? '添加' : '修改'}属性成功`,
          });
          this.getAttrs(this.idForm)
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
      // 编辑完成后清空状态
      this.attrForm = {
        ...this.attrForm,
        attrName: "",
        attrValueList: [],
        categoryLevel: 3,
        id: undefined
      }
    },
    // 取消对属性的修改操作
    cancelChange() {
      // 隐藏属性编辑表格
      this.showEditTable = false;
      // 编辑完成后清空状态
      this.attrForm = {
        ...this.attrForm,
        attrName: "",
        attrValueList: [],
        categoryLevel: 3,
        id: undefined
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
