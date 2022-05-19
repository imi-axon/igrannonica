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
        self.tlock: Lock = Lock()
        self.table = {}

    def table_lock(self):
        self.tlock.acquire(blocking=True)
    
    def table_unlock(self):
        self.tlock.release()

    # Dodaje nit za UID i NNID
    def add(self, tt: TrainingThread, uid, nnid) -> bool: # return True/False <=> Added/NotAdded <=> DidNotExist/Existed
    
        if not self.user_exist(uid):
            self.table[uid] = {}

        if not self.nn_exist(uid, nnid):
            self.table[uid][nnid] = tt
            return True

        return False


    
    # Uklanja iz tabele nit za UID i NNID
    def remove(self, uid, nnid):
    
        if self.nn_exist(uid, nnid):
            self.table[uid].pop(nnid, "NEMA") # brise NN
            if len(list(self.table[uid].keys())) == 0:
                self.table.pop(uid, "NEMA") # brise User-a


    def get_tt(self, uid, nid) -> TrainingThread:
        try:
            return self.table[uid][nid]
        except:
            return None


    def get_user_nns(self, uid):
        try:
            return self.table[uid]
        except:
            return None


    def user_exist(self, uid) -> bool:

        rez = list(self.table.keys()).count(uid) == 1
        return rez


    def nn_exist(self, uid, nnid):
        
        if self.user_exist(uid):
            rez = list(self.table[uid].keys()).count(nnid) == 1
            return rez

        return False


    def pretty_print(self):
        print('======== TTM Status ========')
        print('- ' + 'locked [ X ]' if self.tlock.locked() else 'unlocked [   ]')
        print('---- table ----')
        users = list(self.table.keys())
        for u in users:
            print('user ' + str(u))
            nns = list(self.get_user_nns(u).keys())
            for n in nns:
                print('\tnn ' + str(n))
        print('='*28)


TTM = TrainingThreadsManager()