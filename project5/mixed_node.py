import sys, random
from locust import HttpLocust, TaskSet

def read(locust):
    url_prefix = '/blog/cs144';
    url_params = '/';
    locust.client.get(url_prefix+url_params+str(random.randint(1,500)), name=url_prefix)

def write(locust):
    url_prefix = '/api/cs144';
    url_params = '/';
    locust.client.put(url_prefix+url_params+str(random.randint(1,500)), data={"title": "Loading Test", "body": "***Hello World!***"}, name=url_prefix)

class MyTaskSet(TaskSet):
    tasks = {read: 9, write: 1} 
    def on_start(locust):
        response = locust.client.post("/login", data={"username":"cs144", "password": "password"})
        if response.status_code != 200:
            print("FAIL to start with posting data to server. Make sure that your server is running.")
            sys.exit();

class MyLocust(HttpLocust):
    task_set = MyTaskSet
    min_wait = 1000
    max_wait = 2000
