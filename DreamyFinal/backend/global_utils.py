import time
import multiprocessing


def time_out(timeout):
    print("start timeout function")
    time.sleep(timeout)


def set_time_out_for_function(timeout, time_out_func, func, args=[], kwargs={}):
    """
    timeout: time in seconds (s) 
    time_out_func: function to count the timeout 
    function: function to process
    """

    time_out_process = multiprocessing.Process(
        target=time_out_func, args=[timeout])
    function_process = multiprocessing.Process(
        target=func, args=args, kwargs=kwargs)

    time_out_process.start()
    function_process.start()

    while time_out_process.is_alive() and function_process.is_alive():
        continue

    if time_out_process.is_alive():
        time_out_process.kill()
        print("function finish, hasn't timeout")
        return True
    elif function_process.is_alive():
        function_process.kill()
        print("function did notfinish, timeout occured")
        return False
