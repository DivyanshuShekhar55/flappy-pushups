import cv2
import numpy as np
import json
import asyncio
import websockets
import threading

# Adjust the resolution for faster processing
TARGET_RESOLUTION = (640, 480)

async def send_coordinates(websocket, path):
    print("Starting to send coordinates...")
    face_classifier = cv2.CascadeClassifier("ML/haarcascade_frontalface_default.xml")
    video_cam = cv2.VideoCapture(1)

    if not video_cam.isOpened():
        print("Cannot access the camera")
        return

    # Get the original resolution
    original_width = int(video_cam.get(cv2.CAP_PROP_FRAME_WIDTH))
    original_height = int(video_cam.get(cv2.CAP_PROP_FRAME_HEIGHT))

    # Calculate scaling factor for height
    scale_factor_height = 2400 / original_height

    prev_center_x = None
    prev_center_y = None
    alpha = 0.3  # Smoothing factor

    def process_frame(frame):
        nonlocal prev_center_x, prev_center_y
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_classifier.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)

        if len(faces) > 0:
            max_area = 0
            best_face = None
            for (x, y, w, h) in faces:
                area = w * h
                if area > max_area:
                    max_area = area
                    best_face = (x, y, w, h)

            if best_face:
                (x, y, w, h) = best_face
                current_center_x, current_center_y = x + w // 2, y + h // 2

                if prev_center_x is None or prev_center_y is None:
                    smooth_center_x, smooth_center_y = current_center_x, current_center_y
                else:
                    smooth_center_x = int(alpha * current_center_x + (1 - alpha) * prev_center_x)
                    smooth_center_y = int(alpha * current_center_y + (1 - alpha) * prev_center_y)

                prev_center_x, prev_center_y = smooth_center_x, smooth_center_y

                # Scale the y-coordinate * scale_factor_height
                scaled_y = int(smooth_center_y * scale_factor_height / 2.5)

                print(f"Sending coordinates: {scaled_y}")
                asyncio.run_coroutine_threadsafe(websocket.send(json.dumps({"y": scaled_y})), asyncio.get_event_loop())

                # Return data for visualization
                return x, y, w, h, smooth_center_x, smooth_center_y

        return None

    while True:
        ret, frame = video_cam.read()
        if ret:
            # Resize the frame for faster processing
            resized_frame = cv2.resize(frame, TARGET_RESOLUTION)

            result = process_frame(resized_frame)

            if result:
                x, y, w, h, smooth_center_x, smooth_center_y = result
                # Scale back the coordinates to the original resolution for display
                x, y, w, h = [int(v * original_width / TARGET_RESOLUTION[0]) for v in [x, y, w, h]]
                smooth_center_x = int(smooth_center_x * original_width / TARGET_RESOLUTION[0])
                smooth_center_y = int(smooth_center_y * original_height / TARGET_RESOLUTION[1])

                # Draw a rectangle around the face
                cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)
                # Draw a circle at the center of the face
                cv2.circle(frame, (smooth_center_x, smooth_center_y), 5, (0, 255, 0), -1)

            # Display the frame with the face rectangle and center marked
            cv2.imshow('Face Detection', frame)

            # Break the loop if 'q' is pressed
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        await asyncio.sleep(0.03)  # Slight delay to avoid flooding the client

    video_cam.release()
    cv2.destroyAllWindows()

print("Starting WebSocket server...")
start_server = websockets.serve(send_coordinates, "localhost", 6789)

asyncio.get_event_loop().run_until_complete(start_server)
print("WebSocket server running...")
asyncio.get_event_loop().run_forever()
