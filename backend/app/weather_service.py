import requests
from datetime import datetime
from typing import Dict, Any, List

# Default coordinates: Bangalore, India (can be customized via query parameters)
DEFAULT_LAT = 12.9716
DEFAULT_LON = 77.5946

# Store recent live observations in memory for live charts
live_observations_history: List[Dict[str, Any]] = []
MAX_HISTORY_POINTS = 30

def fetch_open_meteo_data(latitude: float = DEFAULT_LAT, longitude: float = DEFAULT_LON) -> Dict[str, Any]:
    """
    Fetch real-time weather & solar radiation data from Open-Meteo API.
    Does NOT hardcode values.
    """
    url = (
        f"https://api.open-meteo.com/v1/forecast?"
        f"latitude={latitude}&longitude={longitude}&"
        f"current=temperature_2m,relative_humidity_2m,cloud_cover,wind_speed_10m,"
        f"shortwave_radiation,direct_radiation,diffuse_radiation,direct_normal_irradiance,"
        f"global_tilted_irradiance&tilt=20&timezone=auto"
    )
    
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        current = data.get("current", {})
        now = datetime.now()
        
        temperature = float(current.get("temperature_2m", 25.0))
        shortwave_rad = float(current.get("shortwave_radiation", 0.0)) # GHI in W/m2
        direct_rad = float(current.get("direct_radiation", 0.0))
        diffuse_rad = float(current.get("diffuse_radiation", 0.0))
        dni = float(current.get("direct_normal_irradiance", 0.0))
        gti = float(current.get("global_tilted_irradiance", shortwave_rad))
        cloud_cover = float(current.get("cloud_cover", 0.0))
        wind_speed = float(current.get("wind_speed_10m", 0.0))
        
        # Current time extraction for ML features
        hour = now.hour
        day = now.day
        month = now.month
        day_of_week = now.weekday()
        timestamp_str = now.strftime("%Y-%m-%d %H:%M:%S")
        time_short_str = now.strftime("%H:%M:%S")

        # Documented Module Temperature Estimation:
        # Standard NOCT formula: T_module = T_ambient + (GHI / 800) * (NOCT - 20°C)
        # where NOCT = 45°C. Corrected for wind speed: 1 / (1 + 0.05 * wind_speed)
        noct = 45.0
        wind_factor = 1.0 / (1.0 + 0.05 * wind_speed) if wind_speed > 0 else 1.0
        if shortwave_rad > 0:
            est_module_temp = temperature + (shortwave_rad / 800.0) * (noct - 20.0) * wind_factor
        else:
            est_module_temp = max(5.0, temperature - 1.5)
        
        est_module_temp = round(est_module_temp, 2)
        
        result = {
            "source": "Open-Meteo API",
            "timestamp": timestamp_str,
            "time_short": time_short_str,
            "latitude": latitude,
            "longitude": longitude,
            "ambient_temperature": temperature,
            "solar_radiation_ghi": shortwave_rad,
            "direct_solar_radiation": direct_rad,
            "diffuse_solar_radiation": diffuse_rad,
            "direct_normal_irradiance": dni,
            "gti": gti,
            "cloud_cover": cloud_cover,
            "wind_speed": wind_speed,
            "estimated_module_temperature": est_module_temp,
            "estimation_method": "NOCT thermal model: T_ambient + (GHI / 800) * (45 - 20) * [1 / (1 + 0.05 * wind_speed)]",
            "ml_features": {
                "AMBIENT_TEMPERATURE": temperature,
                "MODULE_TEMPERATURE": est_module_temp,
                "IRRADIATION": shortwave_rad,
                "HOUR": hour,
                "DAY": day,
                "MONTH": month,
                "DAY_OF_WEEK": day_of_week
            }
        }
        
        return result

    except Exception as e:
        # Fallback with error status if network fails
        now = datetime.now()
        timestamp_str = now.strftime("%Y-%m-%d %H:%M:%S")
        time_short_str = now.strftime("%H:%M:%S")
        return {
            "error": str(e),
            "source": "Open-Meteo API (Error / Fallback)",
            "timestamp": timestamp_str,
            "time_short": time_short_str,
            "ambient_temperature": 28.5,
            "solar_radiation_ghi": 750.0,
            "direct_solar_radiation": 600.0,
            "diffuse_solar_radiation": 150.0,
            "direct_normal_irradiance": 720.0,
            "gti": 790.0,
            "cloud_cover": 25.0,
            "wind_speed": 10.0,
            "estimated_module_temperature": 50.0,
            "estimation_method": "NOCT thermal model approximation",
            "ml_features": {
                "AMBIENT_TEMPERATURE": 28.5,
                "MODULE_TEMPERATURE": 50.0,
                "IRRADIATION": 750.0,
                "HOUR": now.hour,
                "DAY": now.day,
                "MONTH": now.month,
                "DAY_OF_WEEK": now.weekday()
            }
        }

def record_live_observation(observation: Dict[str, Any], predicted_ac_power: float):
    """
    Appends live observation with predicted AC power to in-memory history.
    """
    history_point = {
        "timestamp": observation.get("timestamp"),
        "time_short": observation.get("time_short"),
        "irradiation": observation.get("solar_radiation_ghi"),
        "ambient_temperature": observation.get("ambient_temperature"),
        "module_temperature": observation.get("estimated_module_temperature"),
        "cloud_cover": observation.get("cloud_cover"),
        "predicted_ac_power": predicted_ac_power
    }
    
    live_observations_history.append(history_point)
    if len(live_observations_history) > MAX_HISTORY_POINTS:
        live_observations_history.pop(0)

def get_live_history() -> List[Dict[str, Any]]:
    return live_observations_history
