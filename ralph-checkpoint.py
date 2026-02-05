#!/usr/bin/env python3
"""
Ralph Wiggum Checkpoint Manager
Handles state persistence, checkpoint creation, and loop control logic
"""

import json
import os
import hashlib
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Any

class RalphCheckpointManager:
    """Manages checkpoints and state for Ralph Wiggum autonomous loops"""
    
    def __init__(self, session_id: Optional[str] = None):
        self.ralph_dir = Path(".ralph")
        self.ralph_dir.mkdir(exist_ok=True)
        
        self.session_id = session_id or self._generate_session_id()
        self.state_file = self.ralph_dir / f"state-{self.session_id}.json"
        self.checkpoints_dir = self.ralph_dir / "checkpoints" / self.session_id
        self.checkpoints_dir.mkdir(parents=True, exist_ok=True)
        
        self.state = self._load_state()
    
    def _generate_session_id(self) -> str:
        """Generate unique session ID"""
        timestamp = datetime.now().isoformat()
        return hashlib.md5(timestamp.encode()).hexdigest()[:12]
    
    def _load_state(self) -> Dict[str, Any]:
        """Load state from disk or create new"""
        if self.state_file.exists():
            with open(self.state_file, 'r') as f:
                return json.load(f)
        return {
            "session_id": self.session_id,
            "task": "",
            "criteria": [],
            "max_checkpoints": 30,
            "current_checkpoint": 0,
            "status": "initializing",
            "verification_method": "auto",
            "verify_command": None,
            "success_pattern": None,
            "history": [],
            "knowledge_base_refs": [],
            "consecutive_failures": 0,
            "last_error_hash": None,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }
    
    def save_state(self):
        """Persist state to disk"""
        self.state["updated_at"] = datetime.now().isoformat()
        with open(self.state_file, 'w') as f:
            json.dump(self.state, f, indent=2)
    
    def initialize_loop(self, 
                       task: str,
                       criteria: List[str],
                       max_checkpoints: int = 30,
                       verify_command: Optional[str] = None,
                       success_pattern: Optional[str] = None):
        """Initialize a new Ralph loop"""
        self.state.update({
            "task": task,
            "criteria": criteria,
            "max_checkpoints": max_checkpoints,
            "verify_command": verify_command,
            "success_pattern": success_pattern,
            "status": "running"
        })
        self.save_state()
        print(f"✓ Ralph loop initialized: {self.session_id}")
        print(f"  Task: {task}")
        print(f"  Max checkpoints: {max_checkpoints}")
    
    def create_checkpoint(self,
                         actions_taken: List[str],
                         results: Dict[str, Any],
                         criteria_status: Dict[str, bool],
                         next_steps: str,
                         evidence: Optional[Dict[str, Any]] = None) -> int:
        """Create a checkpoint with current state"""
        checkpoint_num = self.state["current_checkpoint"] + 1
        
        checkpoint_data = {
            "checkpoint": checkpoint_num,
            "timestamp": datetime.now().isoformat(),
            "actions_taken": actions_taken,
            "results": results,
            "criteria_status": criteria_status,
            "next_steps": next_steps,
            "evidence": evidence or {}
        }
        
        # Save checkpoint to file
        checkpoint_file = self.checkpoints_dir / f"checkpoint-{checkpoint_num:03d}.json"
        with open(checkpoint_file, 'w') as f:
            json.dump(checkpoint_data, f, indent=2)
        
        # Update history
        self.state["history"].append({
            "checkpoint": checkpoint_num,
            "timestamp": checkpoint_data["timestamp"],
            "summary": f"{len(actions_taken)} actions, {sum(criteria_status.values())}/{len(criteria_status)} criteria met"
        })
        
        # Update current checkpoint
        self.state["current_checkpoint"] = checkpoint_num
        self.save_state()
        
        print(f"✓ Checkpoint {checkpoint_num}/{self.state['max_checkpoints']} created")
        return checkpoint_num
    
    def check_completion(self, criteria_status: Dict[str, bool]) -> bool:
        """Check if all completion criteria are met"""
        return all(criteria_status.values())
    
    def should_continue(self) -> tuple[bool, str]:
        """Determine if loop should continue"""
        current = self.state["current_checkpoint"]
        max_checkpoints = self.state["max_checkpoints"]
        
        # Hit max checkpoints
        if current >= max_checkpoints:
            return False, f"max_checkpoints_reached ({max_checkpoints})"
        
        # Too many consecutive failures
        if self.state["consecutive_failures"] >= 3:
            return False, "stuck_3_consecutive_failures"
        
        # Loop should continue
        return True, "continue"
    
    def record_failure(self, error_message: str) -> bool:
        """
        Record a failure and detect if we're stuck in a loop
        Returns True if this is a repeated failure
        """
        error_hash = hashlib.md5(error_message.encode()).hexdigest()
        
        if error_hash == self.state["last_error_hash"]:
            self.state["consecutive_failures"] += 1
        else:
            self.state["consecutive_failures"] = 1
            self.state["last_error_hash"] = error_hash
        
        self.save_state()
        
        is_repeated = self.state["consecutive_failures"] > 1
        if is_repeated:
            print(f"⚠️ Repeated failure detected ({self.state['consecutive_failures']}/3)")
        
        return is_repeated
    
    def record_success(self):
        """Record a successful iteration (reset failure counter)"""
        self.state["consecutive_failures"] = 0
        self.state["last_error_hash"] = None
        self.save_state()
    
    def complete_loop(self, success: bool, final_summary: str):
        """Mark loop as complete"""
        self.state["status"] = "completed" if success else "incomplete"
        self.state["final_summary"] = final_summary
        self.state["completed_at"] = datetime.now().isoformat()
        self.save_state()
        
        status_emoji = "✅" if success else "⚠️"
        print(f"{status_emoji} Ralph loop {self.state['status']}: {self.session_id}")
        print(f"  Checkpoints used: {self.state['current_checkpoint']}/{self.state['max_checkpoints']}")
    
    def get_previous_checkpoint(self) -> Optional[Dict[str, Any]]:
        """Load previous checkpoint data"""
        current = self.state["current_checkpoint"]
        if current == 0:
            return None
        
        checkpoint_file = self.checkpoints_dir / f"checkpoint-{current:03d}.json"
        if not checkpoint_file.exists():
            return None
        
        with open(checkpoint_file, 'r') as f:
            return json.load(f)
    
    def get_last_n_checkpoints(self, n: int) -> List[Dict[str, Any]]:
        """Get last N checkpoint summaries"""
        current = self.state["current_checkpoint"]
        start = max(1, current - n + 1)
        
        checkpoints = []
        for i in range(start, current + 1):
            checkpoint_file = self.checkpoints_dir / f"checkpoint-{i:03d}.json"
            if checkpoint_file.exists():
                with open(checkpoint_file, 'r') as f:
                    checkpoints.append(json.load(f))
        
        return checkpoints
    
    def export_summary(self) -> Dict[str, Any]:
        """Export complete session summary for Knowledge Base"""
        return {
            "session_id": self.session_id,
            "task": self.state["task"],
            "status": self.state["status"],
            "checkpoints_used": self.state["current_checkpoint"],
            "max_checkpoints": self.state["max_checkpoints"],
            "criteria": self.state["criteria"],
            "history": self.state["history"],
            "created_at": self.state.get("created_at"),
            "completed_at": self.state.get("completed_at"),
            "final_summary": self.state.get("final_summary", "")
        }


