import os
ENV_TYPE = os.getenv('ML_ENV_TYPE', 'DEVELOPMENT')

class Urls():
    
    BACK = ''
    BACK_WS = ''
    BACK_HOST = ''
    BACK_PORT = ''

    def SetForDev(ssl: bool = False):
        Urls.BACK_PORT = '7057' if ssl else '10016'
        Urls.SetWithCommonHost('localhost', ssl)
    
    def SetForProd(ssl: bool = False):
        Urls.BACK_PORT = '10016'
        Urls.SetWithCommonHost('147.91.204.115', ssl)
        # Urls.SetWithCommonHost('softeng.pmf.kg.ac.rs')
    
    def SetWithCommonHost(host: str, ssl: bool):
        Urls.BACK_HOST = host
        Urls.BACK = f'http{"s" if ssl else ""}://{Urls.BACK_HOST}:{Urls.BACK_PORT}'
        Urls.BACK_WS = f'ws{"s" if ssl else ""}://{Urls.BACK_HOST}:{Urls.BACK_PORT}'


if ENV_TYPE == 'PRODUCTION':
    Urls.SetForProd()
elif ENV_TYPE == 'DEVELOPMENT':
    Urls.SetForDev()