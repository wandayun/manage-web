import axios from 'axios'
import { Message } from 'element-ui'
import { getUUID } from './util'

const { protocol } = location
// host对环境的map
let hostEnvMap = {
  'brtest.staff.xdf.cn': 'test',
  'dataservice.xdf.cn': 'uat',
  'br.xdf.cn': 'online'
};

// 环境对配置的map
let envSettingMap = {
  // 测试环境
  'test': {
    VUE_APP_BACKEND_API_PREFIX: 'http://10.202.80.156:8066',
    VUE_APP_SSO_LOGIN: 'http://teste2.staff.xdf.cn/index.aspx',
    VUE_APP_SSO_LOGINED_CALLBACK: 'http://brtest.staff.xdf.cn/br-base-rest/login/loginCallBack',
    VUE_APP_SSO_CLIENT_ID: 9830,
    VUE_APP_SSO_LOGOUT_URL: 'http://teste2.staff.xdf.cn/Logout.aspx'
  },
  // 灰度环境
  'uat': {
    VUE_APP_BACKEND_API_PREFIX: 'http://dataservice.xdf.cn/xdf-report',
    VUE_APP_SSO_LOGIN: 'https://passport.xdf.cn/e2/index.aspx',
    VUE_APP_SSO_LOGINED_CALLBACK: 'http://dataservice.xdf.cn/br-base-rest/login/loginCallBack',
    VUE_APP_SSO_CLIENT_ID: 402,
    VUE_APP_SSO_LOGOUT_URL: 'https://passport.xdf.cn/e2/Logout.aspx'
  },
  // 生产环境
  'online': {
    VUE_APP_BACKEND_API_PREFIX: `${protocol}//br.xdf.cn/xdf-report`,
    VUE_APP_SSO_LOGIN: `${protocol}//passport.xdf.cn/e2/index.aspx`,
    VUE_APP_SSO_LOGINED_CALLBACK: `${protocol}//br.xdf.cn/br-base-rest/login/loginCallBack`,
    VUE_APP_SSO_CLIENT_ID: 9727,
    VUE_APP_SSO_LOGOUT_URL: `${protocol}https://passport.xdf.cn/e2/Logout.aspx`
  }
};

// 按照host决定环境和配置
let ENV = hostEnvMap[location.host];
let SETTING;
if (ENV) {
  SETTING = envSettingMap[ENV];
}
// 其他情况，使用测试环境的配置
else {
  SETTING = envSettingMap['test'];
}


// create an axios instance
let conf = {
  baseURL: SETTING.VUE_APP_BACKEND_API_PREFIX, // url = base url + request url
  timeout: 900000, // request timeout
  withCredentials: true,
  headers: {
    // 'Access-Control-Allow-Origin': '*'
  }
};

// 本地手动设置userToken，登录后从接口中寻找关键字userToken
if (!ENV) {
  console.log('ENV:', ENV, ' MODE -> LOCAL')
  conf.params = {'userToken': '6d0f94aca3bebf0372f8d15fed0d5e76b6c3a4db257e943c0bfa28f679b8bda7b519e065779982c6448538b5e03064eded4defea6c7b53457585eaceef4bfd315e4c47a839860d04326c97722a6c1181774b45f43374977c658aef1a4dd0df253c521aa0263200e382b67dda8301934e1c0a3a9fe1214e9763cfe2565ce6533b30732c033c97c3344c98be9674c4d1ce0df2e1dca1f485ba30e413ae402458649d111ab4c64b10fc5cd89c35a8931e39d138e2fb310cc7167def507653d7f4315d32b9d0c5fa05da97b17acb4afb3ff3653228e01f67ef4c1eddace0730ffb70bbce68eab67ae85561ab5fbdbc54e986cf172771e08a408e34bbacfb74c290236e95789f69de3a8c'};
}
else {
  if (sessionStorage.getItem('userToken')) {
    conf.params = {'userToken': sessionStorage.getItem('userToken')};
  }
}
const service = axios.create(conf);

// request interceptor
service.interceptors.request.use(
  config => config,
  error => {
    // do something with request error
    // console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code.
   */
  (resp) => {
    /* let res = data
    const { DATA, SUCCESS, MESSAGE } = data
    if (SUCCESS !== undefined) {
      res = DATA
      !SUCCESS && Message.error(MESSAGE)
    } */
    // console.log('code', resp.data.code)

    // 如果userToken不可用，返回401
    if (resp.data.code === 401) {
      console.log('User token 401');
      // const local = encodeURIComponent(location.href);
      const backEnd = encodeURIComponent(SETTING.VUE_APP_SSO_LOGINED_CALLBACK);
      location.href = `${SETTING.VUE_APP_SSO_LOGIN}?client_id=${SETTING.VUE_APP_SSO_CLIENT_ID}&response_type=code&redirect_uri=${backEnd}&state=${getUUID()}&scope=login`;
    }

    return resp
  },
  error => {
    // 超时
    if (error.message.includes('timeout')) {
      Message({
        message: '请求超时',
        type: 'error',
        duration: 5000
      })
      return Promise.reject(error)
    }

    // 报错
    let msg = '系统错误'
    const { response } = error
    if (response) {
      const { status, data } = response

      console.log('resp status:', status);

      // 未登录跳转单点登录
      if (status === 401) {
        const local = encodeURIComponent(location.href)
        const backEnd = encodeURIComponent(SETTING.VUE_APP_SSO_LOGINED_CALLBACK)
        location.href = `${SETTING.VUE_APP_SSO_LOGIN}?client_id=${SETTING.VUE_APP_SSO_CLIENT_ID}&response_type=code&redirect_uri=${backEnd}&state=${getUUID()}&scope=login`
      }
      // 登录过期
      if (status === 417) {
        location.href = `${SETTING.VUE_APP_SSO_LOGOUT_URL}?ClientId=${SETTING.VUE_APP_SSO_CLIENT_ID}&ReturnUrl=${encodeURIComponent(location.href)}`
      }
      if (data && data.message) msg = data.message
      if (data && data.error) msg = data.error
    }
    Message({
      message: msg,
      type: 'error',
      duration: 5000
    })
    return Promise.reject(error)
  }
)
export {conf}
export default service
