#!/usr/bin/env node

/**
 * Claude Code Changelog Verifier (Remote-to-Remote)
 * 
 * Compares the PUSHED changelog on GitHub against upstream source.
 * This verifies what's actually deployed, not local files.
 * 
 * Compares:
 *   - https://github.com/Organized-AI/organized-codebase/blob/main/DOCUMENTATION/claude-code-changelog.md
 *   - https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md
 * 
 * Usage: node scripts/verify-changelog.js
 * 
 * Returns:
 *   - Exit 0: Up to date
 *   - Exit 1: Updates available or error
 */

const https = require('https');

// Configuration - Remote URLs
// Using GitHub API for real-time content (avoids CDN caching)
const CONFIG = {
  // Our tracked changelog on GitHub
  localRepo: {
    api: 'https://api.github.com/repos/Organized-AI/organized-codebase/contents/DOCUMENTATION/claude-code-changelog.md',
    raw: 'https://raw.githubusercontent.com/Organized-AI/organized-codebase/main/DOCUMENTATION/claude-code-changelog.md',
    web: 'https://github.com/Organized-AI/organized-codebase/blob/main/DOCUMENTATION/claude-code-changelog.md',
  },
  // Upstream source
  upstream: {
    api: 'https://api.github.com/repos/anthropics/claude-code/contents/CHANGELOG.md',
    raw: 'https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md',
    web: 'https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md',
  },
};

/**
 * Fetch content via GitHub API (avoids CDN caching)
 */
function fetchFromGitHubAPI(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'organized-codebase-changelog-verifier',
        'Accept': 'application/vnd.github.v3+json',
      },
    };
    
    https.get(url, options, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchFromGitHubAPI(res.headers.location).then(resolve).catch(reject);
      }
      
      if (res.statusCode === 404) {
        return reject(new Error(`404 Not Found: ${url}`));
      }
      
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}: ${url}`));
      }
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          // GitHub API returns base64 encoded content
          const content = Buffer.from(json.content, 'base64').toString('utf-8');
          resolve(content);
        } catch (e) {
          reject(new Error('Failed to parse GitHub API response'));
        }
      });
      res.on('error', reject);
    }).on('error', reject);
  });
}

/**
 * Fetch content from GitHub raw URL (fallback)
 */
function fetchFromGitHubRaw(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchFromGitHubRaw(res.headers.location).then(resolve).catch(reject);
      }
      
      if (res.statusCode === 404) {
        return reject(new Error(`404 Not Found: ${url}`));
      }
      
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}: ${url}`));
      }
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

/**
 * Fetch with API preferred, raw as fallback
 */
async function fetchContent(source, name) {
  try {
    console.log(`   Trying GitHub API...`);
    return await fetchFromGitHubAPI(source.api);
  } catch (apiError) {
    console.log(`   API failed (${apiError.message}), trying raw URL...`);
    return await fetchFromGitHubRaw(source.raw);
  }
}

/**
 * Extract version from changelog content
 */
