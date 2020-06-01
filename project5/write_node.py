import sys, random
from locust import HttpLocust, TaskSet

def write(locust):
	""" define a function where user cs144 randomly update one of her posts 
    by changing its title to “Loading Test” and body to “***Hello World!***” """
    url_prefix = '/api/cs144';
    url_params = '/';
    locust.client.post(url_prefix+url_params+str(random.randint(1,500)), {"title": "Loading Test", "body": "***Hello World!***"}, name=url_prefix)

class MyTaskSet(TaskSet):
	""" the class MyTaskSet inherits from the class TaskSet, defining the behavior of the user """
    tasks = {write}

class MyLocust(HttpLocust):
	""" the class MyLocust inherits from the class HttpLocust, representing an HTTP user """
    task_set = MyTaskSet
    min_wait = 1000
    max_wait = 2000
