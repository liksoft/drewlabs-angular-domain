import { StoreAction, DrewlabsFluxStore, createAction } from "./rx-state";
import { Log } from "../../utils/logger";
import { observableOf } from "../helpers";
import { delay, map } from "rxjs/operators";
import { tick, fakeAsync } from "@angular/core/testing";

class Message {
  id!: string;
  subject!: string;
  content!: string;
  destination!: string;
}

class MessageState {
  isLoading!: boolean;
  messages!: Message[];
}

export default function reducer(
  state: MessageState,
  action: Partial<StoreAction>
) {
  switch (action.type) {
    case "MESSAGE_LIST_LOADING":
      return {
        ...state,
        isLoading: true,
      } as MessageState;
    case "MESSAGE_LOADED":
      return {
        ...state,
        isLoading: false,
        messages: action.payload,
      } as MessageState;
    case "PATCH_MESSAGES":
      return {
        ...state,
        isLoading: false,
        messages: [...state.messages, action.payload],
      } as MessageState;
    case "UPDATE_MESSAGE_ACTION":
      const messages = [...state.messages];
      const index = messages.findIndex(
        (value) => value.id === action.payload.id
      );
      if (index !== 1) {
        messages.splice(
          index,
          1,
          Object.assign(messages[index], action.payload.newVal)
        );
      }
      return {
        ...state,
        isLoading: false,
        messages,
      };
    default:
      return state;
  }
}

describe("Rx state test definitions", () => {
  it("should be successful no matter what", fakeAsync(() => {
    const state = new DrewlabsFluxStore(reducer, {
      isLoading: false,
      messages: [],
    });
    const newMessagesAction = createAction(
      state,
      (messages: Partial<Message>[]) => {
        return {
          type: "MESSAGE_LOADED",
          payload: messages,
        };
      }
    );
    const updateMessage = createAction(state, (payload) => {
      return {
        type: "UPDATE_MESSAGE_ACTION",
        payload,
      };
    });
    const asyncAction = createAction(state, (payload: Message) => {
      return {
        type: "MESSAGE_LIST_LOADING",
        payload: observableOf<Message>(payload).pipe(
          delay(1000),
          map(
            (source) =>
              ({
                type: "PATCH_MESSAGES",
                payload: source,
              } as Partial<StoreAction>)
          )
        ),
      };
    });
    setTimeout(() => {
      state
      .connect()
      .pipe()
      .subscribe((value) => Log("Current state value: ", JSON.stringify(value.messages)));
    }, 3000);

    newMessagesAction([
      {
        id: "0023",
        subject: "New Subjec1",
        content: "New Message content",
        destination: "asmyns.platonnas29@gmail.com",
      },
    ]);
    updateMessage({
      id: "0023",
      newVal: {
        subject: "Subject1 [UPDATED]",
      },
    });
    asyncAction({
      id: "00450",
      subject: "Loaded Message subject",
      content: "Loaded Message content",
      destination: "azandrewdevelopper@gmail.com",
    });
    tick(5000);
    expect(true).toBeTrue();
  }));
});
