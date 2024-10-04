import {
  ActionCreatorsMapObject,
  combineReducers,
  configureStore,
  bindActionCreators
} from "@reduxjs/toolkit";
import appLibrary from "@/redux/modules/app-library/app-library-slice";
import auth from "@/redux/modules/auth/auth-slice";
import accounts from "@/redux/modules/accounts/accounts-slice";
import moveAppDialog from "@/redux/modules/move-app-dialog/move-app-dialog-slice";

import { createReduxHistoryContext } from "redux-first-history";
import { createBrowserHistory } from "history";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import storage from "redux-persist/lib/storage/session";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore
} from "redux-persist";
import {
  reducer as flashReducer,
  middleware as flashMiddleware
} from "redux-flash";
const { createReduxHistory, routerMiddleware, routerReducer } =
  createReduxHistoryContext({ history: createBrowserHistory() });

const middleware = [routerMiddleware].filter(Boolean);

const combinedReducers = combineReducers({
  appLibrary,
  auth,
  moveAppDialog,
  router: routerReducer,
  accounts,
  flash: flashReducer
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"]
};

const persistedReducer = persistReducer(persistConfig, combinedReducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }).concat(middleware, flashMiddleware())
});

export const persistor = persistStore(store);

export const history = createReduxHistory(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
// Typed useDispatch and useSelector hooks
// READ MORE: https://react-redux.js.org/using-react-redux/usage-with-typescript#define-root-state-and-dispatch-types
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

type ActionCreatorMap<T extends ActionCreatorsMapObject> = {
  // FIXME: replace this any
  [K in keyof T]: (...args: any[]) => ReturnType<T[K]>; // eslint-disable-line
};

export const useAppActions = <T extends ActionCreatorsMapObject>(
  actionCreators: T
): ActionCreatorMap<T> => {
  const dispatch = useDispatch();

  // Bind action creators to dispatch
  const actions = bindActionCreators(actionCreators, dispatch);

  return actions as ActionCreatorMap<T>;
};
