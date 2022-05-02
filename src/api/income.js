import http from '@/utils/request'

//获取支出列表
export async function getInListApi(parm){
    return await http.get("/api/income/incomeList",parm)
}
//增加支出
export async function addInListApi(parm){
    //return await http.get("/api/expense",parm)  //错误的
    return await http.post("/api/income",parm)
}
//编辑支出
export async function editInListApi(parm){
    //return await http.get("/api/expense",parm)  错误的
    return await http.put("/api/income",parm)
}
//删除支出
export async function deleteInListApi(parm){
    return await http.delete("/api/income",parm)
}

//获取支出类型
export async function getInChoiceListApi(parm){
    return await http.get("/api/income/inChoiceList",parm)
}

//获取近一个月收入
export async function getIncomeSumApi(parm){
    return await http.get("/api/income/SumIncome",parm)
}