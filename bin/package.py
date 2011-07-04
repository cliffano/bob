import json
import os

file = open('./package.json')
conf = json.load(file)
out = 'APP_NAME="' + conf['name'] + '"\n' + 'APP_VERSION="' + conf['version'] + '"\n'
try:
    out += 'APP_SRC_DIR="' + conf['app']['src']['dir'] + '"\n'
except:
    print('# Using default source dir')
try:
    out += 'DEPLOY_HOST="' + conf['app']['deploy']['host'] + '"\n' + 'DEPLOY_PORT=' + str(conf['app']['deploy']['port']) + '\n' + 'DEPLOY_DIR="' + conf['app']['deploy']['dir'] + '"\n'
except:
    print('# No deploy info')
print(out)
file.close()