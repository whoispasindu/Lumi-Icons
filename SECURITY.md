# Security policy

## Supported versions

Security fixes are released for the latest published version of each `@lumi-icons/*` package.

## Reporting a vulnerability

Please report vulnerabilities privately through GitHub: open the repository's **Security** tab and choose **Report a vulnerability**. Do not open a public issue for security problems.

Include the affected package and version, a minimal reproduction, and the impact you expect. You can expect an acknowledgement within a few days and a fix or mitigation plan once the report is confirmed.

## Security model

- Attribute and prop values (`name`, `size`, `color`, `label`, ...) are applied through the CSSOM and `setAttribute`, never as markup, so they cannot inject HTML or CSS.
- The built-in artwork contains no scripts, event handlers, links, external references, or inline styles.
- An icon's `svg` string is inserted as markup. Only register icons whose artwork you control; never build an icon definition from user input.
- On pages that enforce Trusted Types, markup goes through a policy named `lumi-icons` (allow it with `trusted-types lumi-icons`).
