import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "../store";

Vue.use(VueRouter)

import Layout from '@/layout/index'

const routes = [{
	path: '/',
	name: 'layout',
	component: Layout,
	redirect: '/index',
	children: [{
			path: 'index',
			component: () => import('@/views/index/index'),
			meta: {
				title: 'index'
			}
		},
		{
			path: 'challenges',
			component: () => import('@/views/challenges/index'),
			meta: {
				title: 'challenges'
			}
		},
		{
			path: 'scoreCard',
			component: () => import('@/views/scoreCard/index'),
			meta: {
				title: 'scoreCard'
			}
		},
		{
			path: 'about',
			component: () => import('@/views/about/index'),
			meta: {
				title: 'about'
			}
		},
		{
			path: 're-lo',
			name: 'Re-lo',
			component: () => import('@/views/re-lo/index'),
		},
		{
			path: 'userInfo',
			component: () => import('@/views/userInfo/index'),
			// props: (route) => ({ query: route.query.uid }),
			meta: {
				title: 'userInfo'
			}
			
		}
	]

}]

const router = new VueRouter({
	mode: 'history',
	routes
})

router.beforeEach((to,from,next)=>{
	//如果没有登录则不能访问其他页面
	let islogin = store.state.Userinfo.loginflag !== 0;
	if(to.path === '/re-lo') {
		next()
	}
	else if(to.path === '/challenges' && !islogin) {
		next({path: '/re-lo'})
	}
	else if(to.path === '/scoreCard' && !islogin) {
		next({path: '/re-lo'})
	}
	else if(to.path === '/about' && !islogin) {
		next({path: '/re-lo'})
	}
	else if(to.path === '/relationextraction' && !islogin) {
		next({path: '/re-lo'})
	}
	else {
		next()
	}
})

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}
export default router
