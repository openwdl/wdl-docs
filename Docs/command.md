# Command
This documentation is in the process of being updated. In the meantime, you may find that some GATK commands are out of date, or that the WDL information is incomplete. If you encounter any issues you can't solve, please let us know.

The command component is a required property of a task. The body of the command block specifies the literal command line to run (basically any command that you could otherwise run in a terminal shell) with placeholders (e.g. ${input_file}) for the variable parts of the command line that need to be filled in. Note that all variable placeholders MUST be defined in the task input definitions.

Usage example
command {
    java -jar myExecutable.jar \
        INPUT=${input_file} \
        OUTPUT=${output_basename}.txt
}