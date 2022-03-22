import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const timeKey = 'expireTime';
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
//清空sessionStorage数据
export function clearStorage(){
  return sessionStorage.clear();
}
//设置token过期时间
export function setTokenTime(time){
  return sessionStorage.setItem(timeKey,time)
}
//清空token过期时间
export function removeTokenTime(){
  return sessionStorage.setItem(timeKey,0);
}
//获取token时间
export function getTokenTime(){
  return sessionStorage.getItem(timeKey)
}