import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { NotebookPickerPanel } from "./BrowseWorkspace";

jest.mock("html-react-parser", () => value => value);

const notebooks = {
  10: { id: 10, name: "Work" },
  20: { id: 20, name: "Personal" },
};

const notes = {
  1: {
    id: 1,
    notebookId: 10,
    title: "Work note",
    content: "<p>Work details</p>",
    createdAt: "2026-07-23T12:00:00.000Z",
    updatedAt: "2026-07-23T12:00:00.000Z",
  },
  2: {
    id: 2,
    notebookId: 20,
    title: "Personal note",
    content: "<p>Personal details</p>",
    createdAt: "2026-07-23T11:00:00.000Z",
    updatedAt: "2026-07-23T11:00:00.000Z",
  },
};

function renderPicker() {
  return render(
    <NotebookPickerPanel
      notebooks={notebooks}
      notes={notes}
      onOpenNotebook={jest.fn()}
      onOpenNote={jest.fn()}
      onCreateNote={jest.fn()}
      onCreateNotebook={jest.fn()}
    />
  );
}

function pickerWithNotes(nextNotes) {
  return (
    <NotebookPickerPanel
      notebooks={notebooks}
      notes={nextNotes}
      onOpenNotebook={jest.fn()}
      onOpenNote={jest.fn()}
      onCreateNote={jest.fn()}
      onCreateNotebook={jest.fn()}
    />
  );
}

test("moves notebook navigation into a rail while a preview is open", () => {
  const { container } = renderPicker();

  fireEvent.click(screen.getByRole("button", { name: /Work 1 notes/i }));

  expect(
    container.querySelector(".notebookPickerWorkspace.is-previewing")
  ).not.toBeNull();
  expect(
    screen
      .getByRole("button", { name: /Work 1 notes/i })
      .getAttribute("aria-pressed")
  ).toBe("true");
  expect(screen.getAllByText("Work details")).toHaveLength(2);

  fireEvent.click(screen.getByRole("button", { name: /Personal 1 notes/i }));
  expect(screen.getAllByText("Personal details")).toHaveLength(2);
});

test("restores the full notebook grid from the preview rail", () => {
  const { container } = renderPicker();

  fireEvent.click(screen.getByRole("button", { name: /Work 1 notes/i }));
  fireEvent.click(
    screen.getByRole("button", { name: /All notebooks/i })
  );

  expect(
    container.querySelector(".notebookPickerWorkspace.is-previewing")
  ).toBeNull();
  expect(
    screen.queryByRole("button", { name: /All notebooks/i })
  ).toBeNull();
});

test("refreshes an open preview when notes change", () => {
  const { rerender } = render(pickerWithNotes({}));

  fireEvent.click(screen.getByRole("button", { name: /No notebook 0 notes/i }));
  expect(screen.getByText("No notes yet.")).not.toBeNull();

  rerender(
    pickerWithNotes({
      3: {
        id: 3,
        notebookId: null,
        title: "New unassigned note",
        content: "<p>Loaded after preview opened</p>",
        createdAt: "2026-07-23T13:00:00.000Z",
        updatedAt: "2026-07-23T13:00:00.000Z",
      },
    })
  );

  expect(screen.getAllByText("New unassigned note")).toHaveLength(2);
  expect(screen.getAllByText("Loaded after preview opened")).toHaveLength(2);
});
