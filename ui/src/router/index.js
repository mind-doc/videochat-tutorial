import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import LoginForm from '@/components/LoginForm';
import VideoTwilio from '@/components/VideoTwilio';
import VideoTok from '@/components/VideoTok';
import auth from '@/auth';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      beforeEnter: (to, from, next) => auth.assertAuthenticated()
        .then(next)
        .catch(() => { next({ path: '/login' }); }),
    },
    {
      path: '/login',
      name: 'LoginForm',
      component: LoginForm,
      // Here we actually want to make sure it's not authenticated
      beforeEnter: (to, from, next) => auth.assertAuthenticated()
        .then(() => { next({ path: '/' }); })
        .catch(() => next()),
    },
    {
      path: '/logout',
      redirect() {
        auth.jwt.remove();
        return '/login';
      },
    },
    {
      path: '/video-twilio',
      name: 'VideoTwilio',
      component: VideoTwilio,
      beforeEnter: (to, from, next) =>
        auth.assertAuthenticated()
          .then(next)
          .catch(() => { next({ path: '/login' }); }),
    },
    {
      path: '/video-tokbox',
      name: 'VideoTok',
      component: VideoTok,
      beforeEnter: (to, from, next) =>
        auth.assertAuthenticated()
          .then(next)
          .catch(() => { next({ path: '/login' }); }),
    },
  ],
});
