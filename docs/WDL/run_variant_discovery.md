# [3] (howto) Run a sample variant discovery mini-pipeline
This documentation is in the process of being updated. In the meantime, you may find that some GATK commands are out of date, or that the WDL information is incomplete. If you encounter any issues you can't solve, please let us know.

Requirements

This walkthrough assumes a (very) basic understanding of GATK’s tools and that you have read the Getting Started guide. You should have installed the necessary tools, and gone through the previous tutorial, as we will be starting off using its script. Lastly, you will need to download the zip bundle containing this tutorial's data. We will use a toy dataset: NA12878, a subset to chromosome 20. The files in the bundle are described in the enclosed README.

Introduction

Our previous tutorial showed you how to chain together multiple tasks in a branching workflow. We also went over pass-through variables, and task aliasing. In this tutorial, we will cover a couple more plumbing methods as we expand the workflow to include a few more tasks.

With linear chaining, we will feed the separate indel and SNP vcfs into a filtering step. Using separate tasks, we will show a sample hard filter, to explain why we wanted to split the workflow in the first place. In the end, we will combine the filtered variant files back into one with a merge.

Please note that the pipeline demonstrated here is meant to give you an opportunity to explore WDL script writing. In GATK’s best practices, we would run HaplotypeCaller in reference confidence mode, then follow it with VQSR. However, with limited data (we use just a single sample, subset to chromosome 20), and given that this is an introductory tutorial, we simply run HaplotypeCaller in normal mode and follow it with hard filtering. It is also important to note that this particular workflow will drop mixed record sites (sites that have both a SNP and indel variant) at the select step.

Write your script

Begin by copying over the simpleVariantSelection.wdl script you created previously into a new text file, which we will call simpleVariantDiscovery.wdl.

Workflow

As with all of our previous tutorials, we will begin by writing the workflow outline. We have the workflow written for the first 3 tasks, shown collapsed with {...} below, to save space. Simply call the remaining tasks within the workflow to get an outline set up:

workflow SimpleVariantDiscovery {
  File gatk
  File refFasta
  File refIndex
  File refDict
  String name

  call haplotypeCaller {...}
  call select as selectSNPs {...}
  call select as selectIndels {...}
  call hardFilterSNP { input: }
  call hardFilterIndel { input: }
  call combine { input: }
}


Since we won’t change anything to do with the haplotypeCaller or select steps, let’s just zoom in on the remaining 3 tasks. First, we will give each task the inputs they need, following the workflow diagram above.

workflow SimpleVariantDiscovery {
  {...}
  call hardFilterSNP {
    input: rawSNPs=selectSNPs.rawSubset
  }
  call hardFilterIndel {
    input: rawIndels=selectIndels.rawSubset
  }
  call combine {
    input: filteredSNPs=hardFilterSNP.filteredSNPs, 
      filteredIndels=hardFilterIndel.filteredIndels
  }
}


Note that for the hard filtering steps, we used the reference name (selectSNPs & selectIndels) instead of the task name (select). This tells the execution engine exactly which task call’s output to use where. The last thing that this workflow needs now are the pass-through variables we included for the beginning steps, so add those in.

workflow SimpleVariantDiscovery {
  {...}
  call hardFilterSNP {
    input: sampleName=name, 
      RefFasta=refFasta, 
      GATK=gatk, 
      RefIndex=refIndex, 
      RefDict=refDict, 
      rawSNPs=selectSNPs.rawSubset
  }
  call hardFilterIndel {
    input: sampleName=name, 
      RefFasta=refFasta, 
      GATK=gatk, 
      RefIndex=refIndex, 
      RefDict=refDict, 
      rawIndels=selectIndels.rawSubset
  }
  call combine {
    input: sampleName=name, 
      RefFasta=refFasta, 
      GATK=gatk, 
      RefIndex=refIndex, 
      RefDict=refDict, 
      filteredSNPs=hardFilterSNP.filteredSNPs, 
      filteredIndels=hardFilterIndel.filteredIndels
  }
}

Tasks
haplotypeCaller & select

Please reference the previous tutorials here & here for instructions on how to write these tasks if you do not already have them written.

hardFilterSNP & hardFilterIndel

Our next two tasks are very similar, so we will discuss them together. Hard filtering with VariantFiltration marks poor variant calls from the SNP or Indel category separately, given certain annotation thresholds.

To write our task, we will start by generating an outline, with pass-through variables and section stubs, as before. Following our flow chart, we add the inputs File rawSNPs and File rawIndels to hardFilterSNP and hardFilterIndel, respectively.

The VariantFiltration command line calls for each are similar; they simply use different --filterExpressions, following this GATK article for filter thresholds. For SNPs, we will filter out any variants with "FS > 60.0". For indels, we will filter out variants with "FS > 200.0".

Please note that we only show one annotation for filtering here. In a robust pipeline you would filter on multiple variant annotations at once, following the recommendation of the above-linked article on setting hard filters.

