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

    def table_lock(self):
        self.lock.acquire(blocking=True)
    
    def table_unlock(self):
        self.lock.release()

    # Dodaje nit za UID i NNID
    def add(self, tt: TrainingThread, uid, nnid) -> bool: # return True/False <=> Added/NotAdded <=> DidNotExist/Existed
        
        try:
            self.table_lock() # [ X ]

            if not self.user_exist(uid):
                self.table[uid] = {}

            if not self.nn_exist(uid, nnid):
                self.table[uid][nnid] = tt
                self.table_unlock() # [   ]
                return True

            return False

        finally:
            self.table_unlock() # [   ]


    
    # Uklanja iz tabele nit za UID i NNID
    def remove(self, uid, nnid):
        
        try:
            self.table_lock() # [ X ]

            if self.nn_exist(uid, nnid):
                self.table[uid].pop(nnid, "NEMA") # brise NN
                if len(list(self.table[uid].keys())) == 0:
                    self.table.pop(uid, "NEMA") # brise User-a
        finally:
            self.table_unlock() # [   ]


    def get_tt(self, uid, nid) -> TrainingThread:
        try:
            self.table_lock() # [ X ]
            return self.table[uid][nid]
        except:
            return None
        finally:
            self.table_unlock() # [   ]


    def get_user_nns(self, uid):
        try:
            self.table_lock() # [ X ]
            return self.table[uid]
        except:
            return None
        finally:
            self.table_unlock() # [   ]


    def user_exist(self, uid) -> bool:
        try:
            self.table_lock() # [ X ]
            rez = list(self.table.keys()).count(uid) == 1
            return rez
        finally:
            self.table_unlock() # [   ]


    def nn_exist(self, uid, nnid):
        try:
            self.table_lock() # [ X ]
            if self.user_exist(uid):
                rez = list(self.table[uid].keys()).count(nnid) == 1
                self.table_unlock() # [   ]
                return rez

            return False
        
        finally:
            self.table_unlock() # [   ]


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