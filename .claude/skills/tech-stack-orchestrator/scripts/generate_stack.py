#!/usr/bin/env python3
"""
Stack Generator for Tech Stack Orchestrator

Generates a complete tech stack configuration file based on
project requirements or component selections.

Usage:
    python generate_stack.py --name "My Stack" --components agent:frontend,command:commit
    python generate_stack.py --from-analysis analysis.json
    python generate_stack.py --interactive
"""

import argparse
import json
import os
from datetime import datetime
from typing import Dict, List, Optional

# Component registry with metadata
COMPONENT_REGISTRY = {
    "agents": {
        "frontend-developer": {
            "downloads": 4400,
            "category": "Development Team",
            "synergies": ["ui-ux-designer", "code-reviewer"],
        },
        "backend-architect": {
            "downloads": 3300,
            "category": "Development Team",
            "synergies": ["database-architect", "devops-engineer"],
        },
        "code-reviewer": {
            "downloads": 3500,
            "category": "Development Tools",
            "synergies": ["test-engineer", "debugger"],
        },
        "ui-ux-designer": {
            "downloads": 3200,
            "category": "Development Team",
            "synergies": ["frontend-developer"],
        },
        "database-architect": {
            "downloads": 1300,
            "category": "Database",
            "synergies": ["backend-architect"],
        },
        "test-engineer": {
            "downloads": 1400,
            "category": "Development Tools",
            "synergies": ["code-reviewer"],
        },
        "devops-engineer": {
            "downloads": 943,
            "category": "Development Team",
            "synergies": ["backend-architect"],
        },
        "python-pro": {
            "downloads": 1700,
            "category": "Programming Languages",
            "synergies": ["debugger"],
        },
        "debugger": {
            "downloads": 1900,
            "category": "Development Tools",
            "synergies": ["code-reviewer", "test-engineer"],
        },
    },
    "commands": {
        "ultra-think": {
            "downloads": 1200,
            "category": "Utilities",
            "synergies": ["code-review"],
        },
        "commit": {
            "downloads": 860,
            "category": "Git Workflow",
            "synergies": ["smart-commit"],
        },
        "generate-tests": {
            "downloads": 653,
            "category": "Testing",
            "synergies": ["run-tests-after-changes"],
        },
        "create-architecture-documentation": {
            "downloads": 1100,
            "category": "Documentation",
            "synergies": [],
        },
        "refactor-code": {
            "downloads": 792,
            "category": "Utilities",
            "synergies": ["code-review"],
        },
        "code-review": {
            "downloads": 784,
            "category": "Utilities",
            "synergies": ["ultra-think"],
        },
        "create-feature": {
            "downloads": 245,
            "category": "Project Management",
            "synergies": [],
        },
        "containerize-application": {
            "downloads": 199,
            "category": "Deployment",
            "synergies": [],
        },
    },
    "settings": {
        "context-monitor": {
            "downloads": 2100,
            "category": "Statusline",
            "synergies": [],
        },
        "development-mode": {
            "downloads": 409,
            "category": "Permissions",
            "synergies": ["allow-npm-commands"],
        },
        "allow-npm-commands": {
            "downloads": 446,
            "category": "Permissions",
            "synergies": ["development-mode"],
        },
        "git-commit-settings": {
            "downloads": 526,
            "category": "Global",
            "synergies": ["smart-commit"],
        },
        "allow-git-operations": {
            "downloads": 363,
            "category": "Permissions",
            "synergies": ["smart-commit", "auto-git-add"],
        },
    },
    "hooks": {
        "simple-notifications": {
            "downloads": 1400,
            "category": "Automation",
            "synergies": [],
        },
        "smart-commit": {
            "downloads": 804,
            "category": "Git Workflow",
            "synergies": ["commit", "git-commit-settings"],
        },
        "lint-on-save": {
            "downloads": 660,
            "category": "Development Tools",
            "synergies": ["smart-formatting"],
        },
        "smart-formatting": {
            "downloads": 601,
            "category": "Development Tools",
            "synergies": ["lint-on-save"],
        },
        "run-tests-after-changes": {
            "downloads": 294,
            "category": "Post Tool",
            "synergies": ["generate-tests"],
        },
        "auto-git-add": {
            "downloads": 356,
            "category": "Git Workflow",
            "synergies": ["smart-commit"],
        },
        "format-python-files": {
            "downloads": 367,
            "category": "Post Tool",
            "synergies": [],
        },
        "security-scanner": {
            "downloads": 254,
            "category": "Security",
            "synergies": [],
        },
    },
    "mcps": {
        "context7": {
            "downloads": 2500,
            "category": "Devtools",
            "synergies": ["memory-integration"],
        },
        "memory-integration": {
            "downloads": 1400,
            "category": "Integration",
            "synergies": [],
        },
        "github-integration": {
            "downloads": 884,
            "category": "Integration",
            "synergies": ["smart-commit"],
        },
        "playwright-mcp-server": {
            "downloads": 1200,
            "category": "Browser Automation",
            "synergies": ["webapp-testing"],
        },
        "postgresql-integration": {
            "downloads": 698,
            "category": "Database",
            "synergies": ["database-architect"],
        },
        "filesystem-access": {
            "downloads": 639,
            "category": "Filesystem",
            "synergies": [],
        },
    },
    "skills": {
        "frontend-design": {
            "downloads": 95,
            "category": "Creative Design",
            "synergies": ["frontend-developer"],
        },
        "webapp-testing": {
            "downloads": 152,
            "category": "Development",
            "synergies": ["playwright-mcp-server", "test-engineer"],
        },
        "mcp-builder": {
            "downloads": 125,
            "category": "Development",
            "synergies": [],
        },
        "skill-creator": {
            "downloads": 277,
            "category": "Development",
            "synergies": [],
        },
    },
}


