import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, getTokenTime, setTokenTime, removeTokenTime, setToken,clearStorage } from '@/utils/auth'
import { refreshTokenApi } from '@/api/user'
import qs from 'qs'
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})
//刷新token
function reFresh() {
  let parm = {
    "token": getToken()
  }
  return refreshTokenApi(parm).then(res => res)
}
// request interceptor
//发送请求之前的拦截器
let isRefresh = false;
service.interceptors.request.use(
  config => {
    //获取当前系统时间
    let curent = new Date().getTime();
    //获取token过期时间
    let expireTime = getTokenTime();
    if (expireTime > 0) {
      let minMx = (expireTime - curent) / 1000 / 60;
      //如果token离过期差10分钟，刷新token
      if (minMx < 10) {
        if (!isRefresh) {
          isRefresh = true;
          return reFresh().then(res => {
            if (res.code == 200) {
              //设置新的token和时间
              setToken(res.data.token)
              setTokenTime(res.data.expireTime);
              //把新的token添加到头部
              config.headers.token = getToken();
            }
            return config;
          }).catch(res => {
            console.log(res)
          }).finally(() => {
            isRefresh = false;
          })
        }
      }
    }
    // do something before request is sent
    //从store里面获取token，如果token存在，
    //把token添加到请求的头部Headers里面
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      //把token添加到请求的头部
      config.headers['token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
//请求返回之后的拦截器
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    console.log(response)
    console.log(res)
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      //验证码处理：返回的是arraybuffer,需要转车base64
      //1.把arraybuffer转换成二进制字符
      //2.把二进制字符转换为base64 (btoa方法)字符给img使用
      let indexs = response.config.responseType;
      if (indexs == 'arraybuffer') {
        return Promise.resolve(
          "data:image/png;base64," +
          btoa(
            new Uint8Array(res).reduce(
              (data, byte) => data + String.fromCharCode(byte), ""
            )
          )
        )
      }
      Message({
        message: res.msg || '服务器出错',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 600 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('用户登录信息过期，请重新登录！', '系统提示', {
          confirmButtonText: '登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            clearStorage();
            removeTokenTime();
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.msg || '服务器出错'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.msg || '服务器出错',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

//请求方法
const http = {
  post(url, params) {
    return service.post(url, params, {
      transformRequest: [(params) => {
        return JSON.stringify(params)
      }],
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  put(url, params) {
    return service.put(url, params, {
      transformRequest: [(params) => {
        return JSON.stringify(params)
      }],
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //parm =>  {id:10}
  // http://localhost:8089/api/user?id=10
  get(url, params) {
    return service.get(url, {
      params: params,
      paramsSerializer: (params) => {
        return qs.stringify(params)
      }
    })
  },
  //parm =>  {id:10}
  // http://localhost:8089/api/user/10
  getRestApi(url, params) {
    let _params
    if (Object.is(params, undefined || null)) {
      _params = ''
    } else {
      _params = '/'
      for (const key in params) {
        console.log(key)
        console.log(params[key])
        // eslint-disable-next-line no-prototype-builtins
        if (params.hasOwnProperty(key) && params[key] !== null && params[key] !== '') {
          _params += `${params[key]}/`
        }
      }
      //去掉参数最后一位?
      _params = _params.substr(0, _params.length - 1)
    }
    console.log(_params)
    if (_params) {
      return service.get(`${url}${_params}`)
    } else {
      return service.get(url)
    }
  },
  //parm =>  {id:10}
  // http://localhost:8089/api/user/10
  delete(url, params) {
    let _params
    if (Object.is(params, undefined || null)) {
      _params = ''
    } else {
      _params = '/'
      for (const key in params) {
        // eslint-disable-next-line no-prototype-builtins
        if (params.hasOwnProperty(key) && params[key] !== null && params[key] !== '') {
          _params += `${params[key]}/`
        }
      }
      //去掉参数最后一位?
      _params = _params.substr(0, _params.length - 1)
    }
    if (_params) {
      return service.delete(`${url}${_params}`).catch(err => {
        message.error(err.msg)
        return Promise.reject(err)
      })
    } else {
      return service.delete(url).catch(err => {
        message.error(err.msg)
        return Promise.reject(err)
      })
    }
  },
  upload(url, params) {
    return service.post(url, params, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  login(url, params) {
    return service.post(url, params, {
      transformRequest: [(params) => {
        return qs.stringify(params)
      }],
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  },
  getImage(url) {
    return service.post(url, null, {
      responseType: 'arraybuffer'
    })
  }
}
export default http
