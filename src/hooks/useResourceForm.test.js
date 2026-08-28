import { act, renderHook, waitFor } from "@testing-library/react";

import useResourceForm from "./useResourceForm";

const INITIAL = { title_ar: "", title_en: "", order: 0 };

describe("useResourceForm", () => {
  test("tracks which fields changed", () => {
    const { result } = renderHook(() =>
      useResourceForm({ initialValues: INITIAL, onSubmit: jest.fn() })
    );

    expect(result.current.dirty).toBe(false);

    act(() => result.current.setField("title_ar", "بطاقة"));

    expect(result.current.dirty).toBe(true);
    expect(result.current.dirtyFields).toEqual(["title_ar"]);
  });

  test("a value typed back to its original is not a change", () => {
    const { result } = renderHook(() =>
      useResourceForm({ initialValues: INITIAL, onSubmit: jest.fn() })
    );

    act(() => result.current.setField("title_ar", "بطاقة"));
    act(() => result.current.setField("title_ar", ""));

    expect(result.current.dirty).toBe(false);
  });

  test("a successful save clears the pending state", async () => {
    const onSubmit = jest.fn().mockResolvedValue(true);
    const { result } = renderHook(() =>
      useResourceForm({ initialValues: INITIAL, onSubmit })
    );

    act(() => result.current.setField("title_ar", "بطاقة"));

    await act(async () => {
      await result.current.submit();
    });

    expect(onSubmit).toHaveBeenCalledWith({ ...INITIAL, title_ar: "بطاقة" });
    expect(result.current.dirty).toBe(false);
    expect(result.current.saving).toBe(false);
  });

  test("a rejected save puts the server message on the field", async () => {
    const onSubmit = jest.fn().mockRejectedValue({
      response: {
        status: 400,
        data: { errors: { title_en: ["This field may not be blank."] } },
      },
    });
    const { result } = renderHook(() =>
      useResourceForm({ initialValues: INITIAL, onSubmit })
    );

    act(() => result.current.setField("title_ar", "بطاقة"));

    let saved;
    await act(async () => {
      saved = await result.current.submit();
    });

    expect(saved).toBe(false);
    expect(result.current.errors.title_en).toBe("This field may not be blank.");
    // The edit is still pending, so nothing the editor typed is lost.
    expect(result.current.dirty).toBe(true);
  });

  test("editing a rejected field clears its message", async () => {
    const onSubmit = jest.fn().mockRejectedValue({
      response: { status: 400, data: { errors: { title_en: ["Required."] } } },
    });
    const { result } = renderHook(() =>
      useResourceForm({ initialValues: INITIAL, onSubmit })
    );

    await act(async () => {
      await result.current.submit();
    });

    expect(result.current.errors.title_en).toBe("Required.");

    act(() => result.current.setField("title_en", "Card"));

    await waitFor(() => expect(result.current.errors.title_en).toBeUndefined());
  });

  test("a cancelled request is not reported as a failure on the fields", async () => {
    const onSubmit = jest.fn().mockRejectedValue({ code: "ERR_CANCELED" });
    const { result } = renderHook(() =>
      useResourceForm({ initialValues: INITIAL, onSubmit })
    );

    await act(async () => {
      await result.current.submit();
    });

    expect(result.current.errors).toEqual({});
    expect(result.current.formError).toBe("");
  });

  test("loading a record replaces the values and the baseline", () => {
    const { result } = renderHook(() =>
      useResourceForm({ initialValues: INITIAL, onSubmit: jest.fn() })
    );

    act(() => result.current.setValues({ title_ar: "بطاقة", title_en: "Card", order: 2 }));

    expect(result.current.values.title_en).toBe("Card");
    expect(result.current.dirty).toBe(false);
  });

  test("a restored draft counts as a pending change", () => {
    const { result } = renderHook(() =>
      useResourceForm({ initialValues: INITIAL, onSubmit: jest.fn() })
    );

    act(() =>
      result.current.setValues(
        { title_ar: "مسودة", title_en: "", order: 0 },
        { asBaseline: false }
      )
    );

    expect(result.current.dirty).toBe(true);
  });
});
