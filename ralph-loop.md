---
description: Run autonomous Ralph Wiggum development loop until task completion
---

# Ralph Loop Workflow

This workflow starts an autonomous development loop that iterates until completion criteria are met.

## Usage

Type `/ralph-loop` or select this workflow, then provide:

1. **Task description** - What to build/fix/migrate
2. **Completion criteria** - DONE when X, Y, Z
3. **Max checkpoints** (optional) - Default: 30

## Steps

### 1. Gather Requirements

Ask the user:

```
I'm starting a Ralph loop. Please provide:

1. **Task**: What should I build/fix/migrate?
2. **DONE when**: What are the completion criteria?
   (Be specific: tests pass, files exist, script succeeds, etc.)
3. **Max checkpoints** (optional, default 30): How many iterations maximum?
4. **Verification** (optional): How should I verify completion?
   - Script: Command to run (e.g., "npm test")
   - Manual: I'll ask you at checkpoints
   - Auto: I'll verify based on criteria
```

### 2. Create Ralph Plan // turbo

Load the ralph-loop skill and create a plan Artifact:

```markdown
# Ralph Loop Plan - [Task Name]
Generated: [timestamp]

## Objective
[User's task description]

## Completion Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Verification Method
[How completion will be verified]

## Checkpoint Configuration
- Max checkpoints: [N]
- Checkpoint interval: 5
- Failure strategy: Backtrack after 3 consecutive fails
- Terminal policy: Agent-assisted

## Current Status
Checkpoint: 0/[N]
Status: Initializing
```

Save this to Knowledge Base as `ralph-plan-[session-id].md`.

### 3. Initialize Loop State // turbo

Create tracking file:

```json
{
  "session_id": "[unique-id]",
  "task": "[task description]",
  "criteria": ["criterion 1", "criterion 2"],
  "max_checkpoints": 30,
  "current_checkpoint": 0,
  "status": "running",
  "verification_method": "script|manual|auto",
  "verify_command": "npm test",
  "success_pattern": "All tests passed",
  "history": [],
  "knowledge_base_refs": []
}
```

Save to `.ralph/state-[session-id].json`.

### 4. Execute Autonomous Loop

**CRITICAL LOOP - This is where the magic happens**

```
BEGIN LOOP:

  CHECKPOINT START (Iteration ${current_checkpoint + 1})
  
  // Load context
  1. Read state from .ralph/state-[session-id].json
  2. If checkpoint > 0: Review previous checkpoint Artifact
  3. Load relevant Knowledge Base entries
  
  // Execute work iteration
  4. Based on current state and criteria, perform next logical step:
     - Write/modify code
     - Run tests
     - Fix errors
     - Implement features
     - Update documentation
  
  5. Generate checkpoint Artifact:
     ```markdown
     # Checkpoint ${checkpoint_number}/${max_checkpoints}
     
     ## Actions Taken
     - [List of files modified]
     - [Commands run]
     - [Features implemented]
     
     ## Results
     - [Test output]
     - [Build status]
     - [Errors encountered]
     
     ## Completion Status
     - [ ] Criterion 1: [status + evidence]
     - [ ] Criterion 2: [status + evidence]
     - [ ] Criterion 3: [status + evidence]
     
     ## Next Steps
     [What to do next if not complete]
     
     ## Evidence
     [Code snippets, logs, screenshots]
     ```
  
  // Verify progress
  6. Run verification (if specified):
     - Execute verify_command
     - Check success_pattern in output
     - OR evaluate criteria manually
     - OR browser test (if enabled)
  
  // Self-evaluation
  7. Check completion:
     ```
     ALL_CRITERIA_MET = 
       criterion_1_met AND 
       criterion_2_met AND 
       criterion_3_met AND
       verification_passed
     ```
  
  // Checkpoint save (every 5 iterations)
  8. If checkpoint % 5 == 0:
     - Save detailed state to Knowledge Base
     - Include: full diff, all test results, learnings
     - Tag with: project, task type, success/failure
  
  // Decision logic
  9. EVALUATE:
  
     IF ALL_CRITERIA_MET:
       → GO TO: Completion Phase
       → BREAK LOOP
     
     ELSE IF current_checkpoint >= max_checkpoints:
       → GO TO: Max Iterations Reached
       → BREAK LOOP
     
     ELSE IF last_3_attempts_identical_failure():
       → GO TO: Stuck - Request Help
       → PAUSE LOOP
     
     ELSE:
       → Update state.json
       → Increment current_checkpoint
       → CONTINUE LOOP (go to step 1)

END LOOP
```

### 5. Completion Phase

When ALL criteria are met:

1. **Generate Final Summary Artifact** // turbo

```markdown
# ✅ Ralph Loop Complete

## Final Status
All completion criteria met ✓

## Task
[Original task description]

## Iterations Used
${current_checkpoint}/${max_checkpoints}

## What Was Built
### Files Created
- file1.ts
- file2.test.ts

### Files Modified
- config.json
- README.md

### Commands Run
- npm install vitest
- npm test
- npm run build

## Verification Results
\`\`\`
${verification_output}
\`\`\`

## Completion Criteria Status
✅ Criterion 1: [evidence]
✅ Criterion 2: [evidence]  
✅ Criterion 3: [evidence]

## Key Learnings (saved to Knowledge Base)
- Pattern that worked: [specific approach]
- Pitfalls avoided: [what didn't work]
- Architecture decision: [with rationale]

## Performance Metrics
- Time elapsed: [duration]
- API calls: [count]
- Tests run: [count]
- Success rate: [percentage]

## Next Steps
1. [Review suggested improvements]
2. [Optional enhancements]
3. [Consider these patterns for future tasks]
```

