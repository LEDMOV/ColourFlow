from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)

# Route for game home page
@app.route('/')
def index():
    return render_template('index.html')

# Route for saving scores
@app.route('/submit_score', methods=['POST'])
def submit_score():
    data = request.json
    # Save score to database (add your logic)
    return jsonify({"status": "success", "message": "Score submitted!"})

def save_score(username, score):
    connection = sqlite3.connect('data/leaderboard.db')
    cursor = connection.cursor()
    cursor.execute("INSERT INTO leaderboard (username, score) VALUES (?, ?)", (username, score))
    connection.commit()
    connection.close()

# Use the function in your submit_score route

@app.route('/leaderboard')
def leaderboard():
    connection = sqlite3.connect('data/leaderboard.db')
    cursor = connection.cursor()
    cursor.execute("SELECT username, score FROM leaderboard ORDER BY score DESC LIMIT 10")
    top_scores = cursor.fetchall()
    connection.close()
    
    # Pass the top_scores to the leaderboard template
    return render_template('leaderboard.html', scores=top_scores)




if __name__ == '__main__':
    app.run(debug=True)
