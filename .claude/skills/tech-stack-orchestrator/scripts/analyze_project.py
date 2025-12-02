#!/usr/bin/env python3
"""
Project Analyzer for Tech Stack Orchestrator

Analyzes a project directory and generates component recommendations
based on detected technologies, workflows, and patterns.

Usage:
    python analyze_project.py /path/to/project [--output json|markdown]
"""

import argparse
import json
import os
import re
from pathlib import Path
from typing import Dict, List, Set, Tuple

# Technology detection patterns
TECH_PATTERNS = {
    # Frontend frameworks
    "react": [r"react", r"\.jsx$", r"\.tsx$", r"next\.config"],
    "vue": [r"vue", r"\.vue$", r"nuxt\.config"],
    "svelte": [r"svelte", r"\.svelte$"],
    "angular": [r"angular", r"\.component\.ts$"],
    
    # Backend frameworks
    "node": [r"node_modules", r"package\.json"],
    "python": [r"\.py$", r"requirements\.txt", r"pyproject\.toml"],
    "go": [r"go\.mod", r"\.go$"],
    "rust": [r"Cargo\.toml", r"\.rs$"],
    
    # Databases
    "postgresql": [r"postgres", r"pg_", r"psycopg"],
    "mongodb": [r"mongo", r"mongoose"],
    "mysql": [r"mysql", r"mariadb"],
    "sqlite": [r"sqlite", r"\.db$"],
    "redis": [r"redis", r"ioredis"],
    
    # Cloud/DevOps
    "docker": [r"Dockerfile", r"docker-compose"],
    "kubernetes": [r"k8s", r"kubernetes", r"\.yaml$"],
    "aws": [r"aws-sdk", r"boto3", r"\.aws"],
    "vercel": [r"vercel\.json", r"\.vercel"],
    
    # Testing
    "jest": [r"jest\.config", r"\.test\.(js|ts)"],
    "pytest": [r"pytest", r"test_.*\.py$"],
    "playwright": [r"playwright", r"\.spec\.(js|ts)"],
    "cypress": [r"cypress"],
    
    # Git/CI
    "github_actions": [r"\.github/workflows"],
    "gitlab_ci": [r"\.gitlab-ci\.yml"],
    "git": [r"\.git$"],
}

# Component recommendations based on detected tech
COMPONENT_RECOMMENDATIONS = {
    "react": {
        "agents": ["frontend-developer", "ui-ux-designer"],
        "commands": ["create-feature", "refactor-code"],
        "hooks": ["lint-on-save", "smart-formatting"],
        "mcps": ["context7"],
        "skills": ["frontend-design"],
    },
    "node": {
        "agents": ["backend-architect", "fullstack-developer"],
        "commands": ["generate-tests", "create-architecture-documentation"],
        "settings": ["allow-npm-commands", "development-mode"],
        "hooks": ["run-tests-after-changes"],
    },
    "python": {
        "agents": ["python-pro", "backend-architect"],
        "commands": ["generate-tests", "refactor-code"],
        "hooks": ["format-python-files"],
        "settings": ["development-mode"],
    },
    "postgresql": {
        "agents": ["database-architect"],
        "mcps": ["postgresql-integration"],
        "commands": ["create-architecture-documentation"],
    },
    "docker": {
        "agents": ["devops-engineer"],
        "commands": ["containerize-application"],
        "settings": ["allow-npm-commands"],
    },
    "git": {
        "agents": ["code-reviewer"],
        "commands": ["commit"],
        "hooks": ["smart-commit", "auto-git-add"],
        "settings": ["git-commit-settings", "allow-git-operations"],
    },
    "jest": {
        "agents": ["test-engineer"],
        "commands": ["generate-tests"],
        "hooks": ["run-tests-after-changes"],
    },
    "playwright": {
        "mcps": ["playwright-mcp-server"],
        "skills": ["webapp-testing"],
    },
    "github_actions": {
        "mcps": ["github-integration"],
        "agents": ["devops-engineer"],
    },
}

# Universal recommendations (always included)
UNIVERSAL_COMPONENTS = {
    "agents": ["code-reviewer"],
    "commands": ["ultra-think", "code-review"],
    "settings": ["context-monitor"],
    "hooks": ["simple-notifications"],
    "mcps": ["memory-integration"],
}


def scan_directory(path: Path) -> Tuple[Set[str], Dict[str, int]]:
    """Scan directory for files and detect technologies."""
    detected_tech = set()
    file_counts = {}
    
    for root, dirs, files in os.walk(path):
        # Skip common non-source directories
        dirs[:] = [d for d in dirs if d not in {
            "node_modules", ".git", "__pycache__", "dist", "build",
            ".next", ".vercel", "venv", ".venv", "env"
        }]
        
        for file in files:
            filepath = os.path.join(root, file)
            rel_path = os.path.relpath(filepath, path)
            
            # Count file types
            ext = Path(file).suffix
            file_counts[ext] = file_counts.get(ext, 0) + 1
            
            # Check against tech patterns
            for tech, patterns in TECH_PATTERNS.items():
                for pattern in patterns:
                    if re.search(pattern, rel_path, re.IGNORECASE):
                        detected_tech.add(tech)
                        break
    
    return detected_tech, file_counts


