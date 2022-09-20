# Call

The `call` component is used within the workflow body to specify that a particular task should be executed. In its simplest form, a call just needs a task name.

Optionally, we can add a code block to specify input variables for the task. We can also modify the call statement to call the task under an alias, which allows the same task to be run multiple times with different parameters in the same workflow. This makes it very easy to reuse code. See [Task aliasing](task_aliasing.md) for more information.

Note that the order in which call statements are executed does not depend on the order in which they appear if the script; instead it is determined based on a graph of dependencies between task calls. This means that the program infers what order task calls should run in by evaluating which of their inputs are outputs of other task calls. 

## Examples

```wdl
# in its simplest form
call task_A

# with input variables
call task_A {
    input: 
        ref = my_ref,
        in = my_input,
        id = name
}

# with an alias and input variables
call task_A as my_task {
    input:
        ref = my_ref,
        in = my_input,
        id = name
}
```