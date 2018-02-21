import { createRenderer } from 'vue-server-renderer';

function expectSnapshot(wrapper) {
  const renderer = createRenderer();
  renderer.renderToString(wrapper.vm, (err, str) => {
    /* istanbul ignore next */
    if (err) throw new Error(err);
    expect(str).toMatchSnapshot();
  });
}

export { expectSnapshot as default };
