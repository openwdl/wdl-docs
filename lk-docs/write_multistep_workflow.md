# [2] (howto) Write a simple multi-step workflow
This documentation is in the process of being updated. In the meantime, you may find that some GATK commands are out of date, or that the WDL information is incomplete. If you encounter any issues you can't solve, please let us know.

Requirements

This walkthrough assumes a (very) basic understanding of GATK’s tools and that you have read the Getting Started guide. You should have installed the necessary tools, and gone through the previous tutorial, as we will be starting off using its script. Lastly, you will need to download the zip bundle containing this tutorial's data. We will use a toy dataset: NA12878, a subset to chromosome 20. The files in the bundle are described in the enclosed README.

Introduction

In this tutorial, you will learn how to pass inputs to a task call, write a branched multi-step workflow, and apply task aliasing. You’ll also learn a neat trick for reducing the number of times you need to input the same data to a group of tasks. We will expand the script you have written in the previous tutorial by adding a step called select. This task separates SNP and indel variants called by haplotypeCaller into separate files. This is something we occasionally need to do to process SNPs and indels differently, for example when applying hard filters to a variant callset. Let’s take a look at our workflow diagram:

It is always useful to begin your pipeline writing by sketching out a diagram like the one above. As you will see in the sections to come, we will frequently reference this diagram. It acts as an outline for both your workflow and each individual task.

Write your script

Copy over the helloHaplotypeCaller script you created previously into a new text file, which we will call simpleVariantSelection.wdl.

Workflow

Before we get down to the nitty-gritty of writing the new task, let’s first take a look at how our workflow is going to fit the tasks together. In the diagram above you saw how haplotypeCaller‘s output fed into the next step’s input; we are going to tell Cromwell exactly how to do that. We already have a workflow that simply calls the haplotypeCaller step, so now let’s call each of the remaining steps:

workflow SimpleVariantSelection {
  call haplotypeCaller { input: }
  call select { input: }
  call select { input: }
}


Our workflow makes a call to each task, following that flow diagram from earlier. However, those two identical calls to select will cause trouble later. Cromwell doesn’t allow us to call the same task twice due to the fact that the second call would overwrite the data generated from the previous one. Luckily, we can use something called task aliasing to give the task a name that’s specific to that exact call to it, like so:

workflow SimpleVariantSelection {
  call haplotypeCaller { input: }
  call select as selectSNPs { input: }
  call select as selectIndels { input: }
}


It’s similar to declaring a variable name for your inputs--you are just giving that task call a variable name that you can reference it by. When we want to do something with the output, we will call selectSNPs.rawSubset, rather than select.rawSubset--but that’s a topic for another tutorial.

Let’s try adding in the inputs next. The task haplotypeCaller is the very start of our workflow, and it requires an input bam. This file will be passed in directly to the task, so there is no need to specify it within the workflow here. For the remaining tasks, we must specify the inputs that will be generated from previous steps in the workflow. To specify an input, follow the format below

input: inputname=taskname.outputname


Therefore, to tell our select step to take the rawVCF output from haplotypeCaller, we write input: rawVCF=haplotypeCaller.rawVCF. Simply go through each task call, and follow our flow diagram to properly assign inputs.

workflow SimpleVariantSelection {
  call haplotypeCaller { input: }
  call select as selectSNPs { 
    input: 
      type=, 
      rawVCF=haplotypeCaller.rawVCF
  }
  call select as selectIndels {
    input: 
      type=, 
      rawVCF=haplotypeCaller.rawVCF
  }
}


The task, select, has an input called type, which does not accept an input from any earlier step. We can specify the type as INDEL or SNP simply by passing in a string.

workflow SimpleVariantSelection {
  call haplotypeCaller { input: }
  call select as selectSNPs { 
    input: 
      type="SNP", 
      rawVCF=haplotypeCaller.rawVCF
  }
  call select as selectIndels {
    input: 
      type="INDEL", 
      rawVCF=haplotypeCaller.rawVCF
  }
}


Now, all the inputs have been assigned, and the workflow should be complete, right? Not quite--we have a few variables that each task is going to need. Originally, we declared these in the haplotypeCaller task definition, but now we will set up pass-through variables. We aren’t changing anything in haplotypeCaller, but we will declare additional variables in the workflow and hand these variables as an input to each command, as shown below. This way, when we generate our inputs file, we only need to tell Cromwell where the tool, reference files, and sample name are a single time. If you’ve ever met a toddler, you’ll know how tedious it can be to answer the same question over and over again.

