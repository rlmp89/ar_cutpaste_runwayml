#!/bin/bash
set -e
drive_model_path=basenet.pth

cd /content/ar_cutpaste_runwayml/server
git clone https://github.com/NathanUA/BASNet.git
mkdir -p BASNet/saved_models/basnet_bsi

cp /content/drive/My\ Drive/$drive_model_path BASNet/saved_models/basnet_bsi/basnet.pth
pip install -r requirements.txt