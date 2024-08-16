import asyncio
import websockets
import cv2
import numpy as np
import base64

async def video_feed(websocket, path):
    async for message in websocket:
        # Decode the base64 image data
        img_data = base64.b64decode(message.split(',')[1])
        np_arr = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        # Display the image using OpenCV
        cv2.imshow('WebSocket Video Feed', img)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cv2.destroyAllWindows()

start_server = websockets.serve(video_feed, "0.0.0.0", 8000)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