def parse_component_string(component_str: str) -> Dict[str, List[str]]:
    """Parse component string like 'agent:frontend,command:commit'."""
    components = {
        "agents": [],
        "commands": [],
        "settings": [],
        "hooks": [],
        "mcps": [],
        "skills": [],
    }
    
    type_mapping = {
        "agent": "agents",
        "command": "commands",
        "setting": "settings",
        "hook": "hooks",
        "mcp": "mcps",
        "skill": "skills",
    }
    
    for item in component_str.split(","):
        item = item.strip()
        if ":" in item:
            comp_type, comp_name = item.split(":", 1)
            comp_type = type_mapping.get(comp_type.lower(), comp_type.lower())
            if comp_type in components:
                components[comp_type].append(comp_name)
    
    return components


def get_synergies(components: Dict[str, List[str]]) -> List[str]:
    """Get suggested additional components based on synergies."""
    suggestions = set()
    
    for comp_type, comp_list in components.items():
        for comp_name in comp_list:
            if comp_type in COMPONENT_REGISTRY:
                if comp_name in COMPONENT_REGISTRY[comp_type]:
                    synergies = COMPONENT_REGISTRY[comp_type][comp_name].get("synergies", [])
                    suggestions.update(synergies)
    
    # Remove components already in the stack
    all_components = set()
    for comp_list in components.values():
        all_components.update(comp_list)
    
    return sorted(suggestions - all_components)


def calculate_stack_score(components: Dict[str, List[str]]) -> Dict:
    """Calculate effectiveness score for a stack."""
    total_components = sum(len(v) for v in components.values())
    total_downloads = 0
    category_coverage = set()
    synergy_count = 0
    
    for comp_type, comp_list in components.items():
        for comp_name in comp_list:
            if comp_type in COMPONENT_REGISTRY:
                if comp_name in COMPONENT_REGISTRY[comp_type]:
                    comp_data = COMPONENT_REGISTRY[comp_type][comp_name]
                    total_downloads += comp_data.get("downloads", 0)
                    category_coverage.add(comp_data.get("category", "Unknown"))
                    synergies = comp_data.get("synergies", [])
                    # Check if synergies are in the stack
                    for syn in synergies:
                        for other_list in components.values():
                            if syn in other_list:
                                synergy_count += 1
    
    # Normalize scores
    coverage = min(10, (len(category_coverage) / 5) * 10)
    synergy = min(10, (synergy_count / max(1, total_components)) * 10 + 3)
    popularity = min(10, (total_downloads / 5000) * 10)
    efficiency = max(0, 10 - max(0, total_components - 12) * 0.5)
    
    total = (coverage * 0.3) + (synergy * 0.3) + (popularity * 0.2) + (efficiency * 0.2)
    
    return {
        "total": round(total, 1),
        "coverage": round(coverage, 1),
        "synergy": round(synergy, 1),
        "popularity": round(popularity, 1),
        "efficiency": round(efficiency, 1),
    }


