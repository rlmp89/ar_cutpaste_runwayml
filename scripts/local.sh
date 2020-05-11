#!/bin/bash
set -e
port=${1:-8081}

drive_model_path=basenet.pth

function run {
    python3 serve.py --port $port
}

cd "$(dirname "$0")"/../server

if source venv/bin/activate;
then 
    echo "Already configured"
    run
else
    echo "Configure..."
    git clone https://github.com/NathanUA/BASNet.git
    mkdir -p BASNet/saved_models/basnet_bsi
    out=BASNet/saved_models/basnet_bsi
    rclone copy gdrive:/$drive_model_path $out
    virtualenv venv
    source venv/bin/activate
    pip install -r requirements.txt
    run
fi


