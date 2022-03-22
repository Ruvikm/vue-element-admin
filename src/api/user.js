import http from '@/utils/request'

//登录
export async function login(parms){
  return await http.login("/api/user/login",parms);
}
//获取用户信息和权限信息
export async function getInfo(){
  return await http.get("/api/sysUser/getInfo")
}
export async function getMenuList(){
  return await http.get("/api/sysUser/getMenuList")
}
//获取用户列表
export async function getUserListApi(parm){
  return await http.getRestApi("/api/user/list",parm)
}
//新增用户
export async function addUserApi(parm){
  return await http.post("/api/user",parm)
}
//编辑用户
export async function editUserApi(parm){
  return await http.put("/api/user",parm)
}
//删除用户
export async function deleteUserApi(parm){
  return await http.delete("/api/user",parm)
}
//获取分配角色列表
export async function assignRoleListApi(parm){
  return await http.get("/api/user/getRolistForAssign",parm)
}
//获取用户的角色id
export async function getRoleIdByUserIdApi(parm){
  return await http.getRestApi("/api/user/getRoleIdByUserId",parm)
}
//分配角色保存
export async function assignRoleSaveApi(parm){
  return await http.post("/api/user/assingRole",parm)
}
//获取验证码
export async function getImageApi(){
  return await http.getImage("/api/sysUser/image")
}
//退出登录
export async function loginOutApi(parm){
  return await http.post("/api/sysUser/loginOut",parm)
}
//数据库还原
export async function restoreApi(){
  return await http.post("/api/backup/restore",null)
}
//刷新token
export async function refreshTokenApi(parm){
  return await http.post("/api/sysUser/refreshToken",parm)
}
