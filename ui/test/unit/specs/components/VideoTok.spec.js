import { mount } from 'vue-test-utils';

import VideoTok from '@/components/VideoTok';

jest.mock('@opentok/client', () => ({
  OT: {
    initPublisher: jest.fn(),
    initSession: jest.fn(),
  },
}));


const s = {
  createSessionButton: '#create-session',
  errors: '.errors',
  logs: '.logs',
};

describe('VideoTok.vue', () => {
  let w;

  beforeEach(() => {
    w = mount(VideoTok);
  });

  describe('"Create Session" button', () => {
    it('calls the "createSession" method of the component', () => {
      w.setMethods({
        createSession: jest.fn(),
      });
      expect(w.vm.createSession).not.toBeCalled();
      w.find(s.createSessionButton).trigger('click');
      expect(w.vm.createSession).toBeCalled();
    });
    it('is hidden, when the session is already created', () => {
      w.setData({
        sessionCreated: true,
      });
      expect(w.find(s.createSessionButton).exists()).toBe(false);
    });
  });
});
