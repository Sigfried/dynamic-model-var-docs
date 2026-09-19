# Tests, and the schema sync workflow.
#
# Tests: `make test` runs everything once; `make test-help-content` runs only
# the tests that check src/explore/help-content.md against the authoring
# format in src/help/FORMAT.md (unknown fields, duplicate ids, anchors that
# resolve to nothing, unresolved {{placeholders}}, tour metadata, ...).
#
# Schema sync: the daily GitHub Action (.github/workflows/schema-sync.yml)
# bumps the pinned upstream commit and opens a PR on branch
# schema-sync/upstream-update. main is untouched, so a clean `git pull` on main
# is expected, not a failed sync. Start with `make sync-review`. It prints what
# to look at and why.

SYNC_BRANCH := schema-sync/upstream-update
PY          := python3

.DEFAULT_GOAL := help

.PHONY: help
help:  ## Show this help
	@echo "Targets:"
	@grep -E '^[a-zA-Z0-9_-]+:.*?## ' $(MAKEFILE_LIST) \
	  | awk 'BEGIN{FS=":.*?## "}{printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "Typical sync run:  make sync-review   (then act on what it flags)"

# --------------------------------------------------------------------------
# tests
# --------------------------------------------------------------------------

.PHONY: test
test:  ## Run the whole test suite once (no watch)
	npx vitest run

.PHONY: test-help-content
test-help-content:  ## Check help-content.md against FORMAT.md (fields, ids, anchors, placeholders)
	npx vitest run src/test/helpContent.test.ts src/test/helpAnchors.test.tsx \
	  src/test/helpTextResolvers.test.ts

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
	cd scripts && (test -d .venv || npm run --prefix .. setup-python) \
	  && .venv/bin/python download_source_data.py --update

.PHONY: sync-check
sync-check:  ## Is upstream ahead? (no changes written)
	cd scripts && (test -d .venv || npm run --prefix .. setup-python) \
	  && .venv/bin/python download_source_data.py --check

# --------------------------------------------------------------------------
# browser probes
# --------------------------------------------------------------------------
#
# ⚠️ CLAUDE CANNOT LAUNCH A BROWSER. Bash commands run under a macOS Seatbelt
# sandbox that denies Chromium's Mach port registration, so `chromium.launch()`
# dies at startup with
#
#     FATAL: bootstrap_check_in org.chromium.Chromium.MachPortRendezvousServer
#            ...: Permission denied (1100)
#
# `--no-sandbox` does not help: the denial is macOS refusing Chromium's IPC,
# not Chromium's own sandbox. So a probe cannot spawn its own browser.
#
# `make probe-browser` is the way around it, and it has to be run BY SIGGIE in
# a normal terminal: it starts a long-lived Chrome with a debugging port, which
# a probe then CONNECTS to (`chromium.connectOverCDP`) rather than launching.
# Connecting is an ordinary localhost connection, which the sandbox allows.
#
# Why this matters beyond any one bug: jsdom implements no CSS anchor
# positioning at all, so no vitest can measure where a popover actually lands.
# Reasoning from screenshots instead produced three wrong fixes on 2026-09-18.
# Measure first.
#
# Leave it running in its own terminal for the session; Ctrl-C when done.
#
# ⚠️ MEASURING IS NOT ENOUGH; MEASURE THE SYMPTOM, NOT THE CHANGE. Both reverted
# sessions had a browser and still shipped wrong fixes, because they measured a
# number, attached a causal story to it, and implemented the story. The 19.6px
# flip arithmetic of 2026-09-18 was measured correctly and explained nothing.
#
# So, in this order:
#
#   1. WRITE THE CHECK THAT DISCRIMINATES, before writing any fix: the thing
#      that is false now and must be true after. For placement that is
#      `popover.top >= anchor.bottom`, not "my attribute reached the DOM".
#      "Did my change land" and "did the symptom go away" are different
#      questions and only the second one matters.
#   2. REPRODUCE IT STANDALONE FIRST. A ~20-line HTML file -- one anchored box,
#      one popover, no app -- found the real cause in one pass after six probes
#      against the running app had not. No canvas animation, no tour state, no
#      top-layer interference, and it runs in a second.
#   3. ONLY THEN probe the live app, to confirm it holds in the real thing.
#
# ⚠️ A PROBE THAT MUTATES THE LIVE POPOVER MAY BE MEASURING NOTHING. It is in
# the top layer: inline styles written onto it from a probe did not change its
# used insets (`inset-block-start` stayed `0px` through every trial, including
# an explicit `top: anchor(bottom)`). Assert the mutation took effect before
# trusting any comparison built on it.
#
# ⚠️ THE CANVAS IS STILL ANIMATING when a popover first opens -- the same probe
# read the anchor's bottom at 599 and then 649 on consecutive runs. Wait for a
# settle (~1.4s plus two rAFs) or fine-grained numbers are noise.
#
# ⚠️ IDENTIFY A BEAT BY READING THE PAGE, NOT BY COUNTING CLICKS. `?step=N`
# opens a step on its DESCRIPTION, which is not a beat -- click once and you
# are on beat 1. Counting the description as beat 1 put every number one too
# high for a whole session on 2026-09-18. The popover renders its own address
# in `.help-popover-address`: "rows-and-dots" for the description, then
# "rows-and-dots \u25b81", "\u25b82", ... for the beats. `.help-tour-count`
# ("3 / 8") is the STEP counter and is the same on every beat of a step.

