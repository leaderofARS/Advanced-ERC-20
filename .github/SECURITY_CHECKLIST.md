# 🔒 Security Checklist for Contributors

## ⚠️ CRITICAL: Never Commit Secrets!

This is an **open-source project**. All code is publicly visible. Follow these rules:

## ✅ Safe to Commit (Public)

- ✅ `.env.example` files (placeholders only)
- ✅ Source code
- ✅ Documentation
- ✅ Configuration templates
- ✅ Public contract addresses (after deployment)

## ❌ NEVER Commit (Private)

- ❌ `.env` files with real values
- ❌ `.env.local` files
- ❌ Private keys
- ❌ API keys
- ❌ Passwords
- ❌ JWT secrets
- ❌ Database credentials
- ❌ Wallet mnemonics/seed phrases

## 🛡️ Protected by `.gitignore`

The following are automatically ignored:

```
.env
.env.*
*.key
*.pem
secrets/
private/
wallet.json
mnemonic.txt
```

## 🔍 Before Every Commit

Run this checklist:

```bash
# 1. Check what you're committing
git status
git diff

# 2. Verify no secrets are staged
git diff --cached | grep -i "api_key\|secret\|password\|private"

# 3. Check for .env files
git ls-files | grep "\.env$"
# Should return NOTHING or only .env.example
```

## 🚨 If You Accidentally Commit Secrets

### Immediate Actions:

1. **DO NOT PUSH** if you haven't already
2. **Remove from Git history:**
   ```bash
   git reset HEAD~1  # Undo last commit
   git add .         # Re-add without secrets
   git commit -m "your message"
   ```

3. **If already pushed to GitHub:**
   ```bash
   # Contact repository owner immediately
   # Rotate ALL exposed credentials
   # Consider using git-filter-repo to clean history
   ```

4. **Rotate compromised credentials:**
   - Regenerate API keys
   - Change passwords
   - Revoke access tokens
   - Generate new JWT secrets

## 🔐 Best Practices

### For Development

1. **Use `.env.local` for local development**
   ```bash
   cp .env.example .env.local
   # Add your real keys to .env.local
   ```

2. **Never share your `.env.local` file**
   - Not in chat
   - Not in screenshots
   - Not in screen recordings
   - Not in documentation

3. **Use different keys for different environments**
   - Development keys
   - Staging keys
   - Production keys

### For Production Deployment

1. **Use environment variables in hosting platform**
   - Vercel: Project Settings → Environment Variables
   - Render: Dashboard → Environment
   - Railway: Variables tab

2. **Never hardcode secrets in code**
   ```javascript
   // ❌ WRONG
   const apiKey = "abc123xyz789";
   
   // ✅ CORRECT
   const apiKey = process.env.API_KEY;
   ```

3. **Use secret management services**
   - GitHub Secrets (for CI/CD)
   - AWS Secrets Manager
   - HashiCorp Vault
   - Vercel Environment Variables

## 📋 Security Audit Commands

```bash
# Check for accidentally committed secrets
git log --all --full-history --source -- **/.env
git log --all --full-history --source -- **/.env.local

# Search for potential secrets in code
grep -r "api_key\|apikey\|secret\|password" --include="*.ts" --include="*.js"

# Check .gitignore is working
git check-ignore -v .env
git check-ignore -v frontend/.env.local
git check-ignore -v backend/.env
```

## 🆘 Emergency Contacts

If you discover exposed secrets:

1. **Create a private security advisory:**
   - Go to repository → Security → Advisories
   - Click "New draft security advisory"

2. **Contact maintainers:**
   - Email: [security contact]
   - GitHub: @leaderofARS

## 📚 Additional Resources

- [GitHub: Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [Git-secrets tool](https://github.com/awslabs/git-secrets)

---

**Remember: Once a secret is pushed to GitHub, consider it compromised. Rotate immediately!**
