import { mount } from 'vue-test-utils';

import Home from '@/components/Home';

import expectSnapshot from '#/expect';

describe('Home.vue', () => {
  it('matches snapshot!', () => {
    expectSnapshot(mount(Home));
  });
});