workflow SimpleVariantSelection {
  File gatk
  File refFasta
  File refIndex
  File refDict
  String name

  call haplotypeCaller {
    input: 
      sampleName=name, 
      RefFasta=refFasta, 
      GATK=gatk, 
      RefIndex=refIndex, 
      RefDict=refDict
  }
  call select as selectSNPs {
    input: 
      sampleName=name, 
      RefFasta=refFasta, 
      GATK=gatk, 
      RefIndex=refIndex, 
      RefDict=refDict, 
      type="SNP",
      rawVCF=haplotypeCaller.rawVCF
  }
  call select as selectIndels {
    input: 
      sampleName=name, 
      RefFasta=refFasta, 
      GATK=gatk, 
      RefIndex=refIndex, 
      RefDict=refDict, 
      type="INDEL", 
      rawVCF=haplotypeCaller.rawVCF
  }
}


That’s it! Your workflow is complete.

Tasks
haplotypeCaller

Please reference the previous tutorial for instructions on how to write this task if you do not already have it written.

select

This task uses GATK’s SelectVariants to separate indels from SNPs in a vcf. To begin, set up an outline that includes the required section stubs and pass-through variables:

task select {
  File GATK
  File RefFasta
  File RefIndex
  File RefDict
  String sampleName

  command {}
  output {}
}


Following our initial diagram, the two inputs we need to add to this task are String type and File rawVCF. For our command, we will be calling SelectVariants as we would on the command line, but plugging in our variables as we have done before. The command looks like so:

    java -jar ${GATK} \
      -T SelectVariants \
      -R ${RefFasta} \
      -V ${rawVCF} \
      -selectType ${type} \
      -o ${sampleName}_raw.${type}.vcf


Our last job for this task is to assign the output from SelectVariants to a variable, rawSubset. We follow the same format as before, Type outputVariable = “output_from_command”, which you can see in our completed task below:

task select {
  File GATK
  File RefFasta
  File RefIndex
  File RefDict
  String sampleName
  String type
  File rawVCF

  command {
    java -jar ${GATK} \
      -T SelectVariants \
      -R ${RefFasta} \
      -V ${rawVCF} \
      -selectType ${type} \
      -o ${sampleName}_raw.${type}.vcf
  }
  output {
    File rawSubset = "${sampleName}_raw.${type}.vcf"
  }
}

Running the pipeline

As we did in our first tutorial, it is good practice to first validate your WDL script before running it to catch any silly syntax errors. Your next step is to generate an input file. We have done so using the command below, then filled in the inputs within simpleVariantSelection_inputs.json using our favorite text editor. If you don’t know which file is which in the bundle, don’t forget to check the README.

java -jar wdltool.jar inputs simpleVariantSelection.wdl > simpleVariantSelection_inputs.json


With your completed inputs file, you can now run your script locally (i.e. on your own computer). We will run using the command below:

java -jar cromwell.jar run simpleVariantSelection.wdl simpleVariantSelection_inputs.json


When you do, Cromwell should begin showing update messages on your terminal until the workflow is complete.

Check your results

If you’ve done everything correctly, Cromwell will finish and display the paths to the output from each step. Our pipeline has taken in pre-processed bam files and called variants with haplotypeCaller. We then split the variants into SNPs and indels. Let’s check one of our outputs, SimpleVariantSelection.selectIndels.rawSubset. The simplest way to do so is to view the vcf as a text file, either using the more command in the terminal or by opening the file in a text editor. (Syntax: more <filename>)

#CHROM  POS ID  REF ALT QUAL  FILTER  INFO  FORMAT  NA12878
20  9999996 . A ACT 534.73  . AC=2;AF=1.00;AN=2;DP=12;FS=0.000;MLEAC=2;MLEAF=1.00;MQ=60.00;QD=25.82;SOR=5.136 GT:AD:DP:GQ:PL  1/1:0,12:12:39:572,39,0
20  10001436  . A AAGGCT  1222.73 . AC=2;AF=1.00;AN=2;DP=29;FS=0.000;MLEAC=2;MLEAF=1.00;MQ=60.00;QD=32.17;SOR=0.836 GT:AD:DP:GQ:PL  1/1:0,28:28:84:1260,84,0


Admittedly, it isn’t the easiest to read. The column titles are the first line, and each subsequent line is information on a single variant site. If you’d prefer, GATK has a tool, VariantsToTable, which is used to extract annotations of interest into a more readable format. The resulting .table file can be opened in RStudio, Matlab, or Excel. You can find a .table output (for which all the annotations were displayed) in the .zip bundle attached to this article, or see below for a preview.

Now take a moment to pat yourself on the back. You’ve constructed a multi-step workflow, and you’re well on your way to writing entire pipelines! Continue on in your journey by adding a few more tasks, and learning the merge half of workflow plumbing in the next tutorial.