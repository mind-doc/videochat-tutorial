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
  disconnectSessionButton: '#disconnect-session',
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
      w.find(s.createSessionButton).trigger('click');
      expect(w.vm.createSession).toBeCalled();
    });
    it('is hidden, when the session is already created', () => {
      w.setData({
        // It's an OpenTok session object in real life, but for tests, it's good enough
        session: {},
      });
      expect(w.find(s.createSessionButton).exists()).toBe(false);
    });
  });

  describe('"Disconnect Session" button', () => {
    it('calls the "disconnectSession" method of the component', () => {
      w.setMethods({
        disconnectSession: jest.fn(),
      });
      w.setData({
        // It's an OpenTok session object in real life, but for tests, it's good enough
        session: {},
      });
      w.find(s.disconnectSessionButton).trigger('click');
      expect(w.vm.disconnectSession).toBeCalled();
    });
    it('is hidden, when the session is already created', () => {
      w.setData({
        session: null,
      });
      expect(w.find(s.disconnectSessionButton).exists()).toBe(false);
    });
  });
});
