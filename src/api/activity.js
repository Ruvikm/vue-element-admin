import http from '@/utils/request'
//获取活动列表
export async function getActListApi(parm){
    return await http.get("/api/activity/list",parm)
}

//获取审批列表
export async function getActProveListApi(parm){
    return await http.get("/api/activity/proveList",parm)
}

//添加活动
export async function addActivityApi(parm){
    return await http.post("/api/activity",parm)
}

//编辑活动
export async function editActivityApi(parm){
    return await http.put("/api/activity",parm)
}

//获取选项活动列表
export async function getActChoiceListApi(parm){
    return await http.get("/api/activity/ActChoiceList",parm)
}