def generate_install_command(components: Dict[str, List[str]]) -> str:
    """Generate installation command."""
    parts = []
    
    type_prefix = {
        "agents": "agent",
        "commands": "command",
        "settings": "setting",
        "hooks": "hook",
        "mcps": "mcp",
        "skills": "skill",
    }
    
    for comp_type, comp_list in components.items():
        prefix = type_prefix.get(comp_type, comp_type)
        for comp_name in comp_list:
            parts.append(f"{prefix}:{comp_name}")
    
    return f"npx organized-ai install {' '.join(parts)}"


def generate_stack_file(
    name: str,
    description: str,
    components: Dict[str, List[str]],
    output_path: Optional[str] = None
) -> Dict:
    """Generate a complete stack configuration."""
    score = calculate_stack_score(components)
    synergy_suggestions = get_synergies(components)
    
    stack = {
        "name": name,
        "description": description,
        "version": "1.0.0",
        "created": datetime.now().isoformat(),
        "components": components,
        "effectiveness": score,
        "suggested_additions": synergy_suggestions[:5],
        "install_command": generate_install_command(components),
        "metadata": {
            "total_components": sum(len(v) for v in components.values()),
            "categories_covered": list(set(
                COMPONENT_REGISTRY.get(ct, {}).get(cn, {}).get("category", "Unknown")
                for ct, cl in components.items()
                for cn in cl
            )),
        },
    }
    
    if output_path:
        with open(output_path, "w") as f:
            json.dump(stack, f, indent=2)
        print(f"Stack saved to: {output_path}")
    
    return stack


def interactive_mode():
    """Interactive stack builder."""
    print("\n🔧 Tech Stack Builder - Interactive Mode\n")
    
    name = input("Stack name: ").strip() or "My Stack"
    description = input("Description: ").strip() or "Custom tech stack"
    
    components = {
        "agents": [],
        "commands": [],
        "settings": [],
        "hooks": [],
        "mcps": [],
        "skills": [],
    }
    
    print("\nAvailable component types: agents, commands, settings, hooks, mcps, skills")
    print("Enter components as 'type:name' (e.g., 'agent:frontend-developer')")
    print("Type 'list <type>' to see available components")
    print("Type 'done' when finished\n")
    
    while True:
        user_input = input("> ").strip().lower()
        
        if user_input == "done":
            break
        
        if user_input.startswith("list "):
            comp_type = user_input[5:].strip()
            if comp_type in COMPONENT_REGISTRY:
                print(f"\nAvailable {comp_type}:")
                for name, data in COMPONENT_REGISTRY[comp_type].items():
                    print(f"  - {name} ({data['downloads']} downloads)")
                print()
            else:
                print(f"Unknown type: {comp_type}")
            continue
        
        if ":" in user_input:
            parsed = parse_component_string(user_input)
            for comp_type, comp_list in parsed.items():
                components[comp_type].extend(comp_list)
            print(f"Added: {user_input}")
    
    # Generate stack
    stack = generate_stack_file(name, description, components)
    
    print("\n" + "=" * 50)
    print(json.dumps(stack, indent=2))
    
    save = input("\nSave to file? (y/n): ").strip().lower()
    if save == "y":
        filename = input("Filename (default: stack.json): ").strip() or "stack.json"
        with open(filename, "w") as f:
            json.dump(stack, f, indent=2)
        print(f"Saved to {filename}")
    
    return stack


def main():
    parser = argparse.ArgumentParser(
        description="Generate tech stack configurations"
    )
    parser.add_argument("--name", "-n", default="My Stack", help="Stack name")
    parser.add_argument("--description", "-d", default="", help="Stack description")
    parser.add_argument("--components", "-c", help="Components (agent:name,command:name)")
    parser.add_argument("--from-analysis", "-f", help="Load from analysis JSON file")
    parser.add_argument("--output", "-o", help="Output file path")
    parser.add_argument("--interactive", "-i", action="store_true", help="Interactive mode")
    
    args = parser.parse_args()
    
    if args.interactive:
        interactive_mode()
        return 0
    
    if args.from_analysis:
        with open(args.from_analysis) as f:
            analysis = json.load(f)
        components = analysis.get("recommendations", {})
        name = args.name or f"Stack for {analysis.get('project', 'Unknown')}"
        description = args.description or "Generated from project analysis"
    elif args.components:
        components = parse_component_string(args.components)
        name = args.name
        description = args.description or "Custom stack"
    else:
        print("Error: Provide --components, --from-analysis, or --interactive")
        return 1
    
    stack = generate_stack_file(name, description, components, args.output)
    
    if not args.output:
        print(json.dumps(stack, indent=2))
    
    return 0


if __name__ == "__main__":
    exit(main())
