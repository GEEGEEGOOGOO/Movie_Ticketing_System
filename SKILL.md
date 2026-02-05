# Ralph Wiggum Autonomous Loop Skill

**Version**: 1.0.0  
**Type**: Autonomous Iteration Loop  
**Compatibility**: Google Antigravity IDE

---

## Purpose

This skill implements a Ralph Wiggum-style autonomous development loop within Antigravity's agent-first architecture. Unlike the original bash loop approach, this leverages Antigravity's native capabilities: Skills, Workflows, Artifacts, and Knowledge Base.

## Philosophy

> "Deterministically bad in an undeterministic world."  
> — Geoffrey Huntley

This skill embraces:
- **Checkpoint-based iteration** instead of full context resets
- **Artifact-driven verification** instead of bash exit codes
- **Asynchronous execution** with Manager View orchestration
- **Knowledge accumulation** rather than memory destruction

## How It Works

### Core Loop Mechanism

```
1. Agent receives task + completion criteria
2. Agent creates initial plan (Artifact)
3. Agent executes work
4. Agent generates checkpoint Artifact
5. Agent self-evaluates against criteria
6. If incomplete → checkpoint saved to Knowledge Base → LOOP to step 3
7. If complete → Final Artifact + Summary
```

### Key Differences from Original Ralph

| Original Ralph | Antigravity Ralph |
|---------------|-------------------|
| Kill process each iteration | Preserve agent, checkpoint state |
| State in git/files only | State in Artifacts + Knowledge Base |
| Synchronous blocking loop | Asynchronous Manager View |
| Exit code 2 for continuation | Artifact completion detection |
| Bash wrapper | Native Antigravity Skill |

---

## Usage

### Basic Invocation

```
/ralph-loop "Build a REST API for todos. DONE when: all CRUD endpoints work, tests pass >80% coverage, README exists" --max-checkpoints 20
```

### Advanced with Custom Verification

```
/ralph-loop "Migrate all Jest tests to Vitest" --verify-script "npm test" --success-pattern "All tests passed" --max-checkpoints 50
```

---

## Configuration

### Environment Variables

```bash
# Maximum iterations before forced stop
RALPH_MAX_CHECKPOINTS=30

# Checkpoint interval (iterations between Knowledge Base saves)
RALPH_CHECKPOINT_INTERVAL=5

# Enable/disable browser agent for verification
RALPH_BROWSER_VERIFY=true

# Terminal command safety mode
RALPH_TERMINAL_POLICY=agent-assisted  # off | agent-assisted | auto
```

### Skill Parameters

When invoking this skill, the agent will extract:

1. **Task description** - What to build/fix/migrate
2. **Completion criteria** - DONE when X, Y, Z are true
3. **Max checkpoints** - Safety limit (default: 30)
4. **Verification method** - Script, pattern, or manual
5. **Failure strategy** - Continue, backtrack, or escalate

---

## Instructions for Antigravity Agent

### Phase 1: Planning & Setup

1. **Parse the user's request** and extract:
   - Primary objective
   - Completion criteria (DONE when...)
   - Verification method
   - Checkpoint limits

2. **Create Ralph Plan Artifact** (`ralph-plan-{timestamp}.md`):
   ```markdown
   # Ralph Loop Plan
   
   ## Objective
   [Primary goal]
   
   ## Completion Criteria
   - [ ] Criterion 1
   - [ ] Criterion 2
   - [ ] Criterion 3
   
   ## Verification Method
   [How success is measured]
   
   ## Checkpoint Strategy
   - Save state every N iterations
   - Backtrack on critical failures
   - Escalate after 3 consecutive fails
   
   ## Current Checkpoint: 0/30
   ```

3. **Initialize Knowledge Base entry**:
   - Save plan to Knowledge Base
   - Create `ralph-state-{session-id}.json` tracking file

### Phase 2: Execution Loop

**CRITICAL**: This is the autonomous iteration loop.

