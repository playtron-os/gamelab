import { configureStore } from "@reduxjs/toolkit";
import {
  authSlice,
  setAuthState,
  resetAuthState,
  AUTH_SLICE_INITIAL_STATE
} from "./auth-slice";

describe("authSlice", () => {
  it("should handle initial state", () => {
    expect(authSlice.reducer(undefined, { type: "unknown" })).toEqual(
      AUTH_SLICE_INITIAL_STATE
    );
  });

  it("should handle setAuthState with user_id", () => {
    const actual = authSlice.reducer(
      {
        userId: "",
        isAuthenticated: false
      },
      setAuthState({
        userId: "testId"
      })
    );
    expect(actual.userId).toEqual("testId");
    expect(actual.isAuthenticated).toEqual(true);
  });

  it("should handle resetAuthState", () => {
    const actual = authSlice.reducer(
      {
        userId: "testId",
        isAuthenticated: true
      },
      resetAuthState()
    );
    expect(actual).toEqual(AUTH_SLICE_INITIAL_STATE);
  });
});
