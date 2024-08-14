import json
import time

# Path to the coordinates JSON file
json_file_path = "ML/coordinates.json"

# Variables to store the last known good coordinates
last_good_x = None
last_good_y = None

def read_coordinates():
    global last_good_x, last_good_y
    try:
        with open(json_file_path, "r") as file:
            data = json.load(file)
            x = data.get("x")
            y = data.get("y")

            # Update last known good coordinates
            if x is not None and y is not None:
                last_good_x, last_good_y = x, y
                return x, y
            else:
                return last_good_x, last_good_y

    except (FileNotFoundError, json.JSONDecodeError):
        return last_good_x, last_good_y

if __name__ == "__main__":
    while True:
        x, y = read_coordinates()
        if x is not None and y is not None:
            print(f"Coordinates: x = {x}, y = {y}")
        else:
            print("No coordinates available.")

        # Reduce the polling interval
        time.sleep(0.05)  # Reduced polling interval in seconds
