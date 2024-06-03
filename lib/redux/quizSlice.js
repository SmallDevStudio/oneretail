import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ฟังก์ชันสำหรับอัปเดตคะแนน
export const savePoints = createAsyncThunk(
  'quiz/savePoints',
  async ({ userId, points }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/points', {
        userId,
        description: 'Quiz Game',
        type: 'earn',
        points,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


const initialState = {
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  showAnswer: false,
  status: 'idle',
  error: null,
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setQuestions(state, action) {
      state.questions = action.payload;
    },
    answerQuestion(state, action) {
      const { isCorrect } = action.payload;
      if (isCorrect) state.score += 1;
      state.showAnswer = true;
    },
    nextQuestion(state) {
      state.currentQuestionIndex += 1;
      state.showAnswer = false;
    },
    resetQuiz(state) {
      state.currentQuestionIndex = 0;
      state.score = 0;
      state.showAnswer = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(savePoints.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(savePoints.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(savePoints.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setQuestions, answerQuestion, nextQuestion, resetQuiz } = quizSlice.actions;
export default quizSlice.reducer;