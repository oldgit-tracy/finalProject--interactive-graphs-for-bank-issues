import sys

for line in sys.stdin:
        print(line.strip().replace('\0', ''))