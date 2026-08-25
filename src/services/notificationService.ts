import { get, handleResponse, post, put } from '~/utils/httpRequest';

const SUFFIX_NOTIFICATION_API_URL = '/notifications';

const getNotificationsByUsername = async (username, page = 0, size = 10) => {
  const path = `${SUFFIX_NOTIFICATION_API_URL}/get-by-username/${username}`;
  const response = await get(path, {
    params: {
      page: page,
      size: size
    }
  });

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const sendNotification = async (sendNotificationRequest) => {
  const path = `${SUFFIX_NOTIFICATION_API_URL}/send`;
  const response = await post(path, sendNotificationRequest);

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const markNotificationAsRead = async (notificationId) => {
  const path = `${SUFFIX_NOTIFICATION_API_URL}/mark-as-read/${notificationId}`;
  const response = await put(path);

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const countUnreadNotifications = async () => {
  const path = `${SUFFIX_NOTIFICATION_API_URL}/count-unread-notifications`;
  const response = await get(path);
  return handleResponse(response, 200);
};

const notificationService = {
  getNotificationsByUsername,
  markNotificationAsRead,
  countUnreadNotifications,
};

export default notificationService;