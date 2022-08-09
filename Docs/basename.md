# Basename()
This documentation is in the process of being updated. In the meantime, you may find that some GATK commands are out of date, or that the WDL information is incomplete. If you encounter any issues you can't solve, please let us know.

This WDL function allows you to name an output file based on another filename, e.g. an input filename. Giving it a File will strip off the path and yield the filename alone (as a String). If you also give it a string as a secondary argument, the function will attempt to strip that string off the end of the filename and return whatever remains.

This is super convenient for stripping off a file extension and replacing it with something else, when you want to e.g. name a task's output file based on an input filename.

Basic usage:
File input_file = "/Users/chris/input.bam"
String base = basename(input_file)

This produces input.bam.

Providing a suffix string:
File input_file = "/Users/chris/input.bam"
String stripped = basename(input_file, ".bam") 

This produces input, which can then be combined with a new suffix string to produce the desired output filename.