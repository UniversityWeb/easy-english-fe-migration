import {
  CheckCircleIcon,
  DeleteIcon,
  EditIcon,
  TimeIcon,
  WarningIcon,
} from '@chakra-ui/icons';

export const MIN_USERNAME_LENGTH = 3;
export const MIN_PASSWORD_LENGTH = 8;
export const OTP_LENGTH = 6;
export const USER_ROLES = {
  STUDENT: 'STUDENT',
  TEACHER: 'TEACHER',
  ADMIN: 'ADMIN',
  ALL: 'ALL',
};

export const USER_STATUSES = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  DELETED: 'DELETED',
};

export const SEC_ITEM_TYPES = {
  TEXT: 'TEXT',
  VIDEO: 'VIDEO',
  AUDIO: 'AUDIO',
  TEST: 'TEST',
  WRITING: 'WRITING',
};

export const TEST_TYPES = {
  QUIZ: 'QUIZ',
  CUSTOM: 'CUSTOM',
};

export const TEST_STATUSES = {
  DISPLAY: 'DISPLAY',
  HIDE: 'HIDE',
  DRAFT: 'DRAFT',
};

export const QUESTION_TYPES = {
  SINGLE_CHOICE: 'SINGLE_CHOICE',
  MULTI_CHOICE: 'MULTIPLE_CHOICE',
  TRUE_FALSE: 'TRUE_FALSE',
  MATCHING: 'MATCHING',
  FILL_BLANK: 'FILL_BLANK',
};

export const SAVED_ORDERS_TAB_INDEX_KEY = 'selectedOrdersTabIndex';
export const ORDERS_TAB_STATUSES = [
  'All',
  'PENDING_PAYMENT',
  'PAID',
  'FAILED',
  'REFUNDED',
  'EXPIRED',
];
export const getOrdersTabStatusByIndex = (index) => {
  return ORDERS_TAB_STATUSES[index] || ORDERS_TAB_STATUSES[0];
};

export const DEFAULT_LIST_SIZE = 10;

export const TEST_RESULT_STATUSES = {
  DONE: 'DONE',
  IN_PROGRESS: 'IN_PROGRESS',
  FAILED: 'FAILED',
};

export const PAYMENT_STATUES = {
  SUCCESS: 'SUCCESS',
};

export const COURSE_STATUS = {
  PUBLISHED: {
    value: 'PUBLISHED',
    label: 'Published',
    color: 'green.500',
    icon: CheckCircleIcon,
  },
  REJECTED: {
    value: 'REJECTED',
    label: 'Rejected',
    color: 'red.500',
    icon: WarningIcon,
  },
  PENDING_APPROVAL: {
    value: 'PENDING_APPROVAL',
    label: 'Pending Approval',
    color: 'orange.500',
    icon: TimeIcon,
  },
  DRAFT: {
    value: 'DRAFT',
    label: 'Draft',
    color: 'blue.500',
    icon: EditIcon,
  },
  DELETED: {
    value: 'DELETED',
    label: 'Deleted',
    color: 'gray.500',
    icon: DeleteIcon,
  },
};
