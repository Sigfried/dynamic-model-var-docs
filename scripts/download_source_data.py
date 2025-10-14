"""
Downloads repo_sources files from https://raw.githubusercontent.com/{repo}/{commit}/{file_path}
Downloads gsheet_sources from {google_sheet}

Saves to {local_source_dir}/{dependency_name}/{file_name}
Handles errors if files don't exist
Prints what it's fetching
"""

local_source_dir = "source_data"
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