# Quickstart

Welcome to the WDL quickstart guide 🚀! This brief guide gives an overview of all the
important bits of the WDL language to ensure you become an expert in writing your own
tasks and workflows. Before diving into an example, let's take a closer look at the
major concepts within the language.

### Tasks

**Tasks** are the atomic units of computation within WDL. Tasks are comprised of a set
of inputs (defined within the `input` section), a set of outputs (defined within the
`output` section), and a command (defined within the `command` section), which is simply
a Bash script to execute. Tasks also support defining _requirements_ (defined within the
`requirements` section) which dictate certain aspects of the task runtime environment.
Importantly, tasks are executed within a [container][container-explanation] to ensure
portability across different execution environments (e.g., your local computer, an HPC,
or the cloud).

### Workflows

**Workflows** string together tasks via their inputs and outputs into a larger
computation graph that can be executed. Workflows are arranged similarly to tasks
except that (a) they don't have a `requirements` section and (b) they make available
more control flow facilities that aren't relevant within a task context. For example,
the workflow below uses both _conditional execution_ (the `if` statement) and a
_scatter-gather_ (the `scatter` keyword and `messages` output). Notably, workflows can
also define inputs and outputs, and these generally serve as the global inputs and
outputs for the execution of a workflow.

### Inputs and Outputs

JSON is used for specifying both inputs to and outputs from a workflow. In the code
block below the workflow, you can see the inputs that are specified for the top-level
`name` parameter. You can also optionally provide a value for the `is_pirate`
parameter. Further, the output of the workflow is communicated back to you via JSON.
Executing workflows typically involves preparing the needed JSON files and reading the
outputs within the JSON returned from your execution engine.

### An example

For example, assume you wanted to write a task that greets someone, as defined in the
`name` input, in multiple different languages. If that individual is a pirate, you might
even wish to greet them conditionally with `Ahoy`! WDL allows you to express this in a
straightforward manner by (a) constructing the atomic computation you'd like to achieve
using a `task` and (b) running that task for each of your greetings using a `workflow`.

```wdl
version 1.2

task say_hello {
    input {
        String greeting
        String name
    }

    command <<<
        echo "~{greeting}, ~{name}!"
    >>>

    output {
        String message = read_string(stdout())
    }

    requirements {
        container: "ubuntu:latest"
    }
}

workflow main {
    input {
        String name
        Boolean is_pirate = false
    }

    Array[String] greetings = select_all([
        "Hello",
        "Hallo",
        "Hej",
        (
            if is_pirate
            then "Ahoy"
            else None
        ),
    ])

    scatter (greeting in greetings) {
        call say_hello {
            greeting,
            name,
        }
    }

    output {
        Array[String] messages = say_hello.message
    }
}

```

#### Running the example

If you were to run the example above with these inputs,

```json
{
  "main.name": "world",
  // "main.is_pirate": true,
}
```

the output of the above workflow would be the following.

```json
{
  "messages": [
    "Hello, world!",
    "Hallo, world!",
    "Hej, world!",
    // "Ahoy, world!" is included if `is_pirate` is set to `true` above.
  ]
}
```

### Conclusion

This workflow, though simple, demonstrates the how WDL accomplishes its main values:
namely, its _human-readable/writable_ style and its _straightforward but powerful_
control flow abstractions. You can learn more about the values of the WDL language on
the [Overview](../overview.md#values) page.

[container-explanation]:
    https://azure.microsoft.com/en-us/resources/cloud-computing-dictionary/what-is-a-container/
