# Linear chaining

The simplest way to chain tasks together in a workflow is a **linear chain**, whereby
the outputs of one tasks feeds into the input of the next task. The diagram below show
the linear chaining of three tasks in a row.

![A diagram showing linear chaining of three tasks: `stepA`, `stepB`, and `stepC`. Each
task is laid out linearly in the order described. The first task (`stepA`) accepts no
inputs and produces a single output (`out`). The second task (`stepB`) has a single
input (`in`) that is connected to the `out` output from `stepA` and has a single output
(`out`). The third task (`stepC`) has a single input (`in`) that is connected to the
`out` output from `stepB` and has no outputs. This forms a linear execution chain of
these tasks.](header.png)

WDL allows this to be expressed simply, as the output of any task (declared in the
`output` section of the task) may be used as an input to another task when it is called
(via the `call` directive).

```wdl
# ... task definitions ...

workflow run {
  # Run the first task.
  call stepA {}

  # Run `stepB`, connecting the `in` input to `stepA`'s `out` output.
  call stepB { input: in = stepA.out }

  # Run `stepC`, connecting the `in` input to `stepB`'s `out` output.
  call stepC { input: in = stepB.out }
}
```

This works because each task creates a _scope_ of the same name as the task that
contains that tasks outputs. Similarly, when using a `call` directive, you can set
values of the inputs within that task's scope.

## A full example

For a more complete picture, here is a workflow that actually computes π by getting the
constant from Python.

```wdl
version 1.2

# (1) We write a task to calculate π.
task calculate_pi {
  command <<<
    python3 -c "import math; print(math.pi)"
  >>>

  output {
    # (a) π is output as an _output_ of this task here.
    # It's read from standard input and parsed as a `Float`.
    Float pi = read_float(stdout())
  }
}

# (2) We write a task that takes in the output from the
# previous task and uses it to compute the area of a circle.
task calculate_circle_area {
  input {
    # (a) π is taken as an input here.
    Float pi
    Float radius = 5.0
  }

  command <<<
    bc -l <<< "2 * ~{pi} * ~{radius}"
  >>>

  output {
    Float area = read_float(stdout())
  }
}

# (3) We write a workflow that linearly chains the two tasks
# by connecting the output of the first task to the input of
# the second task.
workflow hello {
  # (a) π is calculated in this step.
  call calculate_pi

  # (b) the output from the `calculate_pi` step is passed to
  # the input of the `calculate_circle_area` input here.
  call calculate_circle_area { input: pi = calculate_pi.pi }

  output {
    Float area = calculate_circle_area.area
  }
}

# Now, π will first be calculated by calling `calculate_pi`
# and, once that has completed, `calculate_circle_area` will
# be called using the calculated constant.
```
