import http from '@/utils/request'
//获取活动列表
export async function getArticleListApi(parm){
    return await http.get("/api/article/articleList",parm)
}