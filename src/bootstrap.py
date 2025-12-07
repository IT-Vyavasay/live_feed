import os
import sys

# Absolute path to the project root (LIVE_FEED/src)
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))

if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

# OPTIONAL: ensure parent folder (LIVE_FEED) is visible
PARENT_ROOT = os.path.abspath(os.path.join(PROJECT_ROOT, ".."))
if PARENT_ROOT not in sys.path:
    sys.path.insert(0, PARENT_ROOT)

def debug_paths():
    print("BOOTSTRAP SYSTEM PATH:")
    for p in sys.path:
        print(" -", p)
