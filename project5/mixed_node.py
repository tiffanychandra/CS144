import sys, random
from locust import HttpLocust, TaskSet

def read(locust):
    """ define a function where user cs144 opens a random post with id between 1 and 500 """
    url_prefix = '/blog/cs144';
    url_params = '/';
    locust.client.get(url_prefix+url_params+str(random.randint(1,500)), name=url_prefix)

def write(locust):
	""" combine the read intensive tasks and write intensive ones in a single file
    with 10% write and 90% read """
    url_prefix = '/api/cs144';
    url_params = '/';
    locust.client.post(url_prefix+url_params+str(random.randint(1,500)), {"title": "Loading Test", "body": "***Hello World!***"}, name=url_prefix)

class MyTaskSet(TaskSet):
	""" the class MyTaskSet inherits from the class TaskSet, defining the behavior of the user """
    tasks = {read: 9, write: 1} 

class MyLocust(HttpLocust):
	""" the class MyLocust inherits from the class HttpLocust, representing an HTTP user """
    task_set = MyTaskSet
    min_wait = 1000
    max_wait = 2000
