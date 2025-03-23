from firebase_functions import https_fn, params
from firebase_admin import initialize_app
import openai
import os
# Initialize Firebase Admin SDK
initialize_app()

# Set the OpenAI API key from the environment variables.
import os

openai.api_key = os.environ.get("OPENAI_KEY")






@https_fn.on_request()
def hello_world(req: https_fn.Request) -> https_fn.Response:
    """A simple function that returns a greeting."""
    return https_fn.Response("Hello Landy!", status=200)






@https_fn.on_request(secrets=[params.SecretParam("OPENAI_KEY")])
def generate_karoka_profile(req: https_fn.Request) -> https_fn.Response:
    # Handle CORS preflight
    if req.method == "OPTIONS":
        return https_fn.Response(
            "",
            status=204,
            headers={
                "Access-Control-Allow-Origin": "*",  # For dev only; use specific origin in prod
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        )

    try:
        data = req.get_json(silent=True) or {}
        top3 = data.get("top3", [])

        if not top3:
            return https_fn.Response("Missing 'top3'", status=400)

        types_str = ", ".join([f"{t['type'].upper()}: {t['percent']}%" for t in top3])



        prompt = f"""
        You are Karoka, a character-based AI mentor inspired by Kuroko no Basket.

        The learner’s top 3 types are:
        {types_str}

        You have 7 types: Finisher (Aomine), Mirror (Kise), Strategist (Midorima), Giant (Murasakibara), Visionary (Akashi), Shadow (Kuroko), and Climber (Kagami).

        Give the learner a short, fun, and empowering learner profile including:

        1. A 1-liner personality identity (e.g. "You're an Aomine-type — intense, instinctive, and confident")
        2. Their top 3 types (make sure the percentages total to 100%)
        3. A short explanation of their learning style
        4. One-line affirmation (motivation)
        5. 2-3 suggested career paths based on their traits

        Keep it under 200 words. Make it punchy and friendly.
        """

        
        # Call OpenAI's API to generate the profile.
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}]
        )

        result = response.choices[0].message.content
        

        return https_fn.Response(
            result,
            status=200,
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
            }
        )

    except Exception as e:
        return https_fn.Response(
            f"Error: {str(e)}",
            status=500,
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
            }
        )
