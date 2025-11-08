import socket
import requests
import threading
import time

# Simple cache so we don't spam the geolocation API repeatedly
_ip_cache = {"timestamp": 0, "data": None}
CACHE_TTL = 60 * 60  # 1 hour

def _get_local_ip():
    """Get the machine's local IP address."""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.settimeout(0.5)
        try:
            s.connect(("8.8.8.8", 80))
            ip = s.getsockname()[0]
        finally:
            s.close()
        return ip
    except Exception:
        try:
            return socket.gethostbyname(socket.gethostname())
        except Exception:
            return "127.0.0.1"

def _get_public_ip():
    """Get public IP using external fallback services."""
    services = [
        "https://api.ipify.org?format=json",
        "https://ifconfig.me/all.json",
        "https://ipinfo.io/json"
    ]
    for url in services:
        try:
            resp = requests.get(url, timeout=3)
            resp.raise_for_status()
            j = resp.json()
            if "ip" in j:
                return j["ip"]
            if "address" in j:
                return j["address"]
        except Exception:
            continue
    return None

def _geolocate_ip(ip):
    """Use ip-api.com for geolocation (no API key needed)."""
    if not ip:
        return None
    try:
        url = f"http://ip-api.com/json/{ip}?fields=status,message,country,regionName,city,lat,lon,isp,org,as,query"
        resp = requests.get(url, timeout=4)
        data = resp.json()
        if data.get("status") == "success":
            return data
        return {"error": data.get("message", "geolocation failed")}
    except Exception as e:
        return {"error": str(e)}

def detect_ip_info(force_refresh=False):
    """Synchronous function that returns IP + geolocation info, cached."""
    now = time.time()
    if not force_refresh and _ip_cache["data"] and (now - _ip_cache["timestamp"] < CACHE_TTL):
        return _ip_cache["data"]

    local_ip = _get_local_ip()
    public_ip = _get_public_ip()
    geo = _geolocate_ip(public_ip)

    info = {
        "local_ip": local_ip,
        "public_ip": public_ip,
        "geolocation": geo,
        "timestamp": now
    }

    _ip_cache["data"] = info
    _ip_cache["timestamp"] = now
    return info

# --- Pretty print helper ---
def print_ip_info(info):
    """Format and print the IP/geolocation info neatly."""
    geo = info.get("geolocation", {})
    print("\n🌍  IP Information Summary")
    print("──────────────────────────────")
    print(f"🖥  Local IP:      {info.get('local_ip', 'N/A')}")
    print(f"🌐  Public IP:     {info.get('public_ip', 'N/A')}")
    print(f"📍  Location:      {geo.get('city', 'N/A')}, {geo.get('region', geo.get('regionName', ''))}")
    print(f"🇨🇺  Country:       {geo.get('country', 'N/A')}")
    print(f"🏢  ISP / Org:     {geo.get('isp', 'N/A')} / {geo.get('org', 'N/A')}")
    print(f"🛰  AS Number:     {geo.get('as', 'N/A')}")
    print(f"⏰  Timestamp:     {time.ctime(info.get('timestamp', 0))}")
    print("──────────────────────────────\n")

# --- Start IP check (with callback) ---
def start_ip_check(callback=None, run_in_thread=True):
    """
    Kick off an IP check; if callback provided, it's called with the info dict.
    If run_in_thread True, it runs in background.
    """
    def task():
        info = detect_ip_info(force_refresh=True)
        print_ip_info(info)
        if callback:
            try:
                callback(info)
            except Exception as e:
                print("ip_utils callback error:", e)

    if run_in_thread:
        t = threading.Thread(target=task, daemon=True)
        t.start()
        return t
    else:
        task()
        return None
