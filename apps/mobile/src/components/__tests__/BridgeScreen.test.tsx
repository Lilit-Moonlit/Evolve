import React from "react";
import { render } from "@testing-library/react-native";
import BridgeScreen from "../BridgeScreen";

describe("BridgeScreen", () => {
  it("renders all fields and the Transfer button", () => {
    const { getByText, getByPlaceholderText } = render(<BridgeScreen />);

    // Labels
    expect(getByText("Вихідна мережа")).toBeTruthy();
    expect(getByText("Цільова мережа")).toBeTruthy();
    expect(getByText("Сума токену")).toBeTruthy();

    // Input placeholder
    expect(getByPlaceholderText("0.0")).toBeTruthy();

    // Transfer button
    expect(getByText("Transfer")).toBeTruthy();
  });
});
