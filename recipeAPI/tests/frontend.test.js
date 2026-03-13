const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(path.resolve(__dirname, "../frontend/index.html"), "utf8");

describe("Recipe Recommender UI", () => {
  let dom, document;

  beforeEach(() => {
    dom = new JSDOM(html);
    document = dom.window.document;
  });

  it("should have a search input field", () => {
    const input = document.querySelector("#searchInput");
    expect(input).not.toBeNull();
  });

  it("should have a search button", () => {
    const button = document.querySelector("#searchButton");
    expect(button.textContent.trim()).toBe("Search");
  });
});