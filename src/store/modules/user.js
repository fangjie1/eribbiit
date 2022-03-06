// 用户模块
export default {
  namespaced: true,
  state () {
    return {
      // 用户信息
      profile: {
        id: '',
        avatar: '',
        nickname: '',
        account: '',
        mobile: '',
        token: ''
      },
      // 登录后回跳的路径
      redirectUrl: '/'
    }
  },
  mutations: {
    // 修改用户信息
    setUser (state, payload) {
      state.profile = payload
    },
    setRedirectUrl (state, url) {
      state.redirectUrl = url
    }
  }
}
