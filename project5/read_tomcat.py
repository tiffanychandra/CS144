# read_tomcat.py
import sys, random
from locust import HttpLocust, TaskSet

def read(locust):
    url_prefix = '/editor/post?action=open';
    url_params = '&username=cs144&postid=';
    locust.client.get(url_prefix+url_params+str(random.randint(1,500)), name=url_prefix)

class MyTaskSet(TaskSet):
    tasks = {read}

class MyLocust(HttpLocust):
    task_set = MyTaskSet
    min_wait = 1000
    max_wait = 2000
