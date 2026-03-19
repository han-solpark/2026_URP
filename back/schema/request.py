from pydantic import BaseModel
from typing import Optional

class ResultReportRequest(BaseModel): # 심리검사 결과 레포트 요청 스키마
    # 심리검사 이용 가이드라인 pdf 따라 만들었습니다
    apikey: Optional[str] = ""
    qestrnSeq: Optional[str] = ""
    trgetSe: Optional[str] = ""        
    gender: str          
    school: Optional[str] = ""
    grade: str           
    startDtm: int = "" 
    answers: str         