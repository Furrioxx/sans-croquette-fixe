export default {
  routes: [
    {
      method: 'GET',
      path: '/chat-conversations',
      handler: 'api::chat-conversation.chat-conversation.find',
    },
    {
      method: 'GET',
      path: '/chat-conversations/:id',
      handler: 'api::chat-conversation.chat-conversation.findOne',
    },
    {
      method: 'POST',
      path: '/chat-conversations',
      handler: 'api::chat-conversation.chat-conversation.create',
    },
    {
      method: 'POST',
      path: '/chat-conversations/:id/messages',
      handler: 'api::chat-conversation.chat-conversation.sendMessage',
    },
  ],
}
