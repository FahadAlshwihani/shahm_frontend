import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ContactCardsCMS from "./ContactCardsCMS";

describe("ContactCardsCMS", () => {
  test("renders one field per translated value instead of two", async () => {
    render(<ContactCardsCMS />);

    await waitFor(() =>
      expect(screen.getAllByRole("tab", { name: /عربي/ })).toHaveLength(5)
    );

    // Five translated values: title, subtitle, description, and the two button
    // labels. Each is one control, not an Arabic input beside an English one.
    expect(screen.getAllByRole("tab", { name: /English/ })).toHaveLength(5);
  });

  test("keeps focus in the action target while it is typed into", async () => {
    render(<ContactCardsCMS />);

    const actionType = await screen.findByLabelText(
      "cms.contact.cards.fields.action_type",
      { selector: "#primary-action" }
    );

    userEvent.selectOptions(actionType, "url");

    const target = await screen.findByLabelText("cms.contact.cards.fields.url");

    userEvent.click(target);
    userEvent.type(target, "https://shahmlaw.sa");

    expect(target).toHaveValue("https://shahmlaw.sa");
    expect(target).toHaveFocus();
  });

  test("nothing is offered for saving until something changes", async () => {
    render(<ContactCardsCMS />);

    const save = await screen.findByRole("button", {
      name: "cms.contact.cards.actions.save",
    });

    expect(save).toBeDisabled();

    userEvent.type(screen.getAllByRole("textbox")[0], "بطاقة");

    await waitFor(() => expect(save).toBeEnabled());
  });
});
