<style lang="scss">
#messageReviewWrapper {
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
  .review-head {
    height: 90px;
    width: 100%;
    display: flex;
    align-items: center;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.16);
    .review-guide {
      width: 70%;
      padding: 0 40px;
      color: $form-inactive-info-color;
    }
    .review-invite {
      box-shadow: 1px 0 4px 0 rgba(0, 0, 0, 0.16);
      height: 100%;
      width: 30%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .review-invite-caption {
        font-size: 10px !important;
        padding-top: 5px;
        color: $primary-color;
      }
    }
  }

  .review-empty-body-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: -moz-calc(100% - 150px);
    /* WebKit */
    height: -webkit-calc(100% - 150px);
    /* Opera */
    height: -o-calc(100% - 150px);
    /* Standard */
    height: calc(100% - 150px);
    .review-empty-body {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;

      font-size: 14px;
      .review-empty-text-bold {
        color: $form-title-color;
        padding-top: 20px;
      }
      .review-empty-text {
        color: $form-inactive-info-color;
        padding-top: 20px;
      }
    }
  }

  .review-message-text {
    height: 60px;
    width: 100%;
    box-shadow: 0 -2px 4px 0 rgba(0, 0, 0, 0.16);
    position: absolute;
    bottom: 0;
  }
  .chat-wrapper {
    height: 600px;
    width: 300px;
    border: 1px solid red;
  }
  .sc-launcher {
    display: none;
  }

  .temp {
    background-image: url('~assets/img/chat/Pathologist01.png');
    border: 1px solid red;
  }
}
</style>
<template>
  <div id="messageReviewWrapper">
    <div class="review-head">
      <div class="review-guide">{{$t('diagnosis.review-guide')}}</div>
      <div class="review-invite">
        <v-btn text icon>
        </v-btn>
        <div class="review-invite-caption">{{$t('diagnosis.invite-member')}}</div>
      </div>
    </div>

    <div v-if="1==1" class="review-empty-body-wrapper">
      <div class="review-empty-body">
        <div class="review-empty-text-bold">{{$t('diagnosis.review-empty-question')}}</div>
        <div class="review-empty-text">{{$t('diagnosis.review-empty-guide')}}</div>
      </div>
      <!-- <beautiful-chat
        class="chat-wrapper"
        :participants="participants"
        :titleImageUrl="titleImageUrl"
        :onMessageWasSent="onMessageWasSent"
        :messageList="messageList"
        :newMessagesCount="newMessagesCount"
        :isOpen="isChatOpen"
        :close="closeChat"
        :icons="icons"
        :open="openChat"
        :showEmoji="false"
        :showFile="showAttachFile"
        :showTypingIndicator="showTypingIndicator"
        :colors="colors"
        :alwaysScrollToBottom="alwaysScrollToBottom"
        :messageStyling="messageStyling"
        @onType="handleOnType"
        @edit="editMessage"
      />-->
    </div>
    <div v-else class="review-body"></div>
    <div class="review-message-text">dsfsdfdf</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      showAttachFile: true,
      icons: {
        open: {
          img: 'la-add',
          name: 'default'
        },
        close: {
          img: 'la-close',
          name: 'default'
        },
        file: {
          img: 'la-add',
          name: 'default'
        },
        closeSvg: {
          img: 'la-close',
          name: 'default'
        }
      },
      participants: [
        {
          id: 'user1',
          name: 'Matteo',
          imageUrl: 'https://avatars3.githubusercontent.com/u/1915989?s=230&v=4'
        },
        {
          id: 'user2',
          name: 'Support',
          imageUrl:
            'https://avatars3.githubusercontent.com/u/37018832?s=200&v=4'
        },
        {
          id: 'user3',
          name: 'دکتر احمدی',
          imageUrl: '~/assets/img/chat/Pathologist01.jpg'
        }
      ], // the list of all the participant of the conversation. `name` is the user name, `id` is used to establish the author of a message, `imageUrl` is supposed to be the user avatar.
      titleImageUrl:
        'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png',
      messageList: [
        { type: 'text', author: `me`, data: { text: `Say yes!` } },
        { type: 'text', author: `user3`, data: { text: `Say yes!` } },
        { type: 'text', author: `user1`, data: { text: `No.` } },
        { type: 'text', author: `user3`, data: { text: `No.` } }
      ], // the list of the messages to show, can be paginated and adjusted dynamically
      newMessagesCount: 0,
      isChatOpen: true, // to determine whether the chat window should be open or closed
      showTypingIndicator: '', // when set to a value matching the participant.id it shows the typing indicator for the specific user
      colors: {
        header: {
          bg: '#4e8cff',
          text: '#ffffff'
        },
        launcher: {
          bg: '#4e8cff'
        },
        messageList: {
          bg: '#ffffff'
        },
        sentMessage: {
          bg: '#4e8cff',
          text: '#ffffff'
        },
        receivedMessage: {
          bg: '#eaeaea',
          text: '#222222'
        },
        userInput: {
          bg: '#f4f7f9',
          text: '#565867'
        }
      }, // specifies the color scheme for the component
      alwaysScrollToBottom: false, // when set to true always scrolls the chat to the bottom when new events are in (new message, user starts typing...)
      messageStyling: true // enables *bold* /emph/ _underline_ and such (more info at github.com/mattezza/msgdown)
    }
  },
  methods: {
    sendMessage(text) {
      if (text.length > 0) {
        this.newMessagesCount = this.isChatOpen
          ? this.newMessagesCount
          : this.newMessagesCount + 1
        this.onMessageWasSent({
          author: 'support',
          type: 'text',
          data: { text }
        })
      }
    },
    onMessageWasSent(message) {
      // called when the user sends a message
      this.messageList = [...this.messageList, message]
      this.showAttachFile = true
    },
    openChat() {
      // called when the user clicks on the fab button to open the chat
      this.isChatOpen = true
      this.newMessagesCount = 0
    },
    closeChat() {
      // called when the user clicks on the botton to close the chat
      this.isChatOpen = false
    },
    handleScrollToTop() {
      // called when the user scrolls message list to top
      // leverage pagination for loading another page of messages
    },
    handleOnType() {
      console.log('Emit typing event')
      this.showAttachFile = false
    },
    editMessage(message) {
      const m = this.messageList.find(m => (<any>m).id === message.id)
      ;(<any>m).isEdited = true
      ;(<any>m).data.text = message.data.text
    }
  }
})
</script>