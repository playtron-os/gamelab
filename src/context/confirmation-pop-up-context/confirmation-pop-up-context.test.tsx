import { render, act } from "@testing-library/react";
import React from "react";

import {
  ConfirmationPopUpContextProvider,
  UseConfirmationPopUpReturn
} from "./confirmation-pop-up-context"; // Replace with the path to your context file
import { useConfirmationPopUp } from "./use-confirmation-popup";

describe("ConfirmationPopUpContextProvider", () => {
  it("provides context", () => {
    const TestComponent: React.FC = () => {
      const context = useConfirmationPopUp();
      expect(context).toBeDefined();
      return null;
    };

    render(
      <ConfirmationPopUpContextProvider>
        <TestComponent />
      </ConfirmationPopUpContextProvider>
    );
  });
});

const mockOnConfirm = jest.fn();

describe("useConfirmationPopUp", () => {
  const TestComponent: React.FC<{ testFn: any }> = ({ testFn }) => {
    testFn(useConfirmationPopUp());
    return null;
  };

  it("throws an error when not wrapped in a provider", () => {
    expect(() => render(<TestComponent testFn={() => {}} />)).toThrow(
      "useConfirmationPopUp must be used within a ConfirmationPopUpContextProvider"
    );
  });

  it("can open the confirmation popup", () => {
    // @ts-expect-error We are doing this a really hacky way
    let hook: UseConfirmationPopUpReturn = null;
    render(
      <ConfirmationPopUpContextProvider>
        <TestComponent
          testFn={(result: UseConfirmationPopUpReturn) => (hook = result)}
        />
      </ConfirmationPopUpContextProvider>
    );

    act(() => {
      hook?.openConfirmationPopUp({
        isOpen: true,
        title: "Are you sure?",
        onConfirm: mockOnConfirm
      });
    });

    expect(hook.props.isOpen).toBe(true);
    expect(hook.props.title).toBe("Are you sure?");
  });

  it("can close the confirmation popup", () => {
    // @ts-expect-error We are doing this a really hacky way
    let hook: UseConfirmationPopUpReturn = null;
    render(
      <ConfirmationPopUpContextProvider>
        <TestComponent
          testFn={(result: UseConfirmationPopUpReturn) => (hook = result)}
        />
      </ConfirmationPopUpContextProvider>
    );

    act(() => {
      hook.openConfirmationPopUp({
        isOpen: true,
        title: "Are you sure?",
        onConfirm: mockOnConfirm
      });
    });

    expect(hook.props.isOpen).toBe(true);

    act(() => {
      hook.closeConfirmationPopUp();
    });

    expect(hook.props.isOpen).toBe(false);
  });
});
