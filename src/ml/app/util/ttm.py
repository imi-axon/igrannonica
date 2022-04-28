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

    def add(self, tt: TrainingThread, uid, nnid) -> bool: # return True/False <=> Added/NotAdded <=> DidNotExist/Existed
        
        if not self.user_exist(uid):
            self.table[uid] = {}

        if not self.nn_exist(uid, nnid):
            self.table[uid][nnid] = tt
            return True

        return False

    def get_nn(self, uid, nid) -> TrainingThread:
        try:
            return self.table[uid][nid]
        except:
            return None

    def get_user(self, uid):
        try:
            return self.table[uid]
        except:
            return None

    def user_exist(self, uid) -> bool:
        return list(self.table.keys()).count(uid) == 1

    def nn_exist(self, uid, nnid):
        if self.user_exist(uid):
            return list(self.table[uid].keys()).count(nnid) == 1
        else:
            return False
        
    def pretty_print(self):
        print('======== TTM Status ========')
        print('- ' + 'locked [ X ]' if self.lock.locked else 'unlocked [   ]')
        print('---- table ----')
        users = list(self.table.keys())
        for u in users:
            print('user ' + str(u))
            nns = list(self.get_user(u).keys())
            for n in nns:
                print('\tnn ' + str(n))
        print('='*28)


TTM = TrainingThreadsManager()