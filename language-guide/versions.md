# Verisons

The Workflow Description Language has two concepts of versions within the project:

* The WDL _language_ has a two-number version (e.g., `1.2`). An increase in the
  minor (second) version number (e.g., `1.1` to `1.2`) indicates the addition
  of, or non-breaking changes to, the language or standard library functions. An
  increase in the major (first) version number (e.g., `1.0` to `2.0`) indicates
  that breaking changes have been made.

* The WDL _specification_ has a three-number version (e.g., `1.2.0`). The
  specification version tracks the language version, but there may also be patch
  releases (indicated by a change to the patch, or third, version number) that
  include fixes for typos, additional examples, or non-breaking clarifications
  of ambiguous language.

In general, users of WDL only need to care about the version of the WDL
_language_—you'll rarely, if ever, need to care about the version of the
_specification_ itself.

## Upgrading

If you're interested in learning more about the finer details of upgrading
between versions, such as what features new versions introduce, common pitfalls
of upgrading, and how to get help, see the [Upgrade guide] in the Reference section.

## Version specification

The WDL version is a statement that appears at the top of a WDL document—when included,
it **must** be the first non-comment within the document.

:::tip NOTE
Technically, the version statement is not _required_, but it is highly recommended that
you do include it in all of your WDL documents. Omission of the version statement
defaults to a very early version of the WDL specification (`draft-2`).
:::


You can specify the version of your WDL document like so:

```wdl
version 1.2

# ... other document contents ...
```

## Compatability considerations

Documents may only import other WDL documents of the same version. This is
because the imported documents are effectively comingled within their importer's
context and processed holistically (instead of, for example, being compiled
independently).

[Upgrade guide]: ../reference/upgrade-guide.md
