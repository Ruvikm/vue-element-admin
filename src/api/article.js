import http from '@/utils/request'
//获取文章列表
export async function getArticleListApi(parm){
    return await http.get("/api/article/articleList",parm)
}

//获取类型列表
export async function getTypeListApi(parm){
    return await http.get("/api/article/articleTypeList",parm)
}

//新增文章
export async function addArticleApi(parm){
    return await http.post("/api/article",parm)
}

//获取当前文章
export async function fetchArticle(parm){
    return await http.getRestApi("/api/article/getArticleById",parm)
}

