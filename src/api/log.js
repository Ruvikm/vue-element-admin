import http from '@/utils/request'
//获取日志列表
export async function getLogListApi(parm){
    return await http.get("/api/sysLog/list",parm)
}