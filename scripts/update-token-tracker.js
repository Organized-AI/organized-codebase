#!/usr/bin/env node

/**
 * Automated Token Tracker for Claude Code
 *
 * Parses Claude Code JSONL files to track token usage by model
 * Updates token-tracker.json with weekly and daily usage stats
 *
 * Run hourly via cron: 0 * * * * node ~/.claude/scripts/update-token-tracker.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ANSI colors for output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m'
};

function log(message, color = 'reset') {
  const timestamp = new Date().toISOString();
  console.log(`${colors[color]}[${timestamp}] ${message}${colors.reset}`);
}

/**
 * Get the start of the current week (Monday 00:00:00)
 */
function getWeekStart() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust when Sunday
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString();
}

/**
 * Get all JSONL files from Claude projects directory
 */
function getAllJSONLFiles(projectsDir) {
  const files = [];

  if (!fs.existsSync(projectsDir)) {
    log(`Projects directory not found: ${projectsDir}`, 'yellow');
    return files;
  }

  const projectDirs = fs.readdirSync(projectsDir);

  for (const projectDir of projectDirs) {
    const projectPath = path.join(projectsDir, projectDir);
    if (!fs.statSync(projectPath).isDirectory()) continue;

    const jsonlFiles = fs.readdirSync(projectPath)
      .filter(f => f.endsWith('.jsonl'))
      .map(f => path.join(projectPath, f));

    files.push(...jsonlFiles);
  }

  return files;
}

/**
 * Parse a single JSONL file and extract token usage
 */
async function parseJSONLFile(filePath, weekStart, todayStart) {
  const usage = {
    weekly: {},
    daily: {}
  };

  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    if (!line.trim()) continue;

    try {
      const entry = JSON.parse(line);

      // Only process assistant messages with usage data
      if (entry.type !== 'assistant' || !entry.message?.usage) continue;

      const timestamp = new Date(entry.timestamp);
      const model = entry.message.model || 'unknown';
      const tokens = entry.message.usage.input_tokens + entry.message.usage.output_tokens;

      // Count weekly usage (if within current week)
      if (timestamp >= new Date(weekStart)) {
        usage.weekly[model] = (usage.weekly[model] || 0) + tokens;
      }

      // Count daily usage (if today)
      if (timestamp >= new Date(todayStart)) {
        usage.daily[model] = (usage.daily[model] || 0) + tokens;
      }

    } catch (error) {
      // Skip malformed JSON lines
      continue;
    }
  }

  return usage;
}

/**
 * Main function to update token tracker
 */
async function updateTokenTracker() {
  log('Starting token tracker update...', 'cyan');

  const claudeDir = path.join(process.env.HOME, '.claude');
  const projectsDir = path.join(claudeDir, 'projects');
  const trackerPath = path.join(claudeDir, 'token-tracker.json');

  // Calculate time windows
  const weekStart = getWeekStart();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStart = today.toISOString();

  // Initialize usage counters
  const totalUsage = {
    weekly: {},
    daily: {}
  };

  // Get all JSONL files
  const jsonlFiles = getAllJSONLFiles(projectsDir);
  log(`Found ${jsonlFiles.length} JSONL files to process`, 'cyan');

  // Process each file
  for (const file of jsonlFiles) {
    const usage = await parseJSONLFile(file, weekStart, todayStart);

    // Aggregate usage for all models
    for (const period of ['weekly', 'daily']) {
      for (const [model, tokens] of Object.entries(usage[period])) {
        totalUsage[period][model] = (totalUsage[period][model] || 0) + tokens;
      }
    }
  }

  // Calculate totals
  const weeklyTotal = Object.values(totalUsage.weekly).reduce((a, b) => a + b, 0);
  const dailyTotal = Object.values(totalUsage.daily).reduce((a, b) => a + b, 0);

  // Sort models by usage (descending)
  const sortedWeekly = Object.entries(totalUsage.weekly)
    .sort((a, b) => b[1] - a[1])
    .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {});

  const sortedDaily = Object.entries(totalUsage.daily)
    .sort((a, b) => b[1] - a[1])
    .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {});

  // Create tracker data
  const trackerData = {
    lastUpdated: new Date().toISOString(),
    weekStart: weekStart,
    todayStart: todayStart,
    weekly: {
      total: weeklyTotal,
      byModel: sortedWeekly,
      limits: {
        // User can manually set limits per model
      }
    },
    daily: {
      total: dailyTotal,
      byModel: sortedDaily
    },
    fiveHourWindow: {
      // Read from quota-tracker.json if exists
      limit: 200000,
      remaining: 200000
    }
  };

  // Try to read quota-tracker.json for 5-hour window data
  const quotaTrackerPath = path.join(claudeDir, 'quota-tracker.json');
  if (fs.existsSync(quotaTrackerPath)) {
    try {
      const quotaData = JSON.parse(fs.readFileSync(quotaTrackerPath, 'utf-8'));
      trackerData.fiveHourWindow = {
        limit: quotaData.limit || 200000,
        remaining: quotaData.currentWindow?.remaining || 200000,
        resetTime: quotaData.currentWindow?.resetTime
      };
    } catch (error) {
      log('Could not read quota-tracker.json', 'yellow');
    }
  }

  // Write to token-tracker.json
  fs.writeFileSync(trackerPath, JSON.stringify(trackerData, null, 2));

  // Log summary
  log('Token tracker updated successfully!', 'green');
  log(`Weekly total: ${weeklyTotal.toLocaleString()} tokens`, 'cyan');

  // Log top 3 models by weekly usage
  const topWeekly = Object.entries(sortedWeekly).slice(0, 3);
  topWeekly.forEach(([model, tokens]) => {
    const color = model.includes('opus') ? 'yellow' : 'cyan';
    log(`  - ${model}: ${tokens.toLocaleString()}`, color);
  });

  log(`Daily total: ${dailyTotal.toLocaleString()} tokens`, 'cyan');

  // Log top 3 models by daily usage
  const topDaily = Object.entries(sortedDaily).slice(0, 3);
  topDaily.forEach(([model, tokens]) => {
    const color = model.includes('opus') ? 'yellow' : 'cyan';
    log(`  - ${model}: ${tokens.toLocaleString()}`, color);
  });

  log(`Saved to: ${trackerPath}`, 'green');
}

// Run the update
updateTokenTracker().catch(error => {
  log(`Error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
