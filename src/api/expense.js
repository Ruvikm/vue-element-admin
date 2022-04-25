import http from '@/utils/request'

//获取支出列表
export async function getExListApi(parm){
    return await http.get("/api/expense/expenseList",parm)
}

//外界获取支出列表
export async function getExpenseListApi(parm){
    return await http.get("/api/expense/exList",parm)
}
//增加支出
export async function addExListApi(parm){
    //return await http.get("/api/expense",parm)  //错误的
    return await http.post("/api/expense",parm)
}
//编辑支出
export async function editExListApi(parm){
    //return await http.get("/api/expense",parm)  错误的
    return await http.put("/api/expense",parm)
}
//删除支出
export async function deleteExListApi(parm){
    return await http.delete("/api/expense",parm)
}

//获取支出类型
export async function getExChoiceListApi(parm){
    return await http.get("/api/expense/exChoiceList",parm)
}