import { useAuthentication } from "./hooks";
import { renderHookWithContext } from "@/utils";
import { useAppSelector } from "@/redux/store";

const navigateMockFunc = jest.fn(() => null);

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(() => navigateMockFunc)
}));

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: jest.fn(() => null),
  useDispatch: jest.fn(() => jest.fn())
}));

const redirectToAuthPortalMock = jest.fn();

jest.mock("@/utils", () => ({
  ...jest.requireActual("@/utils"),
  redirectToAuthPortal: jest.fn(() => redirectToAuthPortalMock())
}));

describe("useAuthentication", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call navigate to dashboard when isAuthenticated is true", () => {
    (useAppSelector as jest.Mock).mockReturnValue({
      isAuthenticated: true
    });
    renderHookWithContext(useAuthentication);

    expect(navigateMockFunc).toHaveBeenCalledWith("/");
  });
});
