import React from 'react'
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import Verify from "@/components/verify";

jest.mock("axios");

describe("Verify component", () => {
  beforeEach(() => {
    render(<Verify />);
  });

  it("renders 6 input fields", () => {
    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(6);
  });

  it("moves focus to the next input field when a digit is entered", () => {
    const input = screen.getByRole("textbox", { name: /digit 1/i });
    fireEvent.change(input, { target: { value: "1" } });
    expect(screen.getByRole("textbox", { name: /digit 2/i })).toHaveFocus();
  });

  it("does not move focus to the next input field when a non-digit character is entered", () => {
    const input = screen.getByRole("textbox", { name: /digit 1/i });
    fireEvent.change(input, { target: { value: "a" } });
    expect(screen.getByRole("textbox", { name: /digit 1/i })).toHaveFocus();
  });

  it("limits input value to 1 character when pasted value is longer than 1 character", () => {
    const input = screen.getByRole("textbox", { name: /digit 1/i });
    fireEvent.paste(input, { clipboardData: { getData: () => "123" } });
    expect(input.value).toBe("1");
    expect(screen.getByRole("textbox", { name: /digit 2/i }).value).toBe("2");
  });

  it("deletes previous input field when current one is empty", () => {
    const input1 = screen.getByRole("textbox", { name: /digit 1/i });
    const input2 = screen.getByRole("textbox", { name: /digit 2/i });
    fireEvent.change(input1, { target: { value: "1" } });
    fireEvent.change(input2, { target: { value: "" } });
    fireEvent.keyDown(input2, { key: "Backspace" });
    expect(input1).toHaveFocus();
  });

  it("submits the verification code when all input fields are filled with digits", async () => {
    const inputs = screen.getAllByRole("textbox");
    inputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: `${index + 1}` } });
    });

    axios.post.mockResolvedValueOnce({ status: 200 });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    expect(axios.post).toHaveBeenCalledWith("/api/verify", { code: "123456" });
    expect(screen.getByRole("heading", { name: /success/i })).toBeInTheDocument();
  });

})