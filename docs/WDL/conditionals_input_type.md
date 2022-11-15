# Conditionally running different WDL tasks based on input data type

Thanks to [conditionals](conditionals.md), WDL supports running or skipping tasks based on a number of different factors, including, with a few tricks, the filenames or extensions of input files.

Imagine you have a list of thousands of files of varying types, and each type needs to be processed slightly differently before being analyzed using a common tool. You could write a workflow for each type of file, but that would require you to parse the list of files and determine which workflow should be run on each. Alternatively, you could write a single workflow that takes in all of your files at once, and runs the tasks required based on the type of file. With this method, you don’t need to parse the list of files before running your workflow, which may streamline your analyses. However, we don’t recommend this approach if there are no shared processing steps between your input types.

Whatever the reason, conditionals allow you to programmatically decide when you want to run one task versus another. In this document, you’ll see examples of code that run different tasks based on the filenames or extensions of the input files.

## Problem

You have a long list of files that need to be analyzed using the same WDL, but each type of file needs to be processed using different tasks (or the same task with a different set of parameters; see [Task aliasing](task_aliasing.md)).

## Solution

To run different tasks on different files in WDL, `if()` statements can be used to evaluate the characteristics of the files (file extension, for example) and determine which tasks should be run.

Let’s say we have a workflow that [scatters](ScatterGather_parallelism.md) an array of input files of mixed data type, such as FASTQ and BAM. In the code example below, this array is defined as `my_input` and it’s scattered across two tasks, `task_A` and `task_B`.

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
    call task_B {
      input: 
        ref = my_ref,
        in = file,
        id = name
    }
  }
}

task task_A {...}
task task_B {...}
```

Instead of running both `task_A` and `task_B` on each input file as shown, we want to run the workflow with only one task, depending on the input’s file extension (BAM or FASTQ). 

To do that, we first need to tell the workflow how to distinguish between the files we are providing in the input array (`my_input`). We can use the WDL function `basename()` to return each filename, which will include its extension. 

Next, we need to tell our workflow which task to run depending on the file extension, which we’ll do using `if()` statements along with the `sub()` function. Let’s look at the code example below, and then we’ll break down the functions a little further.

```wdl
version 1.0
workflow myWorkflowName {
  input {
    File my_ref
    Array[File] my_input
    String name
  }
  scatter (file in my_input) {

    # Returns filename of each input file and saves it to the variable `file_extension`
    String file_extension = basename(file)

    # If file has extension `fastq`, remove the extension such that the returned string does not match `file_extension`, then run `task_A`
    if (sub(file_extension, “fastq”, “”) != file_extension) {
      call task_A {
        input: 
          ref = my_ref,
          in = file,
          id = name     
      }
    }

    # If file does not have extension `fastq`, do not remove the extension such that the returned string matches `file_extension`, then run `task_B`
    if (sub(file_extension, “fastq”, “”) == file_extension) {
      call task_B {
        input: 
          ref = my_ref,
          in = file,
          id = name
      }
    }
  }
}

