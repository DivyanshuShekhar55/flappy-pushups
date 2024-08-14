import cv2
import numpy as np
import json

face_classifier = cv2.CascadeClassifier("ML/haarcascade_frontalface_default.xml")

video_cam = cv2.VideoCapture(1)

if not video_cam.isOpened():
    print("Cannot access the camera")
    exit()

# Variables to store the previous face coordinates
prev_center_x = None
prev_center_y = None
alpha = 0.3  # Smoothing factor (higher values mean more smoothing)

q_pressed = False
while not q_pressed:
    ret, frame = video_cam.read()

    if ret:
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_classifier.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=2)

        if len(faces) > 0:
            # Find the face with the maximum area
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

                # Apply smoothing
                if prev_center_x is None or prev_center_y is None:
                    smooth_center_x, smooth_center_y = current_center_x, current_center_y
                else:
                    smooth_center_x = int(alpha * current_center_x + (1 - alpha) * prev_center_x)
                    smooth_center_y = int(alpha * current_center_y + (1 - alpha) * prev_center_y)

                # Update previous center values
                prev_center_x, prev_center_y = smooth_center_x, smooth_center_y

                cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
                cv2.circle(frame, (smooth_center_x, smooth_center_y), 5, (0, 0, 255), -1)

                # Convert int32 to Python int and write the coordinates to a file
                with open("ML/coordinates.json", "w") as file:
                    json.dump({"x": int(smooth_center_x), "y": int(smooth_center_y)}, file)
                    file.flush()  # Ensure data is written to the file immediately

                print(f"Smoothed face detected at coordinates: ({smooth_center_x}, {smooth_center_y})")

            text = "Face Locked"
        else:
            text = "No Faces Detected"

        font = cv2.FONT_HERSHEY_SIMPLEX
        cv2.putText(frame, text, (0, 30), font, 1, (255, 0, 0), 1)

        cv2.imshow("Result", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            q_pressed = True
            break

video_cam.release()
cv2.destroyAllWindows()
