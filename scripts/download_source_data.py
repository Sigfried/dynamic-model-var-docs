#!/usr/bin/env python3
"""
Downloads repo_sources files from https://raw.githubusercontent.com/{repo}/{commit}/{file_path}
Downloads gsheet_sources from {google_sheet}

Saves to {local_source_dir}/{dependency_name}/{file_name}
Handles errors if files don't exist
Prints what it's fetching
"""

import sys
from pathlib import Path
from urllib import request
from urllib.error import URLError, HTTPError


local_source_dir = "public/source_data"
repo_sources = {
    "HM": {         # dependency_name
        "repo": "RTIInternational/NHLBI-BDC-DMC-HM",
        "commit": "0e7a22c",
        "file_paths": [
          "src/bdchm/schema/bdchm.yaml",
          "generated/bdchm.schema.json"
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


def main():
    """Download all configured source files."""
    project_root = Path(__file__).parent.parent
    source_dir = project_root / local_source_dir

    success_count = 0
    fail_count = 0

    # Download repo sources
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
                else:
                    fail_count += 1

        elif "googlesheet" in config:
            # Convert Google Sheets URL to TSV export URL
            sheet_url = config["googlesheet"]
            file_name = config["file_name"]

            # Extract sheet ID from URL
            # Format: https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit?gid={GID}#gid={GID}
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

    # Summary
    print("\n" + "="*60)
    print(f"Downloaded: {success_count} file(s)")
    if fail_count > 0:
        print(f"Failed: {fail_count} file(s)")
        print("="*60)
        return 1

    print("="*60)
    return 0


if __name__ == "__main__":
    sys.exit(main())
