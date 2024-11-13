import sys
import http.client
import json

# server/github_user_activity.py
from flask import Blueprint, jsonify

# GitHub API endpoint for user events
GITHUB_API_HOST = "api.github.com"
USER_EVENTS_PATH = "/users/{}/events/public"



github_activity_bp = Blueprint('github_activities', __name__)

# GitHub kullanıcısının etkinliklerini getir
@github_activity_bp.route('/activity/<username>', methods=['GET'])
def get_activity(username):
    # Gerçek GitHub API çağrısını burada yapın
    if username :
        return jsonify({"message": f"Fetched activity for {username}", "activities": []}), 200
    return jsonify({"message": f"Fetched nothing", "activities": []}), 200

def fetch_github_activity(username):
    """Fetch recent public activity for a GitHub user."""
    connection = http.client.HTTPSConnection(GITHUB_API_HOST)
    path = USER_EVENTS_PATH.format(username)
    
    try:
        connection.request("GET", path, headers={"User-Agent": "Python Script"})
        response = connection.getresponse()
        if response.status == 404:
            print(f"Error: User '{username}' not found on GitHub.")
            return
        elif response.status != 200:
            print(f"Error: Failed to fetch data (status code: {response.status})")
            return
        
        data = response.read().decode()
        events = json.loads(data)
        
        if not events:
            print(f"No recent activity found for user '{username}'.")
            return

        # Display each event's type and repository name
        print(f"Recent activity for GitHub user '{username}':\n")
        for event in events[:10]:  # Limit to 10 most recent events
            event_type = event.get("type", "Unknown")
            repo_name = event["repo"]["name"] if "repo" in event else "Unknown"
            print(f"- {event_type} in {repo_name}")

    except json.JSONDecodeError:
        print("Error: Could not parse the API response.")
    except http.client.HTTPException as e:
        print(f"Error: HTTP connection failed - {e}")
    finally:
        connection.close()

def main():
    if len(sys.argv) != 2:
        print("Usage: python Github_user_activity.py <github_username>")
        return

    username = sys.argv[1]
    fetch_github_activity(username)

if __name__ == "__main__":
    main()
