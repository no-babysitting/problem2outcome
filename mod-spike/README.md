# Spike mod cho Claude Desktop

Mục tiêu: biết một mod làm được và không làm được gì **trước khi** viết PRD hay design system cho mod. Phạm vi là PDD mục 13 cộng các hàng C8–C11, C14, C15, C18.

Mod là một thư mục: `nb-spike/`. Nó gộp bốn phép thử, mỗi phép thử một file trong `nb-spike/hooks/`:

| Phép thử | PDD | File | Câu hỏi cần trả lời |
| --- | --- | --- | --- |
| 1. Cắt dòng `<nb>` | C9 | `probe-strip.tsx` | Dòng `<nb>…</nb>` Claude viết kèm có biến mất khỏi câu trả lời mà không lộ thẻ dở lúc đang stream không? |
| 2. Hoạt ảnh và nền | C11 | `probe-anim.tsx`, `mascot.tsx`, `scene.ts` | Mascot (Client) và nền SVG chạy mượt không? Nhịp đo được là bao nhiêu khung mỗi giây? |
| 3. Giữ tool call để hỏi | C8 | `probe-hold.ts` | Hộp hỏi "thế nào là xong" có hiện đúng chỗ, và có chồng lên hộp xin quyền không? |
| 4. Lưu câu đã dịch | C10 | `probe-store.ts` | Bản dịch có còn sau khi tắt hẳn Desktop mở lại không? |

Kèm theo: C14 (`/mascot`), C15 (dòng token và hạn mức, `/spike-usage`), C18 (`/grill-me`, `/challenge-me`, `/teach-me`).

## Cài

Cần Claude Desktop từ v2.1.286 trở lên (bản Claude Code 2.1.287 trở lên cho terminal). Mod không có sandbox: nó chạy với quyền của bạn, nên chỉ nạp mod bạn đã đọc. Mod này không gọi mạng, chỉ gọi `$.model.complete` một lần khi bạn chạy `/spike-lang` với ngôn ngữ mới.

1. Lấy nhánh này về máy: `git clone https://github.com/no-babysitting/problem2outcome` rồi `git checkout claude/mod-spike-desktop`.
2. Cho Desktop nạp mod. Thêm vào `~/.claude/settings.json` (đổi đường dẫn cho đúng):

   ```json
   { "env": { "CLAUDE_CODE_PLUGIN_DIRS": "/duong/dan/toi/problem2outcome/mod-spike/nb-spike" } }
   ```

   Hoặc, để thử trong terminal: `claude --plugin-dir /duong/dan/toi/problem2outcome/mod-spike/nb-spike`.
3. Mở một phiên **mới** trong tab Code của Desktop, trong một thư mục thử (không phải thư mục việc thật).
4. Chạy `/spike-report`. Nếu thấy bản `nb-spike report · Claude Code …` là mod đã nạp. Nếu không thấy lệnh nào bắt đầu bằng `spike`, mod chưa nạp: báo lại cho Claude kèm bản Desktop (Settings, About).

Gỡ: xoá dòng `env` hoặc bỏ `--plugin-dir`.

## Thử từng điểm

Sau mỗi điểm, chạy `/spike-report` và dán kết quả vào thread, kèm vài chữ về điều bạn **thấy** (mô tả hoặc ảnh chụp màn hình).

### 1. Cắt dòng `<nb>` (C9)

1. Gõ một yêu cầu nhỏ, ví dụ: `Giúp mình lập danh sách 5 việc cần chuẩn bị cho buổi chụp ảnh sản phẩm ngày mai.` Mod gắn một khối ngữ cảnh ẩn nhờ Claude viết thêm một dòng `<nb>…</nb>` ở cuối.
2. Nhìn câu trả lời lúc nó đang hiện dần. Có lúc nào bạn thấy `<`, `<nb` hay `<nb>` chớp lên cuối đoạn không?
3. Hết lượt, dòng `<nb>` có biến mất khỏi câu trả lời, và có hiện ở dải mascot trên ô nhập không?
4. Gửi 3 yêu cầu khác nhau, đếm xem Claude viết `<nb>` mấy lần trên 3 (Claude có thể quên, đó cũng là kết quả).
5. Mở lịch sử đầy đủ (ctrl+O hoặc tương đương): dòng `<nb>` còn trong bản lưu không? (Dự kiến: còn, vì mod chỉ đổi hình vẽ.)

Tắt phép thử: `/spike-strip off`.

### 2. Hoạt ảnh và nền (C11, C14, C15)

1. Mở phiên mới. Có nền chuyển động phía sau chat không (các quả cầu màu trôi chậm)? Chữ vẫn dễ đọc không?
2. Trên ô nhập có dải mascot `(^_^) ....*....` với vệt `*` chạy ngang và dòng `Context …% · … fps`. Vệt chạy mượt hay giật? Số fps hiện ra là bao nhiêu?
3. Chạy `/spike-anim 50` rồi `/spike-anim 33`: mục tiêu 20 và 30 khung mỗi giây. Số fps đo được có vượt 10 không? (Tài liệu nói trần là 10 lần vẽ mỗi giây trên Desktop.)
4. Làm vài lượt dài (dán một văn bản dài) để context tăng: màu nền và mặt mascot có đổi theo (xanh, hổ phách, đỏ) không? Nền có giật khi đổi không?
5. Thử `/mascot quiet`, `/mascot normal`, `/mascot chatty` và `/spike-usage off|numbers|bar`: dải đổi ngay không, có cần mở phiên mới không?

