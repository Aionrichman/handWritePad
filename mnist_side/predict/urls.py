from django.urls import path

from . import views

app_name = 'predict'
urlpatterns = [
    path('', views.index, name='index'),
    path('result', views.predict_result, name='result'),
    path('uploadError', views.upload_error, name='uploadError'),
    path('getData', views.get_table_data, name='getData'),
    path('table', views.result_table, name='table')
]