
# ----------------------------
# with updation here
# ----------------------------


from flask import Flask, request, jsonify, send_from_directory
import os
import json
from flask_cors import CORS
from langchain_google_genai import ChatGoogleGenerativeAI  # Gemini API

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load professor data from JSON file
def load_professor_data():
    with open('test.json', 'r') as file:
        return json.load(file).get('professors', [])

# Function to filter professors based on student query
def filter_professors(professors, specialization=None):
    if specialization:
        return [
            prof for prof in professors
            if specialization.lower() in prof.get('specialization', '').lower()
        ]
    return professors

# Function to summarize professor data for token optimization
def summarize_professors(professors):
    return "\n".join(
        f"{prof['name']}: {prof['specialization']}, Rating: {prof.get('average_rating', 'N/A')}"
        for prof in professors
    )

# Function to communicate with Gemini API
def get_gemini_recommendation(prompt):
    os.environ['GOOGLE_API_KEY'] = 'YOUR_GEMINI_KEY'  # Replace with your Gemini API Key
    gemini_ai = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.7)
    
    try:
        response = gemini_ai.predict(prompt)
        return response
    except Exception as e:
        raise RuntimeError(f"Gemini API Error: {str(e)}")

@app.route('/')
def home():
    return "Welcome to the Rate Professor API"

# Serve static files (including JSON)
@app.route('/test.json')
def serve_json():
    return send_from_directory('.', 'test.json')

# Fetch professor data by ID
@app.route('/professor/<int:professor_id>', methods=['GET'])
def get_professor(professor_id):
    professors = load_professor_data()
    for professor in professors:
        if professor['id'] == professor_id:
            return jsonify(professor), 200
    return jsonify({"error": "Professor not found"}), 404

# Endpoint to save a review
@app.route('/submit-review', methods=['POST'])
def submit_review():
    data = request.json
    professor_name = data.get('professor_name', '')
    rating = data.get('rating', '')
    rating_message = data.get('rating_message', '')
    student_name = data.get('student_name', '')

    if not professor_name or rating is None:
        return jsonify({"error": "Professor name and rating are required"}), 400

    # Convert rating to a number (float)
    try:
        rating = float(rating)
    except ValueError:
        return jsonify({"error": "Invalid rating format"}), 400

    # Load existing data
    professors = load_professor_data()

    # Find the professor
    for professor in professors:
        if professor['name'] == professor_name:
            # Add the new review
            if 'reviews' not in professor:
                professor['reviews'] = []
            
            # Generate a new review_id
            new_review_id = max((review.get('review_id', 0) for review in professor['reviews']), default=0) + 1

            professor['reviews'].append({
                "review_id": new_review_id,
                "rating": rating,
                "comment": rating_message,
                "student_name": student_name
            })
            break
    else:
        return jsonify({"error": "Professor not found"}), 404

    # Save updated data back to the JSON file
    with open('test.json', 'w') as file:
        json.dump({"professors": professors}, file, indent=2)

    return jsonify({"message": "Review submitted successfully"}), 200

# Route for professor recommendations
@app.route('/recommend', methods=['POST'])
def recommend_professor():
    data = request.json
    student_prompt = data.get('prompt', '')
    specialization = data.get('specialization', '')

    if not student_prompt:
        return jsonify({"error": "Prompt is required"}), 400

    # Load and filter professor data
    professors = load_professor_data()
    filtered_professors = filter_professors(professors, specialization)

    # Summarize professor data for prompt
    summarized_data = summarize_professors(filtered_professors)

    # Define the Gemini prompt
    gemini_prompt = f"""
    You are an intelligent guide AI. A student has asked for advice to choose the best professor for their needs.
    Use the following professor data and the student's query to provide the most suitable recommendation.
    
    Student Query: {student_prompt}
    Professor Data: 
    {summarized_data}

    Recommend the best professor and explain why.
    """

    try:
        # Get the response from Gemini
        recommendation = get_gemini_recommendation(gemini_prompt)
        return jsonify({"recommendation": recommendation})
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500

# Run the app
if __name__ == "__main__":
    app.run(debug=True, port=5000)
