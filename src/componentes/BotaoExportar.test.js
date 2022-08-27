import React from "react";
import { renderWithProviders } from "../util/test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import BotaoExportar from "./BotaoExportar";

test("Executar a exportação", async () => {
  const onExport = jest.fn();
  renderWithProviders(<BotaoExportar onExport={onExport}></BotaoExportar>);

  const botao = await waitFor(() =>
    screen.findByRole("button", { name: /Exportar para CSV/i })
  );
  fireEvent.click(botao);

  expect(onExport).toHaveBeenCalled();
});
