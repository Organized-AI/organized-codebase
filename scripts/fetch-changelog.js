#!/usr/bin/env node

/**
 * Claude Code Changelog Fetcher
 * 
 * Integrated into Organized Codebase - fetches Claude Code changelog
 * via Apify RAG Web Browser and outputs to DOCUMENTATION/
 * 
 * Usage: node scripts/fetch-changelog.js
 * 
 * Environment Variables:
 *   APIFY_TOKEN - Your Apify API token (required)
 */

const fs = require('fs').promises;
const path = require('path');

// Dynamically import apify-client (handles if not installed)
let ApifyClient;

// Configuration - relative to Organized Codebase root
const CONFIG = {
  actorId: 'apify/rag-web-browser',
  targetUrl: 'https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md',
  outputDir: path.join(__dirname, '..', 'DOCUMENTATION'),
  configDir: path.join(__dirname, '..', 'CONFIG'),
  outputFile: 'CLAUDE-CODE-CHANGELOG.md',
  rawOutputFile: 'changelog-raw.json',
};

/**
 * Load configuration from CONFIG/changelog-tracker.json if exists
 */
async function loadConfig() {
  const configPath = path.join(CONFIG.configDir, 'changelog-tracker.json');
  try {
    const configData = await fs.readFile(configPath, 'utf-8');
    const userConfig = JSON.parse(configData);
    
    // Merge user config with defaults
    if (userConfig.targets?.[0]?.url) {
      CONFIG.targetUrl = userConfig.targets[0].url;
    }
    if (userConfig.output?.filename) {
      CONFIG.outputFile = userConfig.output.filename;
    }
    console.log('📁 Loaded config from CONFIG/changelog-tracker.json');
  } catch (error) {
    // Config file doesn't exist, use defaults
    console.log('📁 Using default configuration');
  }
}

/**
 * Check and initialize Apify client
 */
async function initApifyClient() {
  try {
    const apifyModule = require('apify-client');
    ApifyClient = apifyModule.ApifyClient;
    return new ApifyClient({ token: process.env.APIFY_TOKEN });
  } catch (error) {
    console.error('❌ apify-client not installed. Run: npm install apify-client');
    process.exit(1);
  }
}

/**
 * Fetch changelog using Apify RAG Web Browser
 */
async function fetchChangelog(client) {
  console.log('🚀 Starting Claude Code Changelog fetch...');
  console.log(`📍 Target: ${CONFIG.targetUrl}`);

  try {
    const run = await client.actor(CONFIG.actorId).call({
      query: CONFIG.targetUrl,
      maxResults: 1,
      outputFormats: ['markdown'],
      requestTimeoutSecs: 60,
      dynamicContentWaitSecs: 10,
    });

    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    if (!items || items.length === 0) {
      throw new Error('No results returned from Apify actor');
    }

    return items[0];
  } catch (error) {
    console.error('❌ Error fetching changelog:', error.message);
    throw error;
  }
}

/**
 * Parse and clean the changelog markdown
 */
