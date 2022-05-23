import asyncio

# Run Blocking (run b)
# Wraper oko poziva blokirajuce funkcije koji ne blokira izvrsavanje ostalih funkcija (ne blokira eventloop)
async def runb(fun, *args):
    return await asyncio.get_event_loop().run_in_executor(None, fun, *args)