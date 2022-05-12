from threading import Lock, Thread
from typing import List, Tuple

class TrainingThread():

    def __init__(self, thread: Thread, buffer: List[bytes], flags, lock: Lock):
        self.thread = thread
        self.buffer = buffer
        self.flags = flags
        self.lock = lock

    def attrs(self):
        return (self.thread, self.buffer, self.flags, self.lock)


# Training Threads Manager
class TrainingThreadsManager():

    def __init__(self):
        self.lock: Lock = Lock()
        self.table = {}

    # Dodaje nit za UID i NNID
    def add(self, tt: TrainingThread, uid, nnid) -> bool: # return True/False <=> Added/NotAdded <=> DidNotExist/Existed
        
        self.lock.acquire(blocking=True) # [ X ]

        if not self.user_exist(uid):
            self.table[uid] = {}

        if not self.nn_exist(uid, nnid):
            self.table[uid][nnid] = tt
            self.lock.release()         # [   ]
            return True

        self.lock.release()             # [   ]

        return False

    
    # Uklanja iz tabele nit za UID i NNID
    def remove(self, uid, nnid):
        
        self.lock.acquire(blocking=True) # [ X ]
        try:
            if self.nn_exist(uid, nnid):
                self.table[uid].pop(nnid, "NEMA") # brise NN
                if len(list(self.table[uid].keys())) == 0:
                    self.table.pop(uid, "NEMA") # brise User-a
        finally:
            self.lock.release()         # [   ]


    def get_tt(self, uid, nid) -> TrainingThread:
        self.lock.acquire(blocking=True) # [ X ]
        try:
            return self.table[uid][nid]
        except:
            return None
        finally:
            self.lock.release()         # [   ]


    def get_user_nns(self, uid):
        self.lock.acquire(blocking=True) # [ X ]
        try:
            return self.table[uid]
        except:
            return None
        finally:
            self.lock.release()         # [   ]


    def user_exist(self, uid) -> bool:
        self.lock.acquire(blocking=True) # [ X ]
        rez = list(self.table.keys()).count(uid) == 1
        self.lock.release()             # [   ]
        return rez


    def nn_exist(self, uid, nnid):
        self.lock.acquire(blocking=True) # [ X ]
        if self.user_exist(uid):
            rez = list(self.table[uid].keys()).count(nnid) == 1
            self.lock.release()         # [   ]
            return rez

        self.lock.release()             # [   ]
        return False


    def pretty_print(self):
        print('======== TTM Status ========')
        print('- ' + 'locked [ X ]' if self.lock.locked else 'unlocked [   ]')
        print('---- table ----')
        users = list(self.table.keys())
        for u in users:
            print('user ' + str(u))
            nns = list(self.get_user_nns(u).keys())
            for n in nns:
                print('\tnn ' + str(n))
        print('='*28)


TTM = TrainingThreadsManager()