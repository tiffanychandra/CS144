# write_tomcat.py

import sys, random
from locust import HttpLocust, TaskSet

def write(locust):
    url_prefix = '/editor/post?action=save';
    url_params = '&username=cs144&postid=' + str(random.randint(1,500)) + '&title=Loading%20Test&body=***Hello%20World!***'
    locust.client.post(url_prefix + url_params, name=url_prefix)

class MyTaskSet(TaskSet):
    tasks = {write}

class MyLocust(HttpLocust):
    task_set = MyTaskSet
    min_wait = 1000
    max_wait = 2000
