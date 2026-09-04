# Schema sync workflow.
#
# The daily GitHub Action (.github/workflows/schema-sync.yml) bumps the pinned
# upstream commit and opens a PR on branch schema-sync/upstream-update. main is
# untouched, so a clean `git pull` on main is expected, not a failed sync.
#
# Start with `make sync-review`. It prints what to look at and why.

SYNC_BRANCH := schema-sync/upstream-update
PY          := python3

.DEFAULT_GOAL := help

.PHONY: help
help:  ## Show this help
	@echo "Schema sync:"
	@grep -E '^[a-zA-Z0-9_-]+:.*?## ' $(MAKEFILE_LIST) \
	  | awk 'BEGIN{FS=":.*?## "}{printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "Typical run:  make sync-review   (then act on what it flags)"

# --------------------------------------------------------------------------
# review
# --------------------------------------------------------------------------

.PHONY: sync-status
sync-status:  ## Is there an open sync PR? What does it change?
	@gh pr list --state open --label schema-sync 2>/dev/null; \
	 if [ $$? -ne 0 ]; then \
	   echo "(gh unavailable -- check github.com/Sigfried/dynamic-model-var-docs/pulls)"; \
	 fi
	@git fetch -q origin $(SYNC_BRANCH) 2>/dev/null || true
	@echo ""
	@if git rev-parse --verify -q origin/$(SYNC_BRANCH) >/dev/null; then \
	  echo "Files changed vs. main:"; \
	  git --no-pager diff --stat main...origin/$(SYNC_BRANCH); \
	  echo ""; \
	  echo "Pinned upstream commit:"; \
	  git --no-pager diff main...origin/$(SYNC_BRANCH) -- scripts/download_source_data.py \
	    | grep -E '^[-+] *"commit"' || echo "  (unchanged)"; \
	else \
	  echo "No $(SYNC_BRANCH) branch on origin -- nothing to review."; \
	fi

.PHONY: sync-audit
sync-audit:  ## Audit the open sync PR for silent breakage
	@git fetch -q origin $(SYNC_BRANCH) 2>/dev/null || true
	@$(PY) scripts/audit_schema_sync.py --base main --head origin/$(SYNC_BRANCH)

.PHONY: sync-audit-local
sync-audit-local:  ## Audit the working tree (use after checking the branch out)
	@$(PY) scripts/audit_schema_sync.py --base origin/main

.PHONY: test-sync
test-sync:  ## Run only the schema-sensitive tests
	npx vitest run src/test/entityCategories.test.ts src/test/containmentGraph.test.ts \
	  src/test/data-integrity.test.ts src/test/ownershipExpansion.test.ts \
	  src/test/ownershipSubgraph.test.ts src/test/schemaFields.test.ts

.PHONY: sync-review
sync-review:  ## FULL REVIEW: status + audit + tests + build (start here)
	@$(MAKE) --no-print-directory sync-status
	@echo ""
	@echo "=============================================================="
	@echo " AUDIT -- changes the diff won't show you"
	@echo "=============================================================="
	@$(MAKE) --no-print-directory sync-audit; audit=$$?; \
	 echo "=============================================================="; \
	 echo " TESTS"; \
	 echo "=============================================================="; \
	 $(MAKE) --no-print-directory test-sync || exit 1; \
	 echo ""; \
	 echo "=============================================================="; \
	 echo " BUILD  (tsc --noEmit is too weak here -- it has let breakage through)"; \
	 echo "=============================================================="; \
	 npm run build || exit 1; \
	 echo ""; \
	 echo "=============================================================="; \
	 echo " WHAT TO DO NEXT"; \
	 echo "=============================================================="; \
	 if [ $$audit -ne 0 ]; then \
	   echo "The audit flagged items (the [!] sections above). For each one:"; \
	   echo ""; \
	   echo "  New class            -> add it to a category in"; \
	   echo "                          src/config/entityCategories.ts"; \
	   echo "  Stale override       -> the slot was renamed or removed; update"; \
	   echo "                          the set in src/models/containmentGraph.ts"; \
	   echo "  Ownership flip       -> decide whether the new direction is right."; \
	   echo "                          This one is a judgment call, not a lookup:"; \
	   echo "                          see docs/OWNERSHIP_CLASSIFICATION.md"; \
	   echo "  Lost inbound edge    -> the class now draws as a root with nothing"; \
	   echo "                          pointing at it. Usually a range widened to"; \
	   echo "                          Entity. Decide if that is acceptable."; \
	   echo ""; \
	   echo "Then: make sync-checkout, fix on the branch, re-run make sync-review."; \
	 else \
	   echo "Nothing flagged. Tests and build pass."; \
	   echo ""; \
	   echo "To merge:  gh pr merge $(SYNC_BRANCH) --squash"; \
	   echo "       or: git checkout main && git merge $(SYNC_BRANCH)"; \
	   echo ""; \
	   echo "Note this only merges the schema data. Nothing is pushed or"; \
	   echo "deployed -- run npm run deploy separately when you want it live."; \
	 fi

# --------------------------------------------------------------------------
# acting on it
# --------------------------------------------------------------------------

.PHONY: sync-checkout
sync-checkout:  ## Check out the sync branch to make fixes on it
	git fetch origin $(SYNC_BRANCH)
	git checkout $(SYNC_BRANCH)

.PHONY: sync-manual
sync-manual:  ## Run the sync yourself (Action does this daily)
	npm run download-data

.PHONY: sync-check
sync-check:  ## Is upstream ahead? (no changes written)
	cd scripts && (test -d .venv || npm run --prefix .. setup-python) \
	  && .venv/bin/python download_source_data.py --check
