---
description: Configure Meta Conversions API (CAPI) with Stape CAPIG for server-side tracking
allowed-tools: ["Read", "Write", "Edit", "Bash", "WebFetch", "Glob"]
---

# GTM CAPI Command

Configure Meta Conversions API using Stape CAPIG (Conversions API Gateway) for simplified server-side tracking.

## What is CAPIG?

**CAPIG (Conversions API Gateway)** is Stape's streamlined approach to Meta CAPI:

✅ No complex sGTM tags - Just HTTP requests to CAPIG endpoint
✅ Automatic user data hashing - CAPIG handles SHA256 hashing
✅ Better reliability - Stape manages the Meta API connection
✅ Simpler debugging - View events in Stape dashboard

## CAPIG URL Structure

```
https://capig.stape.vip/{PIXEL_ID}/{EVENT_NAME}
```

**Example URLs:**
```
https://capig.stape.vip/912613798381607/PageView
https://capig.stape.vip/912613798381607/ViewContent
https://capig.stape.vip/912613798381607/Lead
https://capig.stape.vip/912613798381607/Purchase
https://capig.stape.vip/912613798381607/CompleteRegistration
```

## Setup Steps

### 1. Prerequisites

Collect the following credentials:

```yaml
Meta Pixel ID: [YOUR_PIXEL_ID]
Meta Access Token: [YOUR_CAPI_ACCESS_TOKEN]
Stape Container Domain: [YOUR_STAPE_DOMAIN]
```

**Get Meta Access Token:**
1. Go to Meta Events Manager
2. Select your Pixel → Settings
3. Conversions API → Generate access token
4. Copy token (starts with `EAA...`)

### 2. Install CAPIG Template in sGTM

1. Open sGTM workspace
2. Templates → Tag Templates → Search Gallery
3. Search "Stape CAPI Gateway"
4. Add to workspace

### 3. Create CAPIG Configuration Tag

| Setting | Value |
|---------|-------|
| Pixel ID | `{PIXEL_ID}` |
| Access Token | `{ACCESS_TOKEN}` |
| API Version | `v18.0` |
| Test Event Code | (blank for production) |

### 4. Create Event Tags

#### PageView Tag
```yaml
Event Name: PageView
Event Source URL: {{ED - Page Location}}
Action Source: website
Event ID: {{ED - Event ID}}
Trigger: GA4 Client - PageView
```

#### Lead Tag (Web)
```yaml
Event Name: Lead
Event Source URL: {{ED - Page Location}}
Action Source: website
Event ID: {{ED - Event ID}}
Value: {{ED - Value}}
Currency: USD
User Data:
  - Email: {{UD - Email}}
  - Phone: {{UD - Phone}}
  - First Name: {{UD - First Name}}
  - Last Name: {{UD - Last Name}}
  - Country: {{UD - Country}}
  - FBP: {{Cookie - _fbp}}
  - FBC: {{Cookie - _fbc}}
Trigger: GA4 Client - Lead
```

#### Purchase Tag (Offline)
```yaml
Event Name: Purchase
Event Source URL: https://[your-domain.com]
Action Source: system_generated
Value: {{ED - Value}}
Currency: USD
Content Name: {{ED - Therapy Type}}
User Data: (same as Lead)
Trigger: Webhook - Deposit Paid | Treatment Complete
```

## Event Deduplication

CAPIG automatically handles deduplication when `event_id` is provided:

1. **Browser Pixel** fires with `event_id: "abc123"`
2. **sGTM → CAPIG** fires with same `event_id: "abc123"`
3. Meta deduplicates and counts as 1 event

**Critical:** Generate unique event_id in browser and pass to server.

## Troubleshooting

### CAPIG Not Receiving Events
1. Check sGTM Preview mode - verify tags fire
2. Verify CAPIG endpoint URL is correct
3. Check Authorization header has valid token

### No User Data Match
1. Ensure email/phone are passed unhashed (CAPIG hashes automatically)
2. Verify user_data structure in request body
3. Check CRM webhook field mappings

### Offline Events Missing
1. Test webhook with Webhook.site first
2. Verify sGTM Webhook Client for `/webhook` path
3. Check trigger conditions match `event_name` values
