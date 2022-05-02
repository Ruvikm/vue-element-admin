import http from "@/utils/request";
//获取文章列表
export async function getArticleListApi(parm) {
  return await http.get("/api/article/articleList", parm);
}

//获取类型列表
export async function getTypeListApi(parm) {
  return await http.get("/api/article/articleTypeList", parm);
}

//新增文章
export async function addArticleApi(parm) {
  return await http.post("/api/article", parm);
}

//编辑文章
export async function editArticleApi(parm) {
  return await http.put("/api/article", parm);
}

//获取当前文章
export async function fetchArticle(parm) {
  return await http.getRestApi("/api/article/getArticleById", parm);
}

//删除文章
export async function deleteArticleApi(parm) {
  return await http.delete("/api/article", parm);
}

//上传图片
export async function uploadPicApi(parm) {
  return await http.post("/api/article/UploadPic", parm);
}

//获取待归还数量
export async function GetArticleNumApi(parm) {
  return await http.get("/api/article/articleNum", parm);
}
