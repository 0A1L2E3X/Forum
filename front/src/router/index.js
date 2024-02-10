import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 解决导航栏或者底部导航tabBar中的vue-router在3.0版本以上频繁点击菜单报错的问题。
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/',
    name: 'Manager',
    component: () => import('../views/Manager.vue'),
    redirect: '/home',  // 重定向到主页
    children: [
      { path: '403', name: 'NoAuth', meta: { name: 'Not authorized' },
        component: () => import('../views/manager/403') },
      { path: 'home', name: 'Home', meta: { name: 'Home' },
        component: () => import('../views/manager/Home') },
      { path: 'admin', name: 'Admin', meta: { name: 'Admin Info' },
        component: () => import('../views/manager/Admin') },
      { path: 'adminPerson', name: 'AdminPerson', meta: { name: 'Personal Info' },
        component: () => import('../views/manager/AdminPerson') },
      { path: 'password', name: 'Password', meta: { name: 'Change Password' },
        component: () => import('../views/manager/Password') },
      { path: 'notice', name: 'Notice', meta: { name: 'Announcement' },
        component: () => import('../views/manager/Notice') },
      { path: 'user', name: 'User', meta: { name: 'User info' },
        component: () => import('../views/manager/User.vue') },
      { path: 'category', name: 'Category', meta: { name: 'Category' },
        component: () => import('../views/manager/Category.vue') },
      { path: 'blog', name: 'Blog', meta: { name: 'Blog' },
        component: () => import('../views/manager/Blog.vue') },
      { path: 'activity', name: 'Activity', meta: { name: 'Activity' },
        component: () => import('../views/manager/Activity.vue') },
      { path: 'comment', name: 'Comment', meta: { name: 'Comment' },
        component: () => import('../views/manager/Comment.vue') },
    ]
  },
  {
    path: '/front',
    name: 'Front',
    component: () => import('../views/Front.vue'),
    children: [
      { path: 'home', name: 'FHome', meta: { name: 'Home' },
        component: () => import('../views/front/Home') },
      { path: 'person', name: 'Person', meta: { name: 'Personal Center' },
        component: () => import('../views/front/Person') },
      { path: 'blogDetail', name: 'blogDetail', meta: { name: 'Blog Detail' },
        component: () => import('../views/front/BlogDetail') },
      { path: 'search', name: 'Search', meta: { name: 'Search' },
        component: () => import('../views/front/Search.vue') },
    ]
  },
  { path: '/login', name: 'Login', meta: { name: 'Sign In' },
    component: () => import('../views/Login.vue') },
  { path: '/register', name: 'Register', meta: { name: 'Sign Up' },
    component: () => import('../views/Register.vue') },
  { path: '*', name: 'NotFound', meta: { name: 'Access Denied' },
    component: () => import('../views/404.vue') },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 注：不需要前台的项目，可以注释掉该路由守卫
// 路由守卫
// router.beforeEach((to ,from, next) => {
//   let user = JSON.parse(localStorage.getItem("xm-user") || '{}');
//   if (to.path === '/') {
//     if (user.role) {
//       if (user.role === 'USER') {
//         next('/front/home')
//       } else {
//         next('/home')
//       }
//     } else {
//       next('/login')
//     }
//   } else {
//     next()
//   }
// })

export default router
