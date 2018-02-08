<template>
  <div class="video">
    <b-container>
      <b-row>
        <button @click="createSession()">Create Session</button>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import auth from '@/auth';
import Video from 'twilio-video';
import Chat from 'twilio-chat';
export default {
  methods: {
    /**
     * Create tokbox session and retrieve token
     */
    createSession() {
      auth.getTokboxToken().then((res) => {
        console.log(res);
      }).catch((err) => {
        console.error(err);
      });
    },
  },
};
</script>
