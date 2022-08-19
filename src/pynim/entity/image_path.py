import os


def get_image_path(image_name):
    image_path = os.path.normpath(os.path.join(os.path.dirname(__file__), '../images'))
    return os.path.join(image_path, image_name)
