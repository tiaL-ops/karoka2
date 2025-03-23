from firebase_functions import https_fn
from firebase_admin import initialize_app
import os
import openai

# Initialize Firebase Admin SDK
initialize_app()

# Set the OpenAI API key from the environment variables.
import os

openai.api_key = os.environ.get("OPENAI_API_KEY") or os.environ.get("openai.key")




@https_fn.on_request()
def hello_world(req: https_fn.Request) -> https_fn.Response:
    """A simple function that returns a greeting."""
    return https_fn.Response("Hello Landy!", status=200)






@https_fn.on_request()
def generate_karoka_profile(req: https_fn.Request) -> https_fn.Response:
    """
    Generates a Karoka profile using the learner's top 3 types.
    
    Expected JSON payload format:
    {
      "top3": [
        {"type": "exampleType", "percent": 76},
        ...
      ]
    }
    """
    # Safely parse the JSON from the request.
    request_json = req.get_json(silent=True) or {}
    top3 = request_json.get("top3", [])

    # Build a string that shows the top types with percentages.
    types_str = ", ".join([f"{t['type'].upper()}: {t['percent']}%" for t in top3])

    # Construct the prompt for OpenAI.
    prompt = f"""
        You are Karoka, a personality AI. The learner's top 3 types are:
        {types_str}

        Give:
        1. A 1-line identity ("You are 76% [type]")
        2. Their top 3 with percentages
        3. A learner-style interpretation
        4. One-line affirmation
        """

    try:
        # Call OpenAI's API to generate the profile.
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}]
        )

        result = response.choices[0].message.content
        return https_fn.Response(result, status=200)

    except Exception as e:
        # Return error details if something goes wrong.
        return https_fn.Response(f"Error: {str(e)}", status=500)


