<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="addMark">添加</el-button>

    <el-dialog title="添加品牌" :visible.sync="dialogFormVisible">
      <el-form ref="tmForm" :model="tmForm" style="width:80%" :rules="rules">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdate('tmForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-table border stripe style="margin: 20px 0" :data="tradeMarks">
      <el-table-column label="序号" width="80" align="center" type="index" />
      <el-table-column label="品牌名称" width="col.width" prop="tmName" />
      <el-table-column label="品牌图标" width="col.width">
        <template slot-scope="{ row }">
          <img style="width: 80px; height: 60px" :src="row.logoUrl" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="col.width" prop="id">
        <template slot-scope="{ row }">
          <el-button
            type="warning"
            size="mini"
            icon="el-icon-edit"
            @click="updateMark(row)"
          >
            修改
          </el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="deleteMark(row.id)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="text-align: center"
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="limit"
      :current-page="page"
      @current-change="getTradeMarks"
    />

  </div>
</template>

<script>
export default {
  name: "Trademark",
  data() {
    return {
      page: 1,
      total: 0,
      limit: 3,
      tradeMarks: [],
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      dialogFormVisible: false,
      formLabelWidth: '100',
      rules: {
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { min: 2, max: 7, message: '长度在 2 到 7 个字符', trigger: 'change' }
        ],
        logoUrl: [
          { required: true, message: '请上传品牌LOGO', trigger: 'change' }
        ],
      }

    };
  },
  mounted() {
    this.getTradeMarks();
  },
  methods: {
    async getTradeMarks(page = 1) {
      this.page = page;
      const { limit } = this;
      const result = await this.$API.tradeMarks.getPageList(page, limit);
      console.log(result);
      const { code, data: { records, total }} = result
      if (code === 200) {
        this.tradeMarks = records;
        this.total = total;
      }
    },
    deleteMark(id) {
      this.$confirm("此操作将永久删除该品牌, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async() => {
          const result = await this.$API.tradeMarks.deleteMark(id);
          if (result.code === 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            const num = Math.ceil((this.total - 1) / this.limit);
            const page = this.page >= num ? num : this.page;
            this.getTradeMarks(page)
          } else {
            this.$message({
              type: "info",
              message: "删除失败",
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
    updateMark(data) {
      this.dialogFormVisible = true
      this.tmForm = {
        ...data
      }
    },
    addMark() {
      this.dialogFormVisible = true
      this.tmForm = {
        tmName: "",
        logoUrl: "",
      }
    },
    addOrUpdate(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          this.dialogFormVisible = false
          try {
            const result = await this.$API.tradeMarks.addOrUpdate(this.tmForm);
            if (result.code === 200) {
              this.$message({
                type: "success",
                message: `${this.tmForm.id ? '修改' : '添加'}成功!`,
              });
              if (!this.tmForm.id) {
                console.log();
                const num = Math.ceil((this.total + 1) / this.limit);
                this.getTradeMarks(num);
                this.page = num;
              } else {
                this.getTradeMarks(this.page);
              }
            } else {
              this.$message({
                type: "info",
                message: "添加失败",
              });
            }
          } catch (error) {
            this.$message({
              type: "info",
              message: "请求错误",
            });
          }
        } else {
          return false;
        }
      });
    },
    handleAvatarSuccess(res) {
      console.log(res);
      this.tmForm.logoUrl = res.data;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    }
  },
};
</script>

<style scope>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
