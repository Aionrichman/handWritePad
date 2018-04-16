import os

import tensorflow as tf
import numpy as np
from PIL import Image
import matplotlib.image as mpimg

from predict.models import PredictResult


def get_data_from_img_by_mp(img_path):
    img = mpimg.imread(img_path)
    img = np.dot(img[..., :3], [0.299, 0.587, 0.114])

    return img.reshape(1, 784)


def get_data_from_img(img_path):
    img = Image.open(img_path).convert('L')
    if img.size[0] != 28 or img.size[1] != 28:
        img = img.resize((28, 28))

    arr = [float(img.getpixel((j, i)))/255.0 for i in range(28) for j in range(28)]
    return np.array(arr).reshape((1, 784))


def save_result(img_path, result):
    obj = PredictResult.objects.create(image=os.path.split(img_path)[1], result=result)

    return obj.id


def predict_num(img_path):
    test_data = get_data_from_img(img_path)

    tf.reset_default_graph()
    x = tf.placeholder("float", [None, 784])
    w = tf.Variable(tf.zeros([784, 10]))
    b = tf.Variable(tf.zeros([10]))
    y = tf.nn.softmax(tf.matmul(x, w) + b)
    label = tf.argmax(input=y, axis=1)
    init = tf.global_variables_initializer()

    with tf.Session() as sess:
        sess.run(init)
        check_point = tf.train.get_checkpoint_state("model")
        saver = tf.train.Saver()
        saver.restore(sess, check_point.model_checkpoint_path)

        result = sess.run(label, feed_dict={x: test_data})
        id = save_result(img_path, result[0])

        return id, result
