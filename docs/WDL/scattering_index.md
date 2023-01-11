# Scattering on an index

Arrays in WDL are 0-indexed and the elements are stored and retrieved using their index positions. This is especially useful if you have multiple arrays of files that need to be scattered together, meaning that the first file of all of the arrays needs to be scattered together, the second file of all of the arrays needs to be scattered together, and so on. Because arrays are ordered in WDL, you can index into one array and use that index to scatter all of the arrays as long as you pass the lists of array elements in the same order. Note that an input array must be non-optional to index into the array.

You could also use this method to scatter a single array, but in most cases, it makes more sense to scatter on the array itself rather than the index. To learn more about scattering in WDL, see [Scatter-gather parallelism](ScatterGather_parallelism.md).

Whether it’s 2 or 20 arrays, using indices allows you to scatter the elements of multiple ordered arrays together in WDL. In this document, you’ll see examples of code that use indices to scatter two or more arrays together to run a task in parallel.

## Problem

You have two ordered lists of files that need to be scattered together and run in parallel through a task.

## Solution

As long as the lists you pass to your workflow are ordered, scattering on the index is the easiest way to scatter the files in those lists together.

Let’s say we have a workflow that takes two arrays of files as input, scatters one array, and calls one task, `task_A`.

```wdl
version 1.0
workflow myWorkflowName {
  input {
    Array[File] my_ref
    Array[File] my_input
    String name
  }
  scatter (file in my_input) {
    call task_A {
      input: 
        ref = my_ref,
        in = file,
        id = name     
    }
  }
}

task task_A {...}
```

As this workflow is currently written, only the files in the array `my_input` are being scattered in `task_A`, but we want the files in both `my_input` and `my_ref` to be scattered together. We can do this by indexing into one of the arrays, and then scattering on the index instead of on one of the arrays.

```wdl
version 1.0
workflow myWorkflowName {
  input {
    Array[File] my_ref
    Array[File] my_input
    String name
  }
  scatter (idx in range(length(my_input))) {
    call task_A {
      input: 
        ref = my_ref[idx],
        in = my_input[idx],
        id = name     
    }
  }
}

task task_A {...}
```

To scatter on the index of one of the arrays, we first need to know the number of elements in the array which we get using the `length()` function. Then, we use the `range()` function on that number to create an array of indices which we use to scatter the array `my_input`. 

When scattering on the index, the input blocks of your task calls will look a little different than they typically might. Here, any input arrays you want to scatter together need to include the index, as in `ref = my_ref[idx]` and `in = my_input[idx]` to ensure that the right files are being analyzed together.

Scattering separates inputs and allows a task to be run in parallel, which results in arrays as outputs for any tasks inside a scatter block. In WDL, it isn’t necessary to explicitly gather the results of the scatter. Rather, you can pass the output right to another task as long as it takes in an array as input.

```wdl
version 1.0
workflow myWorkflowName {
  input {
    Array[File] my_ref
    Array[File] my_input
    String name
  }
  scatter (idx in range(length(my_input))) {
    call task_A {
      input: 
        ref = my_ref[idx],
        in = my_input[idx],
        id = name     
    }
  }
  call task_B {
    input:
      in_file = task_A.output_file
  }
}

task task_A {
  output {
    File output_file = "~{id}.ext"
  }
}
task task_B {
  input {
    Array[File] in_file
  }
}
```

By simply specifying the output of `task_A` as the input to `task_B`, you can gather the results of `task_A` from the scatter block.

## Example

