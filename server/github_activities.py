import sys
import http.client
import json
from flask import Blueprint, jsonify, request

# GitHub API endpoint for user events
GITHUB_API_HOST = "api.github.com"
USER_EVENTS_PATH = "/users/{}/events/public"

github_activity_bp = Blueprint('github_activities', __name__)

def fetch_github_activity(username):
    """Fetch recent public activity for a GitHub user."""
    connection = http.client.HTTPSConnection(GITHUB_API_HOST)
    path = USER_EVENTS_PATH.format(username)
    activities = []
    
    try:
        connection.request("GET", path, headers={"User-Agent": "Python Script"})
        response = connection.getresponse()
        
        if response.status == 404:
            print(f"Error: User '{username}' not found on GitHub.")
            return activities  # Return empty list if user not found
        elif response.status != 200:
            print(f"Error: Failed to fetch data (status code: {response.status})")
            return activities  # Return empty list if fetching fails
        
        data = response.read().decode()
        events = json.loads(data)
        
        if not events:
            print(f"No recent activity found for user '{username}'.")
            return activities  # Return empty list if no activity found

        # Prepare the activity list with the most recent 10 events
        for event in events[:10]:
            event_type = event.get("type", "Unknown")
            repo_name = event["repo"]["name"] if "repo" in event else "Unknown"
            activities.append({
                "type": event_type,
                "repo_name": repo_name
            })

    except json.JSONDecodeError:
        print("Error: Could not parse the API response.")
    except http.client.HTTPException as e:
        print(f"Error: HTTP connection failed - {e}")
    finally:
        connection.close()

    return activities

# GitHub kullanıcısının etkinliklerini getir
@github_activity_bp.route('/activity/<username>', methods=['GET'])
def get_activity(username):
    # Fetch activities using the fetch_github_activity function
    activities = fetch_github_activity(username)
    
    if activities:
        return jsonify({"message": f"Fetched activity for {username}", "activities": activities}), 200
    else:
        return jsonify({"message": f"Could not fetch activity for {username}", "activities": []}), 404
