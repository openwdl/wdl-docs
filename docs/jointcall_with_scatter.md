# [4] (howto) Use scatter-gather to joint call genotypes
This documentation is in the process of being updated. In the meantime, you may find that some GATK commands are out of date, or that the WDL information is incomplete. If you encounter any issues you can't solve, please let us know.

Requirements

This tutorial assumes that you have a (very) basic understanding of GATK tools and have read the Getting Started guide. You should also have installed the necessary tools and gone through the previous tutorial, as we will build off concepts learned there. Lastly, you will need to download the zip bundle containing this tutorial's data. We will use a toy dataset: NA12878, NA12877, and NA12882, a subset to chromosome 20. For a detailed description of each file in the bundle, see the README.

Introduction

Our previous tutorials have given you a solid base in WDL, but now we’re going to test your skills with a particularly complex workflow structure: a scatter operation. To illustrate this feature, we’ve chosen to pull the joint calling variant discovery section of the GATK Best Practices pipeline. HaplotypeCaller takes bams and outputs genotype likelihoods for every possible variant site. Then GenotypeGVCFs uses genotype likelihoods from multiple samples to call variants across a cohort. This method is most often used with large cohorts, but we will be executing it on only 3 samples simply to give you an idea of how it works.

As you can see from this diagram, there are a lot of pieces in this workflow. In previous tutorials, the workflows were simple enough that the diagrams may have seemed unnecessary, but once you get to more complex examples like this one, the utility of the diagram is a lot more obvious.

We start from inputSamples, an array that contains samples. Each sample is an array with three Files*. The first position (array index 0) contains the name of our sample, followed by the bam with our data (array index 1), and the index file for that bam (array index 2). In this example, we will scatter by sample, then gather after the first step, HaplotypeCallerERC. The gathered GVCFs are then processed by GenotypeGVCFs to produce a multisample VCF of raw variant calls that are ready for filtering in the next step of the pipeline.

*Files can also simply be strings, with no need to alter type, as is the case for sampleName.

Write your script

Before we get to writing the workflow itself, we need to generate a file that will allow us to easily input our complex Array[Array[File]] inputSamples. Open up a new text file, which we’ve chosen to call inputsTSV.txt, and list each sample’s inputs you need on a new line, in the following order:

sampleName  inputBam  bamIndex
sampleName2 inputBam2 bamIndex2
...etc.

Each input is separated by a tab character, and each sample is on its own line. This file saves you from having to deal with nested array declarations in your inputs json later.

Now, open up a new file in a text editor of your choice and call it jointCallingGenotypes.wdl. All of our script writing will be done in this file.

Workflow

Starting with our workflow inputs, we will need the inputSamplesFile we created above. To convert that file into an Array[Array[File]], we can use a function from the WDL standard library, called read_tsv.

  Array[Array[File]] inputSamples = read_tsv(inputSamplesFile)


Now, to scatter by sample, we wrap our call to the task HaplotypeCallerERC in a scatter operation, like so:

  scatter (sample in inputSamples) {
    call HaplotypeCallerERC {...}
  }


The scatter operation has an implied gather step at the end, meaning you don’t have to do anything but call your next task outside the operation. The individual GVCFs produced by each parallel call to HaplotypeCallerERC is grouped into an array of GVCFs that you can pass directly to the next task.

  scatter (sample in inputSamples) {
    call HaplotypeCallerERC {...}
  }
  call GenotypeGVCFs { input: GVCFs=HaplotypeCallerERC.GVCF }


Now let’s look at it all together, with the inputs specified in the task call. As we have done in previous tutorials, we have added in the pass-through variables (gatk, refFasta, etc.) as well.

workflow jointCallingGenotypes {

  File inputSamplesFile
  Array[Array[File]] inputSamples = read_tsv(inputSamplesFile)
  File gatk
  File refFasta
  File refIndex
  File refDict

  scatter (sample in inputSamples) {
    call HaplotypeCallerERC {
      input: GATK=gatk, 
        RefFasta=refFasta, 
        RefIndex=refIndex, 
        RefDict=refDict, 
        sampleName=sample[0],
        bamFile=sample[1], 
        bamIndex=sample[2]
    }
  }
  call GenotypeGVCFs {
    input: GATK=gatk, 
      RefFasta=refFasta, 
      RefIndex=refIndex, 
      RefDict=refDict, 
      sampleName="CEUtrio", 
      GVCFs=HaplotypeCallerERC.GVCF
  }
}


Now, armed with a completed workflow script, we venture on to task declarations!

Task
HaplotypeCallerERC

At this point in our tutorial series, we have written quite a few task declarations. As always, we begin by declaring inputs. We need to specify all pass-through variable names, as well as task-specific inputs, following the diagram. Since we have handled parsing the complicated Array[Array[File]] at the workflow level, our task-specific inputs here are simply String sampleName, File bamFile, and File bamIndex.

