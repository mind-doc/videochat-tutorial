import axios from 'axios';

const jwt = (() => {
  let value = null;

  return {
    get() {  // TODO: use it later in router
      return value || localStorage.getItem('jwt');
    },
    set(j) {
      value = j;
      localStorage.setItem('jwt', value);
    },
    remove() {
      value = null;
      localStorage.removeItem('jwt');
    },
  };
})();

const getErrorMessage = (response) => {
  const msg = (response && response.data && response.data.message) || 'Unknown Error';
  const status = response.status;
  return `${msg} (${status})`;
};

function authenticate(username, password) {
  return axios.post('/api/user', { username, password })
    .then((response) => { jwt.set(response.data.jwt); })
    .catch((error) => { throw getErrorMessage(error.response); });
}

function assertAuthenticated() {
  return new Promise((resolve, reject) => {
    const t = jwt.get();
    if (t === null) reject('No JWT available.');
    // TODO: We could create an endpoint, that tells us if the JWT is valid
    // without creating a token with Twilio.
    // As we don't have it yet, let's make a call to /api/token with the JWT.
    axios.get('/api/token', { headers: { Authorization: `Bearer ${t}` } })
      .then(resolve)
      .catch(() => {
        jwt.remove();
        reject(`JWT ${t} was invalid.`);
      });
  });
}

export default {
  assertAuthenticated,
  authenticate,
  jwt,
};
