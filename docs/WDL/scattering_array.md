# Parallelizing by scattering on an array

Imagine you have a list of files of the same type that all need to be processed identically. You could choose to pass each file one by one to your workflow and process them individually, but that would be repetitive and inefficient. Instead, you could choose to parallelize your workflow. By processing the data simultaneously instead of sequentially, you can do the same amount of work in a fraction of the time. In WDL 1.0, you can accomplish this using arrays and [scatter-gather parallelism](ScatterGather_parallelism.md).

In this document, you’ll see examples of code that scatter input arrays to parallelize workflows.

## Problem

You have several files that all need to be processed in the same way and you want to run them in parallel.

## Solution

When you have multiple files that can be processed simultaneously and all need to be processed using the same steps and tools in WDL, you can scatter those files in your workflow to parallelize and speed up your work. 

Let’s say we have a workflow that takes in an array of files, `my_input`, and calls two tasks, `task_A` and `task_B`, as shown in the example WDL script below:

```wdl
version 1.0
workflow myWorkflowName {
  input {
    File my_ref
    Array[File] my_input
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
      in = task_A.out,
      id = name
  }
}

task task_A {...}
task task_B {...}
```

We want the workflow to scatter the input array before running the tasks in the workflow, but that isn’t written into the script above yet. To scatter the input array and parallelize our workflow, we can surround our task call in a scatter block. Let’s take a look at the updated workflow after we’ve added a scatter block:

```wdl
version 1.0
workflow myWorkflowName {
  input {
    File my_ref
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
  call task_B {
    input: 
      ref = my_ref,
      in = task_A.out,
      id = name
  }
}

task task_A {...}
task task_B {...}
```

By adding the scatter block above, we’ve told our workflow that it can run `task_A` on each file in the array, `my_input`, simultaneously.

You’ll notice that we didn’t change anything about our call to `task_B` in the workflow when we added the scatter block around `task_A`. Even though the output of `task_A` is an array, we don’t need to explicitly tell our workflow that the input to `task_B`, `task_A.out`, is also an array. In WDL 1.0, simply referring to `task_A.out` indicates that you are referring to the array of those outputs.

## Example

Now, let’s look at a real-world example of a WDL workflow that runs or skips tasks based on whether or not an input variable is defined. The code block below contains relevant snippets of the [Imputation pipeline](https://github.com/broadinstitute/warp/blob/master/pipelines/broad/arrays/imputation/Imputation.wdl) in the [WARP GitHub repository](https://github.com/broadinstitute/warp/tree/83dfb2a0c2d8da3c00ed178af76204b75e7230f2).

The Imputation pipeline is an open-source, cloud-optimized pipeline that is based on the [Michigan Imputation Server pipeline](https://imputationserver.readthedocs.io/en/latest/pipeline/) and imputes missing genotypes from either a multi-sample VCF file or an array of single sample VCF files. The pipeline filters, phases, and performs imputation on a multi-sample VCF, and returns the imputed VCF file along with several metrics. For more information, see the [Imputation Overview](https://broadinstitute.github.io/warp/docs/Pipelines/Imputation_Pipeline/README).

The code below shows an example of scattering and gathering an input array in WDL 1.0. In this pipeline, `contigs` are taken in as input in the form of an array of strings, and then that array is scattered. Inside the scatter block, each `contig` is used to create a `reference_filename`, values are assigned to the struct `ReferencePanelContig`, and `tasks.CountVariantsInChunks` is called. 

Later on in the workflow, another task, `tasks.StoreChunksInfo`, is called and takes in outputs of `tasks.CountVariantsInChunks` as inputs, `vars_in_array` and `vars_in_panel`. Just like the [Solution](#solution) above, the inputs are not explicitly defined as arrays, but because they are the outputs of a task inside a scatter block, the workflow will understand that the inputs are arrays.

```wdl
version 1.0
workflow Imputation {
  input {
    File ref_dict # for reheadering / adding contig lengths in the header of the ouptut VCF, and calculating contig lengths
    Array[String] contigs
    String reference_panel_path # path to the bucket where the reference panel files are stored for all contigs

    # file extensions used to find reference panel files
    String vcf_suffix = ".vcf.gz"
    String vcf_index_suffix = ".vcf.gz.tbi"
    String bcf_suffix = ".bcf"
    String bcf_index_suffix =  ".bcf.csi"
    String m3vcf_suffix = ".cleaned.m3vcf.gz"
  }

  scatter (contig in contigs) {

    String reference_filename = reference_panel_path + "ALL.chr" + contig + ".phase3_integrated.20130502.genotypes.cleaned"

    ReferencePanelContig referencePanelContig = {
      "vcf": reference_filename + vcf_suffix,
      "vcf_index": reference_filename + vcf_index_suffix,
      "bcf": reference_filename + bcf_suffix,
      "bcf_index": reference_filename + bcf_index_suffix,
      "m3vcf": reference_filename + m3vcf_suffix,
      "contig": contig
    }

    call tasks.CountVariantsInChunks {
      input:
        vcf = select_first([OptionalQCSites.output_vcf,  GenerateChunk.output_vcf]),
        vcf_index = select_first([OptionalQCSites.output_vcf_index, GenerateChunk.output_vcf_index]),
        panel_vcf = referencePanelContig.vcf,
        panel_vcf_index = referencePanelContig.vcf_index
    }
  }

  call tasks.StoreChunksInfo {
    input:
      chroms = flatten(chunk_contig),
      starts = flatten(start),
      ends = flatten(end),
      vars_in_array = flatten(CountVariantsInChunks.var_in_original),
      vars_in_panel = flatten(CountVariantsInChunks.var_in_reference),
      valids = flatten(CheckChunks.valid),
      basename = output_callset_name
  }
}
```

## Resources

- [Scatter-gather parallelism WDL doc](ScatterGather_parallelism.md)
- [WDL 1.0 spec](https://github.com/openwdl/wdl/blob/main/versions/1.0/SPEC.md)
- Imputation pipeline [code](https://github.com/broadinstitute/warp/blob/master/pipelines/broad/arrays/imputation/Imputation.wdl) and [documentation](https://broadinstitute.github.io/warp/docs/Pipelines/Imputation_Pipeline/README)
