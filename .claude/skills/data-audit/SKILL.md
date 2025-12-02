---
name: data-audit
description: Comprehensive Meta Ads account auditing using Pipeboard Meta MCP and Stape MCP tools. Use when conducting performance audits, analyzing ad account data, evaluating tracking infrastructure (Pixel/CAPI/Stape), creating audit reports, assessing campaign performance, managing Stape containers, or generating architecture diagrams. Triggers on requests like "audit this Meta account", "analyze ad performance", "evaluate tracking setup", "create CAPI recommendations", "set up Stape container", or "generate audit report".
---

# Data Audit

Systematic workflow for conducting comprehensive Meta Ads account audits using Pipeboard Meta MCP and Stape MCP tools, generating professional reports, and creating actionable recommendations.

## Audit Workflow

### Phase 1: Data Collection

**Step 1: Account Discovery**
```python
# Get all accessible ad accounts
get_ad_accounts(access_token=None, user_id="me", limit=200)

# Select target account and get details
get_account_info(account_id="act_XXXXXXXXX")
```

**Step 2: Campaign Analysis**
```python
# Get campaigns with filters
get_campaigns(
    account_id="act_XXXXXXXXX",
    limit=50,
    status_filter="ACTIVE",
    objective_filter=""
)

# Get detailed campaign data
get_campaign_details(campaign_id="CAMPAIGN_ID")
```

**Step 3: Ad Set & Ad Analysis**
```python
# Get ad sets
get_adsets(account_id="act_XXXXXXXXX", limit=50, campaign_id="")
get_adset_details(adset_id="ADSET_ID")

# Get ads and creatives
get_ads(account_id="act_XXXXXXXXX", limit=50)
get_ad_creatives(ad_id="AD_ID")
get_ad_image(ad_id="AD_ID")
```

**Step 4: Performance Insights**
```python
# Get insights with breakdowns
get_insights(
    object_id="act_XXXXXXXXX",
    time_range="last_30d",
    breakdown="",
    level="campaign",
    limit=25
)
```

### Phase 2: Analysis & Synthesis

**Key Metrics:**
- Total spend and budget allocation
- Lead volume and CPL
- Purchase volume and cost per purchase
- CTR ranges
- Conversion events
- Campaign objectives alignment
- Top performers vs. underperformers

**Tracking Infrastructure Assessment:**
- Pixel implementation status
- CAPI deployment
- Event match quality scores
- Attribution window coverage
- iOS 14+ impact (30-40% loss without CAPI)
- Revenue tracking completeness

### Phase 3: Artifact Generation

**Required Artifacts:**

1. **Comprehensive Audit Report** - See `references/audit_template.md`
2. **Visual Architecture Diagram** - See `references/architecture_template.md`
3. **CAPI Implementation Checklist** - See `references/capi_checklist.md`
4. **Meta Account Insights Summary**

**Formatting Rules:**
- Use clear headers (##, ###)
- Include tables for data
- Add status indicators: [OK], [X], [WARN]
- Simple ASCII diagrams only
- No time constraints
- Use phased roadmaps

### Phase 4: Recommendations

**Priority HIGH: CAPI Implementation**
- Set up Stape container (Europe zone for GDPR)
- Configure CAPI endpoint with enhanced matching
- Connect CRM webhooks (GHL -> Stape -> Meta)
- Implement event deduplication
- Expected: +30-40% attribution recovery

**Priority MEDIUM: Revenue Tracking**
- Audit purchase paths
- Standardize value parameters
- Enable value-based bidding

**Priority MEDIUM: Optimization**
- Analyze complete data
- Reallocate budgets
- Implement advanced strategies

## CAPI Best Practices

### One vs. Multiple CAPI Integrations

**Use ONE CAPI when:**
- Single ad account
- Single domain
- Single Meta Pixel
- Want simple setup (RECOMMENDED)

**Architecture:**
```
1 Website -> 1 Pixel -> 1 CAPI -> All Campaigns
```

**Use MULTIPLE only when:**
- Multiple separate businesses
- Multiple ad accounts
- Multiple domains
- Regulatory requirements

**Key:** CAPI connects to Pixel/Dataset, not campaigns. Meta routes events automatically via fbclid.

## Tool Integration

### Pipeboard Meta MCP Tools

**Account:** `get_ad_accounts`, `get_account_info`, `get_account_pages`
**Campaign:** `get_campaigns`, `get_campaign_details`, `create_campaign`, `update_campaign`, `bulk_update_campaigns`
**Ad Set:** `get_adsets`, `get_adset_details`, `create_adset`, `update_adset`, `bulk_update_adsets`
**Ad:** `get_ads`, `get_ad_details`, `get_ad_creatives`, `get_ad_image`, `create_ad`, `update_ad`, `bulk_update_ads`
**Creative:** `upload_ad_image`, `create_ad_creative`, `update_ad_creative`
**Analytics:** `get_insights`, `bulk_get_insights`
**Targeting:** `search_interests`, `get_interest_suggestions`, `estimate_audience_size`, `search_behaviors`, `search_demographics`, `search_geo_locations`
**Search:** `search`, `fetch`

### Stape MCP Tools

**Container:** `stape_container_crud`, `stape_container_power_ups`, `stape_container_proxy_files`, `stape_container_schedules`
**Domain:** `stape_container_domains`
**Analytics:** `stape_container_analytics`, `stape_container_statistics`
**Subscription:** `stape_container_subscription`, `stape_container_paddle`
**Account:** `stape_account`
**Resources:** `stape_container_resource`, `stape_gateway_resource`, `stape_billing_resource`, `stape_monitoring_resource`

See `references/stape_integration.md` for complete documentation.

**Note on GTM:** GTM integration happens through Stape server-side containers. Use Stape MCP tools to create containers that run GTM templates.

### Sequential Thinking

Always use sequential thinking for:
1. Data collection planning
2. Pattern identification
3. Recommendation synthesis
4. Data validation
5. Artifact structuring

## Resources

### references/
- `stape_integration.md` - Complete Stape MCP guide
- `meta_best_practices.md` - Meta API patterns
- `audit_template.md` - Audit report template
- `architecture_template.md` - Architecture diagrams
- `capi_checklist.md` - CAPI implementation guide

### assets/
- Example audits from real projects
