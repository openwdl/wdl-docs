# Workflow

The `workflow` component is a required top-level component of a WDL script. It contains `call` statements that invoke `task` components, as well as workflow-level input definitions.

There are various options for chaining tasks together using `call` and other statements. For more information, see [Add plumbing](add_plumbing.md).

## Usage example
```wdl
workflow myWorkflowName {
    call task_A
}
```