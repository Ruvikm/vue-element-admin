import http from '@/utils/request'

//获取物品列表
export async function getThingsListApi(parm){
    return await http.get("/api/things/List",parm)
}
//外界获取物品列表
export async function getShowListApi(parm){
    return await http.get("/api/things/ThingsList",parm)
}
//增加物品
export async function addThingsApi(parm){
    //return await http.get("/api/expense",parm)  //错误的
    return await http.post("/api/things",parm)
}
//编辑物品
export async function editThingsApi(parm){
    //return await http.get("/api/expense",parm)  错误的
    return await http.put("/api/things",parm)
}
//删除物品
export async function deleteThingsApi(parm){
    return await http.delete("/api/things",parm)
}