CHROME_PROFILE ?= $(TMPDIR)cdp-profile
CDP_PORT       ?= 9222

.PHONY: probe-browser
probe-browser:  ## Start Chrome with a debug port (Siggie starts it; Claude connects to it)
	@BIN=$$(node -e "console.log(require('playwright').chromium.executablePath())"); \
	 echo "Chrome:  $$BIN"; \
	 echo "Port:    $(CDP_PORT)"; \
	 echo "Profile: $(CHROME_PROFILE)"; \
	 echo ""; \
	 echo "Leave this running. Ctrl-C to stop."; \
	 echo ""; \
	 "$$BIN" --remote-debugging-port=$(CDP_PORT) \
	         --user-data-dir="$(CHROME_PROFILE)" \
	         --no-first-run --no-default-browser-check

.PHONY: probe-check
probe-check:  ## Is the debug browser up and reachable?
	@curl -sf http://127.0.0.1:$(CDP_PORT)/json/version \
	  && echo "" && echo "OK: debug browser reachable on $(CDP_PORT)" \
	  || (echo "NOT reachable on $(CDP_PORT). Run: make probe-browser"; exit 1)

# --------------------------------------------------------------------------
# placement tests (Playwright)
# --------------------------------------------------------------------------
#
# jsdom implements NO CSS anchor positioning, so no vitest here can observe
# where a popover lands. These measure real rects.
#
# `make e2e` is the trustworthy one: its own production build, nothing to
# start. `make e2e-probe` runs the same specs over CDP against the dev server,
# and is the one Claude can run -- but only while `make probe-browser` is up.
# See docs/TESTING.md.

.PHONY: e2e
e2e:  ## Run the placement tests against a fresh production build (Siggie, CI)
	npx playwright test

.PHONY: e2e-ui
e2e-ui:  ## Same, in Playwright's UI mode -- step through and watch it place
	npx playwright test --ui

.PHONY: e2e-report
e2e-report:  ## Open the report from the last `make e2e` run
	npx playwright show-report

.PHONY: e2e-install
e2e-install:  ## One-time: fetch the browser Playwright drives
	npx playwright install chromium

# ⚠️ To check whether 4173 is up, curl `[::1]`, not `127.0.0.1`. Vite binds
# `localhost`, which resolves to IPv6 here, so 127.0.0.1 reports "connection
# refused" for a server that is running fine.
.PHONY: e2e-probe
e2e-probe:  ## Placement tests in the probe browser (needs `make probe-browser`)
	@$(MAKE) --no-print-directory probe-check >/dev/null \
	  || (echo "Start it first, in your own terminal: make probe-browser"; exit 1)
	USE_PROBE_BROWSER=1 npx playwright test -c playwright.probe.config.ts
