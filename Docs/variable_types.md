# Variable types in WDL
This documentation is in the process of being updated. In the meantime, you may find that some GATK commands are out of date, or that the WDL information is incomplete. If you encounter any issues you can't solve, please let us know.

Note that this is not technically a formal WDL component like task or workflow since there is no entity named variables in the WDL specification. We are covering variables as a group and lumping them in with the proper components for the purposes of simplicity in documentation. We sure hope that doesn't backfire and confuse everyone more instead.

As is common in most programming languages, WDL distinguishes 5 basic types of variables, also called primitive types:

String : A series of alphanumeric characters; typically used to store (short) text, filenames or, in genomics, information such as DNA sequences.
Float : A decimal number; for example 3.1459 (can be negative too).
Int : An integer number; for example 16 (can be negative too).
Boolean : A logical element that represents binary values; for example true or false.
File : An object that represents a file, which is a bit different from just the filename itself.

These primitive types can be grouped into more complex data structures, also called compound types:

Array : A list of elements that are stored, sorted and retrieved by their index position; for example [A,B,C,D] is an array of strings or Array[String] where we can pick the B element by taking the second element (index position 1 since WDL arrays are 0-indexed).
Map : A list of key-value pairs; for example {"color": "blue", "size": "large"} is a map of strings to strings or Map[String, String] where we can ask what is the color of our object.
Object : This one is a little weird and not commonly used, so see the spec for more information.

You can declare variables in the task itself or in the workflow, using the following syntax:

Type variableName

Sometimes, you may not want to use a variable every time you call the task. To make a variable optional (meaning you do not need to set a value either in your JSON inputs file or in your workflow call), simply add the ? modifier*, like so:

Type? variableName

Note that you may also see the ? modifier used next to the Type with a space, like this: Type ? variableName. Both formats are currently allowed (up to Cromwell v24), but the extra space may be disallowed in future versions.

When working with optional variables in your command, you can specify a default value. This tells the execution engine, "if I don't give my own value for this variable, use this default value instead." The syntax for that is:

${default="value" variableName}

At this time, it is not possible to use optional variables at the workflow level.