def generate_recommendations(detected_tech: Set[str]) -> Dict[str, List[str]]:
    """Generate component recommendations based on detected technologies."""
    recommendations = {
        "agents": set(UNIVERSAL_COMPONENTS["agents"]),
        "commands": set(UNIVERSAL_COMPONENTS["commands"]),
        "settings": set(UNIVERSAL_COMPONENTS["settings"]),
        "hooks": set(UNIVERSAL_COMPONENTS["hooks"]),
        "mcps": set(UNIVERSAL_COMPONENTS["mcps"]),
        "skills": set(),
    }
    
    for tech in detected_tech:
        if tech in COMPONENT_RECOMMENDATIONS:
            for category, components in COMPONENT_RECOMMENDATIONS[tech].items():
                recommendations[category].update(components)
    
    # Convert sets to sorted lists
    return {k: sorted(v) for k, v in recommendations.items()}


def calculate_effectiveness(detected_tech: Set[str], recommendations: Dict) -> Dict:
    """Calculate effectiveness score for the recommended stack."""
    total_components = sum(len(v) for v in recommendations.values())
    tech_coverage = len(detected_tech)
    
    # Base coverage score
    coverage = min(10, (total_components / 5) * 2)
    
    # Synergy score based on matching technologies
    synergy = min(10, (tech_coverage / 3) * 2 + 4)
    
    # Efficiency (penalize if too many components)
    efficiency = max(0, 10 - max(0, total_components - 15) * 0.5)
    
    total = (coverage * 0.4) + (synergy * 0.35) + (efficiency * 0.25)
    
    return {
        "total": round(total, 1),
        "coverage": round(coverage, 1),
        "synergy": round(synergy, 1),
        "efficiency": round(efficiency, 1),
    }


def generate_install_command(recommendations: Dict) -> str:
    """Generate the installation command for recommended components."""
    components = []
    
    type_prefix = {
        "agents": "agent:dev-team",
        "commands": "command:utilities",
        "settings": "setting:statusline",
        "hooks": "hook:automation",
        "mcps": "mcp:devtools",
        "skills": "skill:development",
    }
    
    for category, items in recommendations.items():
        prefix = type_prefix.get(category, category)
        for item in items[:3]:  # Limit to top 3 per category
            components.append(f"{prefix}/{item}")
    
    return f"npx organized-ai install {' '.join(components)}"


def format_markdown(
    project_path: str,
    detected_tech: Set[str],
    file_counts: Dict[str, int],
    recommendations: Dict,
    effectiveness: Dict
) -> str:
    """Format output as markdown."""
    output = []
    
    output.append(f"# Tech Stack Analysis: {os.path.basename(project_path)}")
    output.append("")
    
    # Detected Technologies
    output.append("## Detected Technologies")
    if detected_tech:
        for tech in sorted(detected_tech):
            output.append(f"- {tech.replace('_', ' ').title()}")
    else:
        output.append("- No specific technologies detected")
    output.append("")
    
    # File Distribution
    output.append("## File Distribution")
    top_extensions = sorted(file_counts.items(), key=lambda x: x[1], reverse=True)[:10]
    for ext, count in top_extensions:
        if ext:
            output.append(f"- {ext}: {count} files")
    output.append("")
    
    # Recommendations
    output.append("## Recommended Tech Stack")
    output.append("")
    
    icons = {
        "agents": "🤖",
        "commands": "⚡",
        "settings": "⚙️",
        "hooks": "🪝",
        "mcps": "🔌",
        "skills": "🎨",
    }
    
    for category, items in recommendations.items():
        if items:
            output.append(f"### {icons.get(category, '')} {category.title()}")
            for item in items:
                output.append(f"- {item}")
            output.append("")
    
    # Effectiveness Score
    output.append("## Effectiveness Score")
    output.append(f"**Total: {effectiveness['total']}/10**")
    output.append(f"- Coverage: {effectiveness['coverage']}/10")
    output.append(f"- Synergy: {effectiveness['synergy']}/10")
    output.append(f"- Efficiency: {effectiveness['efficiency']}/10")
    output.append("")
    
    # Installation Command
    output.append("## Installation")
    output.append("```bash")
    output.append(generate_install_command(recommendations))
    output.append("```")
    
    return "\n".join(output)


def format_json(
    project_path: str,
    detected_tech: Set[str],
    file_counts: Dict[str, int],
    recommendations: Dict,
    effectiveness: Dict
) -> str:
    """Format output as JSON."""
    return json.dumps({
        "project": os.path.basename(project_path),
        "detected_technologies": sorted(detected_tech),
        "file_distribution": dict(sorted(
            file_counts.items(),
            key=lambda x: x[1],
            reverse=True
        )[:10]),
        "recommendations": recommendations,
        "effectiveness": effectiveness,
        "install_command": generate_install_command(recommendations),
    }, indent=2)


def main():
    parser = argparse.ArgumentParser(
        description="Analyze a project and recommend Claude Code components"
    )
    parser.add_argument("path", help="Path to project directory")
    parser.add_argument(
        "--output", "-o",
        choices=["json", "markdown"],
        default="markdown",
        help="Output format (default: markdown)"
    )
    args = parser.parse_args()
    
    project_path = Path(args.path).resolve()
    
    if not project_path.exists():
        print(f"Error: Path does not exist: {project_path}")
        return 1
    
    if not project_path.is_dir():
        print(f"Error: Path is not a directory: {project_path}")
        return 1
    
    # Analyze project
    detected_tech, file_counts = scan_directory(project_path)
    recommendations = generate_recommendations(detected_tech)
    effectiveness = calculate_effectiveness(detected_tech, recommendations)
    
    # Output results
    if args.output == "json":
        print(format_json(
            str(project_path),
            detected_tech,
            file_counts,
            recommendations,
            effectiveness
        ))
    else:
        print(format_markdown(
            str(project_path),
            detected_tech,
            file_counts,
            recommendations,
            effectiveness
        ))
    
    return 0


if __name__ == "__main__":
    exit(main())
