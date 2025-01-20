# Imports

Often, it is desirable to split WDL code between multiple files. For example, you may
have several common tasks that you want to share between multiple workflows. In these
cases, you can use `import` statements ([spec link][spec-import-statements]) to refer to
code across files.

The most important bits to understand are:

* Imports get their own namespace within WDL files,
* Imports can be local files or URLs (technically, arbitrary URIs),
* Imported documents **must** be the same version as the current document, and
* You may alias imports or their constituent parts to avoid name collisions.

The example below shows some representative imports with brief descriptions of each.

```wdl
# Importing from a file `foo.wdl` with the namespace `foo`.
import "foo.wdl"

# Importing form a file `bar.wdl` but defining its namespace as `baz`.
import "bar.wdl" as baz

# Importing the `Person` struct from `person.wdl` directly into the
# current namespace with the name `Individual`..
import "person.wdl" alias Person as Individual 

# Importing from a URI.
import "http://example.com/lib/stdlib.wdl"
```

[spec-import-statements]:
    https://github.com/openwdl/wdl/blob/wdl-1.2/SPEC.md#import-statements
