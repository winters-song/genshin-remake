import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GameState {
  gameStarted: boolean; // 用户点击“开始游戏”
  shouldStop: boolean; // 铺路动画完成并终止，准备创建传送门
  doorPosition: [number, number, number];
  doorCreated: boolean;
  shouldOpenDoor: boolean;
}

const initialState: GameState = {
  gameStarted: false,
  shouldStop: false,
  doorPosition: [0, 0, 0],
  doorCreated: false,
  shouldOpenDoor: false,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setGameStarted(state, action: PayloadAction<boolean>) {
      state.gameStarted = action.payload;
    },
    setShouldStop(state, action: PayloadAction<boolean>) {
      state.shouldStop = action.payload;
    },
    setDoorPosition(state, action: PayloadAction<[number, number, number]>) {
      state.doorPosition = action.payload;
    },
    setDoorCreated(state, action: PayloadAction<boolean>) {
      state.doorCreated = action.payload;
    },
    setShouldOpenDoor(state, action: PayloadAction<boolean>) {
      state.shouldOpenDoor = action.payload;
    }
  },
});

export const { setGameStarted, setShouldStop, setDoorPosition, setShouldOpenDoor, setDoorCreated } = gameSlice.actions;

export const store = configureStore({
  reducer: {
    game: gameSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 