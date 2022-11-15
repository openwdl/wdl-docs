# Running conditional tasks based on input size

Thanks to [conditionals](conditionals.md), WDL supports running or skipping tasks based on a number of different factors, including the size of a file. 

There are a number of reasons you might want to run a different task (or the same task with a different set of parameters; see [Task aliasing](task_aliasing.md)) if your data is larger or smaller than a certain size, but these reasons basically boil down to the efficiency of your task and workflow. Maybe you are expecting a lot of variability in the input file size for a task, so you want to run the task with different parameters that are optimized for the different sizes. Or maybe you are using a tool that can only handle inputs up to a certain size, so you want to split your inputs across different virtual machines, but only if the inputs are above the size limit of the tool.

Whatever the reason, conditionals allow you to programmatically decide when you want to run one task versus another. In this document, you’ll see examples of code that run different tasks based on the size of the input files.

## Problem

You want to run one task if an input file is below a certain size and a different task if the input file is above a certain size.

## Solution

To run a different task or set of tasks based on the size of an input file, one or more conditional `if()` statements can be used. 

Let’s say we have a workflow that calls two tasks, `task_A` and `task_B`, as shown in the example WDL script below:

```wdl
version 1.0
workflow myWorkflowName {
  input {
    File my_ref
    File my_input
    String name
  }
  call task_A {
    input: 
      ref = my_ref,
      in = my_input,
      id = name     
  }
  call task_B {
    input: 
      ref = my_ref,
      in = my_input,
      id = name
  }
}

task task_A {...}
task task_B {...}
```

We don’t want the workflow to run both `task_A` and `task_B`, which is what would happen if we ran it as it’s written above. Instead, we want the workflow to run only one task, and which task it runs should depend on the size of one of the input files, like the file called `my_input` shown above. 

To do that, we first need to tell the workflow what the cutoff size should be. We can do that by adding another input variable to the workflow called `input_size_cutoff_mb`. You can hardcode a cutoff size into the workflow or allow the cutoff to be defined at execution.

We still need to tell our workflow under what conditions we want it to run each task, and we’ll do that using `if()` statements along with the `size()` function. Specifically, we’ll compare the size of our inputs to the cutoff size and, depending on if our input size is smaller or larger than the cutoff size, we’ll run either `task_A` or `task_B`. Let’s look at the example code below:

```wdl
version 1.0
workflow myWorkflowName {
  input {
    File my_ref
    File my_input
    String name

    # Specifies the cutoff size in megabytes for the following `if()` statements
    Float input_size_cutoff_mb
  }

  # Only run `task_A` if the size of `my_input` in megabytes is larger than the size 
  # of the cutoff
  if (size(my_input, “MB”) > input_size_cutoff_mb) {
    call task_A {
      input: 
        ref = my_ref,
        in = my_input,
        id = name     
    }
  }

  # Only run `task_B` if the size of `my_input` in megabytes is smaller than or equal 
  # to the size of the cutoff
  if (size(my_input, “MB”) <= input_size_cutoff_mb) {
    call task_B {
      input: 
        ref = my_ref,
        in = my_input,
        id = name     
    }
  }
}

task task_A {...}
task task_B {...}
```

