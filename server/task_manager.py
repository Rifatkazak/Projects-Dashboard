import sys
import json
import os
from flask import Blueprint, jsonify, request

task_manager_bp = Blueprint('task_manager', __name__)

# Constants
TASKS_FILE = "tasks.json"

# Helper functions
def load_tasks():
    """Load tasks from the JSON file."""
    if os.path.exists(TASKS_FILE):
        with open(TASKS_FILE, "r") as f:
            return json.load(f)
    return []

def save_tasks(tasks):
    """Save tasks to the JSON file."""
    with open(TASKS_FILE, "w") as f:
        json.dump(tasks, f, indent=4)

def find_task(task_id, tasks):
    """Find a task by ID."""
    for task in tasks:
        if task["id"] == task_id:
            return task
    return None

def generate_task_id(tasks):
    """Generate a new unique task ID."""
    return max((task["id"] for task in tasks), default=0) + 1

# Flask routes
@task_manager_bp.route('/add-task', methods=['POST'])
def add_task():
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    
    tasks = load_tasks()
    task_id = generate_task_id(tasks)
    new_task = {
        "id": task_id,
        "title": title,
        "description": description,
        "status": "not done"  # Default status
    }
    tasks.append(new_task)
    save_tasks(tasks)
    return jsonify({"message": "Task added", "task": new_task}), 201

@task_manager_bp.route('/list-tasks', methods=['GET'])
def list_tasks():
    filter_status = request.args.get('status')  # Optional filter for task status
    tasks = load_tasks()
    if filter_status:
        tasks = [task for task in tasks if task['status'] == filter_status]
    return jsonify({"tasks": tasks}), 200

@task_manager_bp.route('/update-task', methods=['PUT'])
def update_task():
    data = request.get_json()
    task_id = data.get('id')
    title = data.get('title')
    description = data.get('description')

    tasks = load_tasks()
    task = find_task(task_id, tasks)
    if task:
        if title:
            task["title"] = title
        if description:
            task["description"] = description
        save_tasks(tasks)
        return jsonify({"message": "Task updated", "task": task}), 200
    return jsonify({"message": f"Task with ID {task_id} not found"}), 404

@task_manager_bp.route('/delete-task', methods=['DELETE'])
def delete_task():
    data = request.get_json()
    task_id = data.get('id')

    tasks = load_tasks()
    tasks = [task for task in tasks if task["id"] != task_id]
    save_tasks(tasks)
    return jsonify({"message": f"Task with ID {task_id} has been deleted."}), 200

@task_manager_bp.route('/mark-task', methods=['PUT'])
def mark_task():
    data = request.get_json()
    task_id = data.get('id')
    status = data.get('status')  # Should be one of "not done", "in progress", "done"
    

    tasks = load_tasks()
    task = find_task(task_id, tasks)
    if task:
        task["status"] = status
        save_tasks(tasks)
        return jsonify({"message": f"Task ID {task_id} marked as {status}.", "task": task}), 200
    return jsonify({"message": f"Task with ID {task_id} not found"}), 404


# Command-line Interface
def cli_add_task(title, description):
    tasks = load_tasks()
    task_id = generate_task_id(tasks)
    new_task = {
        "id": task_id,
        "title": title,
        "description": description,
        "status": "not done"  # Default status
    }
    tasks.append(new_task)
    save_tasks(tasks)
    print(f"Task added: {new_task}")

def cli_update_task(task_id, title=None, description=None):
    tasks = load_tasks()
    task = find_task(task_id, tasks)
    if task:
        if title:
            task["title"] = title
        if description:
            task["description"] = description
        save_tasks(tasks)
        print(f"Task ID {task_id} updated: {task}")
    else:
        print(f"Task ID {task_id} not found.")

def cli_delete_task(task_id):
    tasks = load_tasks()
    new_tasks = [task for task in tasks if task["id"] != task_id]
    if len(new_tasks) < len(tasks):
        save_tasks(new_tasks)
        print(f"Task ID {task_id} deleted.")
    else:
        print(f"Task ID {task_id} not found.")

def cli_mark_task(task_id, status):
    tasks = load_tasks()
    task = find_task(task_id, tasks)
    if task:
        task["status"] = status
        save_tasks(tasks)
        print(f"Task ID {task_id} marked as {status}.")
    else:
        print(f"Task ID {task_id} not found.")

def cli_list_tasks():
    tasks = load_tasks()
    if tasks:
        for task in tasks:
            print(f"ID: {task['id']} | Title: {task['title']} | Status: {task['status']} | Description: {task['description']}")
    else:
        print("No tasks found.")

# Main function for CLI usage
def main():
    if len(sys.argv) < 2:
        print("Usage: python task_manager.py <command> [<args>...]")
        return

    command = sys.argv[1]

    try:
        if command == "add":
            title = sys.argv[2]
            description = sys.argv[3] if len(sys.argv) > 3 else ""
            cli_add_task(title, description)

        elif command == "update":
            task_id = int(sys.argv[2])
            title = sys.argv[3] if len(sys.argv) > 3 else None
            description = sys.argv[4] if len(sys.argv) > 4 else None
            cli_update_task(task_id, title, description)

        elif command == "delete":
            task_id = int(sys.argv[2])
            cli_delete_task(task_id)

        elif command == "mark_in_progress":
            task_id = int(sys.argv[2])
            cli_mark_task(task_id, "in progress")

        elif command == "mark_done":
            task_id = int(sys.argv[2])
            cli_mark_task(task_id, "done")

        elif command == "mark_not_done":
            task_id = int(sys.argv[2])
            cli_mark_task(task_id, "not done")

        elif command == "list":
            cli_list_tasks()

        else:
            print(f"Unknown command: {command}")
            print("Available commands: add, update, delete, mark_in_progress, mark_done, mark_not_done, list")
    except IndexError:
        print("Error: Missing required arguments for the command.")
    except ValueError:
        print("Error: Invalid input. Task ID should be a number.")

if __name__ == "__main__":
    main()
