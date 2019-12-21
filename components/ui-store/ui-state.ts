export class UIState {
  constructor(public performingAction: boolean, public uiMessage?: string) {}
}

export const initialUIState: UIState = {
  performingAction: false,
  uiMessage: null
};
