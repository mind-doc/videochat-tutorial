import { mount } from 'vue-test-utils';

import VideoTwilio from '@/components/VideoTwilio';

describe('VideoTwilio.vue', () => {
  let w;

  beforeEach(() => {
    w = mount(VideoTwilio);
  });

  it('contains local media element', () => {
    expect(w.contains('div#local-media')).toBe(true);
  });

  it('contains buttons', () => {
    const buttons = w.findAll('b-button');

    const startPreviewBtn = buttons.at(0);
    expect(startPreviewBtn.text()).toEqual('Preview My Camera');
    expect(startPreviewBtn.attributes().size).toBe('sm');
    expect(startPreviewBtn.attributes().variant).toBe('primary');

    const stopPreviewBtn = buttons.at(1);
    expect(stopPreviewBtn.text()).toEqual('Stop preview');
    expect(stopPreviewBtn.attributes().size).toBe('sm');
    expect(stopPreviewBtn.attributes().variant).toBe('danger');

    const joinRoomBtn = buttons.at(2);
    expect(joinRoomBtn.text()).toEqual('Join');
    expect(joinRoomBtn.attributes().size).toBe('sm');
    expect(joinRoomBtn.attributes().variant).toBe('success');

    const leaveRoomBtn = buttons.at(3);
    expect(leaveRoomBtn.text()).toEqual('Leave');
    expect(leaveRoomBtn.attributes().size).toBe('sm');
    expect(leaveRoomBtn.attributes().variant).toBe('danger');
  });

  it('contains remote media element', () => {
    expect(w.contains('div#remote-media')).toBe(true);
  });

  it('contains alert', () => {
    const alert = w.find('b-alert');
    expect(alert.text()).toEqual('');
    expect(alert.attributes().variant).toBe('danger');
    expect(alert.attributes().dismissible).toBe('');
  });

  it('contains chat messages element', () => {
    expect(w.contains('div#messages')).toBe(true);
  });

  it('contains chat input element', () => {
    const chatInput = w.find('input#chat-input');
    expect(chatInput.attributes().type).toBe('text');
    expect(chatInput.attributes().placeholder).toBe('say anything');
  });
});
