import os
import time
import json

from PIL import Image
from django.http import HttpResponse, HttpResponseForbidden, Http404
from django.shortcuts import render
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

from mnist_side.settings import STATICFILES_DIRS
from predict.models import PredictResult
from predict.predict_by_model import predict_num


def index(request):
    return render(request, 'predict/index.html')


def predict_result(request):
    if request.method == 'POST':
        data = request.FILES['predictImg']
        filename = str(int(time.mktime(time.localtime()))) + '.png'
        img_url = default_storage.save(os.path.join(STATICFILES_DIRS[0], filename), ContentFile(data.read()))

        with Image.open(img_url).convert('L') as img:
            if img.size[0] != 28 or img.size[1] != 28:
                img = img.resize((28, 28))
            img.save(img_url)

        id, predict = predict_num(img_url)
        result_dict = {
            "id": id,
            "number": str(predict[0])
        }
        return HttpResponse(json.dumps(result_dict))

    else:
        return HttpResponseForbidden


def upload_error(request):
    if request.method == 'POST':
        try:
            data = request.POST
            if data["error"] == "0":
                PredictResult.objects.filter(pk=data["id"]).update(correct=False)
            else:
                PredictResult.objects.filter(pk=data["id"]).update(correct=True)
            return HttpResponse(0)
        except PredictResult.DoesNotExist:
            return Http404("Server Error")

    else:
        return HttpResponseForbidden


def result_table(request):
    return render(request, 'predict/table.html')


def get_table_data(request):
    try:
        result = PredictResult.objects.all()
    except PredictResult.DoesNotExist:
        raise Http404("Result does not exist")

    data = []
    for res in result:
        tmp_dict = {
            'image': '/static/' + res.image,
            'result': res.result,
            'correct': res.correct,
            'log_time': str(res.log_time)
        }
        data.append(tmp_dict)

    return HttpResponse(json.dumps(data))


def upload_file(request):
    return render(request, 'predict/file.html')