import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import BilingualField from "./BilingualField";

function Harness({ initial = {}, errors = {}, as = "input" }) {
  const [values, setValues] = React.useState({
    title_ar: "",
    title_en: "",
    ...initial,
  });

  return (
    <BilingualField
      label="العنوان"
      name="title"
      as={as}
      values={values}
      errors={errors}
      onChange={(name, value) => setValues((current) => ({ ...current, [name]: value }))}
    />
  );
}

describe("BilingualField", () => {
  test("edits one language at a time and keeps both values", () => {
    render(<Harness />);

    userEvent.type(screen.getByRole("textbox"), "بطاقة");
    expect(screen.getByRole("textbox")).toHaveValue("بطاقة");
    expect(screen.getByRole("textbox")).toHaveAttribute("dir", "rtl");

    userEvent.click(screen.getByRole("tab", { name: /English/ }));
    expect(screen.getByRole("textbox")).toHaveValue("");
    expect(screen.getByRole("textbox")).toHaveAttribute("dir", "ltr");

    userEvent.type(screen.getByRole("textbox"), "Card");

    userEvent.click(screen.getByRole("tab", { name: /عربي/ }));
    expect(screen.getByRole("textbox")).toHaveValue("بطاقة");
  });

  test("says when the other language is still empty", () => {
    render(<Harness initial={{ title_ar: "بطاقة" }} />);

    expect(screen.getByRole("tab", { name: /English/ })).toHaveAttribute(
      "aria-selected",
      "false"
    );
    expect(screen.getByTitle("لم تعبأ بعد")).toBeInTheDocument();
  });

  test("copies the Arabic text when English is empty", () => {
    render(<Harness initial={{ title_ar: "بطاقة" }} />);

    userEvent.click(screen.getByRole("tab", { name: /English/ }));
    userEvent.click(screen.getByRole("button", { name: "انسخ النص العربي" }));

    expect(screen.getByRole("textbox")).toHaveValue("بطاقة");
  });

  test("shows the server message on the language it was raised for", () => {
    render(
      <Harness
        initial={{ title_ar: "بطاقة" }}
        errors={{ title_en: "This field may not be blank." }}
      />
    );

    // Arabic is shown first and carries no error.
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByTitle("رفضه الخادم")).toBeInTheDocument();

    userEvent.click(screen.getByRole("tab", { name: /English/ }));

    expect(screen.getByRole("alert")).toHaveTextContent("This field may not be blank.");
  });

  test("renders a textarea when asked for one", () => {
    render(<Harness as="textarea" />);

    expect(screen.getByRole("textbox").tagName).toBe("TEXTAREA");
  });
});