task task_A {...}
task task_B {...}
```

In this workflow, we are using `basename(file)` to get the name of each input file and save it as the variable, `file_extension`.

The `if()` statements are doing a lot in this workflow, so let’s break them down. Inside each `if()` statement, we’re using the `sub()` function as a way of string matching. We’re checking if the `file_extension` variable contains the string `fastq`, and if it does, `fastq` is removed from the output of that function. For example, if our input file has the name `file_1.fastq`, the function will only return `file_1`.

In contrast, if the `file_extension` variable doesn’t contain the string `fastq`, the filename is output without being changed. This means that if the file is named `file.bam`, the function will return the full name `file.bam`. Note that `file_extension` is **not** being overwritten by this new string. Check out the [WDL 1.0 spec](https://github.com/openwdl/wdl/blob/main/versions/1.0/SPEC.md#string-substring-string-string) to read more about using `sub()` in WDL. 

Next, the workflow is checking whether the output of `sub()` matches the `file_extension` variable. Since `fastq` is removed from the output of `sub` for files containing the string `fastq`, the output of `sub` doesn’t match `file_extension` for our FASTQ input, and the workflow runs `task_A`. In the case of our BAM input file, `sub()` outputs the filename without being changed, which means it matches `file_extension` and the workflow runs `task_B`.

## Example

Now, let’s look at an example of a full WDL workflow with more biologically relevant variables that runs a different task based on the input file type. The code block below contains relevant snippets of the [example `Different Samples` workflow](https://github.com/openwdl/wdl-docs/blob/1.0/Example_Pipelines/Different_Samples/DifferentSamples.wdl) in the [example workflows folder](https://github.com/openwdl/wdl-docs/tree/1.0/Example_Pipelines) of this repository.

The `Different Samples` workflow is an example workflow that takes an array of mixed research and clinical samples as input, identifies whether each file is a research sample or clinical sample, and then runs `ResearchTask` on research samples and `ClinicalTask` on clinical samples.

```wdl
version 1.0
workflow DifferentSamples {
  input {
    Array[File] mixed_research_and_clinical_sample
  }

  # Run different tasks for samples in a single array based on sample name
  # Note this could call a task or a subworkflow
  scatter (sample in mixed_research_and_clinical_sample) {
      String sample_name = basename(sample)
      if (sub(sample_name, "clinical", "") != sample_name)  {
          call ClinicalTask {
              input:
                  clinical_input = sample
          }
      }
      if (sub(sample_name, "clinical", "") == sample_name) {
          call ResearchTask {
              input:
                  research_input = sample
          }
      }
   }

   # Note that the results of these subworkflow will be arrays of optional types (for example Array[File?]). If the type works, there is no need to explicitly gather. If you want to explictly gather the results, it would look like this:
   Array[File?] optional_clinical_results = ClinicalTask.results
   Array[File?] optional_research_results = ResearchTask.results

   # gather your samples from the clinical and research sub workflows (assuming both could have run) and convert to non-optional type
   Array[File] clincal_and_research_results = flatten([select_all(ClinicalTask.results), select_all(ResearchTask.results)])

   # if you didn't want to unify the results but need the results to be non-optional
   Array[File] clinical_results = select_all(ClinicalTask.results) # Array[Array[File?]]
   Array[File] research_results = select_all(ResearchTask.results)


   output {
       Array[File] unified_results = clincal_and_research_results
  }

}
```

The example above shows one way of using conditionals to run different tasks based on whether the input files contain a specified string. The `if()` statements in this workflow are structured the same way as in the [Solution](#solution) above, where the names of the input files are saved to a variable and compared to the output of the `sub()` function. In this case, the output is only edited if the input is a clinical sample and `ClinicalTask` is run. The output is not edited if the input is a research sample and `ResearchTask` is run.

The `scatter()` function is used to run each input file in parallel, and if you want to use the results of a scattered task downstream, you need to gather them back up, meaning you need to collect the scattered outputs and combine them into a single array. You can do this implicitly, as shown in the article, [Scatter-gather parallelism](ScatterGather_parallelism.md), or explicitly, as shown in the code above under the comment, “gather your samples from the clinical and research sub workflows.”

## Resources

- [Conditionals WDL doc](./conditionals.md)
- [Task aliasing WDL doc ](task_aliasing.md)
- [Scatter-gather parallelism WDL doc](ScatterGather_parallelism.md)
- [WDL 1.0 spec](https://github.com/openwdl/wdl/blob/main/versions/1.0/SPEC.md)
- Different Samples example [workflow](https://github.com/openwdl/wdl-docs/blob/1.0/Example_Pipelines/Different_Samples/DifferentSamples.wdl), [inputs JSON](https://github.com/openwdl/wdl-docs/blob/1.0/Example_Pipelines/Different_Samples/inputs.json), and [input files](https://console.cloud.google.com/storage/browser/wdl-doc-test-data;tab=objects?forceOnBucketsSortingFiltering=false&project=broad-dsde-outreach&prefix=&forceOnObjectsSortingFiltering=false)