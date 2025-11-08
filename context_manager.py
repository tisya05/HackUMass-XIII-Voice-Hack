import re
import google.generativeai as genai
import os
from dotenv import load_dotenv
from ip_utils import detect_ip_info

# --- Setup ---
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model_name = "models/gemini-2.5-flash-lite"

# --- Core memory & conversation ---
conversation = [
    {"role": "system", "content": (
        "You are a calm, concise, safety-first emergency response assistant. "
        "Always prioritize the user's safety and privacy. "
        "Keep responses short and direct."
    )}
]

memory = {
    "emergency_type": None,
    "approx_location": None,
    "vulnerability": None,
    "people_involved": None,
    "hazards": None,
    "environment": None,
    "ip_location_hint": None,
}

MAX_TURNS_KEEP = 8
MEMORY_PROMPT_MAX_LEN = 800


# --- Load IP location automatically ---
def init_ip_location():
    try:
        info = detect_ip_info()
        geo = info.get("geolocation", {})
        loc_str = f"{geo.get('city', 'N/A')}, {geo.get('regionName', 'N/A')}, {geo.get('country', 'N/A')}"
        memory["ip_location_hint"] = loc_str
        print(f"🌍 IP location hint set to: {loc_str}")
    except Exception as e:
        print("⚠️ Failed to fetch IP location:", e)


init_ip_location()


# --- Keyword tables ---
EMERGENCY_KEYWORDS = {
    "fire": ["fire", "smoke", "burning"],
    "flood": ["flood", "flooding", "water rising"],
    "earthquake": ["earthquake", "tremor", "shaking"],
    "medical": ["injured", "bleeding", "unconscious", "heart attack", "collapse"],
    "storm": ["tornado", "hurricane", "storm", "wind"],
}

VULNERABILITY_KEYWORDS = {
    "child": ["child", "kid", "baby"],
    "elderly": ["elderly", "old", "senior"],
    "pregnant": ["pregnant", "expecting"],
}

SITUATION_KEYWORDS = [
    "apartment", "house", "room", "bathroom", "kitchen",
    "garage", "car", "building", "office", "school", "street"
]


# --- Memory updater ---
def update_memory(user_text):
    text_l = user_text.lower()

    # --- Emergency type ---
    for kind, kws in EMERGENCY_KEYWORDS.items():
        # match keywords as whole words to avoid substring false positives (e.g. 'windows' matching 'wind')
        for kw in kws:
            if re.search(r"\b" + re.escape(kw) + r"\b", text_l):
                if memory["emergency_type"] != kind:
                    memory["emergency_type"] = kind
                    print(f"✅ Stored: emergency_type = {kind}")
                break

    # --- Vulnerability ---
    for vuln, kws in VULNERABILITY_KEYWORDS.items():
        for kw in kws:
            if re.search(r"\b" + re.escape(kw) + r"\b", text_l):
                if memory["vulnerability"] != vuln:
                    memory["vulnerability"] = vuln
                    print(f"✅ Stored: vulnerability = {vuln}")
                break

    # --- Explicit location (like “near Boston”) ---
    loc_match = re.search(r"\b(?:at|near|around|by)\s+([A-Z0-9][\w\s,.-]{4,80})", user_text)
    if loc_match:
        loc = loc_match.group(1).strip()
        if memory["approx_location"] != loc:
            memory["approx_location"] = loc
            print(f"✅ Stored: approx_location = {loc}")

    # --- People involved ---
    if "alone" in text_l and memory["people_involved"] != "alone":
        memory["people_involved"] = "alone"
        print("✅ Stored: people_involved = alone")
    elif re.search(r"\b(\d+)\s+(?:people|persons|others)\b", text_l):
        num = re.search(r"\b(\d+)\s+(?:people|persons|others)\b", text_l).group(1)
        val = f"{num} people"
        if memory["people_involved"] != val:
            memory["people_involved"] = val
            print(f"✅ Stored: people_involved = {val}")

    # --- Hazards ---
    for hazard in ["gas leak", "weapon", "gun", "knife", "electric", "collapsed"]:
        if re.search(r"\b" + re.escape(hazard) + r"\b", text_l) and memory["hazards"] != hazard:
            memory["hazards"] = hazard
            print(f"✅ Stored: hazards = {hazard}")

    # --- Environment / situation ---
    for env in SITUATION_KEYWORDS:
        if re.search(r"\b" + re.escape(env) + r"\b", text_l) and memory["environment"] != env:
            memory["environment"] = env
            print(f"✅ Stored: environment = {env}")
            break


# --- Context builder for Gemini ---
def build_prompt():
    mem_items = [f"{k}: {v}" for k, v in memory.items() if v]
    mem_block = "Pinned context:\n" + ("\n".join(mem_items) if mem_items else "None")
    if len(mem_block) > MEMORY_PROMPT_MAX_LEN:
        mem_block = mem_block[:MEMORY_PROMPT_MAX_LEN] + "…"

    joined = ""
    for msg in conversation[-MAX_TURNS_KEEP*2:]:
        joined += f"[{msg['role'].upper()}] {msg['content']}\n\n"

    return f"{mem_block}\n\n{joined}"


# --- Gemini model call ---
def gemini_reply_with_context():
    model = genai.GenerativeModel(model_name)
    joined = build_prompt()
    response = model.generate_content(joined)
    reply_text = response.text.strip()
    print("🤖 Gemini:", reply_text)
    conversation.append({"role": "assistant", "content": reply_text})
    return reply_text


# --- Core pipeline ---
def process_user_message(user_text):
    conversation.append({"role": "user", "content": user_text})
    update_memory(user_text)
    return gemini_reply_with_context()


# --- Debugging / inspection ---
def show_current_context():
    print("\n📝=== CURRENT CONTEXT ===")
    for msg in conversation[-MAX_TURNS_KEEP*2:]:
        print(f"[{msg['role'].upper()}] {msg['content']}")
    print("🗂=== MEMORY ===")
    for k, v in memory.items():
        if v:
            print(f"{k}: {v}")
    print("=======================\n")


def clear_session():
    global conversation, memory
    conversation = conversation[:1]
    for key in memory:
        memory[key] = None
    init_ip_location()
    print("🧹 Session cleared.")
