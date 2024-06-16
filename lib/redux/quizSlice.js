// redux/quizSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  showAnswer: false,
  status: 'idle',
};

export const savePoints = createAsyncThunk('quiz/savePoints', async ({ userId, points }) => {
  const response = await axios.post(`/api/points`, { userId, points });
  return response.data;
});

export const calculateLevel = createAsyncThunk('quiz/calculateLevel', async ({ userId }) => {
  const response = await axios.post(`/api/calculateLevel`, { userId });
  return response.data;
});

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setQuestions(state, action) {
      state.questions = action.payload;
      state.currentQuestionIndex = 0;
      state.score = 0;
      state.showAnswer = false;
    },
    answerQuestion(state, action) {
      state.showAnswer = true;
      if (action.payload.isCorrect) {
        state.score += 1;
      }
    },
    nextQuestion(state) {
      state.currentQuestionIndex += 1;
      state.showAnswer = false;
    },
    resetQuiz(state) {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(savePoints.fulfilled, (state, action) => {
        // handle save points success
      })
      .addCase(calculateLevel.fulfilled, (state, action) => {
        // handle calculate level success
      });
  },
});

export const { setQuestions, answerQuestion, nextQuestion, resetQuiz } = quizSlice.actions;

export default quizSlice.reducer;
