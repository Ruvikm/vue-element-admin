import http from '@/utils/request'

//获取会议列表
export async function getMeetingListApi(parm){
    return await http.get("/api/meeting/getMeetingList",parm)
}

//增加会议
export async function addMeetingApi(parm){
    //return await http.get("/api/expense",parm)  //错误的
    return await http.post("/api/meeting",parm)
}
//编辑会议
export async function editMeetingApi(parm){
    //return await http.get("/api/expense",parm)  错误的
    return await http.put("/api/meeting",parm)
}
//删除会议
export async function deleteMeetingApi(parm){
    return await http.delete("/api/meeting",parm)
}