2. **Save to Knowledge Base** // turbo

Save successful patterns, approaches, and learnings for future Ralph loops.

3. **Ask user**:

```
Ralph loop completed successfully! 

Would you like me to:
1. Commit these changes with a conventional commit message?
2. Create a PR with detailed description?
3. Run additional verification?
4. Start a new Ralph loop for the next phase?
```

### 6. Max Iterations Reached

If hit max_checkpoints without completion:

1. **Generate Incomplete Summary**

```markdown
# ⚠️ Ralph Loop Stopped - Max Iterations Reached

## Status
Stopped after ${max_checkpoints} checkpoints

## Task
[Original task]

## Progress Made
### Completed
✅ [Criteria that were met]

### Remaining  
❌ [Criteria not yet met]

### Blockers
- [Specific issues preventing completion]

## What Was Accomplished
[List of work done]

## Why It Stopped
[Analysis of what's blocking completion]

## Recommendations
1. [Adjust approach]
2. [Break task into smaller phases]
3. [Increase max checkpoints if justified]
4. [Get human input on specific blocker]

## Resume Instructions
To resume, run:
\`\`\`
/ralph-loop [adjusted task] --max-checkpoints 20 --resume-from checkpoint-${current_checkpoint}
\`\`\`
```

2. **Ask user**:

```
Ralph loop hit the checkpoint limit (${max_checkpoints}).

Progress was made but task not fully complete.

Options:
1. Review what was done and manually complete
2. Adjust criteria and restart loop
3. Increase checkpoint limit and continue
4. Break into smaller phases

What would you like to do?
```

### 7. Stuck - Request Help

If 3 consecutive failures with identical errors:

1. **Create Debug Artifact**

```markdown
# 🔴 Ralph Loop Stuck - Need Human Input

## Problem
Same error occurring 3 consecutive times

## Failed Attempt
[Description of what was tried]

## Error Pattern
\`\`\`
${error_log}
\`\`\`

## Last 3 Checkpoints
1. Checkpoint ${n-2}: [summary]
2. Checkpoint ${n-1}: [summary]  
3. Checkpoint ${n}: [summary]

## What I've Tried
- Approach 1: [result]
- Approach 2: [result]
- Approach 3: [result]

## Why I'm Stuck
[Analysis of the blocker]

## Possible Solutions
1. [Suggestion 1 with trade-offs]
2. [Suggestion 2 with trade-offs]
3. [Suggestion 3 with trade-offs]

## Paused at Checkpoint
${current_checkpoint}/${max_checkpoints}
```

2. **Ask user**:

```
I'm stuck in a loop (3 consecutive identical failures).

Here's what's happening: [brief summary]

I've tried: [approaches]

Could you:
1. Review the Debug Artifact I created
2. Suggest an alternative approach
3. Make a manual fix so I can continue
4. Adjust the completion criteria

Loop is paused. What should I do?
```

3. **Wait for user response**, then:
   - Resume with new guidance
   - Or abandon and create handoff document

### 8. Cleanup // turbo

Regardless of how loop ends:

1. Update `.ralph/state-[session-id].json` with final status
2. Archive all checkpoint Artifacts  
3. Save session summary to Knowledge Base
4. Clean up temporary files
5. Present final Artifact to user

## Safety Checks

Before starting loop, verify:

- [ ] Task has clear completion criteria
- [ ] Max checkpoints set (default: 30, max: 100)
- [ ] Terminal policy is agent-assisted or review-driven
- [ ] User understands this is autonomous (will run without prompting)
- [ ] Verification method is specified

If any safety check fails, ask for clarification before starting.

## Turbo Mode

Steps marked `// turbo` run automatically without asking permission. This includes:
- Creating plan Artifacts
- Updating state files
- Running verification scripts  
- Saving to Knowledge Base

Steps requiring approval:
- Destructive file operations (rm, drop table)
- External API calls
- Git commits/pushes
- Browser navigation to non-localhost

## Tips for Success

**Good task + criteria**:
```
Task: Migrate Jest to Vitest in src/ directory
DONE when: 
  - All .test.js files use Vitest syntax
  - npm test runs vitest (not jest)  
  - All tests pass
  - package.json updated
Verify: npm test && echo "All tests passed"
```

**Bad task + criteria**:
```
Task: Make the tests better
DONE when: tests are good
Verify: I'll know it when I see it
```

Be specific, measurable, and programmatically verifiable.

## Resume Capability

To resume a previous Ralph loop:

```
/ralph-loop --resume-from checkpoint-15 --session-id abc-123
```

This loads the state from checkpoint 15 and continues.

---

**Remember**: Ralph loops are for **mechanical, well-defined tasks** with clear success criteria. For exploratory work or novel architecture, use standard agent workflows instead.
