import websockets
import cv2
import numpy as np
import json
import asyncio

async def send_coordinates(websocket, path):
    print("Starting to send coordinates...")
    face_classifier = cv2.CascadeClassifier("ML/haarcascade_frontalface_default.xml")
    video_cam = cv2.VideoCapture(1)

    

    if not video_cam.isOpened():
        print("Cannot access the camera")
        return

    prev_center_x = None
    prev_center_y = None
    alpha = 0.3  # Smoothing factor

    while True:
        ret, frame = video_cam.read()
        if ret:
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = face_classifier.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=2)

            if len(faces) > 0:
                print("Face detected")
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

                    # Draw a rectangle around the face
                    cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)
                    # Draw a circle at the center of the face
                    cv2.circle(frame, (smooth_center_x, smooth_center_y), 5, (0, 255, 0), -1)

                    print(f"Sending coordinates: {smooth_center_y}")
                    await websocket.send(json.dumps({"y": int(smooth_center_y)}))

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
