#!/usr/bin/env python3

"""
iCal Token Intelligence Bridge
Connects your calendar workflow with Claude Code token tracking

Usage:
    python scripts/ical-intelligence.py today    # Show today's sessions
    python scripts/ical-intelligence.py week     # Show this week
    python scripts/ical-intelligence.py predict  # Predict token needs
"""

import sys
import json
import re
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict, Optional

# ANSI colors for terminal output
class Colors:
    RESET = '\033[0m'
    BOLD = '\033[1m'
    CYAN = '\033[36m'
    GREEN = '\033[32m'
    YELLOW = '\033[33m'
    RED = '\033[31m'
    BLUE = '\033[34m'
    MAGENTA = '\033[35m'

def log(message: str, color: str = 'RESET'):
    """Print colored log message"""
    print(f"{getattr(Colors, color.upper(), Colors.RESET)}{message}{Colors.RESET}")

class iCalTokenBridge:
    """
    Minimal bridge between iCal and token tracking
    Phase 1: Manual event parsing and prediction
    """

    def __init__(self):
        self.tracker_path = Path.home() / '.claude' / 'token-tracker.json'
        self.calendar_path = self.find_calendar_location()

        # Complexity-based token rates (from your planning docs)
        self.token_rates = {
            'low': 5000,      # Simple tasks, bug fixes
            'medium': 10000,  # Standard development
            'high': 15000,    # Complex features
            'critical': 20000 # Architecture, major features
        }

    def find_calendar_location(self) -> Optional[Path]:
        """Locate macOS iCal data"""
        # TODO(human): Add calendar location detection
        # macOS stores calendars at: ~/Library/Calendars/
        # We'll parse .ics files or use icalendar library
        pass

    def get_current_budget_status(self) -> Dict:
        """Read real-time token status from tracker"""
        if not self.tracker_path.exists():
            log("⚠️  Token tracker not found. Run: node scripts/update-token-tracker.js", 'yellow')
            return {
                'weekly': {'total': 0, 'byModel': {}},
                'daily': {'total': 0, 'byModel': {}},
                'fiveHourWindow': {'remaining': 200000, 'limit': 200000}
            }

        return json.loads(self.tracker_path.read_text())

    def parse_session_metadata(self, event_title: str, description: str = '') -> Dict:
        """
        Extract intelligence from calendar event text

        Supports tags like:
        - #complexity:high
        - #project:organized-ai
        - #tokens:45k
        - #agents:claude,droid
        """
        full_text = f"{event_title} {description}".lower()
        metadata = {}

        # Parse complexity tag
        complexity_match = re.search(r'#complexity:(low|medium|high|critical)', full_text)
        if complexity_match:
            metadata['complexity'] = complexity_match.group(1)
        else:
            # Infer from keywords
            if any(word in full_text for word in ['simple', 'fix', 'tweak', 'update']):
                metadata['complexity'] = 'low'
            elif any(word in full_text for word in ['complex', 'architecture', 'design', 'critical']):
                metadata['complexity'] = 'high'
            else:
                metadata['complexity'] = 'medium'

        # Parse project tag
        project_match = re.search(r'#project:(\S+)', full_text)
        if project_match:
            metadata['project'] = project_match.group(1)

        # Parse explicit token estimate
        token_match = re.search(r'#tokens:(\d+)([km]?)', full_text)
        if token_match:
            value = int(token_match.group(1))
            unit = token_match.group(2)
            if unit == 'k':
                value *= 1000
            elif unit == 'm':
                value *= 1000000
            metadata['explicit_tokens'] = value

        # Parse agent suggestions
        agent_match = re.search(r'#agents:([a-z,]+)', full_text)
        if agent_match:
            metadata['suggested_agents'] = agent_match.group(1).split(',')

        return metadata

    def predict_session_tokens(self, duration_hours: float, metadata: Dict) -> Dict:
        """
        Predict token usage for a coding session

        Returns:
            base_estimate: Conservative estimate
            buffer: Safety margin (20%)
            max: Worst-case scenario
            confidence: Prediction confidence (0-1)
        """
        # Use explicit token estimate if provided
        if 'explicit_tokens' in metadata:
            base = metadata['explicit_tokens']
            return {
                'base': base,
                'buffer': int(base * 0.2),
                'max': int(base * 1.3),
                'confidence': 1.0,
                'method': 'explicit'
            }

        # Calculate based on duration and complexity
        complexity = metadata.get('complexity', 'medium')
        rate = self.token_rates[complexity]
        base = int(duration_hours * rate)

        # Adjust for time of day (from planning docs)
        # Early morning: +20% efficiency
        # Late evening: -20% efficiency
        # TODO: Can be enhanced with actual time

        return {
            'base': base,
            'buffer': int(base * 0.2),
            'max': int(base * 1.5),
            'confidence': 0.7,  # Lower confidence for rule-based
            'method': 'rule-based',
            'rate_used': f"{rate}/hour",
            'complexity': complexity
        }

    def estimate_cost(self, tokens: int, model: str = 'sonnet') -> float:
        """
        Estimate cost based on token count and model
        Using pricing from planning docs
        """
        pricing = {
            'opus': {
                'input': 0.000015,
                'output': 0.000075
            },
            'sonnet': {
                'input': 0.000003,
                'output': 0.000015
            },
            'haiku': {
                'input': 0.0000005,
                'output': 0.0000025
            }
        }

        # Assume 50/50 split input/output for estimation
        prices = pricing.get(model, pricing['sonnet'])
        avg_price = (prices['input'] + prices['output']) / 2

        return tokens * avg_price

    def show_today_preview(self):
        """Display today's coding sessions with predictions"""
        log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", 'cyan')
        log("📅 Today's Coding Sessions - Token Intelligence Preview", 'bold')
        log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n", 'cyan')

        # Get current budget status
        budget = self.get_current_budget_status()

        log("📊 Current Budget Status:", 'cyan')
        log(f"  Weekly Used: {budget['weekly']['total']:,} tokens", 'blue')
        log(f"  Daily Used: {budget['daily']['total']:,} tokens", 'blue')
        log(f"  5-Hour Window: {budget['fiveHourWindow']['remaining']:,} / {budget['fiveHourWindow']['limit']:,} remaining", 'green')

        # TODO(human): Parse actual calendar events
        # For now, show example with manual input
        log("\n💡 Example Session Analysis:", 'yellow')
        log("   (Calendar integration coming in Phase 2)\n", 'yellow')

        # Demo session
        demo_session = {
            'title': 'Build OAuth Integration #complexity:high #project:organized-ai',
            'start': '2:00 PM',
            'duration_hours': 3.0,
            'description': 'Implement OAuth2 flow with token refresh'
        }

        metadata = self.parse_session_metadata(demo_session['title'], demo_session['description'])
        prediction = self.predict_session_tokens(demo_session['duration_hours'], metadata)

        log(f"🔨 {demo_session['title']}", 'bold')
        log(f"   Time: {demo_session['start']} ({demo_session['duration_hours']}h)", 'cyan')
        log(f"   Complexity: {prediction['complexity']}", 'yellow')
        log(f"   Estimated: {prediction['base']:,} tokens (±{prediction['buffer']:,})", 'green')
        log(f"   Max: {prediction['max']:,} tokens", 'red')
        log(f"   Cost: ${self.estimate_cost(prediction['base'], 'sonnet'):.2f} (Sonnet)", 'magenta')
        log(f"   Confidence: {prediction['confidence']*100:.0f}%\n", 'cyan')

        # Budget impact
        new_total = budget['daily']['total'] + prediction['base']
        log("💰 Budget Impact:", 'cyan')
        log(f"   After session: {new_total:,} tokens", 'blue')
        log(f"   5-Hour remaining: {budget['fiveHourWindow']['remaining'] - prediction['base']:,} tokens", 'green')

        percentage = (new_total / budget['fiveHourWindow']['limit']) * 100
        if percentage > 90:
            log(f"   ⚠️  Warning: Would use {percentage:.0f}% of 5-hour budget!", 'red')
        elif percentage > 75:
            log(f"   ⚠️  Notice: {percentage:.0f}% of 5-hour budget", 'yellow')
        else:
            log(f"   ✅ Safe: {percentage:.0f}% of 5-hour budget", 'green')

        log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", 'cyan')
        log("💡 Next Steps:", 'yellow')
        log("   1. Add calendar events with #complexity tags", 'cyan')
        log("   2. Run this script before coding sessions", 'cyan')
        log("   3. Review budget impact predictions", 'cyan')
        log("   4. Track actual usage with: node scripts/update-token-tracker.js", 'cyan')
        log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n", 'cyan')

    def interactive_session_planner(self):
        """Interactive prompt for planning a coding session"""
        log("\n🎯 Interactive Session Planner", 'bold')
        log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n", 'cyan')

        # Get current budget
        budget = self.get_current_budget_status()
        log(f"💰 Current budget: {budget['fiveHourWindow']['remaining']:,} tokens remaining\n", 'green')

        # Get session details
        title = input("📝 Session title: ")
        duration = float(input("⏱️  Duration (hours): "))
        complexity = input("🎚️  Complexity (low/medium/high/critical) [medium]: ").strip().lower() or 'medium'

        # Create metadata
        metadata = {'complexity': complexity}

        # Predict
        prediction = self.predict_session_tokens(duration, metadata)

        # Display results
        log(f"\n📊 Session Prediction:", 'bold')
        log(f"   Estimated: {prediction['base']:,} tokens", 'green')
        log(f"   Buffer: ±{prediction['buffer']:,} tokens", 'yellow')
        log(f"   Maximum: {prediction['max']:,} tokens", 'red')
        log(f"   Cost (Sonnet): ${self.estimate_cost(prediction['base'], 'sonnet'):.2f}", 'magenta')
        log(f"   Cost (Opus): ${self.estimate_cost(prediction['base'], 'opus'):.2f}\n", 'magenta')

        # Budget check
        remaining_after = budget['fiveHourWindow']['remaining'] - prediction['base']
        percentage = (prediction['base'] / budget['fiveHourWindow']['limit']) * 100

        if remaining_after < 0:
            log(f"⚠️  WARNING: Session would exceed budget by {abs(remaining_after):,} tokens!", 'red')
        elif percentage > 75:
            log(f"⚠️  Notice: Session will use {percentage:.0f}% of 5-hour window", 'yellow')
        else:
            log(f"✅ Safe: {remaining_after:,} tokens remaining after session", 'green')

        # Calendar event suggestion
        log(f"\n📅 Suggested Calendar Event:", 'cyan')
        log(f"   {title} #complexity:{complexity} #tokens:{prediction['base']//1000}k", 'blue')
        print()

def main():
    bridge = iCalTokenBridge()

    if len(sys.argv) < 2:
        command = 'today'
    else:
        command = sys.argv[1]

    if command == 'today':
        bridge.show_today_preview()
    elif command == 'plan':
        bridge.interactive_session_planner()
    elif command == 'status':
        budget = bridge.get_current_budget_status()
        print(json.dumps(budget, indent=2))
    else:
        log(f"Unknown command: {command}", 'red')
        log("\nUsage:", 'cyan')
        log("  python scripts/ical-intelligence.py today   # Preview today's sessions", 'blue')
        log("  python scripts/ical-intelligence.py plan    # Interactive planner", 'blue')
        log("  python scripts/ical-intelligence.py status  # Show current budget", 'blue')

if __name__ == '__main__':
    main()
