import pandas as pd;
import numpy as np;
import os;
import sys;
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
from database.connection import SessionFactory  # 이미 만들어둔 설정 재사용
from database.orm import Activity

current_dir = os.path.dirname(os.path.abspath(__file__))

def toSQL1():
    session = SessionFactory()
    csv_path = os.path.join(current_dir, '..', 'data', 'certification1.csv')

    try:
        df = pd.read_csv(csv_path)
        print("CSV 로드 성공!")
        print(df.head())

        certifications = df['종목명']
        source = []
        seen_names = set()
        for i in range(len(certifications)):
            if len(certifications[i].split("_")) > 1:
                certifications[i] = certifications[i].split("_")[0] + " " + certifications[i].split("_")[1]
            if certifications[i] not in seen_names:
                source.append({"name": certifications[i], "category": "certification", "persistence":"long"})
                seen_names.add(certifications[i])
                print("log:", source)
        
        for item in source:
            exists = session.query(Activity).filter(Activity.name == item['name']).first()
                
            if not exists:
                new_row = Activity(**item) 
                session.add(new_row)
                print(f"신규 추가: {item['name']}")
            else:
                print(f"중복 패스: {item['name']}")

        session.commit()
        
    except Exception as e:
        print(f"에러 발생: {e}")
        session.rollback()

    finally:
        session.close()

def toSQL2():
    session = SessionFactory()
    csv_path = os.path.join(current_dir, '..', 'data', 'certification2.csv')

    try:
        df = pd.read_csv(csv_path, encoding='cp949')
        print("CSV 로드 성공!")
        print(df.head())

        certifications = df[['자격종목', '등급']]
        source = []
        seen_names = set()
        for i in range(len(certifications)):
            name = certifications['자격종목'][i]
            for j in certifications['등급'][i].split(", "):
                if j == "등급없음" or j == "단일등급":
                    if name not in seen_names:
                        source.append({"name": name, "category": "certification", "persistence":"long"})
                        seen_names.add(name)
                        print("log:", source)
                        
                else:
                    new_name = name + " " + j
                    if new_name not in seen_names:
                        source.append({"name": new_name, "category": "certification", "persistence":"long"})
                        seen_names.add(new_name)
                        print("log:", source)

        for item in source:
            exists = session.query(Activity).filter(Activity.name == item['name']).first()
                
            if not exists:
                new_row = Activity(**item) 
                session.add(new_row)
                print(f"신규 추가: {item['name']}")
            else:
                print(f"중복 패스: {item['name']}")

        session.commit()
        
    except Exception as e:
        print(f"에러 발생: {e}")
        session.rollback()

    finally:
        session.close()

if __name__ == "__main__":
    toSQL1()
    toSQL2()
    
    print("데이터베이스 업데이트가 완료되었습니다.")