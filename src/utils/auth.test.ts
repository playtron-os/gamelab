import { setUserIdToLocalStorage, getUserIdFromLocalStorage } from "./auth";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "mocked-uuid")
}));

jest.mock("@/utils/cookies", () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn()
}));

jest.mock("@/redux/modules", () => ({
  setAuthState: jest.fn()
}));

jest.mock("@/types/playserve/message", () => ({
  MessageType: {
    SetJwt: "SetJwt"
  },
  getMessage: jest.fn()
}));

describe("Auth utils", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should set/get the user ID in the local storage", () => {
    const userId = "testUserId";

    setUserIdToLocalStorage(userId);

    const localStorageValue = getUserIdFromLocalStorage();
    expect(localStorageValue).toEqual(userId);
  });
});