task HaplotypeCallerERC {
  File GATK
  File RefFasta
  File RefIndex
  File RefDict
  String sampleName
  File bamFile
  File bamIndex
}


In previous tutorials, we have used the HaplotypeCaller tool in normal mode. This tutorial applies the joint calling method, so we will be running the tool in reference confidence mode. The command is the same as it was in previous tutorials, except with an added -ERC GVCF to enable reference confidence mode.

    java -jar ${GATK} \
        -T HaplotypeCaller \
        -ERC GVCF \
        -R ${RefFasta} \
        -I ${bamFile} \
        -o ${sampleName}_rawLikelihoods.g.vcf


Lastly, we need to assign our tool’s output to an output variable in WDL. This is especially important if you are not running this script on your local machine--often, to save space, platforms will delete any files generated that are not assigned an output variable when the entire workflow finishes.

  output {
    File GVCF = "${sampleName}_rawLikelihoods.g.vcf"
  }


Add the output section in your task, below the command, and you have a completed WDL task. If you’ve been following along, your script should look like this:

task HaplotypeCallerERC {

  File GATK
  File RefFasta
  File RefIndex
  File RefDict
  String sampleName
  File bamFile
  File bamIndex

  command {
    java -jar ${GATK} \
        -T HaplotypeCaller \
        -ERC GVCF \
        -R ${RefFasta} \
        -I ${bamFile} \
        -o ${sampleName}_rawLikelihoods.g.vcf
  }
  output {
    File GVCF = "${sampleName}_rawLikelihoods.g.vcf"
  }
}

GenotypeGVCFs

This task takes in the compiled array of GVCFs from HaplotypeCallerERC, so in addition to our usual pass-through variables, we will take in Array[File] GVCFs. As with previous tasks, we also give this one a String sampleName to assist in naming the output file.

task GenotypeGVCFs {
  File GATK
  File RefFasta
  File RefIndex
  File RefDict
  String sampleName
  Array[File] GVCFs
}


When calling GenotypeGVCFs, you must specify each GVCF input with a separate -V. We have an array of the GVCF files, and so we can use a delimiter in order to insert a -V between each item in the array. You’ve seen before how to reference a variable in WDL, ${var}, and you can specify, the delimiter itself using sep within the variable reference, like so: ${sep=” -V “ var}. With this in mind, our command will follow the below format:

    java -jar ${GATK} \
        -T GenotypeGVCFs \
        -R ${RefFasta} \
        -V ${sep=" -V " GVCFs} \
        -o ${sampleName}_rawVariants.vcf


Note that we typed a preceding -V in the above command-- this is to add a -V before the first item in the array, which the sep delimiter will not do. To wrap this task up, assign your output variable, and put everything together.

task GenotypeGVCFs {

  File GATK
  File RefFasta
  File RefIndex
  File RefDict
  String sampleName
  Array[File] GVCFs

  command {
    java -jar ${GATK} \
        -T GenotypeGVCFs \
        -R ${RefFasta} \
        -V ${sep=" -V " GVCFs} \
        -o ${sampleName}_rawVariants.vcf
  }
  output {
    File rawVCF = "${sampleName}_rawVariants.vcf"
  }
}

Running the pipeline

To run your pipeline: validate it, then generate and fill in an inputs file, then run your script locally. We have done so using the following commands:

#validate:
java -jar wdltool.jar validate jointCallingGenotypes.wdl

#generate inputs:
java -jar wdltool.jar inputs jointCallingGenotypes.wdl > jointCallingGenotypes_inputs.json

#run locally:
java -jar cromwell.jar run jointCallingGenotypes.wdl jointCallingGenotypes_inputs.json

While running, Cromwell will show update messages on your terminal until the workflow is complete.

Check your results

The terminal will print out the location of your final output at the very end. Let’s take a look at our results in IGV. Open the final VCF file, and zoom in on a portion of chromosome 20 (20:10,000,000-10,200,000)*. You will see what is pictured below. The top track, CEUtrio_rawVariants.vcf, is the joint called variants across the whole cohort. Below that, each individual sample is be listed, along with its variants.

*Note: Our original files were subset to this particular region, which is why the variants are isolated here.

If you zoom in further, you can take a look at individual variants. Below we can see two variant sites that were called in the SNAP25-AS1 gene. At the first site, one sample (NA12877) is hom ref, whereas the other two are het. At the second site, two are het, and NA12822 is hom var.

In this tutorial, you have learned one of the more complex techniques in WDL: scattering. Scattering can be done over files, as demonstrated here, or over any other primitive types in WDL (String, Int, etc.). Stay tuned for additional WDL tutorials.