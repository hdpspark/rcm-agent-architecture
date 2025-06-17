# DNS Setup Instructions for xyzaixyz.com on GoDaddy

## Steps to Configure DNS:

1. **Log in to GoDaddy**
   - Go to https://www.godaddy.com and sign in
   - Navigate to "My Products" → "Domains"
   - Find "xyzaixyz.com" and click "DNS"

2. **Remove Existing A Records** (if any)
   - Look for any existing A records with "@" as the name
   - Delete them to avoid conflicts

3. **Add GitHub Pages A Records**
   - Click "Add" and select Type: "A"
   - For each IP, create a new A record:
   
   | Type | Name | Value | TTL |
   |------|------|--------|-----|
   | A | @ | 185.199.108.153 | 600 |
   | A | @ | 185.199.109.153 | 600 |
   | A | @ | 185.199.110.153 | 600 |
   | A | @ | 185.199.111.153 | 600 |

4. **Add WWW Subdomain** (Optional)
   - Click "Add" and select Type: "CNAME"
   
   | Type | Name | Value | TTL |
   |------|------|--------|-----|
   | CNAME | www | hdpspark.github.io | 600 |

5. **Save Changes**
   - Click "Save" after adding all records
   - Changes typically propagate within 1-48 hours

## Verify DNS Propagation:

After setting up, you can check propagation status:
- https://www.whatsmydns.net/#A/xyzaixyz.com
- https://dnschecker.org/#A/xyzaixyz.com

## Verify GitHub Pages Setup:

Check the repository settings:
- Go to https://github.com/hdpspark/rcm-agent-architecture/settings/pages
- Under "Custom domain" it should show "xyzaixyz.com"
- Wait for the DNS check to pass (can take up to 24 hours)
- Once verified, "Enforce HTTPS" will become available

## Troubleshooting:

- If you see "DNS Check in Progress" on GitHub, wait a few hours
- Make sure no conflicting A or AAAA records exist
- Ensure the CNAME file in the repository contains exactly: xyzaixyz.com
- Clear browser cache when testing