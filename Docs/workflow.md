# Workflow
This documentation is in the process of being updated. In the meantime, you may find that some GATK commands are out of date, or that the WDL information is incomplete. If you encounter any issues you can't solve, please let us know.

The workflow component is a required top-level component of a WDL script. It contains call statements that invoke task components, as well as workflow-level input definitions.

There are various options for chaining tasks together through call and other statements; these are all detailed in the Plumbing Options documentation.

Usage example
workflow myWorkflowName {
    call my_task
}