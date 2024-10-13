/**
 * @vitest-environment jsdom
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "./page";

describe("Home Component", () => {
  it("renders the component", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1 })).toBeDefined();
  });

  it("displays the correct heading", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Catalogue Manager",
    );
  });

  it("contains a list with two items", () => {
    render(<Home />);
    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(2);
  });

  it("has a link to the upload page", () => {
    render(<Home />);
    const uploadLink = screen.getByRole("link", { name: /upload/i });
    expect(uploadLink).toHaveAttribute("href", "/products/upload");
  });

  it("has a link to the manage page", () => {
    render(<Home />);
    const manageLink = screen.getByRole("link", { name: /manage/i });
    expect(manageLink).toHaveAttribute("href", "/products");
  });

  it("applies the correct CSS class", () => {
    const { container } = render(<Home />);
    expect(container.firstChild).toHaveClass("mockedPageClass");
  });
});
