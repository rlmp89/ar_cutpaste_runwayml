import io
import numpy as np
from PIL import Image

import time
import logging
import argparse

import runway
from runway.data_types import number, text, image, file
import argparse

def sample(model, img):
    # Ensure imaize is under 1024
    if img.size[0] > 1024 or img.size[1] > 1024:
        img.thumbnail((1024, 1024))
    return model.run(np.array(img)).convert("L")
   
      

@runway.setup(options={"onnx":number(default=0)})
def setup(opts):
    import basnet
    return basnet

@runway.command(name='paste',
                inputs= { 'image': image },
                outputs={ 'image': image(channels=4) })
def paste(model,inputs):
    start = time.time()
    logging.info('generating mask...')
    img = inputs['image']
    if img.size[0] > 1024 or img.size[1] > 1024:
        img.thumbnail((1024, 1024))
    mask = sample(model,img)
    logging.info(' > compositing final image...')
    ref = inputs['image']
    empty = Image.new("RGBA", ref.size, 0)
    res = Image.composite(ref, empty, mask.resize(ref.size))
    # Print stats
    logging.info(f'Completed in {time.time() - start:.2f}s')
    return res


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--ngrok', action='store_true')
    parser.add_argument('--onnx', action='store_true')
    parser.add_argument('--port', default=8081,type=int)
    logging.basicConfig(level=logging.INFO)
    args = parser.parse_args()
    if args.ngrok:
        from pyngrok import ngrok
        public_url = ngrok.connect(args.port)
        logging.info(" * ngrok tunnel \"{}\" -> \"http://127.0.0.1:{}/\"".format(public_url, args.port))
    runway.run(host='127.0.0.1', port=args.port,model_options={'onnx':int(args.onnx)})