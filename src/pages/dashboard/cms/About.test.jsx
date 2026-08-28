import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import api from "../../../api/axiosClient";
import CMSAbout from "./About";

const ABOUT = {
  is_active: true,
  stats: [{ id: 1, number: "+20", label_ar: "سنة خبرة", label_en: "", order: 0, is_active: true }],
  posts: [],
  sections: [],
  partners: [],
};

// The screen's own tabs carry role="tab" as well, so they are addressed by
// their label. The language switch inside a field is named عربي / English.
async function openTab(key) {
  const tab = await screen.findByRole(
    "tab",
    { name: new RegExp(`cms.about.tabs.${key}`) },
    { timeout: 3000 }
  );
  userEvent.click(tab);
}

// react-scripts runs with resetMocks, so the shared client needs its answer
// restored inside every test.
function serveAbout() {
  api.get.mockResolvedValue({ data: ABOUT });
  api.patch.mockResolvedValue({ data: ABOUT });
  api.post.mockResolvedValue({ data: {} });
}

describe("CMSAbout", () => {
  test("every translated value is one field with a language switch", async () => {
    serveAbout();
    render(<CMSAbout />);

    await openTab("posts");

    // Subtitle, title and body: three translated values, three fields, not six
    // controls standing side by side.
    await waitFor(() =>
      expect(screen.getAllByRole("tab", { name: /عربي/ })).toHaveLength(3)
    );
    expect(screen.getAllByRole("tab", { name: /English/ })).toHaveLength(3);
  });

  test("a value keeps both languages while one is edited", async () => {
    serveAbout();
    render(<CMSAbout />);

    await openTab("sections");

    const arabicTabs = await screen.findAllByRole("tab", { name: /عربي/ });
    const titleField = screen.getAllByRole("textbox")[2];

    userEvent.type(titleField, "من نحن");
    expect(titleField).toHaveValue("من نحن");

    userEvent.click(screen.getAllByRole("tab", { name: /English/ })[1]);
    expect(screen.getAllByRole("textbox")[2]).toHaveValue("");

    userEvent.click(arabicTabs[1]);
    expect(screen.getAllByRole("textbox")[2]).toHaveValue("من نحن");
  });

  test("a stat saved in Arabic alone is marked as missing its English", async () => {
    serveAbout();
    render(<CMSAbout />);

    await openTab("stats");

    // The stored stat carries an Arabic label and no English one.
    await waitFor(() =>
      expect(screen.getAllByTitle("لم تعبأ بعد").length).toBeGreaterThan(0)
    );
  });
});
