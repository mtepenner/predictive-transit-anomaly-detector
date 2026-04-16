import subprocess, sys, os

os.chdir(os.path.dirname(os.path.abspath(__file__)))

payload = '{"station_id":"STATION_42","hour_of_day":8,"temp":72,"prev_delay":10,"coordinates":[-122.4,37.8]}'
r = subprocess.run([sys.executable, "predict.py", payload], capture_output=True, text=True)
print("STDOUT:", r.stdout.strip())
if r.stderr:
    # filter out DeprecationWarnings
    errs = [l for l in r.stderr.splitlines() if "DeprecationWarning" not in l and "Pyarrow" not in l and "pandas" not in l and not l.strip().startswith("but was") and not l.strip().startswith("please") and not l.strip().startswith("import")]
    if errs:
        print("STDERR:", "\n".join(errs))
assert '"predicted_delay_mins"' in r.stdout, "Prediction key missing from output"
print("TEST PASSED: predict.py returned a valid prediction.")
