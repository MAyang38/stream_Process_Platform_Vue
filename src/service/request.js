import axios from "axios";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// const winurl = "http://10.11.2.207:";
const wulianwangurl = "http://localhost:";
// const wulianwangurl = "http://10.100.32.59:";
// const wulianwangurl="http:///10.6.104.93:";
//const xiaoma="http://192.168.0.105:";
// const xiaoma="http://localhost:";
const connecturl = wulianwangurl;
// const connecturl = xiaoma;
var axiosins_one = axios.create({
    baseURL: connecturl+"5000",
    timeout: "20000"
})
axiosins_one.interceptors.request.use(config => {
    NProgress.start()
    return config
}, err => {
    NProgress.done()
    return Promise.reject(err)
})
axiosins_one.interceptors.response.use(res => {
    NProgress.done()
    return res
}, err => {
    NProgress.done()
    return Promise.reject(err)
})
let get = async function (url, params) {
    let {data} = await axiosins_one.get(url,{params})
    return data
};
let post = async function (url, params, config) {
    let {data} = await axiosins_one.post(url, params, config)
    return data
};
var axiosins_two = axios.create({
    baseURL: connecturl+"5010",
    timeout: "20000"
})
axiosins_two.interceptors.request.use(config => {
    NProgress.start()
    return config
}, err => {
    NProgress.done()
    return Promise.reject(err)
})
axiosins_two.interceptors.response.use(res => {
    NProgress.done()
    return res
}, err => {
    NProgress.done()
    return Promise.reject(err)
})
let gettwo = async function (url, params) {
    let {data} = await axiosins_two.get(url,{params})
    return data
};
let posttwo = async function (url, params, config) {
    let {data} = await axiosins_two.post(url, params, config)
    return data
};
var axiosins_three = axios.create({
    baseURL: connecturl+"5012",
    timeout: "20000"
})
axiosins_three.interceptors.request.use(config => {
    NProgress.start()
    return config
}, err => {
    NProgress.done()
    return Promise.reject(err)
})
axiosins_three.interceptors.response.use(res => {
    NProgress.done()
    return res
}, err => {
    NProgress.done()
    return Promise.reject(err)
})
let getthree = async function (url, params) {
    let {data} = await axiosins_three.get(url,{params})
    return data
};
let postthree = async function (url, params, config) {
    let {data} = await axiosins_three.post(url, params, config)
    return data
};
var axiosins_four = axios.create({
    baseURL: connecturl+"5011",
    timeout: "20000"
})
axiosins_four.interceptors.request.use(config => {
    NProgress.start()
    return config
}, err => {
    NProgress.done()
    return Promise.reject(err)
})
axiosins_four.interceptors.response.use(res => {
    NProgress.done()
    return res
}, err => {
    NProgress.done()
    return Promise.reject(err)
})
let getfour = async function (url, params) {
    let {data} = await axiosins_four.get(url,{params})
    return data
};
let postfour = async function (url, params, config) {
    let {data} = await axiosins_four.post(url, params, config)
    return data
};
//关系抽取部分
// eslint-disable-next-line no-unused-vars
var axiosins_five = axios.create({
    baseURL: connecturl+"5014",
    timeout: "40000"
})
axiosins_five.interceptors.request.use(config => {
    NProgress.start()
    return config
}, err => {
    NProgress.done()
    return Promise.reject(err)
})
axiosins_five.interceptors.response.use(res => {
    NProgress.done()
    return res
}, err => {
    NProgress.done()
    return Promise.reject(err)
})
let getfive = async function (url, params) {
    let {data} = await axiosins_five.get(url,{params})
    return data
};
let postfive = async function (url, params, config) {
    let {data} = await axiosins_five.post(url, params, config)
    return data
};
export {
    get,
    post,
    gettwo,
    posttwo,
    getthree,
    postthree,
    getfour,
    postfour,
    getfive,
    postfive
}
