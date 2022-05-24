import asyncio
from threading import Lock

# Run Blocking (run b)
# Wraper oko poziva blokirajuce funkcije koji ne blokira izvrsavanje ostalih funkcija (ne blokira eventloop)
async def runb(fun, *args):
    return await asyncio.get_event_loop().run_in_executor(None, fun, *args)



# -- Wraperi za specificne funkcije (koristeci runb wraper) --

# Asinhroni Lock
async def alock(lock: Lock):
    return await runb(lock.acquire)

# Asinhroni Unlock
async def aunlock(lock: Lock):
    return await runb(lock.release)