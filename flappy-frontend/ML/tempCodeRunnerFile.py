import asyncio
import websockets

async def connect():
    uri = "ws://localhost:6789"
    async with websockets.connect(uri) as websocket:
        while True:
            message = await websocket.recv()
            print(f"Received: {message}")

# Run the asyncio program using asyncio.run
if __name__ == "__main__":
    asyncio.run(connect())
