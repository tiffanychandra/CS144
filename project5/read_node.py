import sys, random
from locust import HttpLocust, TaskSet

def read(locust):
    url_prefix = '/blog/cs144';
    url_params = '/';
    locust.client.get(url_prefix+url_params+str(random.randint(1,500)), name=url_prefix)

class MyTaskSet(TaskSet):
    tasks = {read}

class MyLocust(HttpLocust):
    task_set = MyTaskSet
    min_wait = 1000
    max_wait = 2000
