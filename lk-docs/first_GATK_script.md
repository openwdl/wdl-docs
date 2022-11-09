# (howto) Write your first WDL script running GATK HaplotypeCaller

 | Requirements | 
 | :-- | 
 | This tutorial assumes that you have a (very) basic understanding of GATK tools. You should also have installed the necessary tools. Lastly, you will need to download the zip bundle containing this tutorial's data. We will use a toy dataset: NA12878, a subset to chromosome 20. For a detailed description of each file in the bundle, see the README. |

Introduction

In the text to follow, we will walk you through step by step how to create your very first WDL script. Now, most would start with the infamous "hello world" example, but we prefer to walk through a more relevant example. Here, we will write a workflow called helloHaplotypeCaller; it consists of a single task that calls GATK’s HaplotypeCaller. This tool performs variant discovery on high-throughput sequencing data.

As you can see from our diagram, the task haplotypeCaller will take in a File inputBAM and output a File rawVCF. It is a one-task workflow, so there isn’t much to see here.

Start out all your script writing with a high-level sketch, like the one above, so you know where you plan to go.

Write your script

Open a blank text file in your favorite text editor and save the file as helloHaplotypeCaller.wdl. (Note the wdl file extension--your text editor might tell you to use txt, which won’t work.) Both the workflow and the tasks will be written to this file.

Workflow

Our first order of business is to outline our workflow. The workflow is the place where you will call each task and specify the order in which they are called. In this case, we only have one task, haplotypeCaller, so the workflow will be fairly simple. Declare your workflow and call your task, like so:

workflow helloHaplotypeCaller {
  call haplotypeCaller
}

Simple, right? Let’s move on to our task now.

Task
haplotypeCaller

A task is essentially the box that packages up a tool command, so it can be interpreted by the execution engine (which is Cromwell in our case). In order to know what we want to write in WDL, let’s first look at how we would enter this command into the terminal. HaplotypeCaller has many possible specifications, but to keep things simple, we will run the tool in normal mode.

java -jar GenomeAnalysisTK.jar \
      -T HaplotypeCaller \
      -R reference.fasta \
      -I input.bam \
      -o output.vcf \

From that declaration, we have a few items that we need to provide as input to the command: reference.fasta, input.bam, output.vcf and GenomeAnalysisTK.jar. Rather than simply providing absolute references (where an absolute reference would be /User/username/input.bam), as we would when running the command, we will give each input a variable name. Three of those inputs are files, so we will declare the variables as File RefFasta, File inputBAM, and File GATK, respectively, within the inputs section of our task. The final input, output.vcf, is a filename to which the output will be written once the command is run. So we will provide a String sampleName with which to name the output file. Place the following text below the workflow declaration within the same helloHaplotypeCaller.wdl file.

task haplotypeCaller {
  File GATK
  File RefFasta
  String sampleName
  File inputBAM
}

Those are the core inputs we need for this task. However, GATK will automatically look for supporting files (an index & dictionary for the reference, and an index for the bam). To tell Cromwell to pull those supporting files into the working directory, we need to declare variables for each of them:

task haplotypeCaller {
  File GATK
  File RefFasta
  File RefIndex
  File RefDict
  String sampleName
  File inputBAM
  File bamIndex
}

Now we can move on to the next component of our task, the command. We’ve already seen the command as it is when run it normally in a bash terminal, but now we need to write it in WDL. We have declared variables, so we simply need to plug them into the command in the right spots. To call a variable in WDL, use the syntax ${variablename}. The GATK variable, for example, would be written as java -jar ${GATK}. Insert each variable into its correct place (aside from the indexes and dictionary as GATK knows to look for them automatically), and place the command within the command component of the task.

task haplotypeCaller {
  File GATK
  File RefFasta
  File RefIndex
  File RefDict
  String sampleName
  File inputBAM
  File bamIndex
  command {
   java -jar ${GATK} \
        -T HaplotypeCaller \
        -R ${RefFasta} \
        -I ${inputBAM} \
        -o ${sampleName}.raw.indels.snps.vcf
  }
}