Now, let’s look at a real-world example of a WDL workflow that scatters several arrays together using the index. The code block below contains relevant snippets of the [Smart-seq2 Multi-Sample (Multi-SS2) pipeline](https://github.com/broadinstitute/warp/blob/master/pipelines/skylab/smartseq2_multisample/MultiSampleSmartSeq2.wdl) in the [WARP GitHub repository](https://github.com/broadinstitute/warp/tree/master).

The Multi-SS2 pipeline is an open-source, cloud-optimized pipeline that supports the processing of single-cell RNAseq data generated with the [Smart-Seq2 assay](https://www.illumina.com/science/sequencing-method-explorer/kits-and-arrays/smart-seq2.html). The pipeline processes multiple cells by importing and running the [Smart-seq2 Single Sample pipeline](https://github.com/broadinstitute/warp/blob/master/pipelines/skylab/smartseq2_single_sample/SmartSeq2SingleSample.wdl) for each cell and merges the results into a single Loom matrix. For more information, see the [Smart-seq2 Multi-Sample Overview](https://broadinstitute.github.io/warp/docs/Pipelines/Smart-seq2_Multi_Sample_Pipeline/README).

In the workflow code below, we want to process single-cell RNA sequencing reads, specifically an array of FASTQ 1 files (read 1) and an array of FASTQ 2 files (read 2), both of which are the same length. Additionally, each FASTQ in the read 1 and read 2 arrays belongs to a sample with a specific `input_id`. We want to pass each ID through the tasks along with its respective FASTQ files. As you look at the code, notice that it scatters on the index of the `input_id`, which is then also used to index the read 1 and read 2 FASTQ arrays.

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

  # Check that all input arrays are the same length
  call checkInputArrays as checkArrays{
      input:
         paired_end = paired_end,
         input_ids = input_ids,
         input_names = input_names,
         fastq1_input_files = fastq1_input_files,
         fastq2_input_files = fastq2_input_files
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

task checkInputArrays {
  input {
    Boolean paired_end
    Array[String] input_ids
    Array[String]? input_names
    Array[String] fastq1_input_files
    Array[String] fastq2_input_files
  }
  Int len_input_ids = length(input_ids)
  Int len_fastq1_input_files = length(fastq1_input_files)
  Int len_fastq2_input_files = length(fastq2_input_files)
  Int len_input_names = if defined(input_names) then length(select_first([input_names])) else 0

  meta {
    description: "checks input arrays to ensure that all arrays are the same length"
  }

  command {
    set -e

    if [[ ~{len_input_ids} !=  ~{len_fastq1_input_files} ]]
      then
      echo "ERROR: Different number of arguments for input_id and fastq1 files"
      exit 1;
    fi

    if [[ ~{len_input_names} != 0  && ~{len_input_ids} !=  ~{len_input_names} ]]
        then
        echo "ERROR: Different number of arguments for input_name and input_id"
        exit 1;
    fi

    if  ~{paired_end} && [[ ~{len_fastq2_input_files} != ~{len_input_ids} ]]
      then
      echo "ERROR: Different number of arguments for sample names and fastq1 files"
      exit 1;
    fi
    exit 0;
  }

  runtime {
    docker: "ubuntu:18.04"
    cpu: 1
    memory: "1 GiB"
    disks: "local-disk 1 HDD"
  }
}
```

The example above shows one way of scattering elements together from multiple arrays. The `scatter()` function used in this workflow is structured the same way as in the [Solution](#solution) above, where the `length()`, or number of elements in the array, is being used along with the `range()` to index into and then scatter the array. Just like above, the inputs that are scattered together are specified in the task call using the index.

When scattering on an index to scatter multiple arrays together, it’s a good idea to check that the arrays you want to scatter together have the same number of elements in them. In this example, the length of the arrays is checked by the `checkInputArrays` task above.

## Resources

- [Scatter-gather parallelism WDL doc](ScatterGather_parallelism.md)
- [WDL 1.0 spec](https://github.com/openwdl/wdl/blob/main/versions/1.0/SPEC.md)
- Multi-SS2 pipeline [code](https://github.com/broadinstitute/warp/blob/master/pipelines/skylab/smartseq2_multisample/MultiSampleSmartSeq2.wdl) and [documentation](https://broadinstitute.github.io/warp/docs/Pipelines/Smart-seq2_Multi_Sample_Pipeline/README)