# Base structure
There are 5 basic components that form the core structure of a WDL script: 
* workflow
* task
* call
* command
* output

There are also some optional components you can use to specify **runtime** parameters (like environment conditions such as a Docker image), **meta** information like the task author and email, and **parameter_meta** descriptions of inputs and outputs -- but we're not going to worry about them right now.


Let's look at how the core components are structured in a minimal WDL script that describes a **workflow**called **myWorkflowName** and two tasks, **task_A** and **task_B** (the names can be anything you want and do not have to include the words 'task' or 'workflow'). 

```wdl
version 1.0
workflow myWorkflowName {
  input {
    String workflow_input
  }
  call task_A {
    input: 
      task_A_input = workflow_input
  }
  call task_B {
    input: 
      task_B_input = task_A.out
  }
  output {
    File final_output = task_B.out
  }
}

task Task_A {...}
task Task_B {...}

```

To keep things  simple for now, we're assuming that any parameters, inputs and output filenames are hardcoded (meaning actual filenames and parameter values are written in the script itself), and there are no variables. We'll see in the next step how to add variables to this basic structure.

## Top-level components: workflow, call and task

At the top level, we define a `workflow` within which we make calls to a set of tasks. The tasks are actually defined outside of the workflow definition block while the `call` statements are placed inside of it.

The order in which the workflow block and task definitions are arranged in the script does not matter. Nor does the order of the call statements matter, as we'll see further on.

### call

The `call` component is used within the workflow definition to specify that a particular task should be executed. In its simplest form, a call just needs a task name.

Optionally, we can add a code block to specify input variables for the task. We can also modify the call statement to call the task under an alias, which allows the same task to be run multiple times with different parameters within the same workflow. This makes it very easy to reuse code. 

The order in which call statements are executed does not depend on the order in which they appear in the script; instead it is determined based on a graph of dependencies between task calls. This means that the program infers what order task calls should run in by evaluating which of their inputs are outputs of other task calls. 

#### Examples:
```wdl
# in it's simplest form
call my_task { }
```

```wdl
# with input variables
call my_task {
  input: 
    task_var1 = workflow_var1,
    task_var2 = workflow_var2, 
    ...
}
```

```wdl
# with an alias and input variables

call my_task as task_alias {
  input: 
    task_var1 = workflow_var1, 
    task_var2 = workflow_var2, 
    ...
}
```
### task

The task component is a top-level component of WDL scripts. It contains all the information necessary to "do something" centering around a command accompanied by definitions of input files and parameters, as well as the explicit identification of its output(s) in the output component. It can also be given additional (optional) properties using the runtime, meta and parameter_meta components.

Tasks are "called" from within the workflow definition, which is what causes them to be executed when we run the script. The same task can be run multiple times with different parameters within the same workflow, which makes it very easy to reuse code.

#### Example:
```wdl
task my_task {
  input { ... 
  }
  command <<< ... 
  >>>
  output { ... 
  }
}
```
### workflow

The `workflow` component is a required top-level component of a WDL script. It contains call statements that invoke task components, as well as workflow-level input definitions.

There are various options for chaining tasks together through call and other statements.

#### Example:
```wdl
workflow myWorkflowName {
  call my_task
}
```

## Core task-level components: command and output

If we look inside a task definition, we find its core components: the command that will be run, which can be any command line that you would run in a terminal shell, and an output definition that identifies explicitly which part of the command constitutes its output.

```wdl
task Task_A {
  input {
    String Task_A_input
  }
  command <<<
    do_stuff -R ~{Task_A_input}!'
  >>>
  output {
    File output_file = stdout()
  }
  runtime {
    docker: 'ubuntu:latest'
  }
}
```
### command

The command component is a required property of a task. The body of the command block specifies the literal command line to run (basically any command that you could otherwise run in a terminal shell) with placeholders (e.g. \~{input_file}) for the variable parts of the command line that need to be filled in. All variable placeholders MUST be defined in the task input definitions.

#### Example:
```wdl
command <<<
  java -jar myExecutable.jar \
  INPUT=~{input_file} \
  OUTPUT=~{output_basename}.txt
>>>
```
### output

The output component is a (mostly) required property of a task. It is used to explicitly identify the output(s) of the task command for the purpose of flow control. 

The outputs identified here will be used to build the workflow graph, so it is important to include all outputs that are used as inputs to other tasks in the workflow.

Technically, output is not required for tasks that don't produce an output that is used anywhere else, like in the canonical "Hello World" example. But this is very rare, as most of the time when you are writing a workflow that actually does something useful, each task command will produce some sort of output. Because otherwise, why would you run it, right?

All types of variables accepted by WDL can be included here. The output definitions MUST include an explicit type declaration.

#### Example:
```wdl
output {
  File out = "~{output_basename}.txt"
}
```
As you can see the basic structure of a WDL script is fairly straightforward. In the next section, we're going to make it more realistic by adding variables instead of assuming that input and output names and all parameters are hardcoded.

Go to the next section: [Add Variables](./add_variables.md)

