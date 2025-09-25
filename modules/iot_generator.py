import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def generate_iot_data(num_hours: int):
    """
    Simulates a stream of environmental data from IoT sensors.

    Args:
        num_hours (int): The number of hours to simulate data for.

    Returns:
        list: A list of dictionaries, where each dictionary represents a time point.
    """
    # 1. Create a time vector
    base_time = datetime.now()
    timestamps = [base_time + timedelta(hours=i) for i in range(num_hours)]

    # 2. Generate Temperature data (°C) with a sinusoidal pattern + noise
    time_points = np.arange(num_hours)
    temp_min = 18
    temp_max = 35
    temp_amplitude = (temp_max - temp_min) / 2
    temp_mean = temp_min + temp_amplitude
    temperature = temp_mean + temp_amplitude * np.sin(2 * np.pi * (time_points - 6) / 24) + 0.1 * np.random.randn(num_hours)

    # 3. Generate Humidity data (%) inversely correlated with temperature
    humidity_min = 40
    humidity_max = 90
    humidity_amplitude = (humidity_max - humidity_min) / 2
    humidity_mean = humidity_min + humidity_amplitude
    humidity = humidity_mean - humidity_amplitude * np.sin(2 * np.pi * (time_points - 6) / 24) + 0.5 * np.random.randn(num_hours)
    humidity = np.clip(humidity, 0, 100)

    # 4. Generate Soil Moisture data (%) with a slow linear decrease + noise
    initial_moisture = 75
    moisture_decay_rate = -0.2
    soil_moisture = initial_moisture + moisture_decay_rate * time_points + 0.3 * np.random.randn(num_hours)
    soil_moisture = np.clip(soil_moisture, 0, 100)

    # 5. Combine into a list of dictionaries (easy to convert to JSON)
    sensor_data = []
    for i in range(num_hours):
        sensor_data.append({
            'timestamp': timestamps[i].isoformat(),
            'temperature_c': round(temperature[i], 2),
            'humidity_pct': round(humidity[i], 2),
            'soil_moisture_pct': round(soil_moisture[i], 2)
        })

    return sensor_data

if __name__ == '__main__':
    # Example of how to use the function
    test_data = generate_iot_data(24)
    import json
    print(json.dumps(test_data, indent=2))
