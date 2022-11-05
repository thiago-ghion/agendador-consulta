import React from "react";
import { renderWithProviders } from "../util/test-utils";
import GoogleAuth from "./GoogleAuth";

test("Renderização do componente", async () => {
  expect(renderWithProviders(<GoogleAuth></GoogleAuth>)).toMatchSnapshot();
});
