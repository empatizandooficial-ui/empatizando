import os
import math

def chunk_file(filepath, prefix, chunk_size=2000):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return 0
    
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
        
    num_chunks = math.ceil(len(lines) / chunk_size)
    print(f"Splitting {filepath} ({len(lines)} lines) into {num_chunks} chunks...")
    
    for i in range(num_chunks):
        chunk_lines = lines[i*chunk_size : (i+1)*chunk_size]
        chunk_filename = f"C:\\Users\\andra\\.gemini\\antigravity\\scratch\\{prefix}_chunk_{i+1}.txt"
        with open(chunk_filename, 'w', encoding='utf-8') as out:
            out.writelines(chunk_lines)
        print(f"Created {chunk_filename}")
        
    return num_chunks

if __name__ == "__main__":
    file1 = r"C:\Users\andra\.gemini\antigravity\scratch\O_Manuscrito_Final_Sirius.md"
    file2 = r"C:\Users\andra\.gemini\antigravity\scratch\backup_general\GastroSync\user_history_utf8.txt"
    
    c1 = chunk_file(file1, "Aero")
    c2 = chunk_file(file2, "General")
    
    print(f"Total chunks: Aero={c1}, General={c2}")
