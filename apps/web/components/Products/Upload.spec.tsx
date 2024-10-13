/**
 * @vitest-environment jsdom
 */

import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Upload from "./Upload"; // Adjust the import path as needed

describe("Upload Component", () => {
  it("renders the Upload heading", () => {
    render(<Upload />);
    const headingElements = screen.getAllByRole("heading", { name: /upload/i });
    expect(headingElements.length).toBeGreaterThan(0);
  });

  it("renders the placeholder text", () => {
    render(<Upload />);
    const placeholderTextElements = screen.getAllByText("Upload will go here");
    expect(placeholderTextElements.length).toBeGreaterThan(0);
  });

  it("renders within a div container", () => {
    const { container } = render(<Upload />);
    const divElements = container.querySelectorAll("div");
    expect(divElements.length).toBeGreaterThan(0);

    // Check if at least one div has the expected structure
    const hasExpectedStructure = Array.from(divElements).some(
      (div) => div.children.length === 2,
    );
    expect(hasExpectedStructure).toBe(true);
  });
});
