import json
import os

file = open('./package.json')
conf = json.load(file)
out = 'APP_NAME="' + conf['name'] + '"\n' + 'APP_VERSION="' + conf['version'] + '"\n'
if hasattr(conf, 'app') and hasattr(conf['app'], 'deploy'):
    out += 'DEPLOY_HOST="' + conf['app']['deploy']['host'] + '"\n' + 'DEPLOY_PORT="' + conf['app']['deploy']['port'] + '"\n' + 'DEPLOY_DIR="' + conf['app']['deploy']['dir'] + '"\n'
print(out)
file.close()
