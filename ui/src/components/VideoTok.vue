<template>
  <div>
    <b-container>
      <b-row>
        <b-col md="6" class="centered">
          <div id="publisher"></div>
        </b-col>
        <b-col md="6" class="centered">
          <div id="subscriber"></div>
        </b-col>
      </b-row>
      <b-button @click="createSession()" variant="primary" v-if="!session" id="create-session">
        Create Session
      </b-button>
      <b-button @click="disconnectSession()" variant="danger" v-if="session" id="disconnect-session">
        Disconnect from Session
      </b-button>
      <div class="errors" v-if="errors !== 0" v-for="error in errors">{{ error }}</div>
      <div class="logs" v-if="logs.length !== 0" v-for="log in logs">{{ log }}</div>
      <pre>
        <code>
          API Key: {{ apiKey || 'undefined' }}
          Session ID: {{ sessionId || 'undefined' }}
          Token: {{ token || 'undefined' }}
        </code>
      </pre>
    </b-container>
  </div>
</template>

<script>
// Inspired by: https://tokbox.com/developer/tutorials/web/basic-video-chat/

import auth from '@/auth';
import OT from '@opentok/client';

export default {
  methods: {
    createSession() {
      auth.getTokboxToken().then((response) => {
        this.logs.push(`Got response from app server with ${JSON.stringify(Object.keys(response.data))} keys`);
        this.apiKey = response.data.apiKey;
        this.sessionId = response.data.sessionId;
        this.token = response.data.token;
        this.logs.push('Initialize session...');
        this.initializeSession();
      }).catch((error) => {
        this.errors.push(`Couldn't fetch token and session ID from app server. ${error}`);
      });
    },
    disconnectSession() {
      if (this.session) {
        this.session.off();
        this.session.disconnect();
        this.session = null;
      }
    },
    initializeSession() {
      // Initialize an OpenTok publisher object
      // For more info: https://tokbox.com/developer/sdks/js/reference/OT.html#initPublisher
      const publisher = OT.initPublisher(
        // The DOM element that the publisher video replaces
        'publisher',
        // The properties of the publisher
        { insertMode: 'append' },
        // A function to be called when the method succeeds
        // or fails in initializing a Publisher object.
        (pubError) => {
          if (pubError) {
            this.errors.push = `Couldn't create publisher. ${pubError}`;
            return;
          }
          this.logs.push('Successfully created publisher');
        },
      );
      // Initialize OpenTok session object.
      const session = OT.initSession(this.apiKey, this.sessionId);
      // Connects the client application to the OpenTok session
      session.connect(this.token, (connErr) => {
        if (connErr) {
          this.errors.push(`Couldn't connect to session. ${connErr}`);
          return;
        }
        this.session = session;
        this.logs.push('Connected to session');
        this.session.publish(publisher, (pubErr) => {
          if (pubErr) {
            this.errors.push(`Couldn't publish to the session. ${pubErr}`);
            return;
          }
          this.logs.push('Successfully publishing to the session');
        });
        // Subscribe to (or view) each other's streams in the session.
        this.session.on(
          // When a new stream is created in the session,
          // the Session object dispatches a streamCreated event
          'streamCreated',
          // The client detects when the new stream is created...
          (event) => {
            // ... and we want the client to subscribe to that stream.
            session.subscribe(
              // The Stream object to which the client is subscribing
              event.stream,
              // DOM element ID that the subscriber video replace
              'subscriber',
              // Customize the appearance of the subscriber view
              { insertMode: 'append' },
              // Completion handler function
              (error) => {
                if (error) {
                  this.errors.push(`Couldn't subscribe to the created stream. Error: ${error}`);
                  return;
                }
                this.logs.push('Subscribed to the created stream');
              },
            );
          },
        );
      });
    },
  },
  data() {
    return {
      apiKey: '',
      sessionId: '',
      session: null,
      token: '',
      errors: [],
      logs: [],
      sessionCreated: false,
    };
  },
};
</script>

<style scoped>
.errors {
  border: red 4px solid;
  background-color: salmon;
  font-weight: bold;
  padding: 10px;
  margin: 6px;
}

.logs {
  border: darkgreen 4px solid;
  background-color: palegreen;
  padding: 10px;
  margin: 6px 0px;
}

.centered {
  text-align: center;
}

#subscriber, #publisher {
  display: inline-block;
}
</style>
