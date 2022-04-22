<template>
  <div class="createPost-container">
    <el-form
      ref="postForm"
      :model="postForm"
      :rules="rules"
      class="form-container"
    >
      <!-- 导航栏 -->
      <sticky :z-index="10" :class-name="'sub-navbar ' + postForm.status">
        <el-button
          v-loading="loading"
          style="margin-left: 10px"
          type="success"
          @click="submitForm"
          v-if="hasPerm('news:edit' || 'news:add')"
        >
          Publish
        </el-button>
      </sticky>
      <!-- 标题 -->
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px" prop="title">
              <MDinput
                v-model="postForm.title"
                :maxlength="100"
                name="name"
                required
              >
                文章题目
              </MDinput>
            </el-form-item>
            <!-- 类型 -->
            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item
                    label-width="75px"
                    label="文章类型:"
                    class="postInfo-container-item"
                  >
                    <el-select
                      v-model="postForm.type"
                      default-first-option
                      @focus="getTypeList"
                      placeholder="请选择文章类别"
                    >
                      <el-option
                        v-for="item in TypeListOptions"
                        :key="item.value"
                        :label="item.artype"
                        :value="item.artype"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <!-- 文章输入框 -->
        <el-form-item prop="content" style="margin-bottom: 30px">
          <Tinymce ref="editor" v-model="postForm.content" :height="400" />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from "@/components/Tinymce";
import MDinput from "@/components/MDinput";
import Sticky from "@/components/Sticky"; // 粘性header组件
import { validURL } from "@/utils/validate";
import {
  addArticleApi,
  getTypeListApi,
  fetchArticle,
  editArticleApi,
} from "@/api/article";
const defaultForm = {
  author: "",
  status: "draft",
  title: "", // 文章题目
  content: "", // 文章内容
  // content_short: "", // 文章摘要
  source_uri: "", // 文章外链
  image_uri: "", // 文章图片
  display_time: undefined, // 前台展示时间
  id: undefined,
  deptId: "",
  // platforms: ["a-platform"],
  // comment_disabled: false,
  // importance: 0,
};

export default {
  name: "ArticleDetail",
  components: { Tinymce, MDinput, Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === "") {
        this.$message({
          message: rule.field + "为必传项",
          type: "error",
        });
        callback(new Error(rule.field + "为必传项"));
      } else {
        callback();
      }
    };
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validURL(value)) {
          callback();
        } else {
          this.$message({
            message: "外链url填写不正确",
            type: "error",
          });
          callback(new Error("外链url填写不正确"));
        }
      } else {
        callback();
      }
    };
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      originData: "", //文本框里的原始数据
      TypeListOptions: [],
      rules: {
        image_uri: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }],
        source_uri: [{ validator: validateSourceUri, trigger: "blur" }],
      },
      tempRoute: {},
    };
  },
  computed: {
    contentShortLength() {
      // return this.postForm.content_short.length;
    },
    displayTime: {
      // set and get is useful when the data
      // returned by the back end api is different from the front end
      // back end return => "2013-06-25 06:59:25"
      // front end need timestamp => 1372114765000
      get() {
        return +new Date(this.postForm.display_time);
      },
      set(val) {
        this.postForm.display_time = new Date(val);
      },
    },
  },
  created() {
    if (this.isEdit) {
      let parms = {
        id: this.$route.params && this.$route.params.id,
      };
      //const articleId = this.$route.query.articleId;
      // console.log(id);
      this.fetchData(parms);
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route);
    this.postForm.author = this.$store.getters.name;
    this.postForm.deptId = this.$store.getters.deptId;
    //this.getUsername();
  },
  methods: {
    async fetchData(id) {
      let article = await fetchArticle(id);
      //console.log(article);
      if (article.data) {
        this.postForm.title = article.data.title;
        this.postForm.type = article.data.type;
        let decoded = this.getDecode(article.data.content);
        console.log(decoded);
        this.originData = decoded;
        this.postForm.content = decoded;
      }
    },
    setTagsViewTitle() {
      const title = "Edit Article";
      const route = Object.assign({}, this.tempRoute, {
        title: `${title}-${this.postForm.id}`,
      });
      this.$store.dispatch("tagsView/updateVisitedView", route);
    },
    setPageTitle() {
      const title = "Edit Article";
      document.title = `${title} - ${this.postForm.id}`;
    },
    submitForm() {
      //console.log(this.postForm);
      if (this.originData == this.postForm.content) {
        //如果没有修改，直接跳回去
        this.$router.push({
          path: "/manageNews",
        });
        return;
      }
      this.$refs.postForm.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          //console.log(this.postForm.content);
          //console.log(this.postForm.author);
          // 将富文本内容专程base64编码，这个用于上传到服务存储到数据库中
          let encoded = this.getEncode64(this.postForm.content);
          // 将富文本的base64编码 转换成原来的格式，这个用于将数据库中的富文本展示在界面上
          //let decoded = Base64.decode(encoded);
          console.log(encoded);
          //console.log(decoded);
          this.postForm.content = encoded;
          let res = null;
          if (!this.isEdit) res = await addArticleApi(this.postForm);
          else {
            this.postForm.id = this.$route.params && this.$route.params.id;
            res = await editArticleApi(this.postForm);
          }
          if (res && res.code == 200) {
            //刷新列表
            //this.getData(this.parms);
            this.$message.success(res.msg);
            this.postForm.status = "published";
            this.loading = false;
            //跳转到文章列表
            this.$router.push({
              path: "/manageNews",
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async getTypeList(query) {
      // searchUser(query).then((response) => {
      //   if (!response.data.items) return;
      //   this.TypeListOptions = response.data.items.map((v) => v.name);
      // });
      let res = await getTypeListApi(this.parms);
      if (res && res.code == 200) {
        //console.log(res.data);
        this.TypeListOptions = res.data;
      }
    },
    //Base64编码
    getEncode64(str) {
      return btoa(
        encodeURIComponent(str).replace(
          /%([0-9A-F]{2})/g,
          function toSolidBytes(match, p1) {
            return String.fromCharCode("0x" + p1);
          }
        )
      );
    },
    //Base64解码
    getDecode(str) {
      return decodeURIComponent(
        atob(str)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea ::v-deep {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
