import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os

def generate_solar_dataset(output_path="backend/data/solar_generation_dataset.csv", num_days=45):
    np.random.seed(42)
    start_date = datetime(2026, 8, 1, 0, 0, 0)
    
    records = []
    total_yield = 50000.0 # starting cumulative yield in Wh
    
    for day_idx in range(num_days):
        current_day_date = start_date + timedelta(days=day_idx)
        daily_yield = 0.0
        
        # 24 hours per day, 15-min intervals (96 intervals per day)
        for min_idx in range(0, 24 * 60, 15):
            record_time = current_day_date + timedelta(minutes=min_idx)
            hour = record_time.hour
            minute = record_time.minute
            day = record_time.day
            month = record_time.month
            day_of_week = record_time.weekday()
            
            # Solar geometry approximation
            hour_float = hour + minute / 60.0
            
            # Irradiation peaks around 12:30 PM (hour_float = 12.5)
            if 6.0 <= hour_float <= 19.0:
                # Sun height curve
                sun_factor = np.sin((hour_float - 6.0) / 13.0 * np.pi)
                # Cloud fluctuation
                cloud_noise = np.random.uniform(0.75, 1.05)
                # Random cloud dips on some days
                if (day_idx % 7 == 3) and (11 <= hour <= 14):
                    cloud_noise *= 0.4 # cloudy afternoon
                
                irradiation = max(0.0, 980.0 * (sun_factor ** 1.3) * cloud_noise + np.random.normal(0, 15))
            else:
                irradiation = 0.0
            
            # Ambient temperature (diurnal cycle: min at 5 AM ~20°C, max at 3 PM ~34°C)
            temp_variation = np.sin((hour_float - 9.0) / 24.0 * 2 * np.pi)
            ambient_temp = 25.0 + 8.0 * temp_variation + np.random.normal(0, 0.8)
            ambient_temp = max(12.0, round(ambient_temp, 2))
            
            # Module temperature approximation (NOCT formula: T_ambient + Irradiation * 0.032 + noise)
            if irradiation > 0:
                module_temp = ambient_temp + (irradiation / 800.0) * 26.0 + np.random.normal(0, 1.2)
            else:
                module_temp = ambient_temp - np.random.uniform(0.5, 2.0)
            module_temp = max(ambient_temp - 2.0, round(module_temp, 2))
            
            # AC Power calculation (Inverter efficiency + Temp derating)
            # Standard rating: 4000W peak at 1000 W/m2 and 25°C module temp
            if irradiation > 5:
                temp_loss = 1.0 - 0.004 * (module_temp - 25.0)
                temp_loss = max(0.7, min(1.05, temp_loss))
                inverter_eff = 0.96 - 0.03 * np.exp(-irradiation / 200.0)
                ac_power = (irradiation / 1000.0) * 4200.0 * temp_loss * inverter_eff + np.random.normal(0, 25)
                ac_power = max(0.0, round(ac_power, 2))
            else:
                ac_power = 0.0
            
            # Update yields (power in Watts for 0.25 hours = Wh)
            energy_wh = ac_power * 0.25
            daily_yield += energy_wh
            total_yield += energy_wh
            
            records.append({
                "DATE_TIME": record_time.strftime("%Y-%m-%d %H:%M:%S"),
                "AMBIENT_TEMPERATURE": round(ambient_temp, 2),
                "MODULE_TEMPERATURE": round(module_temp, 2),
                "IRRADIATION": round(irradiation, 2),
                "AC_POWER": round(ac_power, 2),
                "DAILY_YIELD": round(daily_yield, 2),
                "TOTAL_YIELD": round(total_yield, 2),
                "HOUR": hour,
                "DAY": day,
                "MONTH": month,
                "DAY_OF_WEEK": day_of_week
            })
            
    df = pd.DataFrame(records)
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"Dataset created successfully at {output_path} with {len(df)} rows.")
    return df

if __name__ == "__main__":
    generate_solar_dataset()
