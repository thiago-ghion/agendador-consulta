import React from "react";
import { renderWithProviders } from "../util/test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import Loading from "./Loading";

test("Habilitar o loading", async () => {
  renderWithProviders(
    <Loading>
      <></>
    </Loading>,
    { preloadedState: { loading: { isLoading: true } } }
  );

  await waitFor(() => screen.findByTestId("load"));
});

test("Desabilitar o loading", async () => {
  renderWithProviders(
    <Loading>
      <></>
    </Loading>,
    { preloadedState: { loading: { isLoading: false } } }
  );

  await waitFor(() => {
    expect(screen.queryByTestId("load")).not.toBeInTheDocument();
  });
});