function extractLatestVersion(content) {
  const versionMatch = content.match(/##\s*\[?(\d+\.\d+\.\d+)\]?/);
  return versionMatch ? versionMatch[1] : null;
}

/**
 * Extract all versions from changelog
 */
function extractAllVersions(content) {
  const versionPattern = /##\s*\[?(\d+\.\d+\.\d+)\]?/g;
  const versions = [];
  let match;
  while ((match = versionPattern.exec(content)) !== null) {
    versions.push(match[1]);
  }
  return versions;
}

/**
 * Parse version string into comparable parts
 */
function parseVersion(v) {
  const parts = v.split('.').map(Number);
  return { major: parts[0], minor: parts[1], patch: parts[2] };
}

/**
 * Compare two version strings
 */
function compareVersions(a, b) {
  const va = parseVersion(a);
  const vb = parseVersion(b);
  
  if (va.major !== vb.major) return va.major > vb.major ? 1 : -1;
  if (va.minor !== vb.minor) return va.minor > vb.minor ? 1 : -1;
  if (va.patch !== vb.patch) return va.patch > vb.patch ? 1 : -1;
  return 0;
}

/**
 * Main verification logic
 */
async function verify() {
  console.log('═'.repeat(70));
  console.log('  Claude Code Changelog Verification (Remote-to-Remote)');
  console.log('═'.repeat(70));
  console.log();

  console.log('📍 Comparing GitHub Sources:');
  console.log();
  console.log('   LOCAL REPO (Organized-AI):');
  console.log(`   ${CONFIG.localRepo.web}`);
  console.log();
  console.log('   UPSTREAM (anthropics):');
  console.log(`   ${CONFIG.upstream.web}`);
  console.log();
  console.log('─'.repeat(70));

  try {
    // Fetch both from GitHub
    console.log('⏳ Fetching from Organized-AI/organized-codebase...');
    let localContent;
    try {
      localContent = await fetchContent(CONFIG.localRepo, 'local');
    } catch (err) {
      console.log('❌ Failed to fetch local repo changelog');
      console.log(`   ${err.message}`);
      console.log();
      console.log('   Has the changelog been pushed to GitHub?');
      console.log('   Run: git push origin main');
      return { status: 'local_missing', exitCode: 1 };
    }
    
    console.log('⏳ Fetching from anthropics/claude-code...');
    const upstreamContent = await fetchContent(CONFIG.upstream, 'upstream');

    // Extract versions
    const localVersion = extractLatestVersion(localContent);
    const upstreamVersion = extractLatestVersion(upstreamContent);
    const localVersions = extractAllVersions(localContent);
    const upstreamVersions = extractAllVersions(upstreamContent);

    console.log();
    console.log('📊 Version Comparison:');
    console.log('─'.repeat(70));
    console.log(`   Upstream (anthropics)     Latest: v${upstreamVersion}  (${upstreamVersions.length} total)`);
    console.log(`   Local (Organized-AI)      Latest: v${localVersion}  (${localVersions.length} total)`);
    console.log();

    // Compare
    const comparison = compareVersions(upstreamVersion, localVersion);
    
    if (comparison === 0) {
      console.log('✅ STATUS: UP TO DATE');
      console.log();
      console.log(`   Both repos are at v${localVersion}`);
      console.log();
      console.log('═'.repeat(70));
      return { 
        status: 'current', 
        localVersion, 
        upstreamVersion, 
        exitCode: 0 
      };
    }

    if (comparison > 0) {
      const missingVersions = upstreamVersions.filter(v => 
        !localVersions.includes(v) && compareVersions(v, localVersion) > 0
      );

      console.log('⚠️  STATUS: UPDATES AVAILABLE');
      console.log();
      console.log(`   Upstream has newer version: v${upstreamVersion}`);
      console.log(`   Local repo is at:           v${localVersion}`);
      console.log();
      
      if (missingVersions.length > 0) {
        console.log('🆕 Missing Versions:');
        missingVersions.slice(0, 10).forEach(v => console.log(`   • v${v}`));
        if (missingVersions.length > 10) {
          console.log(`   ... and ${missingVersions.length - 10} more`);
        }
        console.log();
      }
      
      console.log('📝 To update:');
      console.log('   1. Run: /update-changelog (or node scripts/fetch-changelog.js)');
      console.log('   2. Run: git add -A && git commit -m "docs: Update changelog to v' + upstreamVersion + '"');
      console.log('   3. Run: git push origin main');
      console.log();
      console.log('═'.repeat(70));
      
      return { 
        status: 'outdated', 
        localVersion, 
        upstreamVersion, 
        missingVersions,
        exitCode: 1 
      };
    }

    console.log('🤔 STATUS: LOCAL AHEAD OF UPSTREAM');
    console.log();
    console.log(`   Local v${localVersion} > Upstream v${upstreamVersion}`);
    console.log('   This is unusual - check source integrity');
    console.log();
    console.log('═'.repeat(70));
    
    return { 
      status: 'ahead', 
      localVersion, 
      upstreamVersion, 
      exitCode: 0 
    };

  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    return { status: 'error', error: error.message, exitCode: 1 };
  }
}

/**
 * Output JSON result for CI/automation
 */
async function main() {
  const result = await verify();
  
  if (process.argv.includes('--json')) {
    console.log();
    console.log('JSON Output:');
    console.log(JSON.stringify(result, null, 2));
  }
  
  process.exit(result.exitCode);
}

if (require.main === module) {
  main();
}

module.exports = { verify, compareVersions, extractLatestVersion, extractAllVersions };
