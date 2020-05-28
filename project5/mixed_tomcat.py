# mixed_tomcat.py

import sys, random
from locust import HttpLocust, TaskSet

def read(locust):
    url_prefix = '/editor/post?action=open';
    url_params = '&username=cs144&postid=';
    locust.client.get(url_prefix + url_params + str(random.randint(1,500)), name=url_prefix)

def write(locust):
    url_prefix = '/editor/post?action=save';
    url_params = '&username=cs144&postid=' + str(random.randint(1,500)) + '&title=Loading%20Test&body=***Hello%20World!***';
    locust.client.post(url_prefix + url_params, name=url_prefix)

class MyTaskSet(TaskSet):
    tasks = {read: 9, write: 1}

class MyLocust(HttpLocust):
    task_set = MyTaskSet
    min_wait = 1000
    max_wait = 2000
