import { renderToStaticMarkup } from "react-dom/server";
import RootLayout from "./layout";

describe("RootLayout landmarks", () => {
  it("renders distinct header, nav, main, and footer landmarks", () => {
    const markup = renderToStaticMarkup(
      <RootLayout>
        <section>Dashboard content</section>
      </RootLayout>,
    );

    expect(markup).toContain("<header");
    expect(markup).toContain("<nav");
    expect(markup).toContain('aria-label="Primary"');
    expect(markup).toContain('<main id="main-content"');
    expect(markup).toContain("<footer");
    expect((markup.match(/<main\\b/g) ?? []).length).toBe(1);
  });
});
