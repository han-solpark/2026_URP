import requests
from bs4 import BeautifulSoup
import datetime
from dateutil.relativedelta import relativedelta

import sys
import os
import time

# 부모 디렉토리를 path에 추가
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))

from database.connection import SessionFactory  # 이미 만들어둔 설정 재사용
from database.orm import Activity              # ORM 모델

def save_labs(labs):
    session = SessionFactory()
    
    try:
        for item in labs: # labs는 name url detail로 구성
            # 2. 중복 체크 (URL 기준)
            exists = session.query(Activity).filter(Activity.name == item['name']).first()
            
            if not exists:
                new_row = Activity(**item) 
                session.add(new_row)
                print(f"신규 추가: {item['name']}")
            else:
                # 이미 존재하면 루프를 중단하거나 건너뜀
                print(f"중복 패스: {item['name']}")
        
        session.commit()
        
    except Exception as e:
        print(f"에러 발생: {e}")
        session.rollback()

    finally:
        session.close()

def crawl_skku_lab():
    results = []
    base_url = "https://gradschool.skku.edu/grad/prepare/laboratory_01.htm?college_id=COL"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    seen_names = set()
    for i in range(1, 14):
        response = requests.get(f"{base_url}{i:03d}", headers=headers)
        response.encoding = response.apparent_encoding
        print(f"{base_url}{i:03d}")
        print("status code:", response.status_code)

        if response.status_code != 200:
            print("페이지를 불러오는데 실패했습니다.")
            return

        soup = BeautifulSoup(response.text, "html.parser")
        rows = soup.select(".table_1 table tr")

        for row in rows:
            cols = row.find_all('td')
            # 데이터가 있는 행인지 확인 (헤더 등 제외)
            if len(cols) >= 5:
                dep = cols[0].get_text(strip=True)  # 학과
                field = cols[1].get_text(strip=True)       # 분야
                lab = cols[2].get_text(strip=True)    # Lab실
                prof = cols[3].get_text(strip=True)   # 대표교수
                
                link_tag = cols[7].find('a')
                url = link_tag['href'].strip() if link_tag else None

                if len(lab)<2 or lab is None or prof is None or len(prof)<2:
                    continue # 교수 이름이나 연구실 이름 없으면 제외 

                print(f"{lab}: {url}")

                if prof + " 교수님 - " + lab not in seen_names:
                    results.append({
                        "name": prof + " 교수님 - " + lab,
                        "url": url,
                        "detail": dep + ", " + field, # DB 용량 고려 일부만 저장
                        "category": "lab",
                        "persistence":"long"
                    })
                    seen_names.add(prof + " 교수님 - " + lab)
  
    return results



if __name__ == "__main__":
    save_labs(crawl_skku_lab())
    
    print("데이터베이스 업데이트가 완료되었습니다.")
