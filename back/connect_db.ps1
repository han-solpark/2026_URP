# connect_db.ps1
$HostName = "interchange.proxy.rlwy.net"
$Port = "44980"
$User = "root"
$Database = "railway"

Write-Host "Connecting to Railway MySQL..." -ForegroundColor Cyan
# -p 뒤에 비밀번호를 직접 적으면 보안상 안 좋으니 실행 후 입력하게 구성했습니다.
mysql -h $HostName -P $Port -u $User -p $Database