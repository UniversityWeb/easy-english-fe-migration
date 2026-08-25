import { lazy } from 'react';
import config from '~/config';
import { USER_ROLES } from '~/utils/constants';

const AddCoursePage = lazy(() => import('~/pages/Common/AddCoursePage'));
const LoginPage = lazy(() => import('~/pages/Common/LoginPage'));
const RegisterPage = lazy(() => import('~/pages/Common/RegisterPage'));
const ForgotPasswordPage = lazy(
  () => import('~/pages/Common/ForgotPasswordPage'),
);
const UserProfileEditPage = lazy(
  () => import('~/pages/Common/UserProfileEditPage'),
);
const OtpValidationPage = lazy(
  () => import('~/pages/Common/OtpValidationPage'),
);
const Notifications = lazy(() => import('~/pages/Student/Notifications'));
const TakeTestPage = lazy(() => import('~/pages/Student/TakeTestPage'));
const PreviewTestPage = lazy(() => import('~/pages/Student/PreviewTestPage'));
const CartPage = lazy(() => import('~/pages/Student/CartPage'));
const PaymentResultPage = lazy(
  () => import('~/pages/Student/PaymentResultPage'),
);
const CourseManagementForTeacherPage = lazy(
  () => import('~/pages/Teacher/CourseManagementForTeacherPage'),
);
const HomePage = lazy(() => import('~/pages/Common/HomePage'));
const SearchPage = lazy(() => import('~/pages/Student/SearchPage'));
const FavouritePage = lazy(() => import('~/pages/Student/FavouritePage'));
const EnrollCoursePage = lazy(() => import('~/pages/Student/EnrollCoursePage'));
const CourseViewDetailPage = lazy(
  () => import('~/pages/Student/CourseDetailPage'),
);
const CourseDetailPage = lazy(() => import('~/pages/Teacher/CourseDetailPage'));
const OrdersPage = lazy(() => import('~/pages/Student/OrdersPage'));
const OrderDetailPage = lazy(() => import('~/pages/Student/OrderDetailPage'));
const LearnPage = lazy(() => import('~/pages/Student/LearnPage'));
const CategoryPage = lazy(() => import('~/pages/Admin/CategoryPage'));
const TopicAndLevelPage = lazy(() => import('~/pages/Admin/TopicAndLevelPage'));
const TestResultPage = lazy(() => import('~/pages/Common/TestResultPage'));
const EntranceTestResultPage = lazy(
  () => import('~/pages/Common/EntranceTestResultPage'),
);
const CourseLineChartPage = lazy(
  () => import('~/pages/Admin/CourseLineChartPage'),
);
const ReviewAnalystPage = lazy(() => import('~/pages/Admin/ReviewAnalystPage'));
const Gradebook = lazy(() => import('~/pages/Teacher/Gradebook'));
const UserManagement = lazy(() => import('~/pages/Admin/UserManagementPage'));
const ChatPage = lazy(() => import('~/pages/Common/ChatPage'));
const CourseManagementForAdminPage = lazy(
  () => import('~/pages/Admin/CourseManagementPage'),
);
const Bundle = lazy(() => import('~/pages/Teacher/Bundle'));
const BundleDetail = lazy(
  () => import('~/components/Teacher/Bundle/BundleDetail'),
);
const NewBundle = lazy(() => import('~/components/Teacher/Bundle/NewBundle'));
const WritingTaskPage = lazy(() => import('~/pages/Common/WritingTaskPage'));
const ChatAI = lazy(() => import('~/pages/Common/ChatAIPage'));
const EntranceTestPage = lazy(() => import('~/pages/Student/EntranceTestPage'));
const StudentDropPage = lazy(() => import('~/pages/Teacher/StudentDropPage'));
const TeacherPage = lazy(() => import('~/pages/Student/TeacherPage'));
const publicRoutes = [
  {
    path: config.routes.login,
    component: LoginPage,
    roles: [USER_ROLES.ALL],
  },
  {
    path: config.routes.register,
    component: RegisterPage,
    roles: [USER_ROLES.ALL],
  },
  {
    path: config.routes.forgot_password,
    component: ForgotPasswordPage,
    roles: [USER_ROLES.ALL],
  },
  {
    path: config.routes.user_profile_edit,
    component: UserProfileEditPage,
    roles: [USER_ROLES.ALL],
  },
  {
    path: config.routes.otp_validation,
    component: OtpValidationPage,
    roles: [USER_ROLES.ALL],
  },
  {
    path: config.routes.notifications,
    component: Notifications,
    roles: [USER_ROLES.ALL],
  },
  {
    path: config.routes.preview_test,
    component: PreviewTestPage,
    roles: [USER_ROLES.ALL],
  },
  {
    path: config.routes.take_test(':testId'),
    component: TakeTestPage,
    roles: [USER_ROLES.ALL],
  },
  {
    path: config.routes.cart,
    component: CartPage,
    roles: [USER_ROLES.STUDENT],
  },
  {
    path: config.routes.payment_result,
    component: PaymentResultPage,
    roles: [USER_ROLES.STUDENT],
  },
  {
    path: config.routes.maincourse,
    component: AddCoursePage,
    roles: [USER_ROLES.TEACHER, USER_ROLES.ADMIN],
  },
  {
    path: config.routes.course_detail(':courseId'),
    component: CourseDetailPage,
    roles: [USER_ROLES.ALL],
  },
  {
    path: config.routes.course_management_for_teacher,
    component: CourseManagementForTeacherPage,
    roles: [USER_ROLES.TEACHER, USER_ROLES.ADMIN],
  },
  {
    path: config.routes.search,
    component: SearchPage,
    roles: [USER_ROLES.ALL],
  },
  {
    path: config.routes.favourite,
    component: FavouritePage,
    roles: [USER_ROLES.STUDENT],
  },
  {
    path: config.routes.enroll_course,
    component: EnrollCoursePage,
    roles: [USER_ROLES.STUDENT],
  },
  {
    path: config.routes.course_view_detail,
    component: CourseViewDetailPage,
    roles: [USER_ROLES.ALL],
  },

  {
    path: config.routes.orders,
    component: OrdersPage,
    roles: [USER_ROLES.ALL],
  },
  {
    path: config.routes.order_detail,
    component: OrderDetailPage,
    roles: [USER_ROLES.ALL],
  },
  {
    path: config.routes.learn(':courseId', ':courseTitle'),
    component: LearnPage,
    roles: [USER_ROLES.ALL],
  },
  {
    path: config.routes.category_for_admin,
    component: CategoryPage,
    roles: [USER_ROLES.ADMIN],
  },
  {
    path: config.routes.topic_level_for_admin,
    component: TopicAndLevelPage,
    roles: [USER_ROLES.ADMIN],
  },
  {
    path: config.routes.test_result(':testResultId'),
    component: TestResultPage,
    roles: [USER_ROLES.ALL],
  },
  {
    path: config.routes.entrance_test_result(':testResultId'),
    component: EntranceTestResultPage,
    roles: [USER_ROLES.STUDENT],
  },
  {
    path: config.routes.analytics_courses,
    component: CourseLineChartPage,
    roles: [USER_ROLES.TEACHER, USER_ROLES.ADMIN],
  },
  {
    path: config.routes.gradebook,
    component: Gradebook,
    roles: [USER_ROLES.TEACHER, USER_ROLES.ADMIN],
  },
  {
    path: config.routes.analytics_reviews,
    component: ReviewAnalystPage,
    roles: [USER_ROLES.TEACHER, USER_ROLES.ADMIN],
  },
  {
    path: config.routes.user_management,
    component: UserManagement,
    roles: [USER_ROLES.ADMIN],
  },

  {
    path: config.routes.chat,
    component: ChatPage,
    roles: [USER_ROLES.ALL],
  },
  {
    path: config.routes.course_management_for_admin,
    component: CourseManagementForAdminPage,
    roles: [USER_ROLES.ADMIN],
  },
  {
    path: config.routes.homepage,
    component: HomePage,
    roles: [USER_ROLES.ALL],
  },
  {
    path: config.routes.bundle_detail(':bundleId'),
    component: BundleDetail,
    roles: [USER_ROLES.ALL],
  },
  {
    path: config.routes.bundle_add,
    component: NewBundle,
    roles: [USER_ROLES.TEACHER, USER_ROLES.ADMIN],
  },
  {
    path: config.routes.bundle,
    component: Bundle,
    roles: [USER_ROLES.ALL],
  },
  {
    path: config.routes.gradebook,
    component: Gradebook,
    roles: [USER_ROLES.TEACHER, USER_ROLES.ADMIN],
  },
  {
    path: config.routes.writing_task(':writingTaskId'),
    component: WritingTaskPage,
    roles: [USER_ROLES.ALL],
  },
  {
    path: config.routes.chat_ai,
    component: ChatAI,
    roles: [USER_ROLES.ALL],
  },
  {
    path: config.routes.entrance_test,
    component: EntranceTestPage,
    roles: [USER_ROLES.STUDENT],
  },
  {
    path: config.routes.student_drop,
    component: StudentDropPage,
    roles: [USER_ROLES.TEACHER],
  },
  {
    path: config.routes.teacher(':username'),
    component: TeacherPage,
    roles: [USER_ROLES.STUDENT],
  },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
