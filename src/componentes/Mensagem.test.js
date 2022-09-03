import React from "react";
import { renderWithProviders } from "../util/test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import Mensagem from "./Mensagem";

test("Nenhuma mensagem", async () => {
  renderWithProviders(<Mensagem></Mensagem>);
  await waitFor(() => {
    expect(screen.getByTestId("caixavazia")).toBeInTheDocument();
  });

  await waitFor(() => {
    expect(screen.queryByTestId("caixamensagem")).not.toBeInTheDocument();
  });
});

test("Com mensagem", async () => {
  renderWithProviders(<Mensagem></Mensagem>, {
    preloadedState: { mensagem: { mensagem: "Mensagem de teste" } },
  });
  await waitFor(() => {
    expect(screen.queryByTestId("caixavazia")).not.toBeInTheDocument();
  });

  await waitFor(() => {
    expect(screen.getByTestId("caixamensagem")).toBeInTheDocument();
  });
});
