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

CURRENT_DATE = datetime.date.today()

from datetime import datetime

def save_notices(notices):
    session = SessionFactory()
    
    try:
        for item in notices: # notices는 name url detail로 구성
            # 2. 중복 체크 (URL 기준)
            exists = session.query(Activity).filter(Activity.url == item['url']).first()
            
            if not exists:
                new_row = Activity(**item) 
                """
                **item 통해 
                new_row = Activity(
                name=item['name'],
                url=item['url'],
                detail=item['detail']
                ) 와 같은 형식으로 자동으로 맵핑되어 INSERT 쿼리를 생성함.
                """
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


def crawl_skku_notice():
    base_url = "https://www.skku.edu/skku/campus/skk_comm/notice01.do"
    article_offset = 0
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    escape = False

    results = []

    while True:
        page_url = f"{base_url}?mode=list&&articleLimit=10&article.offset={article_offset}"
        response = requests.get(page_url, headers=headers)
    
        print("status code:", response.status_code)

        if response.status_code != 200:
            print("페이지를 불러오는데 실패했습니다.")
            return

        soup = BeautifulSoup(response.text, "html.parser")
    
        # 공지사항 리스트 행 찾기
        notice = soup.select("dl.board-list-content-wrap")

        for row in notice:
            title_element = row.select_one("dt.board-list-content-title a")
            info_element = row.select_one("dd.board-list-content-info ul")

            if not title_element or not info_element:
                continue

            # 제목과 상세 페이지 URL 추출
            title = title_element.get_text(strip=True) # 글의 제목 가져오기
            print("log:", title)
            link = base_url + title_element['href'] # 글의 url 가져오기

            # 상세 페이지 접속해서 내용(detail) 가져오기
            detail_response = requests.get(link, headers=headers)
            detail_soup = BeautifulSoup(detail_response.text, "html.parser")
        
            # 본문 영역 선택
            content_area = detail_soup.select_one(".pre")
            detail_text = content_area.get_text(strip=True) if content_area else "내용 없음"

            # 날짜 선택
            try :
                date = info_element.get_text(strip=True).split("-") # 날짜 가져오기

                year = int(date[0][-4::])
                month = int(date[1])
                day = int(date[2][0:2]) # 거기서 숫자 강제로 추출 ,,

            
            except:
                print(f"다음 부분에서 에러 발생: {info_element.get_text(strip=True)}")
                continue # 날짜에서 에러나는 예외적인 상황은 그냥 db에서 빼버리기

            written_date = f"{year}-{month}-{day}"
            written_date = datetime.strptime(written_date, "%Y-%m-%d").date()

            if written_date < CURRENT_DATE-relativedelta(months=4):
                escape = True
                break # 너무 오래된 글은 이제 그냥 멈추기
            
            results.append({
                "name": title,
                "url": link,
                "detail": detail_text[:200] + "...", # DB 용량 고려 일부만 저장
                "written_date": written_date
            })
            

        article_offset += 10
        
        if escape==True:
            break

    return results

if __name__ == "__main__":
    notices = crawl_skku_notice()

    save_notices(notices)
    
    print("notices의 길이 ", len(notices))
    print("데이터베이스 업데이트가 완료되었습니다.")