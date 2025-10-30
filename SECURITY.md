# Security Guide

## ⚠️ IMPORTANT: Protecting Your Credentials

### If You Already Pushed Secrets to GitHub

If you've already pushed your `.env` file or credentials to GitHub, follow these steps:

#### 1. **Remove the file from Git history:**
```bash
# Remove the file from Git tracking
git rm --cached server/.env

# Commit the removal
git add .gitignore
git commit -m "Remove .env file and update .gitignore"

# Push to GitHub
git push origin main
```

#### 2. **Rotate Your Credentials IMMEDIATELY:**

**MongoDB Atlas:**
1. Go to MongoDB Atlas Dashboard
2. Navigate to Database Access
3. Delete the compromised user: `tempgpt369_db_user`
4. Create a new user with a new strong password
5. Update your local `server/.env` file with new credentials

**JWT Secret:**
1. Generate a new random secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
2. Update `JWT_SECRET` in `server/.env`

#### 3. **Clean Git History (if credentials were committed):**

If the credentials were actually committed to Git history, you need to remove them:

```bash
# Install git-filter-repo (one time)
pip install git-filter-repo

# Remove .env file from entire history
git filter-repo --path server/.env --invert-paths

# Force push (WARNING: This rewrites history)
git push origin main --force
```

**⚠️ WARNING:** Force pushing rewrites history. Coordinate with team members if it's a shared repository.

### Setting Up Your Environment

1. **Copy the example file:**
   ```bash
   cp server/.env.example server/.env
   ```

2. **Edit `server/.env` with your actual credentials:**
   - Never share this file
   - Never commit this file
   - Never post it online

3. **Verify `.gitignore` includes:**
   ```
   .env
   server/.env
   **/.env
   ```

### Best Practices

✅ **DO:**
- Use environment variables for all secrets
- Keep `.env` files in `.gitignore`
- Use `.env.example` with placeholder values
- Rotate credentials if they're exposed
- Use strong, unique passwords
- Enable MongoDB IP whitelist (only allow your IP)

❌ **DON'T:**
- Commit `.env` files
- Hardcode credentials in source code
- Share credentials in chat/email
- Use weak passwords
- Reuse passwords across services

### Environment Variables in This Project

- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Secret key for JWT token signing
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret

### Emergency Response Checklist

If credentials are leaked:
- [ ] Remove file from Git tracking
- [ ] Update `.gitignore`
- [ ] Rotate all exposed credentials
- [ ] Clean Git history if needed
- [ ] Review recent database access logs
- [ ] Update local `.env` files
- [ ] Notify team members
- [ ] Document the incident

### Additional Security Measures

1. **MongoDB Atlas Security:**
   - Enable IP Whitelist
   - Use strong passwords (20+ characters)
   - Enable 2FA on Atlas account
   - Regular security audits

2. **Application Security:**
   - Keep dependencies updated
   - Use HTTPS in production
   - Implement rate limiting
   - Regular security scans

3. **GitHub Security:**
   - Enable secret scanning
   - Use GitHub security advisories
   - Review commit history regularly

## Resources

- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [MongoDB Security Checklist](https://www.mongodb.com/docs/manual/administration/security-checklist/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
