import { login, logout, getInfo } from "@/api/user";
import { getToken, setToken, removeToken, setTokenTime } from "@/utils/auth";
import router, { resetRouter } from "@/router";

const state = {
  token: getToken(),
  name: "",
  avatar: "",
  introduction: "",
  roles: [],
  userId: "",
  deptId: "",
  isAdmin: "",
  roleName:"",
  username:"",
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_USERNAME: (state, username) => {
    state.username = username;
  },
  SET_USERUID: (state, userId) => {
    state.userId = userId;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  },
  SET_DEPTID: (state, deptId) => {
    state.deptId = deptId;
  },
  SET_ISADMIN: (state, isAdmin) => {
    state.isAdmin = isAdmin;
  },
  SET_ROLENAME: (state, roleName) => {
    state.roleName = roleName;
  }
};

const actions = {
  // user login  用户登录
  login({ commit }, userInfo) {
    //解构出用户名和密码
    const { username, password, code } = userInfo;
    return new Promise((resolve, reject) => {
      //调用api/user里面的login方法
      login({ username: username.trim(), password: password, code: code })
        .then(response => {
          // console.log(response)
          const { token, expireTime } = response;
          //把后端返回的token存到vuex中
          commit("SET_TOKEN", token);
          commit("SET_USERNAME", username);
          //把后端返回的token存到cookies里面
          setToken(token);
          //设置token过期时间
          setTokenTime(expireTime);
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      //调用api/user里面的getInfo方法获取用户信息和权限信息
      getInfo(state.token)
        .then(response => {
          // console.log(response)
          const { data } = response;

          if (!data) {
            reject("Verification failed, please Login again.");
          }

          const {
            username,
            roles,
            name,
            avatar,
            introduction,
            id,
            deptId,
            isAdmin,
            roleName
          } = data;

          // roles must be a non-empty array

          //roles必须是一个数组
          if (!roles || roles.length <= 0) {
            reject("getInfo: roles must be a non-null array!");
          }
          //把权限字段放到sessionStorage里面
          sessionStorage.setItem("codeList", JSON.stringify(roles));
          //把roles存到store里面
          commit("SET_ROLES", roles);
          let userImg =
            "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif";
          commit("SET_USERUID", id);
          commit("SET_USERNAME", username);
          commit("SET_NAME", name);
          commit("SET_AVATAR", userImg);
          commit("SET_INTRODUCTION", introduction);
          commit("SET_DEPTID", deptId);
          commit("SET_ISADMIN", isAdmin);
          commit("SET_ROLENAME", roleName);
          // console.log(state)
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          commit("SET_TOKEN", "");
          commit("SET_ROLES", []);
          removeToken();
          resetRouter();

          // reset visited views and cached views
          // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
          dispatch("tagsView/delAllViews", null, { root: true });

          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit("SET_TOKEN", "");
      commit("SET_ROLES", []);
      removeToken();
      resolve();
    });
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + "-token";

    commit("SET_TOKEN", token);
    setToken(token);

    const { roles } = await dispatch("getInfo");

    resetRouter();

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch("permission/generateRoutes", roles, {
      root: true
    });
    // dynamically add accessible routes
    router.addRoutes(accessRoutes);

    // reset visited views and cached views
    dispatch("tagsView/delAllViews", null, { root: true });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
