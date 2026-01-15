---
description: Audit existing GTM implementation for issues, gaps, and optimization opportunities
allowed-tools: ["Read", "WebFetch", "Bash", "Glob", "Grep"]
---

# GTM Audit Command

Perform a comprehensive audit of an existing GTM implementation to identify issues, gaps, and optimization opportunities.

## Audit Scope

### 1. Container Health Check

**Web GTM Container:**
- [ ] Container published and active
- [ ] No unpublished changes pending
- [ ] Built-in variables enabled (Page URL, Referrer, Click classes, etc.)
- [ ] User-defined variables properly configured
- [ ] No orphaned tags (tags without triggers)
- [ ] No orphaned triggers (triggers without tags)

**Server GTM Container:**
- [ ] Container running and healthy
- [ ] Client configurations correct
- [ ] Tags processing events
- [ ] No error logs in recent history

### 2. Tag Implementation Review

**Meta Pixel Tags:**
- [ ] Pixel Setup tag fires on all pages
- [ ] PageView fires once per page load
- [ ] ViewContent on product/service pages
- [ ] Lead/Purchase events have required parameters
- [ ] Event ID passed for deduplication
- [ ] User data parameters populated

**GA4 Tags:**
- [ ] Configuration tag with correct Measurement ID
- [ ] Server-side transport_url configured
- [ ] page_view events firing
- [ ] Custom events mapped correctly
- [ ] E-commerce events (if applicable)
- [ ] User properties set

**Google Ads Tags:**
- [ ] Conversion Linker present
- [ ] Conversion tracking tags configured
- [ ] Enhanced conversions enabled (if applicable)
- [ ] Remarketing tag (if applicable)

### 3. Trigger Analysis

**Page-Based Triggers:**
- [ ] All Pages trigger exists
- [ ] Specific page triggers use correct conditions
- [ ] Page path vs URL matching appropriate

**Event-Based Triggers:**
- [ ] Custom event names match dataLayer pushes
- [ ] Form submission triggers reliable
- [ ] Click triggers scoped correctly
- [ ] Scroll depth tracking (if needed)

### 4. Event Quality Assessment

**Meta Events Manager:**
- [ ] Event Match Quality score
- [ ] Deduplicated event count
- [ ] Server vs browser breakdown
- [ ] Parameter coverage

**GA4 Debug View:**
- [ ] Events appearing in real-time
- [ ] Parameters populated
- [ ] User properties set
- [ ] No duplicate events

## Quick Audit Checklist

For rapid assessment, verify these critical items:

1. ✅ GTM snippet installed correctly (head + body)
2. ✅ Meta Pixel fires PageView on load
3. ✅ GA4 config tag fires with correct ID
4. ✅ Conversion events include event_id
5. ✅ User data captured on forms
6. ✅ Server-side receiving events
7. ✅ Meta Events Manager shows server events
8. ✅ No duplicate conversions counted
