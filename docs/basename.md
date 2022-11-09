# Basename()
This WDL function allows you to name an output file based on another filename, such as an input filename. Giving it a File will strip off the path and yield the filename alone (as a String). If you also give it a string as a secondary argument, the function will attempt to strip that string off the end of the filename and return whatever remains.

This is super convenient for stripping off a file extension and replacing it with something else, like when you want to name a task's output file based on an input filename.

## Basic usage
```wdl
File input_file = "/Users/chris/input.bam"
String base = basename(input_file)
```
This produces `input.bam`.

## Providing a suffix string
```wdl
File input_file = "/Users/chris/input.bam"
String stripped = basename(input_file, ".bam") 
```
This produces the string `input`, which can then be combined with a new suffix string to produce the desired output filename.