Lastly, we route the output file from the command to an output variable, following the format from previous tasks (Type outputVariable = “output_from_command”). Below, you can see all these parts fit together for each task (differences between tasks in bold)

task hardFilterSNP {
  File GATK
  File RefFasta
  File RefIndex
  File RefDict
  String sampleName
  File rawSNPs

  command {
    java -jar ${GATK} \
      -T VariantFiltration \
      -R ${RefFasta} \
      -V ${rawSNPs} \
      --filterExpression "FS > 60.0" \
      --filterName "snp_filter" \
      -o ${sampleName}.filtered.snps.vcf
  }
  output {
    File filteredSNPs = "${sampleName}.filtered.snps.vcf"
  }
}

task hardFilterIndel {
  File GATK
  File RefFasta
  File RefIndex
  File RefDict
  String sampleName
  File rawIndels

  command {
    java -jar ${GATK} \
      -T VariantFiltration \
      -R ${RefFasta} \
      -V ${rawIndels} \
      --filterExpression "FS > 200.0" \
      --filterName "indel_filter" \
      -o ${sampleName}.filtered.indels.vcf
  }
  output {
    File filteredIndels = "${sampleName}.filtered.indels.vcf"
  }
}

combine

The final task in our pipeline is to merge our separate SNP and indel files into a single, cohesive vcf. We accomplish this using GATK’s CombineVariants. Let’s begin by constructing an outline, as we have before, including the section stubs for command and output, and all the pass-through inputs.

task combine {
  File GATK
  File RefFasta
  File RefIndex
  File RefDict
  String sampleName

  command {  }
  output {  }
}


Add the inputs, File filteredSNPs and File filteredIndels, according to our diagram.

The command itself follows the defaults, aside from setting a --genotypemergeoption. For our case here, we chose UNSORTED, as we wish to combine the two files back into one without maintaining the distinction of which file the variants came from. Don’t forget to plug your ${variables} into the command where needed.

All that’s left is to label the output from CombineVariants as the output for this task, using the same format as we have previously, Type outputVariable = “output_from_command”. Enter the parts into our task outline from before, and you have your completed task:

task combine {
  File GATK
  File RefFasta
  File RefIndex
  File RefDict
  String sampleName
  File filteredSNPs
  File filteredIndels

  command {
    java -jar ${GATK} \
      -T CombineVariants \
      -R ${RefFasta} \
      -V ${filteredSNPs} \
      -V ${filteredIndels} \
      --genotypemergeoption UNSORTED \
      -o ${sampleName}.filtered.snps.indels.vcf
  }
  output {
    File filteredVCF = "${sampleName}.filtered.snps.indels.vcf"
  }
}

Running the pipeline

To run your pipeline: validate it, then generate and fill in an inputs file, then run your script locally. We have done so using the following commands: 

#validate:
java -jar wdltool.jar validate simpleVariantDiscovery.wdl

#generate inputs:
java -jar wdltool.jar inputs simpleVariantDiscovery.wdl > simpleVariantDiscovery_inputs.json

#run locally:
java -jar cromwell.jar run simpleVariantDiscovery.wdl simpleVariantDiscovery_inputs.json


While running, Cromwell will show update messages on your terminal until the workflow is complete.

Check your results

If you’ve done everything correctly, Cromwell will display the paths to the output from each step when it finishes. Our pipeline has taken in pre-processed bam files and called variants with haplotypeCaller. We then split the variants into SNPs and indels for separate hard filtering. After we filtered out variants which didn’t meet our criteria, we combined the vcf back into one. Let’s check our final output: SimpleVariantDiscovery.combine.filteredVCF. You can view the vcf as a text file, either using the more command or by opening the file in a text editor. (Syntax: more <filename>)

#CHROM  POS     ID      REF     ALT     QUAL    FILTER  INFO    FORMAT  NA12878
20      9999996 .       A       ACT     534.73  PASS    AC=2;AF=1.00;AN=2;DP=12;FS=0.000;MLEAC=2;MLEAF=1.00;MQ=60.00;QD=25.82;SOR=5.136;set=variant2    GT:AD:DP:GQ:PL  1/1:0,12:12:39:572,39,0
20      10000117        .       C       T       262.77  PASS    AC=1;AF=0.500;AN=2;BaseQRankSum=-0.831;ClippingRankSum=0.092;DP=23;FS=0.000;MLEAC=1;MLEAF=0.500;MQ=60.47;MQRankSum=-0.769;QD=11.42;ReadPosRankSum=0.769;SOR=0.446;set=variant   GT:AD:DP:GQ:PL
  0/1:11,12:23:99:291,0,292
 

Alternatively, you can view the annotations per variant record using GATK’s VariantsToTable. Run the tool and open the resulting .table file in RStudio, Matlab, or Excel. You can find a premade .table output in the .zip bundle attached to this article, or see below for a preview.