```
DO {
  
  // Execute work iteration
  1. Load current state from Knowledge Base
  2. Review previous checkpoint Artifact (if exists)
  3. Perform next logical work step
  4. Run verification (if specified)
  5. Generate checkpoint Artifact with:
     - What was attempted
     - What succeeded/failed
     - Test results
     - Current completion status
  
  // Self-evaluation
  6. Evaluate completion criteria:
     - Check each criterion in plan
     - Run verification script (if any)
     - Inspect Artifacts for evidence
  
  // Checkpoint decision
  7. If iteration % CHECKPOINT_INTERVAL == 0:
     - Save full state to Knowledge Base
     - Create detailed checkpoint Artifact
     - Include: code diff, test results, screenshots
  
  // Continuation logic
  8. If ALL criteria met:
     - BREAK loop
     - Generate Final Summary Artifact
  
  9. Else if checkpoint_count >= max_checkpoints:
     - BREAK loop
     - Generate Incomplete Summary Artifact
  
  10. Else if 3 consecutive failures:
     - Save failure state to Knowledge Base
     - Generate Debug Artifact
     - Ask user for guidance (PAUSE)
  
  11. Else:
     - Increment checkpoint counter
     - CONTINUE loop (go to step 1)
  
} WHILE (not complete AND checkpoints < max)
```

### Phase 3: Verification Methods

The agent should support multiple verification strategies:

#### 1. **Script-based** (Most reliable)
```bash
# User specifies verification script
--verify-script "npm test && npm run lint"
--success-pattern "All checks passed"
```

Agent runs script, parses output, checks for pattern.

#### 2. **Artifact-based** (Antigravity native)
```markdown
# Agent checks generated Artifacts
- Task completion checklist → all boxes checked
- Test results Artifact → all green
- Screenshot Artifact → expected UI visible
```

#### 3. **Browser-based** (For UI work)
```markdown
# Agent uses browser subagent to verify
1. Launch app in Antigravity browser
2. Navigate to feature
3. Take screenshot
4. Verify expected elements present
```

#### 4. **Manual checkpoint** (User-driven)
```markdown
# Agent asks for user confirmation
"Checkpoint 15/30: Feature X implemented. Ready to proceed? (yes/no/debug)"
```

### Phase 4: Failure Recovery

When work fails or gets stuck:

1. **Backtrack**: Load previous successful checkpoint from Knowledge Base
2. **Analyze**: Create Debug Artifact with:
   - Error logs
   - Stack traces
   - Environment state
   - Previous 3 checkpoints
3. **Strategy shift**: Try alternative approach based on failure mode
4. **Escalate**: If 3 consecutive fails, pause and request human input

### Phase 5: Completion

When ALL criteria are met:

1. **Generate Final Summary Artifact**:
   ```markdown
   # Ralph Loop Complete
   
   ## Final Status
   ✅ All completion criteria met
   
   ## Iterations Used: 23/30
   
   ## What Was Built
   - [List of files created/modified]
   
   ## Verification Results
   - [Test output, screenshots, etc.]
   
   ## Key Learnings (saved to Knowledge Base)
   - [Patterns that worked]
   - [Pitfalls encountered]
   
   ## Next Steps
   - [Suggested improvements]
   ```

2. **Save learnings to Knowledge Base**:
   - Successful patterns
   - Common errors
   - Architecture decisions

3. **Commit work** (if user approves):
   - Run `/git-commit` workflow with conventional message
   - Push to branch

---

## Safety & Guardrails

### Terminal Command Policy

Set Antigravity's terminal policy to **agent-assisted** for Ralph loops:

```
Settings → Advanced Settings → Terminal Command Auto Execution: Agent Assisted
```

This allows the agent to run most commands automatically but requires approval for destructive operations.

### Browser URL Allowlist

For browser-based verification, restrict to safe domains:

```
Settings → Advanced Settings → Browser URL Allowlist
Add: localhost, 127.0.0.1, *.ngrok.io
```

### Checkpoint Limits

ALWAYS enforce max checkpoints to prevent runaway loops:

- **Small tasks**: 10-15 checkpoints
- **Medium tasks**: 20-30 checkpoints
- **Large refactors**: 50 checkpoints (exception)

### Cost Awareness

Each checkpoint consumes tokens. Estimate costs:

- **Small codebase** (<100 files): ~$0.50-2/checkpoint
- **Medium codebase** (100-500 files): ~$2-5/checkpoint
- **Large codebase** (500+ files): ~$5-15/checkpoint

Budget accordingly and set conservative limits.

---

## Best Practices

### 1. **Write Declarative Completion Criteria**

✅ Good:
```
DONE when:
- All files in src/ have JSDoc comments
- npm run lint passes with 0 errors
- test coverage >80% (run: npm test -- --coverage)
```

❌ Bad:
```
DONE when: code is good and tests work
```

### 2. **Use Incremental Milestones**

