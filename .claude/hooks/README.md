# Claude Hooks Directory

This directory contains hook scripts for enhancing your Claude Code development experience.

## 🎯 Purpose

Hooks allow you to:
- Monitor token usage in real-time
- Enforce framework compliance (PM-Meta, BMAD METHOD)
- Automate documentation generation
- Track session metrics
- Get desktop notifications for budget alerts

## 📋 Available Hooks

### Token Budget Monitor (Optional - Advanced)
See `PLANNING/07-token-tracking-implementation.md` for full implementation guide.

**When to implement:**
- You want real-time desktop notifications for budget alerts
- You need detailed session analytics
- You want ML-powered token estimation
- You're managing multiple developers/projects

**Quick setup:**
1. Review implementation guide in PLANNING/
2. Copy Python script from guide to this directory
3. Configure via Claude Code `/hooks` command
4. Test with sample operation

## 🚀 Quick Start (Manual Tracking)

If you don't need automated hooks, you can still track tokens manually:

### Check Budget
```bash
cat ../.ai/token-tracker.json | grep -A 10 "weekly_budgets"
```

### Log Session
```bash
# Add to .ai/sessions/ after each Claude Code session
echo "$(date): Used ~X tokens, Model: Sonnet" >> ../.ai/reports/sessions/manual.log
```

### Weekly Review
```bash
# Every Sunday, review what you used
cat ../.ai/reports/sessions/manual.log
```

## 💡 Strategy for Opus Conservation

**Your situation:** Out of Opus because of improper allocation

**Solution:** Use this workflow:

### Planning Phase (Use Sonnet!)
```
1. Initial brainstorm → Sonnet 4.5 (10-15k tokens)
2. Draft architecture → Sonnet 4.5 (15-20k tokens)
3. Create roadmap → Sonnet 4.5 (10-15k tokens)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total planning: 35-50k tokens with Sonnet
Cost: ~$0.15-0.20
```

### Review Phase (Use Opus Strategically!)
```
4. Critical review → Opus 4 (5-10k tokens)
   - Security validation
   - Architecture approval
   - Major design decisions
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total review: 5-10k tokens with Opus
Cost: ~$0.15-0.25
```

**Total Planning Cost:** ~$0.30-0.45 instead of $1-2 with all-Opus!

### Implementation Phase
```
5. Feature development → Sonnet 4.5 (80% of work)
6. Security review → Opus 4 (critical paths only)
7. Testing → Haiku 3.5 (routine) or Sonnet (complex)
```

## 📊 Model Selection Decision Tree

```
Is this a critical architecture decision?
├─ YES → Use Opus 4
│         (security, major design, complex algorithms)
│
└─ NO → Is this standard development work?
          ├─ YES → Use Sonnet 4.5
          │         (features, APIs, UI, tests)
          │
          └─ NO → Is this routine/simple?
                    └─ YES → Use Haiku 3.5
                              (docs, formatting, boilerplate)
```

## 🎓 Learning from Your Opus Shortage

**What happened:**
- Opus used for planning that Sonnet could handle
- No budget tracking led to unconscious overspending
- No alerts when approaching limits

**Prevention going forward:**

1. **Always check budget first:**
   ```bash
   cat .ai/token-tracker.json
   ```

2. **Plan with Sonnet, Review with Opus:**
   - Sonnet drafts the plan (90% quality, 20% cost)
   - Opus validates critical decisions (100% quality, only where needed)

3. **Track as you go:**
   ```bash
   # After each session, note usage
   echo "$(date): Planning session, Sonnet 4.5, ~25k tokens" >> .ai/reports/sessions/manual.log
   ```

4. **Weekly budget check:**
   - Sunday: Review total usage
   - Adjust next week's model selection
   - Reserve Opus for critical needs

## 🔧 Advanced Setup (Optional)

For automated tracking with hooks:
1. Read `PLANNING/07-token-tracking-implementation.md`
2. Implement Phase 1 (Foundation) first
3. Add Phase 2 (Monitoring) when ready
4. Scale to Phases 3-4 as needed

Not required for manual tracking!

## 📞 Need Help?

- Token tracking basics: See `.ai/README.md`
- Full implementation: See `PLANNING/07-token-tracking-implementation.md`
- Model selection: See `PLANNING/01-project-brief.md` (AI Assistance Budget section)

---

**Remember:** The goal isn't to build complex automation immediately. Start with manual tracking, learn your patterns, then automate what makes sense for your workflow!
