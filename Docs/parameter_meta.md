# Parameter_meta
This documentation is in the process of being updated. In the meantime, you may find that some GATK commands are out of date, or that the WDL information is incomplete. If you encounter any issues you can't solve, please let us know.

The parameter_meta component is an optional property of a task. It is intended to store descriptions of input arguments and parameters used in the task command, which is particularly helpful if your variable names are not descriptive enough. Any item (i.e. input_file) in this section MUST be present in the command line.

Usage example
parameter_meta {
    input_file: "the BAM file to process"
    sample_id: "the name of a sample"
}