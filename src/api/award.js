import http from '@/utils/request'

//获取奖项列表
export async function getAwardsListApi(parm){
    return await http.get("/api/awards/List",parm)
}
//外界获取奖项列表
export async function getShowListApi(parm){
    return await http.get("/api/awards/awardsList",parm)
}
//增加奖项
export async function addAwardsApi(parm){
    //return await http.get("/api/expense",parm)  //错误的
    return await http.post("/api/awards",parm)
}
//编辑奖项
export async function editAwardsApi(parm){
    //return await http.get("/api/expense",parm)  错误的
    return await http.put("/api/awards",parm)
}
//删除奖项
export async function deleteAwardsApi(parm){
    return await http.delete("/api/awards",parm)
}
