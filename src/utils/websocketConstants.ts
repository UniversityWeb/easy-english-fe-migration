const notificationTopic = (username) => `/topic/notifications/${username}`;

const notificationDestination = '/app/notifications';

const cartItemCountTopic = (username) => `/topic/cart-item-count/${username}`;

const cartItemCountDestination = '/app/cart-item-count';

const testResultNotificationTopic = (testId) => `/topic/test-result/${testId}`;

const testResultDestination = '/app/test-result';

const messageTopic = (recipientUsername) => `/topic/messages/${recipientUsername}`;

const messageDestination = '/app/messages';

const recentChatsTopic = (recipientUsername) => `/topic/recent-chats/${recipientUsername}`;

const onlineUsersTopic = `/topic/online-users`;

const notificationCountTopic = (username) => `/topic/notifications-count/${username}`;

export const websocketConstants = {
  notificationTopic,
  notificationDestination,
  cartItemCountTopic,
  cartItemCountDestination,
  testResultNotificationTopic,
  testResultDestination,

  messageTopic,
  messageDestination,

  recentChatsTopic,

  onlineUsersTopic,

  notificationCountTopic,
};
