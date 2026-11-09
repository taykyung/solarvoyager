# Solar Voyager Fortune PWA

태양계에서 출발해 뭉치(우주복 비숑)·치노와 함께 별자리를 3D로 항해하는 웹 앱이에요. 홈 화면에 설치할 수 있어요.

## 파일 구성
- `index.html`: 앱 본체 (3D 화면, 항해, 우주복 뭉치·치노, 행운·도전 메시지, 배경음악)
- `manifest.webmanifest`: 앱 이름, 아이콘, 전체 화면 설정
- `sw.js`: 서비스 워커. 한 번 접속하면 오프라인에서도 실행돼요.
- `icons/`: 앱 아이콘 (우주복 뭉치: 192, 512, 마스커블 512, iOS용 180, 파비콘 32)

## 배포 방법
PWA는 **HTTPS 주소**에서만 설치돼요. 파일을 더블클릭해 여는 방식(file://)으로는 설치가 안 돼요.

- **GitHub Pages:** 저장소에 폴더 내용을 그대로 올리고 Settings → Pages에서 켜기
- **Netlify / Vercel:** 폴더를 드래그해서 배포
- **내 컴퓨터에서 테스트:** 폴더 안에서 `npx serve` 또는 `python3 -m http.server 8080` 실행 후 http://localhost:8080 접속 (localhost는 HTTPS 없이도 테스트 가능)

## 설치
- **안드로이드 / PC 크롬:** 주소창의 설치 아이콘 또는 메뉴 → "앱 설치"
- **아이폰 / 아이패드 사파리:** 공유 버튼 → "홈 화면에 추가"

## 참고
- 3D 엔진(Three.js)은 CDN에서 불러와요. 첫 실행은 인터넷이 필요하고, 그 뒤로는 저장된 파일로 오프라인 실행돼요.
- 앱을 고친 뒤 다시 배포할 때는 `sw.js`의 `CACHE` 이름(지금 `solar-voyager-v22` → 다음엔 `v23`)을 바꿔야 사용자 기기에 새 버전이 적용돼요.

## 데이터 출처
- 별 데이터: HYG Database v4.4 (astronexus.com), CC BY-SA 4.0
- 별자리 선: Stellarium, modern 하늘 문화 (`skycultures/modern/index.json`)
