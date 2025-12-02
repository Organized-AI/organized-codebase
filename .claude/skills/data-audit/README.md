# Data Audit Skill

Comprehensive Meta Ads account auditing skill using Pipeboard Meta MCP and Stape MCP tools.

## What It Does

Conducts systematic Meta Ads account audits including:
- Performance analysis across campaigns, ad sets, and ads
- Tracking infrastructure assessment (Pixel/CAPI/Stape)
- Attribution gap identification (iOS 14+ impact)
- CAPI implementation recommendations
- Stape container management
- Professional audit report generation

## When To Use

The skill automatically triggers on:
- "Audit this Meta account"
- "Analyze ad performance"
- "Evaluate tracking setup"
- "Create CAPI recommendations"
- "Set up Stape container"
- "Generate audit report"

## Requirements

### MCP Tools Required:
1. **Pipeboard Meta MCP** - Meta Ads API access
2. **Stape MCP** - Server-side tracking management

### Access Required:
- Meta Business Manager admin
- Events Manager access
- Stape account (for CAPI setup)

## Key Features

### CAPI Analysis
Automatically assesses whether to use:
- ONE CAPI integration (recommended for single account)
- MULTIPLE CAPI integrations (only for separate businesses)

### Stape Integration
Full support for Stape MCP tools:
- Container CRUD operations
- Domain management and validation
- Power-ups configuration (cookie keeper, proxy files, etc.)
- Analytics and monitoring
- Subscription management

### Performance Metrics
Analyzes:
- Campaign performance (spend, leads, purchases)
- Cost efficiency (CPL, cost per purchase, CTR)
- Attribution gaps (iOS 14+ impact estimation)
- Match quality scores
- Revenue tracking completeness

## Output Artifacts

1. **Comprehensive Audit Report**
2. **Architecture Diagrams**
3. **Implementation Checklist**

## Version

1.0 - Initial release
