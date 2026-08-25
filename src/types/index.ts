export interface IUser {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
  avatarUrl?: string;
  accountStatus?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IPrice {
  id: number;
  price: number;
  salePrice: number;
}

export interface ICourse {
  id: number;
  title: string;
  ownerUsername: string;
  imagePreview?: string;
  duration?: number;
  countStudent?: number;
  rating?: number;
  ratingCount?: number;
  price?: IPrice;
  isFree?: boolean;
}

export interface ICartItem {
  id: number;
  course: ICourse;
  discountPercent?: number;
}

export interface IBundle {
  id: number;
  name: string;
  desc?: string;
  price: number;
  courseIds: number[];
}

export interface ITest {
  id: number;
  status: string;
  title: string;
  description?: string;
  ordinalNumber?: number;
  durationInMilis?: number;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  parts: ITestPart[];
  sectionId?: number;
}

export interface ITestPart {
  id: number;
  title: string;
  readingPassage?: string;
  ordinalNumber: number;
  testId: number;
  questionGroups: IQuestionGroup[];
}

export interface IQuestionGroup {
  id: number;
  ordinalNumber: number;
  from: number;
  to: number;
  title: string;
  requirement?: string;
  imagePath?: string | null;
  audioPath?: string | null;
  questions: IQuestion[];
  testPartId: number;
}

export interface IQuestion {
  id: number;
  type: string;
  ordinalNumber: number;
  title: string;
  description?: string;
  audioPath?: string | null;
  imagePath?: string | null;
  options: string[];
  correctAnswers: string[];
  questionGroupId: number;
}

export interface IAPIResponse<T> {
  status: number;
  data: T;
  message?: string;
  error?: string;
}

export interface IPaginatedResponse<T> {
  content: T[];
  pageable: any;
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: any;
  numberOfElements: number;
  empty: boolean;
}
