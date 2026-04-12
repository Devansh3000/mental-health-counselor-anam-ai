import asyncio
from anam import AnamClient

client = AnamClient(
    api_key="MmQyNzJjZDAtOWJiOC00NmE1LTkxMTgtODg1MzhjM2Q0MDU5OjJYbW1ZOEN1S0pmWkx2MjcvWENMREdBYkcrV1U2NldISzZ5SDNGcDZ1ODg9",
    persona_id="82103afc-ea75-4767-b0de-2fc3ea8d5630",
)

async def main():
    async with client.connect() as session:
        print("Connected! Streaming video frames...")
        async for frame in session.video_frames():
            img = frame.to_ndarray(format="rgb24")
            print(f"Got frame: shape={img.shape}")

asyncio.run(main())