### 3. Giữ tool call để hỏi (C8)

1. Trong thư mục thử, gõ: `Tạo file ghichu.md với một dòng chữ bất kỳ.`
2. Trước khi file được ghi, một hộp hỏi "Thế nào là xong với việc này?" phải hiện. Hộp xin quyền ghi file của Claude Code hiện **trước** hay **sau** hộp này, hay chồng lên nhau? Bạn bấm được cả hai không?
3. Chọn "Chưa, để tôi nói": Claude có hỏi lại bạn bằng một câu ngắn không, và file có chưa bị ghi không?
4. Chạy `/spike-hold reset` rồi thử lại với "Đã có tiêu chí, cứ làm": hộp xin quyền vẫn hiện sau đó (mod không tự duyệt)?
5. Ghi file lần thứ hai trong cùng phiên: hộp hỏi không hiện nữa (mod chỉ hỏi một lần).

### 4. Lưu câu đã dịch (C10)

1. Chạy `/spike-lang vi`. Mod gọi model dịch 5 câu một lần và lưu lại, báo số token đã tốn.
2. Chạy `/spike-lang en` rồi `/spike-lang vi`: lần này phải báo "lấy từ kho, 0 token".
3. Tắt **hẳn** Desktop, mở lại, vào phiên mới, chạy `/spike-lang vi`: vẫn phải báo "lấy từ kho".
4. Đặt `/mascot chatty`: câu viết sẵn ở dải mascot đã là tiếng Việt chưa?

### C18: lệnh tắt

Gõ `/teach-me prompt caching` (có chủ đề): ô nhập được điền cả câu lẫn chủ đề, bạn xem lại rồi bấm Enter. Gõ `/grill-me` không kèm gì: câu điền sẵn kết thúc bằng `Topic: `, bạn gõ chủ đề vào đó. `/challenge-me` kết thúc bằng `Plan: `.

## Báo lại cho Claude

Cho mỗi điểm: chạy được hay không, một câu mô tả điều bạn thấy, kèm khối `/spike-report`. Nhớ ghi bản Desktop. Điều bạn thấy quan trọng hơn nhật ký: mod không biết được màn hình trông ra sao.

## Kết quả thử lần 1 trên Desktop (20/11, Claude Code 2.1.326, Windows 11)

| Điểm | Kết quả | Ghi chú |
| --- | --- | --- |
| Nạp mod | Đạt | Qua `CLAUDE_CODE_PLUGIN_DIRS` |
| C9 cắt `<nb>` | Một nửa | Claude có viết dòng `<nb>`; chưa xác nhận dòng bị cắt và sang mascot |
| C11 Client | Đạt | 10,1 khung/giây ở tick 100 ms; chưa thử 50 và 33 ms |
| C11 nền | Có vẻ đạt | `isDrawn=false` lúc mở phiên vì Desktop chưa gắn vào; nền vẽ sau đó |
| C8 giữ tool call | Chưa thử | |
| C10 lưu bản dịch | Chưa thử | |
| C14 `/mascot` | Đạt | Đổi ngay, không tốn lượt Claude |
| C15 token, hạn mức | Đạt | `Context 8% · five_hour 37% used` |
| C18 lệnh tắt | Lỗi, đã sửa | Câu điền sẵn không có chủ đề; nay nhận `[chủ đề]` và chừa chỗ `Topic:` |

Sửa sau lần 1:
- Mỗi lệnh có hook riêng với matcher `{ command }`. Trước đó một hook không matcher làm lệnh của mod khác hiện nhãn `nb-spike+…`.
- `/mascot` và `/spike-usage` lưu vào `$.store`, nên nhớ qua phiên (`$.state` chỉ sống trong một phiên).
- Khối ngữ cảnh ẩn cho phép Claude bỏ dòng `<nb>` khi không có gì đúng và có ích để nói.

Bài học từ mod `matrix-rain` (thử cùng đợt): hoạt ảnh liên tục nên là SVG có CSS keyframes, chỉ vẽ lại khi trạng thái đổi; vẽ lại theo nhịp bị trần khoảng 10 lần mỗi giây trên Desktop.

## Điều đã học khi dựng (chưa cần Desktop)

- `ui.render` là hàm thuần: engine **từ chối** `state.set` trong lúc vẽ. Vì vậy C9 tách đôi: hook vẽ chỉ cắt chữ, còn việc đưa dòng `<nb>` sang mascot làm ở `turn.complete` (sự kiện này có `answer`, câu trả lời cuối). Hệ quả: mascot cập nhật **sau khi hết lượt**, không phải lúc đang stream.
- `$.ui.ask` đi qua một `tool.call` của `AskUserQuestion`. Hook `tool.call` của mod nghe được nó (và phải bỏ qua), nên mod khác cũng thấy hộp hỏi của ta.
- Bộ kiểm tra của engine đọc mã tĩnh: `read`/`update` chỉ nhận atom khai báo ngay trong file dùng nó, hàm nhận `$` phải là `function` khai báo, và mỗi sự kiện chỉ một hook khi không có matcher.
- Kiểm tra bằng máy: `claude plugin validate nb-spike` và `claude plugin test nb-spike` (9 test) (12 test) đều qua. Không có test nào vẽ thật: phần nhìn bằng mắt là việc của bạn trên Desktop.
