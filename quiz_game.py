import csv
import random
import os

def load_questions(filename):
    questions = []
    if not os.path.exists(filename):
        print(f"\n❌ 錯誤：找不到檔案")
        print(f"程式嘗試讀取的路徑是：{filename}")
        
        directory = os.path.dirname(os.path.abspath(filename))
        if os.path.exists(directory):
            print(f"資料夾 '{directory}' 裡面的檔案有：")
            try:
                files = os.listdir(directory)
                target_name = os.path.basename(filename)
                for f in files:
                    print(f"  - {f}")
                    if f == target_name + ".txt":
                        print(f"    ⚠️  注意：您的檔案變成了 '{f}' (多了 .txt)，請重新命名移除 .txt")
                    if f == target_name + ".csv":
                        print(f"    ⚠️  注意：您的檔案變成了 '{f}' (多了 .csv)，請重新命名")
            except Exception as e:
                print(f"  (無法列出檔案: {e})")
        else:
            print(f"❌ 資料夾不存在：{directory}")
            
        print("\n請確認：")
        print("1. CSV 檔案是否放在同一個資料夾？")
        print("2. 檔名是否正確？")
        print("3. 如果您看到檔案後面有 .txt，請將其移除。")
        return []
    
    try:
        # 嘗試多種編碼 (utf-8-sig 為通用，cp950 為 Windows Excel 預設)
        encodings = ['utf-8-sig', 'cp950', 'utf-8']
        for encoding in encodings:
            try:
                with open(filename, 'r', encoding=encoding) as f:
                    reader = csv.DictReader(f)
                    questions = [row for row in reader if '題目' in row and '答案' in row]
                if questions: break # 成功讀取就跳出
            except: continue
    except Exception as e:
        print(f"讀取檔案時發生錯誤: {e}")
        return []
        
    return questions

def play_quiz(filename, topic_name):
    questions = load_questions(filename)
    if not questions:
        print("沒有題目可以顯示。")
        return

    random.shuffle(questions)
    score = 0
    total = len(questions)
    
    print(f"\n=== 開始 {topic_name} ===")
    
    for i, q in enumerate(questions, 1):
        print(f"\n第 {i} 題: {q['題目']}")
        
        while True:
            user_input = input("請輸入答案 或輸入 H 取得提示: ").strip()
            
            if user_input.upper() == 'H':
                print(f"💡 提示: {q['提示']}")
                continue
            
            if user_input == q['答案']:
                print(f"✅ {q['答對回饋']}")
                score += 1
            else:
                print(f"❌ {q['答錯回饋']}")
            break
                
    print(f"\n測驗結束！ 你的得分: {score}/{total}")

def main():
    # 設定檔案路徑
    base_dir = os.path.dirname(os.path.abspath(__file__))
    print(f"程式執行位置: {base_dir}")
    quizzes = {
        "1": ("首都測驗", "capital_questions.csv"),
        "2": ("F1 賽車測驗", "F1questions.csv"),
        "3": ("數學測驗", "math_questions.csv")
    }
    
    while True:
        print("\n請選擇測驗主題:")
        for key, (name, _) in quizzes.items():
            print(f"{key}. {name}")
        print("Q. 離開")
        
        choice = input("請輸入選項: ").strip().upper()
        
        if choice == 'Q':
            print("再見！")
            break
            
        if choice in quizzes:
            name, filename = quizzes[choice]
            
            # 嘗試兩種路徑：1. 跟程式同一層資料夾 2. 當前執行目錄
            full_path = os.path.join(base_dir, filename)
            if not os.path.exists(full_path):
                if os.path.exists(filename):
                    full_path = filename
            
            play_quiz(full_path, name)
        else:
            print("無效的選項，請重試。")

if __name__ == "__main__":
    main()