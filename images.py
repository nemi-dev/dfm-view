from os import listdir
from os.path import join
from PIL import Image


l = listdir("./public/img/item")

for image_name in l:
  if image_name == ".DS_Store": continue
  with Image.open(join("./public/img/item", image_name)) as im:
    
    im_p = im.resize((64, 64)).quantize(64)
    im_p.save(join("./public/img/optimized/item", image_name))
