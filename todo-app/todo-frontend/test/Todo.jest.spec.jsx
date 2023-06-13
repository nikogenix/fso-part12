/**
 * @jest-environment jsdom
 */
import React from "react";
import { Todo } from "../src/Todos/List";
import "@testing-library/jest-dom/extend-expect";

const { render, screen } = require("@testing-library/react");

const todoList = [
	{ text: "todo1", done: true },
	{ text: "todo2", done: false },
];

describe("<Todo />", () => {
	const onClickDelete = jest.fn();
	const onClickComplete = jest.fn();

	it("should render and show the correct status for complete tasks", async () => {
		render(<Todo todo={todoList[0]} onClickDelete={onClickDelete} onClickComplete={onClickComplete} />);

		expect(screen.getByText("todo1")).toBeVisible();
		expect(screen.getByText("This todo is done")).toBeVisible();
	});

	it("should render and show the correct status for tasks in progress", async () => {
		render(<Todo todo={todoList[1]} onClickDelete={onClickDelete} onClickComplete={onClickComplete} />);

		expect(screen.getByText("todo2")).toBeVisible();
		expect(screen.getByText("This todo is not done")).toBeVisible();
	});
});
