# Scattering on optional types

Scattering on optional types isn’t actually possible in WDL 1.0, but by using the `select_first()` function, you can convert an optional type to a non-optional type.

You’ll likely find this method useful anytime you want to scatter optional and non-optional inputs together. For example, you might have arrays of samples and sample IDs that need to be scattered and processed, but you might also want the flexibility to provide sample names. In that case, the array of sample names would be an optional workflow input that, when provided, gets scattered along with the arrays of samples and sample IDs.

In order to scatter on optional inputs, you need to convert the optional inputs to non-optional and index into any inputs you want to scatter together. To learn more about scattering in WDL, see [Scatter-gather parallelism](ScatterGather_parallelism.md).

In this document, you’ll see examples of code that use indices and the `select_first()` function to scatter optional input arrays together with non-optional arrays.

## Problem

You have both optional and non-optional input arrays that you need to scatter together and run through a task in parallel.

## Solution

Since scattering on optional types isn’t supported by WDL 1.0, we first need to convert optional inputs to non-optional before scattering arrays together using the index. To learn more about scattering on an index, see [Scattering on an index](scattering_index.md).

Let’s say we have a workflow that takes in two arrays as input where one array, `my_input`, is non-optional and the other, `my_ref`, is optional. Then, the workflow scatters the non-optional array by index and calls one task, `task_A`, as show in the code below. 

```wdl
version 1.0
workflow myWorkflowName {
  input {
    Array[File]? my_ref
    Array[File] my_input
    String name
  }
  scatter (idx in range(length(my_input))) {
    call task_A {
      input: 
        ref = my_ref,
        in = my_input[idx],
        id = name     
    }
  }
}

task task_A {...}
```

In order to scatter the optional input, `my_ref`, together with `my_input`, we first need to convert it to a non-optional input inside the scatter block using the `select_first()` function, which selects and returns the first defined value. 

The `select_first()` function requires that at least one defined value exists, but since `my_ref` is an optional workflow input, that may not always be the case. To get around this, we can use an `if then else` operator and `defined()` function to ensure that the `select_first()` function is only evaluated when `my_ref` is provided to the workflow. 

The last thing we need to do is actually scatter `my_ref` by index, which can be done by simply adding `[idx]` to the task-level input. Let’s take a look at the example workflow after the functions described have been added:

```wdl
version 1.0
workflow myWorkflowName {
  input {
    Array[File]? my_ref
    Array[File] my_input
    String name
  }

  if (false) {
     String? none = "None"
  }

  scatter (idx in range(length(my_input))) {
    call task_A {
      input: 
        ref = if defined(my_ref) then select_first([my_ref])[idx] else none,
        in = my_input[idx],
        id = name     
    }
  }
}

task task_A {...}
```

There’s one other component that we added to the workflow in order to scatter on the optional input array. In the input block of the task call, you’ll notice that the `if then else` operator ends in `else none`. This bit of code tells our workflow that if `my_ref` is defined, `my_ref[idx]` will be used as input to `task_A`, but if `my_ref` is undefined (or not provided to the workflow), then the task input `ref` is set to `none`. In WDL, `none` is not defined by default, so we define `none` using an additional variable and the code `String? none = “None”`.

## Example

Now, let’s look at a real-world example of a WDL workflow that scatters several arrays together using the index. The code block below contains relevant snippets of the [Smart-seq2 Multi-Sample (Multi-SS2) pipeline](https://github.com/broadinstitute/warp/blob/master/pipelines/skylab/smartseq2_multisample/MultiSampleSmartSeq2.wdl) in the [WARP GitHub repository](https://github.com/broadinstitute/warp/tree/master).

The Multi-SS2 pipeline is an open-source, cloud-optimized pipeline that supports the processing of single-cell RNAseq data generated with the [Smart-Seq2 assay](https://www.illumina.com/science/sequencing-method-explorer/kits-and-arrays/smart-seq2.html). The pipeline processes multiple cells by importing and running the [Smart-seq2 Single Sample pipeline](https://github.com/broadinstitute/warp/blob/master/pipelines/skylab/smartseq2_single_sample/SmartSeq2SingleSample.wdl) for each cell and merges the results into a single Loom matrix. For more information, see the [Smart-seq2 Multi-Sample Overview](https://broadinstitute.github.io/warp/docs/Pipelines/Smart-seq2_Multi_Sample_Pipeline/README).

The code below shows one way of scattering optional arrays in WDL. In this example, `input_names` is an optional workflow input, and is scattered together with `input_ids`, `fastq1_input_files`, and `fastq2_input_files` using the same method as described in the [Solution](#solution) above, where an `if then else` operator is used along with `select_first()` to define the task-level input.

```wdl
version 1.0
workflow MultiSampleSmartSeq2 {
  input {
      # Gene Annotation
      File genome_ref_fasta
      File rrna_intervals
      File gene_ref_flat

      # Reference index information
      File hisat2_ref_name
      File hisat2_ref_trans_name
      File hisat2_ref_index
      File hisat2_ref_trans_index
      File rsem_ref_index

      # Sample information
      String stranded
      Array[String] input_ids
      Array[String]? input_names
      Array[String] fastq1_input_files
      Array[String] fastq2_input_files = []
      String? input_name_metadata_field
      String? input_id_metadata_field
      Boolean paired_end
  }

  if (false) {
     String? none = "None"
  }

  ### Execution starts here ###
  if (paired_end) {
    scatter(idx in range(length(input_ids))) {
      call single_cell_run.SmartSeq2SingleSample as sc_pe {
        input:
          fastq1 = fastq1_input_files[idx],
          fastq2 = fastq2_input_files[idx],
          stranded = stranded,
          genome_ref_fasta = genome_ref_fasta,
          rrna_intervals = rrna_intervals,
          gene_ref_flat = gene_ref_flat,
          hisat2_ref_index = hisat2_ref_index,
          hisat2_ref_name = hisat2_ref_name,
          hisat2_ref_trans_index = hisat2_ref_trans_index,
          hisat2_ref_trans_name = hisat2_ref_trans_name,
          rsem_ref_index = rsem_ref_index,
          input_id = input_ids[idx],
          output_name = input_ids[idx],
          paired_end = paired_end,
          input_name_metadata_field = input_name_metadata_field,
          input_id_metadata_field = input_id_metadata_field,
          input_name = if defined(input_names) then select_first([input_names])[idx] else none
      }
    }
  }
}
```

## Resources

- [Scatter-gather parallelism WDL doc](ScatterGather_parallelism.md)
- [Scattering on an index WDL doc](scattering_index.md)
- [WDL 1.0 spec](https://github.com/openwdl/wdl/blob/main/versions/1.0/SPEC.md)
- Multi-SS2 pipeline [code](https://github.com/broadinstitute/warp/blob/master/pipelines/skylab/smartseq2_multisample/MultiSampleSmartSeq2.wdl) and [documentation](https://broadinstitute.github.io/warp/docs/Pipelines/Smart-seq2_Multi_Sample_Pipeline/README)