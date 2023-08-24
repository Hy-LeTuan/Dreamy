with open("test.txt", "r", encoding="utf-8") as f:
    for line in f:
        line = line.strip()
        if line:
            print(line)
        else:
            continue
