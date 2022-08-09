# Call
This documentation is in the process of being updated. In the meantime, you may find that some GATK commands are out of date, or that the WDL information is incomplete. If you encounter any issues you can't solve, please let us know.

The call component is used within the workflow body to specify that a particular task should be executed. In its simplest form, a call just needs a task name.

Optionally, we can add a code block to specify input variables for the task. We can also modify the call statement to call the task under an alias, which allows the same task to be run multiple times with different parameters within the same workflow. This makes it very easy to reuse code; how this works in practice is explained in detail in the Plumbing Options section of the Quick Start guide.

Note that the order in which call statements are executed does not depend on the order in which they appear if the script; instead it is determined based on a graph of dependencies between task calls. This means that the program infers what order task calls should run in by evaluating which of their inputs are outputs of other task calls. This is also explained in detail in the Plumbing Options section.

Example:
# in its simplest form 
call my_task

# with input variables
call my_task{
    input: task_var1= workflow_var1, task_var2= workflow_var2, ...
}

# with an alias and input variables
call my_task as task_alias {
    input: task_var1= workflow_var1, task_var2= workflow_var2, ...
}