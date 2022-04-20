export default {
    namespaced: true,
    actions: {
        setloginFlag(state, value) {
            localStorage.setItem('loginflag', value);

            state.commit('SET_LOGINFLAG', value);
        }
    },
    mutations: {
        SET_LOGINFLAG(state, value) {
            state.loginflag = value;
        }
    },
    state: {
        loginflag: Number.parseInt(localStorage.getItem('loginflag')) || 0   ////////登录状态值
        // loginflag:0
    },
    getters: {

    }
}