Here, we are using `size(my_input, “MB”)` to get the size in megabytes of our input file, then comparing it to the size of `input_size_cutoff_mb`. Check out the [WDL 1.0 spec](https://github.com/openwdl/wdl/blob/main/versions/1.0/SPEC.md#float-sizefile-string) to read more about using `size()` in WDL. 

The `if()` statements specify that the workflow should run `task_A` only if the size of `my_input` is larger than the size of the cutoff and `task_B` only if the size of `my_input` is smaller than or equal to the size of the cutoff.

## Example

Now, let’s look at a real-world example of a WDL workflow that checks the size of an input file and then runs one or more different tasks based on how that size compares to a cutoff. The code block below contains relevant snippets of the [Optimus pipeline](https://github.com/broadinstitute/warp/blob/83dfb2a0c2d8da3c00ed178af76204b75e7230f2/pipelines/skylab/optimus/Optimus.wdl) in the [WARP GitHub repository](https://github.com/broadinstitute/warp/tree/83dfb2a0c2d8da3c00ed178af76204b75e7230f2). *Note that this version of the pipeline is not currently available on the main branch of the repository and the code block below does not contain the full script.*

The Optimus pipeline is an open-source, cloud-optimized pipeline that supports the processing of any 3' single-cell and single-nucleus count data generated with the [10x Genomics v2 or v3 assay](https://www.10xgenomics.com/solutions/single-cell/). The pipeline corrects cell barcodes and UMIs, aligns reads, marks duplicates calculates summary metrics for genes and cells, detects empty droplets, returns read outputs in BAM format, and returns cell gene counts in NumPy matrix and Loom file formats. For more information, see the [Optimus Overview](https://broadinstitute.github.io/warp/docs/Pipelines/Optimus_Pipeline/README/).

```wdl
version 1.0
workflow Optimus {
  input {
    # Mode for counting either "sc_rna" or "sn_rna"
    String counting_mode = "sc_rna"

    # Sequencing data inputs
    Array[File] r1_fastq
    Array[File] r2_fastq
    Array[File]? i1_fastq
    String input_id
    String output_bam_basename = input_id

    # organism reference parameters
    File tar_star_reference

    # 10x parameters
    File whitelist
    # tenX_v2, tenX_v3
    String chemistry = "tenX_v2" 

    # Set to true to count reads aligned to exonic regions in sn_rna mode
    Boolean count_exons = false
  }
  
  # Get the size of the input fastq files with `size()` function and round up to the nearest integer with the `ceil()` function
  Int fastq_input_size = ceil(size(r1_fastq, "Gi") ) +  ceil(size(r2_fastq, "Gi"))

  # Check whether the combined size of the input fastq files is larger than 30 Gi
  Boolean split_fastqs = if ( fastq_input_size > 30 ) then true else false

  # Run the following three tasks only if `split_fastqs` is true
  if ( split_fastqs ) {
    # Split the input fastq into multiple fastq files 
    call FastqProcessing.FastqProcessing as SplitFastq {
      input:
        i1_fastq = i1_fastq,
        r1_fastq = r1_fastq,
        r2_fastq = r2_fastq,
        whitelist = whitelist,
        chemistry = chemistry,
        sample_id = input_id
    }
    # Scatter the fastq files and call STARsolo in parallel
    scatter(idx in range(length(SplitFastq.fastq_R1_output_array))) {
      call StarAlign.STARsoloFastq as STARsoloFastq {
        input:
          r1_fastq = [SplitFastq.fastq_R1_output_array[idx]],
          r2_fastq = [SplitFastq.fastq_R2_output_array[idx]],
          white_list = whitelist,
          tar_star_reference = tar_star_reference,
          chemistry = chemistry,
          counting_mode = counting_mode,
          count_exons = count_exons,
          output_bam_basename = output_bam_basename + "_" + idx
      }
    }
    # Merge the bam files from the previous task
    call Merge.MergeSortBamFiles as MergeBam {
      input:
        bam_inputs = STARsoloFastq.bam_output,
        output_bam_filename = output_bam_basename + ".bam",
        sort_order = "coordinate"
    }
  }

  # Run the following task only if `split_fastqs` is false
  if ( !split_fastqs ) {
    # Call STARsolo to analyze a single fastq
    call StarAlign.STARsoloFastq as STARsoloFastqSingle {
      input:
        r1_fastq = r1_fastq,
        r2_fastq = r2_fastq,
        white_list = whitelist,
        tar_star_reference = tar_star_reference,
        chemistry = chemistry,
        counting_mode = counting_mode,
        count_exons = count_exons,
        output_bam_basename = output_bam_basename
    }
  }
}
```

The example above shows a slightly different way of using conditionals to run different tasks based on the size of your inputs. Here, both the size of the input files and whether that size is larger than the cutoff (30 Gi) is determined outside of the `if()` statements and saved as a boolean variable, `split_fastqs`. This way, you only need to evaluate and compare the input sizes a single time in the workflow, and can then use the value of the resulting boolean variable as many times as you need.

## Resources

- [Conditionals WDL doc](./conditionals.md)
- [Task aliasing WDL doc ](task_aliasing.md)
- [WDL 1.0 spec](https://github.com/openwdl/wdl/blob/main/versions/1.0/SPEC.md)
- Optimus pipeline [code](https://github.com/broadinstitute/warp/blob/83dfb2a0c2d8da3c00ed178af76204b75e7230f2/pipelines/skylab/optimus/Optimus.wdl) and [documentation](https://broadinstitute.github.io/warp/docs/Pipelines/Optimus_Pipeline/README)