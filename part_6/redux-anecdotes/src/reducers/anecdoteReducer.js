import { createSlice } from '@reduxjs/toolkit'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    addVote: (state, action) => {
      const id = action.payload;
      const index = state.findIndex((a) => a.id === id);
      state[index].votes += 1;
    },
    addAnecdote: (state, action) => {
      state.push(action.payload)
    },
    setAnecdotes: (_state, action) => {
      return action.payload
    }
  }
});

export const { addVote, addAnecdote, setAnecdotes } = anecdoteSlice.actions;

export default anecdoteSlice.reducer;
