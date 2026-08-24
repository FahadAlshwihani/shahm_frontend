import { fireEvent, render, screen } from "@testing-library/react";

import CheckboxField from "./CheckboxField";
import PhoneField from "./PhoneField";
import RadioField from "./RadioField";
import SelectField from "./SelectField";

const options = [
  { id: 1, value: "one", label_en: "One", label_ar: "واحد" },
  { id: 2, value: "two", label_en: "Two", label_ar: "اثنان" },
];

test("select, radio, and checkbox fields preserve option values", () => {
  const onValueChange = jest.fn();
  const base = { key: "choice", label_en: "Choice", options };
  const { rerender } = render(
    <SelectField field={base} value="" onValueChange={onValueChange} isEn />
  );
  fireEvent.keyDown(screen.getByRole("combobox"), { key: "Enter" });
  fireEvent.click(screen.getByRole("option", { name: "Two" }));
  expect(onValueChange).toHaveBeenLastCalledWith("choice", "two");

  rerender(<RadioField field={base} value="" onValueChange={onValueChange} isEn />);
  fireEvent.click(screen.getByRole("radio", { name: "One" }));
  expect(onValueChange).toHaveBeenLastCalledWith("choice", "one");

  rerender(<CheckboxField field={base} value={[]} onValueChange={onValueChange} isEn />);
  fireEvent.click(screen.getByRole("checkbox", { name: "Two" }));
  expect(onValueChange).toHaveBeenLastCalledWith("choice", ["two"]);
});

test("phone field emits the documented JSON structure", () => {
  const onValueChange = jest.fn();
  const field = {
    key: "phone",
    label_en: "Phone Number",
    options: [{ id: 1, value: "+966", label_en: "Saudi Arabia +966" }],
  };

  render(
    <PhoneField
      field={field}
      value={{ country_code: "", number: "" }}
      onValueChange={onValueChange}
      isEn
    />
  );

  fireEvent.keyDown(screen.getByRole("combobox"), { key: "Enter" });
  fireEvent.click(screen.getByRole("option", { name: "Saudi Arabia +966" }));
  expect(onValueChange).toHaveBeenCalledWith("phone", {
    country_code: "+966",
    number: "",
  });

  fireEvent.change(screen.getByRole("textbox"), { target: { value: "500000000" } });
  expect(onValueChange).toHaveBeenCalledWith("phone", {
    country_code: "",
    number: "500000000",
  });
});
