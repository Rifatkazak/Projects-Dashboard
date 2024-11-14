import random
from flask import Blueprint, request, jsonify

guessnumber_bp = Blueprint('guess_number', __name__)

# Store game state in memory (for simplicity)
game_state = {
    "target_number": None,
    "attempts_left": None,
    "attempts_used": 0
}

def set_difficulty(difficulty):
    """Set the number of attempts based on difficulty level."""
    difficulty_levels = {"easy": 10, "medium": 7, "hard": 5}
    return difficulty_levels.get(difficulty.lower(), None)

@guessnumber_bp.route('/start-game', methods=['POST'])
def start_game():
    """Start a new game by setting difficulty and target number."""
    data = request.json
    difficulty = data.get('difficulty', 'easy').lower()

    attempts = set_difficulty(difficulty)
    if attempts is None:
        return jsonify({"error": "Invalid difficulty level. Choose 'easy', 'medium', or 'hard'."}), 400

    # Initialize game state
    game_state["target_number"] = random.randint(1, 100)
    game_state["attempts_left"] = attempts
    game_state["attempts_used"] = 0

    return jsonify({
        "message": f"Game started! Difficulty: {difficulty.capitalize()}. You have {attempts} attempts.",
        "attempts_left": attempts
    })

@guessnumber_bp.route('/guess', methods=['POST'])
def guess():
    """Process a player's guess and provide feedback."""
    if game_state["target_number"] is None:
        return jsonify({"error": "Game not started. Use /start-game to start a new game."}), 400

    data = request.json
    try:
        guess = int(data.get("guess"))
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid input. Please enter a valid number."}), 400

    game_state["attempts_used"] += 1
    game_state["attempts_left"] -= 1
    attempts_used = game_state["attempts_used"]
    attempts_left = game_state["attempts_left"]
    status = "Game in progress" if attempts_left > 0 else "Game over"

    if guess == game_state["target_number"]:
        message = f"Congratulations! You guessed the number {game_state['target_number']} correctly in {game_state['attempts_used']} attempts!"
        # Reset game state after winning
        game_state["target_number"] = None
        return jsonify({"message": message, "status": "win"}), 200
    elif guess < game_state["target_number"]:
        feedback = "Too low!"
    else:
        feedback = "Too high!"

    if game_state["attempts_left"] == 0:
        message = f"Sorry, you've run out of attempts! The correct number was {game_state['target_number']}."
        # Reset game state after losing
        game_state["target_number"] = None
        return jsonify({"message": message, "status": "lose"}), 200

    return jsonify({
        "feedback": feedback,
        "attempts_left": game_state["attempts_left"],
        "attempts_used": attempts_used,
        "status": status,
        "result": "incorrect"
    })

@guessnumber_bp.route('/status', methods=['GET'])
def status():
    """Return the current game status."""
    if game_state["target_number"] is None:
        return jsonify({"message": "No game in progress. Use /start-game to start a new game."}), 400

    return jsonify({
        "attempts_left": game_state["attempts_left"],
        "attempts_used": game_state["attempts_used"],
        "status": "Game in progress"
    })