function parseChangelog(rawData) {
  let markdown = rawData.markdown || rawData.text || '';

  // Find the start of actual changelog content
  const patterns = [
    '# Changelog',
    '# CHANGELOG',
    '## 2.',  // Version pattern like ## 2.1.4
    '## [2.',  // Linked version pattern
  ];

  let startIndex = -1;
  for (const pattern of patterns) {
    const idx = markdown.indexOf(pattern);
    if (idx !== -1 && (startIndex === -1 || idx < startIndex)) {
      startIndex = idx;
    }
  }

  if (startIndex !== -1) {
    markdown = markdown.substring(startIndex);
  }

  // Clean up GitHub chrome and artifacts
  markdown = markdown
    .replace(/\[Skip to content\].*?\n/g, '')
    .replace(/You signed in with another tab.*?\n/g, '')
    .replace(/Navigation Menu.*?Toggle navigation/gs, '')
    .replace(/## Footer[\s\S]*$/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return markdown;
}

/**
 * Extract version entries for summary
 */
function extractVersionSummary(markdown) {
  const versionPattern = /^##\s*\[?(\d+\.\d+\.\d+)\]?/gm;
  const versions = [];
  let match;

  while ((match = versionPattern.exec(markdown)) !== null) {
    versions.push(match[1]);
  }

  return versions;
}

/**
 * Generate the output markdown with metadata header
 */
function generateOutputMarkdown(changelog, rawData) {
  const timestamp = new Date().toISOString();
  const versions = extractVersionSummary(changelog);
  const latestVersion = versions[0] || 'Unknown';

  const header = `---
title: Claude Code Changelog
source: ${CONFIG.targetUrl}
fetched_at: ${timestamp}
latest_version: ${latestVersion}
total_versions: ${versions.length}
actor: ${CONFIG.actorId}
generated_by: organized-codebase/changelog-tracker
---

# Claude Code Changelog

> **Last Updated:** ${new Date().toLocaleString()}  
> **Source:** [GitHub - anthropics/claude-code](${CONFIG.targetUrl})  
> **Latest Version:** ${latestVersion}  
> **Fetched via:** Apify RAG Web Browser

---

`;

  return header + changelog;
}

/**
 * Ensure output directory exists
 */
async function ensureOutputDir() {
  try {
    await fs.mkdir(CONFIG.outputDir, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
  }
}

/**
 * Write output files
 */
async function writeOutput(formattedMarkdown, rawData) {
  await ensureOutputDir();

  const outputPath = path.join(CONFIG.outputDir, CONFIG.outputFile);
  const rawPath = path.join(CONFIG.outputDir, CONFIG.rawOutputFile);

  // Write formatted markdown
  await fs.writeFile(outputPath, formattedMarkdown, 'utf-8');
  console.log(`✅ Changelog written to: ${outputPath}`);

  // Write raw JSON for debugging/reference
  await fs.writeFile(rawPath, JSON.stringify(rawData, null, 2), 'utf-8');
  console.log(`📦 Raw data saved to: ${rawPath}`);

  return outputPath;
}

/**
 * Compare with existing changelog to detect updates
 */
async function detectChanges(newMarkdown) {
  const outputPath = path.join(CONFIG.outputDir, CONFIG.outputFile);

  try {
    const existing = await fs.readFile(outputPath, 'utf-8');
    const existingVersions = extractVersionSummary(existing);
    const newVersions = extractVersionSummary(newMarkdown);

    const addedVersions = newVersions.filter(v => !existingVersions.includes(v));

    if (addedVersions.length > 0) {
      console.log(`🆕 New versions detected: ${addedVersions.join(', ')}`);
      return { hasChanges: true, newVersions: addedVersions };
    }

    console.log('ℹ️  No new versions detected');
    return { hasChanges: false, newVersions: [] };
  } catch (error) {
    console.log('📝 First-time fetch, no comparison available');
    return { hasChanges: true, newVersions: [] };
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('═'.repeat(50));
  console.log('  Claude Code Changelog Fetcher');
  console.log('  Integrated with Organized Codebase');
  console.log('═'.repeat(50));

  // Validate environment
  if (!process.env.APIFY_TOKEN) {
    console.error('❌ Error: APIFY_TOKEN environment variable is required');
    console.log('   Get your token at: https://console.apify.com/account/integrations');
    console.log('   Then run: export APIFY_TOKEN=apify_api_xxxxx');
    process.exit(1);
  }

  try {
    // Load config
    await loadConfig();

    // Initialize Apify client
    const client = await initApifyClient();

    // Fetch from Apify
    const rawData = await fetchChangelog(client);

    // Parse and clean
    const changelog = parseChangelog(rawData);

    if (!changelog || changelog.length < 100) {
      console.warn('⚠️  Warning: Changelog content seems too short');
      console.log('Raw data preview:', JSON.stringify(rawData).substring(0, 500));
    }

    // Detect changes before overwriting
    const changes = await detectChanges(changelog);

    // Generate formatted output
    const formattedMarkdown = generateOutputMarkdown(changelog, rawData);

    // Write files
    const outputPath = await writeOutput(formattedMarkdown, rawData);

    // Summary
    const versions = extractVersionSummary(changelog);
    console.log('\n' + '═'.repeat(50));
    console.log('  ✅ Changelog fetch complete!');
    console.log('═'.repeat(50));
    console.log(`  📄 Output: ${outputPath}`);
    console.log(`  📦 Versions found: ${versions.length}`);
    console.log(`  🏷️  Latest: ${versions[0] || 'Unknown'}`);
    if (changes.hasChanges && changes.newVersions.length > 0) {
      console.log(`  🆕 New versions: ${changes.newVersions.join(', ')}`);
    }
    console.log('═'.repeat(50));

    return { success: true, changes, versions };
  } catch (error) {
    console.error('\n❌ Fetch failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main, fetchChangelog, parseChangelog, extractVersionSummary };
