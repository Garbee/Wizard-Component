# Wizard Component

A simple wizard component for use with Material Design Lite.

Material Design does not provide guidance for wizards at the current time. So the styles provided are inspired by Material Design but do not adhere to any particular part of the specification.

This component is currently undergoing major development. For all that is holy do **NOT** use this in production. No stability or support offered at this time.

## Events

| Name              | Bubbles | Cancel-able |
| ----------------- | ------- | ----------- |
| wizard-moving     | Yes     | Yes         |
| wizard-moved      | Yes     | No          |
| wizard-onLastStep | Yes     | No          |

The `wizard-moving` event fires once the next button has been pressed **before** the new content is shown.
This allows you to cancel the event to prevent moving to the next step in the wizard.
The `wizard-moved` event fires once the new content is shown.
If the final step has been moved to, the `wizard-onLastStep` event is fired.
