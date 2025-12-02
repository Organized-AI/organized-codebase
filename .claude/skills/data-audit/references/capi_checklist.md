# CAPI Implementation Checklist

## Pre-Implementation

### Access Requirements
- [ ] Meta Business Manager admin
- [ ] Events Manager access
- [ ] Meta Pixel ID: _______________
- [ ] CRM admin access
- [ ] DNS management access

### Information Gathering
- [ ] Current pixel ID
- [ ] Ad account ID: act_____________
- [ ] CRM type and version
- [ ] Current match quality: ___/10
- [ ] Key CRM events to track

---

## Phase 1: Infrastructure

### Stape Container
- [ ] Create Stape account
- [ ] Select Europe zone (GDPR)
- [ ] Choose subscription plan
- [ ] Complete setup

### Custom Domain
- [ ] Choose domain: tracking.[domain].com
- [ ] Add CNAME record in DNS
- [ ] Wait for DNS propagation
- [ ] Verify domain connection

### Meta CAPI Credentials
- [ ] Navigate to Events Manager
- [ ] Go to Settings -> Conversions API
- [ ] Generate access token
- [ ] Document token: _______________
- [ ] Configure permissions

---

## Phase 2: CAPI Configuration

### Enhanced Matching
- [ ] Email (em) - REQUIRED
- [ ] Phone (ph) - REQUIRED
- [ ] External ID (external_id) - REQUIRED
- [ ] First name (fn) - Recommended
- [ ] Last name (ln) - Recommended
- [ ] City/State/Zip - Recommended

### Event Deduplication
- [ ] Configure event_id parameter
- [ ] Set up browser pixel event_id
- [ ] Configure server CAPI event_id
- [ ] Test deduplication logic

---

## Phase 3: CRM Integration

### Webhook Configuration
- [ ] Create webhook endpoint in Stape
- [ ] Configure webhook URL in CRM
- [ ] Set up authentication
- [ ] Test connectivity

### Event Mapping
Map CRM events to Meta events:

| CRM Event | Meta Event | Priority |
|-----------|------------|----------|
| Form submit | Lead | HIGH |
| Appointment | Schedule | HIGH |
| Payment | Purchase | HIGH |
| Deal closed | Purchase | HIGH |

---

## Phase 4: Testing

### Test Event Flow
- [ ] Send test event from CRM
- [ ] Verify in Stape logs
- [ ] Check Meta Events Manager
- [ ] Validate parameters

### Match Quality
- [ ] Check initial score
- [ ] Target: 7.0+
- [ ] Document baseline: ___/10
- [ ] Monitor improvement over 7 days

---

## Success Metrics (30 Days)

- [ ] Event volume: +30-40%
- [ ] Match quality: 7.0+
- [ ] Deduplication: >95%
- [ ] Revenue tracking: 100%
- [ ] CRM events visible: 100%
- [ ] System uptime: 99.5%+
