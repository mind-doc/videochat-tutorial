const { passport, isAuthenticated, signJwt } = require('./auth');
const users = require('./users');
const { createToken } = require('./twilio');
const OpenTok = require('opentok');

const { TOKBOX_API_KEY, TOKBOX_API_SECRET } = process.env;
const opentok = new OpenTok(TOKBOX_API_KEY, TOKBOX_API_SECRET);

/**
 * POSTs a username and password for generating a JWT token
 * @param{object} req the http request
 * @param{object} res the http response
 * @return{object} the JWT token as json
 */
function authenticate(req, res) {
  const { username, password } = req.body;

  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).send({
      message: 'bad request',
    });
  }

  return users.findByUsername(username, (user) => {
    // not found
    if (!user) {
      return res.status(404).send({
        message: 'user not found',
      });
    }

    // check password
    if (!(user.password === password)) {
      return res.status(401).send({
        message: 'authentication failed',
      });
    }

    // create signed JWT
    return res.status(200).send({
      jwt: signJwt(user),
    });
  });
}

/**
 * GETs extra user information for the logged user
 * @param{object} req the http request
 * @param{object} res the http response
 * @return{object} the user object as json
 */
function getUserInfo(req, res) {
  const expiresIn = new Date(req.user.exp * 1000);
  return res.status(200).send({
    id: req.user.id,
    username: req.user.username,
    displayName: req.user.displayName,
    role: req.user.role,
    expiresIn: expiresIn.toISOString(),
  });
}

/**
 * GETs a Twilio Access Token for the logged user
 * @param{object} req the http request
 * @param{object} res the http response
 * @return{undefined} the identity and jwt token as json
 */
function getToken(req, res) {
  const identity = req.user.username;
  console.log(`creating twilio token for identity "${identity}"`);
  const token = createToken(identity);
  // Serialize the token to a JWT string and include it in a JSON response.
  return res.status(200).send({
    identity: token.identity,
    token: token.toJwt(),
  });
}

// Should save it to a database
let sessionId = null;

/**
 * GETs a TokBox Access Token for the logged user
 * @param{object} req the http request
 * @param{object} res the http response
 * @return{undefined} the identity and jwt token as json
 */
function getTokboxToken(req, res) {
  const { username } = req.user;
  return opentok.createSession((error, session) => {
    if (error) {
      return res.status(400).send({ message: error.message });
    }
    if (username === 'doctor') {
      sessionId = session.sessionId; // eslint-disable-line
      return res.status(200).send({
        // Generate a Token from a session object (returned from createSession)
        token: session.generateToken(),
        apiKey: process.env.TOKBOX_API_KEY,
        sessionId,
      });
    } else if (username === 'patient') {
      return res.status(200).send({
        // Generate a Token from a sessionId (going to be fetched from the database)
        token: opentok.generateToken(sessionId),
        apiKey: process.env.TOKBOX_API_KEY,
        sessionId,
      });
    }
    return res.status(500).send({ message: 'Sorry, I can only handle two users. My bad.' });
  });
}

module.exports = function routes(app) {
  app.use(passport.initialize());
  app.post('/user', authenticate);
  app.get('/info', isAuthenticated, getUserInfo);
  app.get('/token', isAuthenticated, getToken);
  app.get('/tokboxtoken', isAuthenticated, getTokboxToken);
};
