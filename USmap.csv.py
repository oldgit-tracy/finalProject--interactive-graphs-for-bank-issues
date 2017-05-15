import sys

for line in sys.stdin:
        print(line.strip().replace('\0', ''))


# in terminal do this: 
        # cat CAmap.csv | python a.py > CAmapnew.csv