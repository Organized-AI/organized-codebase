---
description: Initialize and configure GTM tracking architecture for a new project
allowed-tools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash", "WebFetch"]
---

# GTM Setup Command

Initialize a complete Google Tag Manager tracking implementation. This command guides you through setting up:

- Web GTM container configuration
- Server-side GTM (sGTM) with Stape
- Meta Pixel and CAPI integration
- GA4 tracking with server-side forwarding
- Google Ads conversion tracking

## Workflow

### 1. Gather Account Information

First, collect the essential account IDs:

```
Required Account IDs:
- Meta Pixel ID (e.g., 912613798381607)
- Meta Ad Account ID (e.g., act_1544406343374527)
- GA4 Measurement ID (e.g., G-CS05KZX2HG)
- GA4 Property ID (e.g., 180456352)
- Google Ads Account ID (e.g., 6890103064)
- Web GTM Container ID (e.g., GTM-WM5S3WSG)
- Server GTM Container ID (e.g., GTM-MLBJCV38)
```

### 2. Map Customer Journey

Identify conversion events to track:

**Website Events (Awareness → Conversion):**
- PageView - All pages
- ViewContent - Product/service pages
- form_start - First field focus
- therapy_selected / product_selected - Selection events
- Lead - Form submission

**Offline Events (CRM → CAPI):**
- Lead (qualified) - Pipeline stage change
- CompleteRegistration - Assessment/onboarding complete
- Purchase (deposit) - Initial payment
- Purchase (full) - Treatment/service complete

### 3. Generate Implementation Files

Create the following files in the project:
- `tracking/gtm-web-container.json` - Web GTM import file
- `tracking/gtm-sgtm-container.json` - Server GTM import file
- `tracking/dataLayer-script.js` - Website tracking script
- `tracking/webhook-payloads.json` - CRM webhook templates
- `tracking/implementation-checklist.md` - Testing documentation

### 4. Configure Deduplication

Ensure event_id is passed from browser to server for deduplication:

```javascript
var eventId = 'lead_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
window.dataLayer.push({
  event: 'lead_submit',
  event_id: eventId,
  // ... other parameters
});
```

## Output Structure

```
tracking/
├── gtm-web-container.json
├── gtm-sgtm-container.json
├── dataLayer-script.js
├── webhook-payloads/
│   ├── lead-qualified.json
│   ├── assessment-complete.json
│   ├── deposit-paid.json
│   └── treatment-complete.json
├── implementation-guide.md
└── testing-checklist.md
```

## Best Practices Applied

1. **Server-side first** - All events flow through sGTM for reliability
2. **CAPIG for Meta** - Use Stape CAPIG for simplified CAPI setup
3. **Event deduplication** - Unique event_id on every conversion
4. **User data enrichment** - Hash and pass email, phone, name, country
5. **Dynamic values** - Product-specific conversion values where possible