```
Phase 1 DONE when: Database schema created, migrations run
Phase 2 DONE when: CRUD API endpoints implemented
Phase 3 DONE when: Integration tests pass
Phase 4 DONE when: API documentation generated
```

### 3. **Provide Verification Evidence**

Always specify HOW to verify completion:

- Run script: `npm test`
- Check file: `coverage/lcov-report/index.html shows >80%`
- Browser test: `Navigate to /todos, add item, verify it appears`

### 4. **Checkpoint Recovery Strategy**

```
If stuck after 5 iterations:
1. Review last 3 checkpoint Artifacts
2. Try different approach (e.g., bottom-up instead of top-down)
3. If still stuck, create Debug Artifact and ask user
```

---

## Examples

### Example 1: Test Migration

```
/ralph-loop "Migrate all Jest tests in src/ to Vitest. DONE when: npm test runs vitest and all tests pass. Create migration report." --max-checkpoints 25
```

**What happens**:
1. Agent scans src/ for `.test.js` files
2. Creates migration plan Artifact
3. Iterates through files, converting Jest → Vitest syntax
4. Runs `npm test` after each batch
5. Fixes failures based on error output
6. Generates migration report when complete

### Example 2: Greenfield Feature

```
/ralph-loop "Build user authentication system. DONE when: signup/login/logout work, JWT tokens, tests >90%, security checklist complete. Verify in browser." --max-checkpoints 40 --browser-verify
```

**What happens**:
1. Agent creates architecture plan
2. Implements auth routes
3. Adds JWT middleware
4. Writes integration tests
5. Launches app in browser, tests flows
6. Takes screenshots of working auth
7. Creates security audit Artifact
8. Completes when all criteria met

### Example 3: Code Quality Sweep

```
/ralph-loop "Add TypeScript strict mode to entire codebase. DONE when: tsc --strict passes with 0 errors, all implicit 'any' removed." --max-checkpoints 60
```

**What happens**:
1. Enable `strict: true` in tsconfig.json
2. Run `tsc --strict`, see 1000+ errors
3. Group errors by type
4. Fix batch by batch (checkpoints every 50 fixes)
5. Run tsc after each batch
6. Continue until clean build
7. Final verification Artifact with before/after stats

---

## Troubleshooting

### "Loop stuck, repeating same error"

**Solution**: 
- Check checkpoint Artifacts for repeating patterns
- Agent should recognize loops and try different approach
- If 3 identical failures, escalate to user

### "Verification script always fails"

**Solution**:
- Ensure verification script is correct
- Check terminal output in Artifacts
- May need to adjust success pattern
- Try manual verification checkpoint

### "Ran out of checkpoints"

**Solution**:
- Task too large, break into phases
- Or increase max checkpoints (cautiously)
- Review plan Artifact, may need different strategy

---

## Integration with Antigravity Workflows

This skill can be invoked from workflows:

```markdown
# .agent/workflows/ralph-refactor.md
---
description: Run Ralph loop for code refactoring tasks
---

1. Review the refactoring requirements
2. Invoke ralph-loop skill with task description
3. Monitor checkpoint Artifacts
4. When complete, review final changes
5. Run /git-commit with conventional message
```

---

## Knowledge Base Interaction

Ralph loops contribute to Antigravity's Knowledge Base:

- **Successful patterns**: Saved for reuse
- **Failed approaches**: Documented to avoid
- **Architecture decisions**: Captured with rationale
- **Test strategies**: Reusable across projects

Over time, Ralph loops get smarter by learning from past iterations.

---

## Limitations

### What Ralph CANNOT Do

1. **Make architectural decisions** - Requires human judgment
2. **Handle ambiguous requirements** - Needs clear completion criteria
3. **Guarantee security** - Security-sensitive code needs human review
4. **Replace exploration** - Not suitable for "figure out what to build"

### When NOT to Use Ralph

- Unclear success criteria
- Security-sensitive code
- Novel architecture design
- Research/exploration tasks
- One-shot operations (no iteration needed)

---

## Credits

Inspired by Geoffrey Huntley's original Ralph Wiggum technique:
- https://ghuntley.com/ralph/
- Original: `while :; do cat PROMPT.md | claude-code ; done`

Adapted for Antigravity's agent-first architecture by preserving the **philosophy** (iteration until success) while using native Antigravity primitives (Skills, Artifacts, Knowledge Base, Manager View).

---

## License

MIT License - Free to use, modify, and distribute.

---

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review checkpoint Artifacts for clues
3. File issue with Debug Artifact attached