Nearly there! The very last required component of writing a task is the output. Now, you may be wondering: “Didn’t we already declare an output? It’s right there after the -o!” Yes, the tool has an output, as specified by -o, but in order for the execution engine to recognize the outputs (which is important for the plumbing we explicitly specify them in the outputs { … } component. You’ll get to see the plumbing in practice in a later tutorial, but for now we simply assign the output with the format Type outputVariable = “output_from_command”. In our case, the output component would look like so:

  output {
    File rawVCF = "${sampleName}.raw.indels.snps.vcf"
  }

Add that section in your task, below the command, and you have a completed WDL script. If you’ve been following along, your script should look like this:

workflow helloHaplotypeCaller {
  call haplotypeCaller
}

task haplotypeCaller {
  File GATK
  File RefFasta
  File RefIndex
  File RefDict
  String sampleName
  File inputBAM
  File bamIndex
  command {
    java -jar ${GATK} \
        -T HaplotypeCaller \
        -R ${RefFasta} \
        -I ${inputBAM} \
        -o ${sampleName}.raw.indels.snps.vcf
  }
  output {
    File rawVCF = "${sampleName}.raw.indels.snps.vcf"
  }
}

Running the pipeline

It is good practice to first validate your WDL script before running it. This step is useful whether your script is simple or complex, as it will catch any silly syntax errors before you run it.

Your next step is to generate an input file. We have done so using the command below:

java -jar wdltool.jar inputs helloHaplotypeCaller.wdl > helloHaplotypeCaller_inputs.json

Now you should open the helloHaplotypeCaller_inputs.json file in your text editor of choice. This text editor may not be the default option, or appear as a choice in the quick menus. With most operating systems, you can right-click and Open With or Open As to navigate to the text editor program of your choice. The file extensions, wdl and json are not always recognized, but they will open using a text editor.

In your inputs file, you will see single-line entries for each input that needs to be specified. They follow the format below:

"workflow.task.variable" : "Type"

Replace Type with the absolute path to your file, or with a string. Take RefFasta for example:

"helloHaplotypeCaller.haplotypeCaller.RefFasta" : ".../helloHaplotypeCallerBundle/ref/human_g1k_b37_20.fasta"

You will find all but two inputs (sampleName & gatk) in the attached bundle. The sample's name for our data is "NA12878". For GATK, you should specify the absolute path to your local install (i.e. /usr/Documents/GenomeAnalysisTK.jar instead of $gatk)

With your completed inputs file, you can now run your script locally (i.e. on your own computer). We will run using the command below:

java -jar cromwell.jar run helloHaplotypeCaller.wdl -i helloHaplotypeCaller_inputs.json

When you do, Cromwell should begin printing update messages to your terminal until the workflow is complete.

Note that this command reflects the syntax used by Cromwell version 29+. Earlier versions used the following syntax:

java -jar cromwell.jar run helloHaplotypeCaller.wdl helloHaplotypeCaller_inputs.json
Check your results

The terminal will print out the location of your final output at the very end. It should look similar to this:

{
    "helloHaplotypeCaller.haplotypeCaller.rawVCF": "/Users/username/cromwell-executions/helloHaplotypeCaller/2eae3da2-fb3f-4f26-bc6b-1745a5a077cd/call-haplotypeCaller/NA12878.raw.indels.snps.vcf"
}

Don’t be alarmed by the long string of numbers and letters in the middle of that file structure. That is a hash, designed to uniquely identify each time you run this workflow. With it in place, you won’t accidentally overwrite your files from one run to the next. Go ahead and open up that vcf file to look at it. You can do so by using the more command.

more /Users/username/cromwell-executions/helloHaplotypeCaller/2eae3da2-fb3f-4f26-bc6b-1745a5a077cd/call-haplotypeCaller/NA12878.raw.indels.snps.vcf

This will print the first few lines of your VCF to the terminal. Hit the return key to scroll down through the file until you can see the first few variant calls. They should look like this:

#CHROM  POS     ID      REF     ALT     QUAL    FILTER  INFO    FORMAT  NA12878
20      9999996 .       A       ACT     534.73  .       AC=2;AF=1.00;AN=2;DP=12;FS=0.000;MLEAC=2;MLEAF=1.00;MQ=60.00;QD=25.82;SOR=5.136 GT:AD:DP:GQ:PL  1/1:0,12:12:39:572,39,0
20      10000117        .       C       T       262.77  .       AC=1;AF=0.500;AN=2;BaseQRankSum=-0.831;ClippingRankSum=0.092;DP=23;FS=0.000;MLEAC=1;MLEAF=0.500;MQ=60.47;MQRankSum=-0.769;QD=11.42;ReadPosRankSum=0.769;SOR=0.446       GT:AD:DP:GQ:PL  0/1:11,12:23:99:291,0,292

If you find it a bit hard to read, you’re not alone. GATK has a tool called VariantsToTable that is designed to put a vcf in a bit more readable of a format. 

If you’d like to look through the results more in-depth to compare them, the table file as well as the vcf are present in the bundle’s outputs folder. It should be noted that between GATK versions, the outputs may be marginally different.

Congratulations! You’ve run your very first WDL script! In the next tutorial, here, you will learn how to expand the script you’ve written here. It will teach the branching syntax to workflow plumbing, the importance of pass-through variables, and how to write a multi-task WDL script.