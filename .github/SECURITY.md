# Security Policy

## Supported Versions

We actively support the following versions of the Developer Portfolio Dashboard:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability, please follow these steps:

### 1. Do NOT create a public issue

Please do not report security vulnerabilities through public GitHub issues, discussions, or pull requests.

### 2. Report privately

Instead, please send an email to [security@yourproject.com] with the following information:

- A description of the vulnerability
- Steps to reproduce the issue
- Potential impact of the vulnerability
- Any suggested fixes (if you have them)

### 3. Response timeline

- We will acknowledge receipt of your vulnerability report within 48 hours
- We will provide a detailed response within 7 days indicating next steps
- We will keep you informed of our progress toward a fix
- We may ask for additional information or guidance

### 4. Disclosure policy

- We will work with you to understand and resolve the issue quickly
- We will credit you in our security advisory (unless you prefer to remain anonymous)
- We will coordinate the timing of any public disclosure

## Security Best Practices

When contributing to this project, please follow these security guidelines:

### Environment Variables
- Never commit sensitive information like API keys, passwords, or tokens
- Use `.env.local` for local development secrets
- Ensure `.env.local` is in `.gitignore`

### Dependencies
- Keep dependencies up to date
- Run `npm audit` regularly to check for vulnerabilities
- Use Dependabot to automate dependency updates

### Code Security
- Validate all user inputs
- Use parameterized queries to prevent SQL injection
- Implement proper authentication and authorization
- Use HTTPS in production
- Sanitize data before displaying to prevent XSS

### MongoDB Security
- Use connection strings with authentication
- Implement proper access controls
- Validate and sanitize all database inputs
- Use MongoDB's built-in security features

### JWT Security
- Use strong, random secrets for JWT signing
- Implement proper token expiration
- Store tokens securely (HTTP-only cookies recommended)
- Validate tokens on every protected route

## Automated Security Scanning

This project includes:

- **CodeQL Analysis**: Automated code scanning for security vulnerabilities
- **Dependency Scanning**: Regular checks for vulnerable dependencies
- **Security Audits**: Automated npm audit checks in CI/CD pipeline

## Contact

For any security-related questions or concerns, please contact:
- Email: [security@yourproject.com]
- GitHub: [@code-craka]

Thank you for helping keep our project secure!