import http from '@/utils/request'
//获取部门列表
export async function getDeptListApi(parm){
    return await http.get("/api/department/list",parm)
}
//获取上级部门树数据
export async function getParentTreeApi(parm){
    return await http.get("/api/department/parent",parm)
}
//获取部门名称
export async function getDepNameApi(parm){
    return await http.get("/api/department/getDepName",parm)
}
//新增部门保存
export async function addDeptSaveApi(parm){
    return await http.post("/api/department",parm)
}
//删除部门
export async function deleteDeptApi(parm){
    return await http.delete("/api/department",parm)
}
//编辑部门
export async function editDeptSaveApi(parm){
    return await http.put("/api/department",parm)
}
