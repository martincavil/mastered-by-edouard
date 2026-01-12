# Fonts Directory

Place your local font files (.ttf) in this directory.

## Required files:

### Platform font:
- `Platform-Regular.ttf`
- `Platform-Medium.ttf`
- `Platform-Bold.ttf`

### Poppins font:
- `Poppins-Regular.ttf`
- `Poppins-Medium.ttf`
- `Poppins-SemiBold.ttf`
- `Poppins-Bold.ttf`

## Usage:

Fonts are configured in `/app/globals.css` with `@font-face` declarations.

- **Platform** is used for headings (via `font-platform` class)
- **Poppins** is the default body font

## Example:

```tsx
<h1 className="font-platform">Heading with Platform</h1>
<p className="font-poppins">Body text with Poppins</p>
```

Default body text uses Poppins automatically.
