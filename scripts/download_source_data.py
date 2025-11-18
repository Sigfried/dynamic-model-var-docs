#!/usr/bin/env python3
"""
Downloads repo_sources files from https://raw.githubusercontent.com/{repo}/{commit}/{file_path}
Downloads gsheet_sources from {google_sheet}

Saves to {local_source_dir}/{dependency_name}/{file_name}
Handles errors if files don't exist
Prints what it's fetching

After downloading bdchm.yaml, generates bdchm.expanded.json using gen-linkml.
This includes all types from linkml:types and expands inherited slots.

Usage:
  python download_source_data.py              # Download all files and generate expanded schema
  python download_source_data.py --metadata-only   # Skip downloads, just regenerate expanded schema from existing bdchm.yaml
"""

import sys
import json
import argparse
from pathlib import Path
from urllib import request
from urllib.error import URLError, HTTPError

try:
    import yaml
except ImportError:
    print("Error: PyYAML is required. Install with: pip install pyyaml", file=sys.stderr)
    sys.exit(1)


local_source_dir = "public/source_data"
repo_sources = {
    "HM": {         # dependency_name
        "repo": "RTIInternational/NHLBI-BDC-DMC-HM",
        "commit": "ac8cc23",
        "file_paths": [
          "src/bdchm/schema/bdchm.yaml"
        ],
    },
    "HV": {         # dependency_name
        "googlesheet": "https://docs.google.com/spreadsheets/d/1PDaX266_H0haa0aabMYQ6UNtEKT5-ClMarP0FvNntN8/edit?gid=0#gid=0",
        "file_name": "variable-specs-S1.tsv"
    }
}


def download_file(url: str, output_path: Path, normalize_line_endings: bool = False) -> bool:
    """
    Download a file from URL to output_path.

    Args:
        url: URL to download from
        output_path: Local path to save the file
        normalize_line_endings: If True, convert to Unix line endings (LF)

    Returns:
        True if successful, False otherwise
    """
    try:
        print(f"Fetching {url}...")
        with request.urlopen(url) as response:
            content = response.read()

        # Normalize line endings if requested (for text files like TSV)
        if normalize_line_endings:
            content = content.replace(b'\r\n', b'\n').replace(b'\r', b'\n')

        # Ensure parent directory exists
        output_path.parent.mkdir(parents=True, exist_ok=True)

        # Write file
        output_path.write_bytes(content)
        print(f"  ✓ Saved to {output_path} ({len(content):,} bytes)")
        return True

    except HTTPError as e:
        print(f"  ✗ HTTP error {e.code}: {e.reason}", file=sys.stderr)
        return False
    except URLError as e:
        print(f"  ✗ URL error: {e.reason}", file=sys.stderr)
        return False
    except Exception as e:
        print(f"  ✗ Error: {e}", file=sys.stderr)
        return False


def generate_expanded_schema(yaml_path: Path, output_path: Path) -> bool:
    """
    Generate expanded schema using gen-linkml.
    Resolves imports (like linkml:types) and expands inherited slots.
    Outputs JSON format (gen-linkml default) which includes inherited_from metadata.

    Args:
        yaml_path: Path to bdchm.yaml
        output_path: Path to save bdchm.expanded.json

    Returns:
        True if successful, False otherwise
    """
    import subprocess
    try:
        print(f"Generating expanded schema from {yaml_path.name}...")

        # Run gen-linkml to expand imports (merges imports like linkml:types)
        # Default output format is JSON, which includes inherited_from in attributes
        result = subprocess.run(
            [
                'gen-linkml',
                str(yaml_path),
                '--output', str(output_path)
            ],
            capture_output=True,
            text=True
        )

        if result.returncode != 0:
            print(f"  ✗ gen-linkml error: {result.stderr}", file=sys.stderr)
            return False

        if not output_path.exists():
            print(f"  ✗ gen-linkml did not create output file", file=sys.stderr)
            return False

        file_size = output_path.stat().st_size
        print(f"  ✓ Generated expanded schema ({file_size:,} bytes)")
        print(f"  ✓ Saved to {output_path}")
        return True

    except FileNotFoundError:
        print(f"  ✗ gen-linkml not found. Install with: pip install linkml", file=sys.stderr)
        return False
    except Exception as e:
        print(f"  ✗ Error generating expanded schema: {e}", file=sys.stderr)
        return False


