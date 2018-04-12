from django.contrib import admin
from predict import models


class ResultAdmin(admin.ModelAdmin):
    list_display = ('image', 'result', 'correct', 'log_time')
    list_filter = ['correct', 'log_time']


admin.site.register(models.PredictResult, ResultAdmin)
