# seek.py — updated prompt to return the new fields our Result card needs

import sys
import base64
import json
from pathlib import Path
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage

load_dotenv(Path(__file__).resolve().parent / ".env")

def identify_species(image_path: str) -> dict:
    with open(image_path, "rb") as f:
        image_data = base64.b64encode(f.read()).decode("utf-8")

    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash")

    # updated prompt — now asks for all 9 fields the UI needs
    prompt = """You are a nature expert like the Seek app by iNaturalist.
    Identify the plant or animal in this image.

    Return ONLY a valid JSON object with EXACTLY these keys, nothing else:
    {
      "name": "common name (e.g. Strawberry Peacock Cichlid)",
      "species": "broad category (e.g. Fish, Bird, Mammal, Flowering Plant)",
      "class_name": "scientific class (e.g. Actinopterygii, Aves, Mammalia)",
      "latin_name": "full scientific name (e.g. Aulonocara stuartgranti)",
      "native_place": "where it naturally lives (e.g. Lake Malawi, Africa)",
      "family": "biological family name (e.g. Cichlidae)",
      "habitat": "specific habitat type (e.g. Sandy lake floor, Tropical rainforest)",
      "habitat_type": "one word biome (e.g. Freshwater, Marine, Terrestrial)",
      "conservation": "IUCN status (e.g. Least Concern, Vulnerable, Endangered)",
      "confidence": "your confidence: High, Medium, or Low",
      "detail": "2-3 interesting sentences about this organism"
    }

    If you truly cannot identify it:
    {"error": "Could not identify the organism in this image"}

    Return raw JSON only. No markdown, no backticks, no explanation.
    """

    message = HumanMessage(content=[
        {"type": "text", "text": prompt},
        {"type": "image_url", "image_url": f"data:image/jpeg;base64,{image_data}"}
    ])

    response = llm.invoke([message])

    # strip backticks if Gemini wraps in ```json ... ``` anyway
    # some models do this despite being told not to
    text = response.content.strip()
    if text.startswith("```"):
        text = text.split("```")[1]          # remove opening ```json
        if text.startswith("json"):
            text = text[4:]                  # strip the word "json"
    text = text.strip().rstrip("`")          # remove closing ```

    return json.loads(text)

if __name__ == "__main__":
    try:
        image_path = sys.argv[1]
        result = identify_species(image_path)
        print(json.dumps(result))
    except Exception as e:
        msg = str(e)
        if "RESOURCE_EXHAUSTED" in msg or "429" in msg:
            msg = "Gemini API quota exceeded. Wait and try again, or enable billing in Google AI Studio."
        print(json.dumps({"error": msg}))
        sys.exit(1)