def main():
    """Download all configured source files."""
    parser = argparse.ArgumentParser(
        description="Download source data and generate expanded schema",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python download_source_data.py              # Download all files and generate expanded schema
  python download_source_data.py --metadata-only   # Skip downloads, regenerate expanded schema only
        """
    )
    parser.add_argument(
        '--metadata-only',
        action='store_true',
        help='Skip downloads and only regenerate bdchm.expanded.json from existing bdchm.yaml'
    )
    args = parser.parse_args()

    project_root = Path(__file__).parent.parent
    source_dir = project_root / local_source_dir

    success_count = 0
    fail_count = 0
    yaml_path = None

    # Download repo sources (skip if --metadata-only)
    if args.metadata_only:
        print("Skipping downloads (--metadata-only mode)")
        # Find existing YAML file
        yaml_path = source_dir / "HM" / "bdchm.yaml"
        if not yaml_path.exists():
            print(f"  ✗ Error: {yaml_path} not found. Run without --metadata-only first.", file=sys.stderr)
            return 1
    else:
        for dep_name, config in repo_sources.items():
            if "repo" in config:
                repo = config["repo"]
                commit = config["commit"]
                file_paths = config["file_paths"]

                for file_path in file_paths:
                    url = f"https://raw.githubusercontent.com/{repo}/{commit}/{file_path}"
                    file_name = Path(file_path).name
                    output_path = source_dir / dep_name / file_name

                    if download_file(url, output_path):
                        success_count += 1
                        # Track YAML file for metadata generation
                        if file_name == "bdchm.yaml":
                            yaml_path = output_path
                    else:
                        fail_count += 1

            elif "googlesheet" in config:
                # Convert Google Sheets URL to TSV export URL
                sheet_url = config["googlesheet"]
                file_name = config["file_name"]

                # Extract sheet ID from URL
                # Format: https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit?gid={GID}#gid={GID}
                #   "https://docs.google.com/spreadsheets/d/1PDaX266_H0haa0aabMYQ6UNtEKT5-ClMarP0FvNntN8/edit?gid=0#gid=0",
                if "/d/" in sheet_url and "/edit" in sheet_url:
                    sheet_id = sheet_url.split("/d/")[1].split("/")[0]
                    gid = "0"  # default to first sheet
                    if "gid=" in sheet_url:
                        gid = sheet_url.split("gid=")[1].split("#")[0].split("&")[0]

                    # Construct export URL for TSV format
                    export_url = f"https://docs.google.com/spreadsheets/d/{sheet_id}/export?format=tsv&gid={gid}"
                    output_path = source_dir / dep_name / file_name

                    # TSV files should use Unix line endings
                    if download_file(export_url, output_path, normalize_line_endings=True):
                        success_count += 1
                    else:
                        fail_count += 1
                else:
                    print(f"  ✗ Invalid Google Sheets URL format: {sheet_url}", file=sys.stderr)
                    fail_count += 1

    # Generate expanded schema from YAML if available
    if yaml_path and yaml_path.exists():
        # Generate expanded schema with imports resolved (includes linkml:types)
        # Using JSON format (gen-linkml default)
        expanded_path = yaml_path.parent / "bdchm.expanded.json"
        if generate_expanded_schema(yaml_path, expanded_path):
            success_count += 1
        else:
            fail_count += 1

    # Summary
    print("\n" + "="*60)
    print(f"Downloaded/Generated: {success_count} file(s)")
    if fail_count > 0:
        print(f"Failed: {fail_count} file(s)")
        print("="*60)
        return 1

    print("="*60)
    return 0


if __name__ == "__main__":
    sys.exit(main())
