import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import courseService from '~/services/courseService';

const initialState = {
  courseData: [],
  courseDataAll: [],
};

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDataCourse.fulfilled, (state, action) => {
      state.courseData = action.payload;
    });

    builder.addCase(getDataCourseAll.fulfilled, (state, action) => {
      state.courseDataAll = action.payload;
    });
  },
});

export const getDataCourse = createAsyncThunk(
  'course/getDataCourse',
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const existingData = state?.course.courseData;
    if (existingData.length > 0) {
      return rejectWithValue('Data already exists');
    }
    const courseRequest = {
      pageNumber: 0,
      size: 999,
      title: null,
      categoryIds: null,
      rating: null,
      topicId: null,
      levelId: null,
      status: null,
    };
    const result = await courseService.fetchAllCourseOfTeacher(courseRequest);
    return result.content;
  },
);

export const getDataCourseAll = createAsyncThunk(
  'course/getDataCourseAll',
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const existingData = state?.course.courseData;
    if (existingData.length > 0) {
      return rejectWithValue('Data already exists');
    }
    const courseRequest = {
      pageNumber: 0,
      size: 999,
      title: null,
      categoryIds: null,
      rating: null,
      topicId: null,
      levelId: null,
      status: null,
    };
    const result = await courseService.getCourseByFilter(courseRequest);
    return result.content;
  },
);

export default courseSlice.reducer;
