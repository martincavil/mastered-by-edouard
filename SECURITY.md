# Security Guidelines

## Environment Variables

### Critical Security Notes

⚠️ **NEVER commit `.env.local` or `cms/.env` files to version control**

These files contain sensitive API keys and secrets:
- `DROPBOX_ACCESS_TOKEN`: Dropbox API access token
- Strapi admin credentials and JWT secrets
- Database connection strings

### Setup

1. Copy `.env.example` to `.env.local` (if provided)
2. Fill in your actual credentials
3. Verify `.gitignore` includes `.env*` (except `.env.example`)

## API Routes

All API routes should:
- Validate environment variables before use
- Use `console.error()` for errors (not `console.log()`)
- Never expose sensitive data in error messages
- Return generic error messages to clients

## File Uploads

The `/api/upload` and `/api/production-sheet` routes handle file uploads:
- Validate file types before processing
- Check file sizes to prevent abuse
- Use secure file naming (no user input in filenames)
- All uploads are stored in Dropbox, not on server

## Best Practices

1. **Keep dependencies updated**: `npm audit` regularly
2. **Review tokens**: Rotate API tokens periodically
3. **Monitor logs**: Check for suspicious activity
4. **Rate limiting**: Consider adding rate limits to API routes
5. **CORS**: Configure CORS policies appropriately

## Deployment

When deploying to production:
- Set all environment variables in your hosting platform
- Enable HTTPS only
- Use environment-specific tokens (dev/staging/prod)
- Never use development tokens in production

## Reporting Security Issues

If you discover a security vulnerability, please contact the repository owner directly.
DO NOT open a public issue for security vulnerabilities.