def main():
    """CLI interface for checkpoint manager"""
    import sys
    
    if len(sys.argv) < 2:
        print("Usage:")
        print("  ralph-checkpoint.py init <task> <criteria...>")
        print("  ralph-checkpoint.py checkpoint <session_id>")
        print("  ralph-checkpoint.py status <session_id>")
        print("  ralph-checkpoint.py complete <session_id>")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "init":
        task = sys.argv[2]
        criteria = sys.argv[3:]
        
        manager = RalphCheckpointManager()
        manager.initialize_loop(task, criteria)
        print(f"Session ID: {manager.session_id}")
        
    elif command == "checkpoint":
        session_id = sys.argv[2]
        manager = RalphCheckpointManager(session_id)
        
        # Example checkpoint creation
        manager.create_checkpoint(
            actions_taken=["Modified file.py", "Ran tests"],
            results={"tests": "passed", "errors": 0},
            criteria_status={"tests_pass": True, "coverage": False},
            next_steps="Increase test coverage"
        )
        
    elif command == "status":
        session_id = sys.argv[2]
        manager = RalphCheckpointManager(session_id)
        
        print(f"Session: {session_id}")
        print(f"Status: {manager.state['status']}")
        print(f"Checkpoint: {manager.state['current_checkpoint']}/{manager.state['max_checkpoints']}")
        print(f"Task: {manager.state['task']}")
        
    elif command == "complete":
        session_id = sys.argv[2]
        manager = RalphCheckpointManager(session_id)
        manager.complete_loop(success=True, final_summary="All criteria met")


if __name__ == "__main__":
    main()
