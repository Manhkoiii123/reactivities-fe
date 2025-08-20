import { createMachine, assign } from "xstate";

const activityStateMachine = createMachine({
  id: "activityApp",
  initial: "closed",
  context: {
    selectedActivity: null,
    activities: [],
  },
  states: {
    closed: {
      entry: assign({
        selectedActivity: null,
      }),
      on: {
        CREATE_ACTIVITY: "creating",
        VIEW_ACTIVITY: {
          target: "viewing",
          actions: assign({
            selectedActivity: ({ event }) =>
              event.data || { id: "1", title: "Sample Activity" },
          }),
        },
      },
    },
    creating: {
      entry: assign({
        selectedActivity: null,
      }),
      on: {
        CANCEL: "closed",
        TOGGLE_FORM: "closed",
        SUBMIT: {
          target: "closed",
          actions: assign({
            activities: ({ context, event }) => [
              ...context.activities,
              event.data,
            ],
          }),
        },
      },
    },
    viewing: {
      on: {
        EDIT_ACTIVITY: "editing",
        CANCEL: "closed",
        DELETE_ACTIVITY: {
          target: "closed",
          actions: assign({
            activities: ({ context }) =>
              context.activities.filter(
                (act) => act.id !== context.selectedActivity?.id
              ),
            selectedActivity: null,
          }),
        },
      },
    },
    editing: {
      on: {
        CANCEL: "closed",
        SUBMIT: {
          target: "closed",
          actions: assign({
            activities: ({ context, event }) =>
              context.activities.map((act) =>
                act.id === context.selectedActivity?.id ? event.data : act
              ),
            selectedActivity: null,
          }),
        },
      },
    },
  },
});

export default activityStateMachine;
