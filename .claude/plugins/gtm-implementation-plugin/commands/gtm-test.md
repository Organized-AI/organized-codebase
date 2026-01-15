---
description: Run comprehensive GTM testing checklist and validate tracking implementation
allowed-tools: ["Read", "WebFetch", "Bash", "Glob", "Grep"]
---

# GTM Test Command

Execute a comprehensive testing protocol for GTM implementations. This validates browser-side tracking, server-side events, and platform-specific configurations.

## Testing Phases

### Phase 1: GTM Preview Mode Validation

**Steps:**
1. Enable GTM Preview mode at tagmanager.google.com
2. Connect to the target website
3. Verify tag firing sequence

**Checklist:**
- [ ] GA4 Configuration tag fires on DOM Ready
- [ ] Meta Pixel Setup tag fires on Page Load
- [ ] PageView events fire on all pages
- [ ] ViewContent fires on product/service pages
- [ ] Form interaction events (form_start, field_focus)
- [ ] Conversion events (Lead, Purchase) on submission

### Phase 2: Meta Pixel Helper Validation

**Install:** [Meta Pixel Helper Chrome Extension](https://chrome.google.com/webstore/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)

**Verify:**
- [ ] PageView fires on page load
- [ ] Correct Pixel ID displayed
- [ ] No duplicate PageView events
- [ ] Lead event includes `value` parameter
- [ ] Lead event includes `eventID` for deduplication
- [ ] User data parameters present (em, ph, fn, ln)

### Phase 3: GA4 Real-Time Verification

**Location:** GA4 Admin → Reports → Realtime

**Verify:**
- [ ] page_view events appearing
- [ ] Event parameters populated correctly
- [ ] User properties set (if configured)
- [ ] Custom events (generate_lead, purchase) visible
- [ ] Conversion events marked as conversions

### Phase 4: Server-Side GTM Validation

**Stape Dashboard Checks:**
- [ ] Events appearing in CAPIG logs
- [ ] No authorization errors
- [ ] User data passed correctly
- [ ] Event timestamps accurate

**sGTM Preview Mode:**
- [ ] GA4 Client receiving events
- [ ] CAPIG tags firing
- [ ] Response codes are 200

### Phase 5: Meta Events Manager Validation

**Location:** business.facebook.com/events_manager

**Verify:**
- [ ] Events appearing in Test Events tab
- [ ] Event Match Quality score (target: 6+)
- [ ] Deduplication working (single count, dual sources)
- [ ] Server events showing `action_source: website`
- [ ] Offline events showing `action_source: system_generated`

### Phase 6: Google Ads Conversion Verification

**Location:** ads.google.com → Goals → Conversions

**Verify:**
- [ ] Conversion actions created and active
- [ ] Tag status shows "Recording conversions"
- [ ] Conversion values being passed
- [ ] Attribution model configured

### Phase 7: Offline Conversion Testing

**CRM Webhook Validation:**
1. Move test contact through pipeline stages
2. Check sGTM logs for webhook receipt
3. Verify events in Meta Events Manager

**Test Sequence:**
- [ ] Lead Qualified → CAPI Lead event
- [ ] Assessment Complete → CAPI CompleteRegistration
- [ ] Deposit Paid → CAPI Purchase (deposit value)
- [ ] Treatment Complete → CAPI Purchase (full value)

## Troubleshooting Reference

### Tags Not Firing
1. Check GTM Preview for JavaScript errors
2. Verify trigger conditions match event names
3. Ensure dataLayer.push() occurs before form redirect
4. Check for Content Security Policy blocking

### Meta Pixel Issues
1. Verify Pixel ID is correct
2. Check CSP for facebook.net blocks
3. Use Pixel Helper diagnostic mode
4. Check Events Manager warnings

### Server-Side Events Missing
1. Verify transport_url in GA4 Config
2. Check Stape container status
3. Validate API credentials
4. Review CORS configuration

### Deduplication Failing
1. Confirm event_id matches browser/server
2. Check event_id format consistency
3. Verify timestamp tolerance (<5 minutes)
4. Review Event Match Quality details

## Report Format

After testing, generate a report with:
- Test date and environment
- Pass/fail status for each phase
- Event counts and match rates
- Screenshots of key validations
- Recommended fixes for failures
