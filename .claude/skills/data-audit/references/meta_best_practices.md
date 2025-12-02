# Meta Ads Best Practices

## CAPI Integration

### One vs. Multiple CAPI Integrations

**Recommendation: Use ONE CAPI per Pixel/Dataset**

CAPI connects at the Pixel level, not the campaign level. Campaign attribution happens automatically through fbclid (Facebook Click ID) in URLs.

**Use ONE CAPI for:**
- Single ad account
- Single website domain
- Single Meta Pixel
- All campaigns in account
- Simple, maintainable setup

**Benefits:**
- Single access token
- Simple webhook configuration
- Easier deduplication
- Lower complexity
- More cost-effective
- Easier troubleshooting

**Use MULTIPLE CAPI only when:**
- Separate businesses (different legal entities)
- Multiple ad accounts (different account IDs)
- Multiple domains requiring separation
- Regulatory/compliance mandates separation

### Event Deduplication

Browser Pixel and Server CAPI must use matching `event_id`:

```javascript
// Browser Pixel
const eventId = `${userId}_${eventType}_${timestamp}`;
fbq('track', 'Lead', {
  event_id: eventId,
  em: 'hashed_email'
});

// Server CAPI (same event_id)
{
  event_id: eventId,
  event_name: 'Lead',
  user_data: { em: 'hashed_email' }
}
```

## Enhanced Matching Parameters

**Required:**
- `em` - Email (SHA256 hashed)
- `ph` - Phone (SHA256 hashed)
- `external_id` - CRM/Database ID

**Recommended:**
- `fn`, `ln` - First/Last name (SHA256)
- `ct`, `st`, `zp` - City/State/Zip (SHA256)
- `country` - Country code

**Impact:** Match Quality Score 4.0 -> 7.0+

## Attribution Windows

**iOS 14.5+ Impact:**
- Default: 1-day click, 1-day view (iOS)
- Standard: 7-day click, 1-day view (non-iOS)
- With CAPI: Extended windows for server events

**Recovery:** CAPI bypasses browser restrictions, recovers 30-40% of lost iOS conversions.

## Performance Benchmarks

### B2B Lead Gen
- CPL: $1-15
- CTR: 1.5-5%
- CPC: $0.10-2.50
- Match Quality: 6.0+

### E-commerce
- Cost per Purchase: $10-100
- ROAS: 3.0+ (profitable)
- CTR: 1.5-4%
- Match Quality: 7.0+

### Red Flags
- CPL increasing 50%+ month-over-month
- CTR below 0.5%
- Match Quality below 4.0
- No purchases but high leads (tracking issue)

## Integration Architecture

```
Website (Browser)
  |
  +-> Meta Pixel (Client) ----+
  |                           |
  +-> CRM (GHL/Salesforce)    |
      |                       |
      +-> Webhooks            |
          |                   |
          +-> Stape Container |
              |               |
              +-> Enhanced    |
              |   Matching    |
              |               |
              +-> CAPI -------+
                              |
                              v
                      Meta Events Manager
                              |
                              v
                      All Campaigns Get
                      Better Data
```
