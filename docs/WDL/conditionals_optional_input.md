# Running conditional tasks based on optional inputs

Thanks to [conditionals](./conditionals.md), WDL supports running or skipping tasks based on a number of different factors, including whether or not an optional input is provided. 

Imagine you have a set of sample files of varying types, but each type needs to be converted to a single, common type before being processed by a common set of tools (or tasks). You could write a workflow for each type of sample file, but that would mean writing and maintaining the code for the common tasks in each workflow you write. Instead, you could write a single workflow that takes advantage of optional inputs and conditional statements to convert and process each type of sample file. This way, you would only need to write and maintain the code for the common processing tasks in a single workflow.

Whatever the reason, conditionals allow you to programmatically decide when you want to run one task versus another. In this document, you’ll see examples of code that run different tasks based on whether or not optional inputs are defined.

## Problem

You need to run a task if one optional input variable is defined, but if it isn’t defined, the task should be skipped.

## Solution

To run or skip tasks based on whether an optional input is provided to the workflow, one or more conditional `if()` statements can be used. 

Let’s say we have a workflow that takes in one optional input and one required input, `my_input_A` and `my_input_B`, and calls two tasks, `task_A` and `task_B`, as shown in the example WDL script below:

```wdl
version 1.0
workflow myWorkflowName {
  input {
    File my_ref
    File? my_input_A
    File my_input_B
    String name
  }
  call task_A {
    input: 
      ref = my_ref,
      in = my_input_A,
      id = name     
  }
  call task_B {
    input: 
      ref = my_ref,
      in = my_input_B,
      id = name
  }
}

task task_A {...}
task task_B {...}
```

As it’s currently written, the workflow will try to run both `task_A` and `task_B` during every run of the workflow, even if the optional input isn’t provided to the workflow. Because `my_input_A` is an optional workflow input and is used in `task_A`, we should only run the task if we define the input variable when launching the workflow.

We can do that by adding an `if()` statement above the task call. Every `if()` statement needs a condition under which the code inside the block should be executed, and in this case, the condition is that our optional input, `my_input_A` is defined. We can check this using the `defined()` function, which will return `true` if the optional variable is defined and `false` if it’s undefined. Let’s take a look at the example workflow below with these additions:

```wdl
version 1.0
workflow myWorkflowName {
  input {
    File my_ref
    File? my_input_A
    File my_input_B
    String name
  }
  if (defined(my_input_A)) {
    call task_A {
      input: 
        ref = my_ref,
        in = my_input_A,
        id = name     
    }
  }
  call task_B {
    input: 
      ref = my_ref,
      in = my_input_B,
      id = name
  }
}

task task_A {...}
task task_B {...}
```

Here, we are using `if (defined(my_input_A))` to first check whether `my_input_A` is defined. If it is, the `if()` statement is true and `task_A` will be executed. If `my_input_A` is not defined, the `if()` statement is false and `task_A` will be skipped.

## Example

Now, let’s look at a real-world example of a WDL workflow that runs or skips tasks based on whether or not an input variable is defined. The code block below contains relevant snippets of the [Imputation pipeline](https://github.com/broadinstitute/warp/blob/master/pipelines/broad/arrays/imputation/Imputation.wdl) in the [WARP GitHub repository](https://github.com/broadinstitute/warp/tree/83dfb2a0c2d8da3c00ed178af76204b75e7230f2).

The Imputation pipeline is an open-source, cloud-optimized pipeline that is based on the [Michigan Imputation Server pipeline](https://imputationserver.readthedocs.io/en/latest/pipeline/) and imputes missing genotypes from either a multi-sample VCF file or an array of single sample VCF files. The pipeline filters, phases, and performs imputation on a multi-sample VCF, and returns the imputed VCF file along with several metrics. For more information, see the [Imputation Overview](https://broadinstitute.github.io/warp/docs/Pipelines/Imputation_Pipeline/README).

The code below shows an example of using a conditional statement to run or skip a task based on whether an optional input is defined. Here, `single_sample_vcfs` is an optional workflow input and is used in the `if()` statement that determines whether the task, `tasks.MergeSingleSampleVcfs`, is executed. If `single_sample_vcfs` is defined, the task will run and the single sample VCF files provided to the workflow will be merged into multi-sample VCF file. If `single_sample_vcfs` is not defined, the task is skipped. 

```wdl
version 1.0
workflow Imputation {
  input {
    # You can either input a multisample VCF or an array of single sample VCFs
    # The pipeline will just merge the single sample VCFs into one multisample VCF
    # and then impute the multisample VCF
    # If you want to run a single sample VCF, set the multi_sample_vcf input to the
    # single sample VCF
    File? multi_sample_vcf
    File? Multi_sample_vcf_index
    # Optional workflow input used to determine whether the task,
    # `tasks.MergeSingleSampleVcfs`, is executed
    Array[File]? single_sample_vcfs
    Array[File]? single_sample_vcf_indices

    Int merge_ssvcf_mem_mb = 3000 # the memory allocation for MergeSingleSampleVcfs (in mb)
  }

  if (defined(single_sample_vcfs)) {
    call tasks.MergeSingleSampleVcfs {
      input:
        input_vcfs = select_first([single_sample_vcfs]),
        input_vcf_indices = select_first([single_sample_vcf_indices]),
        output_vcf_basename = "merged_input_samples",
        memory_mb = merge_ssvcf_mem_mb
    }
  }
}
```

## Resources

- [Conditionals WDL doc](./conditionals.md)
- [WDL 1.0 spec](https://github.com/openwdl/wdl/blob/main/versions/1.0/SPEC.md)
- Imputation pipeline [code](https://github.com/broadinstitute/warp/blob/master/pipelines/broad/arrays/imputation/Imputation.wdl) and [documentation](https://broadinstitute.github.io/warp/docs/Pipelines/Imputation_Pipeline/README)
