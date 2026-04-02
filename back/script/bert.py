from sentence_transformers import SentenceTransformer
import os;
import sys;
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
from database.connection import SessionFactory  # 이미 만들어둔 설정 재사용
from database.orm import Activity              # ORM 모델

def embedding():
    session = SessionFactory()
    model = SentenceTransformer(
        "snunlp/KR-SBERT-V40K-klueNLI-augSTS"
    )
    
    try:
        rows = session.query(Activity).all()
    
        for row in rows:
            name = row.name
            detail = row.detail

            embedded = model.encode(
                f"title: {name} \n detail: {detail}",  # 임베딩할 대상
                convert_to_tensor=True,       # PyTorch Tensor
                normalize_embeddings=True # 정규화
            )
            
            row.embedded = embedded.tolist()
            print(embedded.tolist())
            
        # 3. 변경 사항 일괄 반영
        session.commit()
        
    except Exception as e:
        print(f"에러 발생: {e}")
        session.rollback()

    finally:
        session.close()

if __name__ == "__main__":
    embedding()
    
    print("데이터베이스 업데이트가 완료되었습니다.")