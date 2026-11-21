# PDD problem2outcome

> Bản xuất từ PDD (Claude Doc) ngày 21/11/2026. PDD là nguồn chính; sửa ở đó rồi xuất lại file này. Viết bằng tiếng Việt.

## Cách dùng tài liệu này

PDD là **source of truth** cho toàn bộ problem2outcome, gồm workspace và mod. Thesis v4 trả lời *vì sao*. PDD trả lời *sản phẩm là gì và vận hành ra sao*. `AGENTS.md`, `CLAUDE.md` và code của mod là phần hiện thực hoá. Khi chúng khác PDD, PDD thắng. Khi PDD sai, sửa PDD trước rồi mới sửa phần hiện thực hoá.

Tài liệu theo khung **MDA** (Hunicke, LeBlanc và Zubek, 2004). Người dùng cảm nhận theo chiều A → D → M, còn người thiết kế đi theo chiều ngược lại, bắt đầu từ trải nghiệm muốn tạo ra.

- **Aesthetics (A):** điều người dùng *cảm thấy* khi dùng.
- **Dynamics (D):** hành vi xuất hiện khi luật gặp người dùng thật, theo thời gian.
- **Mechanics (C, cơ chế):** luật, file và hook cụ thể mà ta viết ra.

**Quy tắc truy vết:** mỗi cơ chế ghi rõ dynamic và aesthetic mà nó phục vụ, ví dụ C3 → D2 → A2. Cơ chế nào không truy được lên một aesthetic thì bỏ. Đây cũng là cách thực thi nguyên tắc token.

**Trạng thái:** mục ghi *Đã chốt* lấy từ thesis v4 và các quyết định về mod. Mục ghi *Nháp* đang chờ grill. **Nơi lưu:** Claude Doc trong giai đoạn thiết kế, rồi commit vào repo thành `DESIGN.md` mỗi khi chốt một mốc.

## 1. Vision và design pillars

*Đã chốt.*

> **problem2outcome giúp knowledge worker, kể cả người không kỹ thuật, làm việc với agent đúng theo cách vận hành của harness mà nhà cung cấp dựng sẵn (provider-native) trên Claude Code hoặc Codex, và tự đưa ra bốn quyết định mà agent không nên quyết thay họ.**

Năm trụ cột dưới đây là bộ lọc cho mọi tính năng. Một tính năng mâu thuẫn với trụ cột sẽ bị bỏ, trừ khi ta sửa chính trụ cột đó trong PDD.

| Trụ cột | Ý nghĩa | Hệ quả thiết kế |
| --- | --- | --- |
| **P1. Con người quyết, agent làm** | Bốn quyết định luôn thuộc về người dùng | Agent và mod không bao giờ tự chấp nhận kết quả hay tự duyệt tool call thay người dùng |
| **P2. Native với harness, mỏng dần** | Dùng tính năng có sẵn của nhà cung cấp, không làm lại | Không viết cứng mẹo nền tảng; mỗi bản lớn, xoá chỉ dẫn mà agent đã tự làm tốt |
| **P3. Token trả lại giá trị** | Người dùng trả token, nên mọi bước tốn token phải có ích cho họ | Ưu tiên cơ chế 0 token; không có bước nào chỉ để thu dữ liệu |
| **P4. Không cứng** | Model của người dùng tự điều chỉnh theo từng người | Không template hay ví dụ theo nghề, không kịch bản onboarding, chỉ có hướng dẫn tổng quan |
| **P5. Mở và thuộc về người dùng** | Mã nguồn mở, không kinh doanh | Mọi trạng thái của phương pháp nằm trong file của workspace (`me.md`, `tasks/`); không gửi dữ liệu cho người bảo trì. README nói rõ app agent có bản ghi riêng ngoài thư mục (lịch sử phiên, bộ nhớ tự động) và link tới trang chính thức |

## 2. Người chơi

*Đã chốt.* Nhóm đầu tiên là bạn bè của người bảo trì, phần lớn không kỹ thuật nhưng làm công việc tri thức và được dẫn sang dùng Claude Code hoặc Codex: sinh viên, lập trình viên, digital marketer, giám đốc chiến lược và marketing, BA, PM, giáo viên, chủ studio chụp ảnh, kiến trúc sư, nhà thiết kế nội thất, researcher, nhà khởi nghiệp.

| Điều về người chơi | Hệ quả cho thiết kế |
| --- | --- |
| Họ thử vì muốn một kết quả thật, không phải để học | Buổi đầu phải ra kết quả; năng lực được xây qua kết quả đó, không qua bài giảng |
| Nghề rất khác nhau | Phương pháp xoay quanh việc con người cần quyết gì, không xoay quanh loại deliverable |
| Rào cản đầu tiên là chính Claude Code hoặc Codex | Onboarding phải giúp vượt qua cả harness, vì site giáo dục độc lập với sản phẩm này |
| Họ trả token bằng gói của chính mình | Mọi bước tốn token phải có ích cho họ (P3) |

## 3. Aesthetics mục tiêu

*Nháp, đang grill.* Năm aesthetic dưới đây được rút từ thesis v4 và tầm nhìn về mod. Thứ tự ưu tiên (người bảo trì, 20/11/2026): A1 Làm chủ và A5 Cá tính đứng đầu; A2, A3, A4 xếp sau. Khi A1 và A5 va nhau, A1 thắng: cá tính là cách truyền tải việc làm chủ, nên mascot im lặng hoặc lùi lại khi người dùng đang quyết. Vì A5 đứng trên A4, juice được coi trọng hơn hiệu quả thuần tuý, nhưng vẫn phải ưu tiên cơ chế 0 token để không phạm P3.

| Mã | Aesthetic | Người dùng nói | Nguồn |
| --- | --- | --- | --- |
| A1 | Làm chủ | "Mình là người quyết, không phải AI." | Bốn quyết định, P1 |
| A2 | Tiến bộ | "Mình giỏi lên qua từng việc." | Fading, năng lực người dùng |
| A3 | Đồng hành, không trông trẻ | "Có ai đó bên cạnh, nhưng không ai cầm tay mình." | Tên No Babysitting, mascot |
| A4 | Đáng công | "Thời gian và token bỏ ra là xứng đáng." | P3 |
| A5 | Cá tính | "Làm việc với cái này vui và có hồn." | Mọi bề mặt: giọng trong AGENTS.md, mascot trong mod |

**Trải nghiệm phải tránh** (anti-aesthetics):

- Bị giảng bài hay bị kiểm tra.
- Bị hỏi dồn trước khi thấy được kết quả nào.
- Bị chấm điểm hay phán xét.
- Thấy nghi thức rườm rà, nhất là với việc nhỏ.
- Bị làm phiền hay bị chen ngang, kiểu Clippy.
- Bị khen rỗng.

**Dẫn chứng cho việc đặt A1 lên đầu** (tra 20/11/2026):

- Khảo sát 319 knowledge worker: càng tin AI thì càng ít tư duy phản biện, càng tự tin vào bản thân thì càng tư duy nhiều hơn. Tư duy chuyển sang kiểm chứng, tích hợp và "quản gia" công việc ([Lee và cộng sự, CHI 2025](https://consensus.app/papers/details/w:162fef2e-deec-4ea1-a502-c3474d16fce2/?utm_source=claude_desktop)). Bốn quyết định chính là những việc "quản gia" đó.
- Giao việc suy nghĩ cho AI theo kiểu phụ thuộc làm giảm động lực nội tại, còn dùng AI làm giàn giáo trong khi vẫn giữ quyền tự chủ thì ngược lại. Hai kiểu cho lợi ích tức thì như nhau, nên người dùng khó tự nhận ra mình đang phụ thuộc ([Zhu và cộng sự, 2026](https://consensus.app/papers/details/w:b7629dc3-4f13-43af-a025-88bcf034c246/?utm_source=claude_desktop)). Nghiên cứu này dùng chính khung Self-Determination Theory, khớp với A1 và A2.
- Dùng AI có cấu trúc làm giảm việc giao khoán tư duy và cải thiện lập luận, còn dùng không có hướng dẫn thì không ([Gerlich, 2025](https://consensus.app/papers/details/w:63f899c9-29dc-4c9c-9704-4174c40f8a73/?utm_source=claude_desktop)). Đây là bằng chứng gián tiếp cho core loop.

## 4. Core loop: bốn quyết định

*Đã chốt.* Mỗi việc dừng ở bốn điểm mà chỉ con người nên quyết. Gợi ý năng lực AI và phản tư chỉ xuất hiện tại các điểm này, không thành bước riêng.

*(Sơ đồ: core loop gồm 4 quyết định của người dùng, với 1 vòng làm lại từ quyết định 4.)*

Vòng lặp tạo ra hai dynamic chính:

- **D1. Vòng bốn quyết định:** người dùng quen tự hỏi bốn câu trước và sau mỗi việc giao cho agent.
- **D2. Nhịp chấp nhận hay làm lại:** kết quả được đối chiếu với tiêu chí mà chính người dùng đã viết, không phải với cảm giác "trông ổn".

| Quyết định | Agent giúp bằng cách | Tính năng native nên dùng |
| --- | --- | --- |
| 1. Vấn đề thật là gì | Nêu rõ giả định đang ngầm chấp nhận; chỉ hỏi 1–3 câu có thể đổi hướng | Plan mode (Claude Code, Codex) |
| 2. Thế nào là xong | Giúp viết tiêu chí kiểm tra được vào `decisions.md` | `/goal` nhận tiêu chí làm điều kiện (Claude Code) |
| 3. Giao gì, giữ gì | Nói thẳng phần nào AI làm tốt, phần nào người dùng nên giữ; gợi ý năng lực hiện có của nền tảng | Agent tự tra năng lực và tài liệu hiện tại (P2) |
| 4. Chấp nhận hay làm lại | Liệt kê tiêu chí đạt hay chưa đạt, không khen; hỏi một bài học ngắn | Không có: `/goal` chỉ cho biết model thấy đạt, không thay cho việc người dùng chấp nhận |

**Co theo cỡ việc:** việc nhỏ chỉ còn quyết định 2 và 4, mỗi quyết định một dòng. Quy tắc này chống lại trải nghiệm "nghi thức rườm rà".

**Đã chốt (21/11), bỏ pause và nhờ ghi hộ:** bỏ một pause không bỏ thư mục việc; agent vẫn tạo `decisions.md` và ghi `Confirmed: skipped`. Bỏ pause không bao giờ là chấp nhận. Nhưng khi người dùng nói rõ bằng lời "ghi là mình đã chấp nhận", đó là quyết định của họ: agent ghi `Decision: accepted · by: user` kèm trích nguyên văn, và không ghi tiêu chí nào là đạt thay họ (finding F2-01, giữ hành vi này).

**Chế độ người dùng chủ động gọi** (nháp, theo comment của người bảo trì 20/11). Ngoài vòng bốn quyết định, người dùng có thể tự gọi một chế độ khi muốn đi sâu hơn. Agent không bao giờ tự bật chúng (A1).

| Chế độ | Agent làm gì | Gắn với |
| --- | --- | --- |
| grill me | Hỏi từng câu một để làm rõ vấn đề, mỗi câu kèm đề xuất | Quyết định 1 và 2 |
| challenge me | Phản biện quyết định hoặc tiêu chí mà người dùng vừa đưa ra | Quyết định 2, 3, 4 |
| teach me | Không tự giảng: tìm tài liệu chính thức về điều người dùng hỏi, tóm tắt ngắn kèm link (chốt 20/11) | Bất kỳ điểm nào |

Các chế độ được mô tả trong `AGENTS.md` và gọi bằng lời nói tự nhiên, nên chạy được trên Codex và Claude Code Projects (nơi không đọc skill trong repo). Trên Desktop, mod thêm ba skill thật `/grill-me`, `/challenge-me`, `/teach-me` (C18): hỏi theo vòng bằng giao diện chọn của Claude, mỗi câu có lựa chọn và đề xuất.

## 5. Progression: hỗ trợ rút dần

*Đã chốt về nguyên tắc, nháp về chi tiết.* Trong game, đường cong độ khó tăng dần. Ở đây đường cong chạy ngược lại: sự hỗ trợ giảm dần, riêng cho từng quyết định, khi người dùng đã tự làm tốt quyết định đó. Đây là dynamic **D3. Rút dần hỗ trợ**, phục vụ A2 (tiến bộ) và A1 (làm chủ).

| Mức | Agent làm gì ở một quyết định |
| --- | --- |
| Dẫn | Đặt câu hỏi, đề xuất bản nháp để người dùng sửa |
| Phản biện | Người dùng tự viết, agent chỉ bổ sung chỗ thiếu hoặc cảnh báo khi lệch |
| Ghi lại | Người dùng tự quyết, agent chỉ ghi vào `decisions.md` |

- Trạng thái nằm trong một file hồ sơ ngắn trong workspace, ví dụ `me.md`. Agent đề xuất đổi mức, người dùng xác nhận, sửa hoặc xoá được.
- Không có điểm số, không thang năng lực hiển thị cho người dùng. Ba mức trên chỉ là cách agent điều chỉnh, không phải huy hiệu.
- Có thể lùi mức: gặp loại việc mới, hoặc người dùng tự xin hỗ trợ nhiều hơn. Giữ ba mức (người bảo trì, 20/11), và điều chỉnh cách hỗ trợ khi người dùng yêu cầu.

**Đã chốt (20/11, cụ thể hoá 21/11):** agent đề xuất bớt một mức hỗ trợ ở một quyết định khi ba việc gần nhất có quyết định đó đều ghi `Confirmed: yes · by: user` trong `decisions.md`, tức người dùng tự đưa ra quyết định trước khi agent nháp, và agent dẫn ra ba việc đó. Với quyết định 4, chỉ tính những lần người dùng nói tiêu chí nào đạt, tiêu chí nào chưa, hoặc nêu lý do làm lại; một câu "ok" không tính dù lặp bao nhiêu lần. Người dùng xác nhận đề xuất, hoặc tự đổi mức bất cứ lúc nào mà không cần ngưỡng; agent không tự đổi.

**Dẫn chứng về fading** (tra 20/11/2026, từ nghiên cứu học tập):

- *Expertise reversal effect* vững trên 60 thí nghiệm: người mới học tốt hơn khi được hỗ trợ nhiều (d = 0,51), người đã giỏi học tốt hơn khi được hỗ trợ ít (d = −0,43). Hiệu ứng không đối xứng: hỗ trợ người mới quan trọng hơn việc bớt hỗ trợ người giỏi ([Tetzlaff và cộng sự, 2025](https://consensus.app/papers/details/w:7ebc984e-215f-4560-ac7e-b97dad8ce15e/?utm_source=claude_desktop)). Hệ quả: mức mặc định khi bắt đầu nên là Dẫn, và không cần vội rút.
- Khi nhắc nhở (prompt) được giữ nguyên mãi, người học dần dùng chiến lược ít đi và kết quả kém hơn nhóm được rút dần nhắc nhở theo năng lực ([Nückles và cộng sự, 2009](https://consensus.app/papers/details/w:7608e11d-ac71-4def-922a-f32a59acd4bb/?utm_source=claude_desktop)). Đây là lý do D3 tồn tại: nếu bốn điểm dừng không bao giờ mỏng đi, chúng sẽ thành gánh nặng với người đã quen.
- Giới hạn: các nghiên cứu này đo việc học, không đo công việc thật với agent.

## 6. Economy: ngân sách token

*Đã chốt về nguyên tắc.* Token là đồng tiền của sản phẩm, và người dùng là bên trả. Người dùng "mua" bằng token và thời gian, và phải nhận lại kết quả tốt hơn hoặc năng lực lớn hơn (A4).

| Loại chi tiêu | Quy tắc |
| --- | --- |
| Câu hỏi ở quyết định 1 | Tối đa 1–3 câu, chỉ những câu có thể đổi hướng |
| Tiêu chí và bài học | Ngắn, nằm trong `decisions.md`; việc nhỏ mỗi thứ một dòng |
| Lời thoại mascot do model viết | Đi kèm câu trả lời bình thường, không gọi model riêng |
| Lời thoại mascot viết sẵn | 0 token; khi đổi ngôn ngữ, model dịch một lần rồi mod lưu lại |
| Giao diện và hoạt ảnh của mod | 0 token: đọc `$.session.usage()`, `session.measure` và `decisions.md` |
| Thu dữ liệu cho người bảo trì | Không có. Người dùng tự chia sẻ nếu muốn |

**Quy tắc chung:** cơ chế 0 token được xét trước. Một cơ chế tốn token chỉ được thêm khi nó truy được lên A1, A2 hoặc A4.

**Đã chốt (20/11):** không đặt trần token bằng con số. Trên Desktop, mod cho người dùng thấy token và hạn mức đã dùng trong phiên, lấy từ `$.session.usage()` nên không tốn token (C15). Con số này là của cả phiên, không tách được phần riêng của problem2outcome. Trên các bề mặt khác chỉ có quy tắc định tính ở trên.

## 7. Feedback và juice

*Đã chốt phần lớn, chỉ có trên Desktop khi cài mod.* Phần này tạo ra hai dynamic:

- **D4. Mascot phản ứng theo trạng thái:** một bạn đồng hành thường xuyên, nói vừa phải và không chen ngang (A3, A5).
- **D5. Không gian làm việc có sự sống:** hình nền đổi theo tiến độ bốn quyết định (mặt trời lên dần khi người dùng quyết), còn đồng hồ ngữ cảnh cho biết phiên đã đầy tới đâu, giúp người dùng cảm được tình trạng việc và phiên mà không phải đọc số (A5, A4).

**Luật của mascot:**

- Chỉ nói trong dải phía trên ô nhập. Câu của nó do Claude viết trong thẻ `<nb>` cuối câu trả lời, và mod ẩn thẻ đó khỏi chat; ở mức `quiet` Claude không được nhờ viết.
- Khen quyết định của con người, không khen kết quả của AI.
- Khi Claude xong việc, nhắc người dùng nghiệm thu.
- Dòng do model viết chỉ nêu tiêu chí đạt hay chưa đạt, vì đó là agent tự nói về kết quả của chính nó.
- Trộn câu viết sẵn theo trạng thái với một dòng ngắn do Claude viết kèm câu trả lời.
- Mặc định tiếng Anh. Khi người dùng muốn ngôn ngữ khác, model của họ tự đối ứng.

**Tham khảo hình ảnh:** ASCII art trên website NB; hiệu ứng chuyển đổi như các ví dụ của Lydia Hallie và ClaudeDevs; cách làm mascot và hiệu ứng của [claude.dev](https://claude.dev/). Design system riêng cho mod sẽ dựng sau khi đã kiểm tra khả thi.

**Dẫn chứng về mascot** (tra 20/11/2026, từ nghiên cứu về pedagogical agent trong học tập, không phải trong công việc với AI):

- Hiệu ứng dương nhưng nhỏ: nhân vật có cảm xúc làm tăng cảm xúc tích cực và động lực nội tại (g ≈ 0,26) ([Wang và cộng sự, 2022](https://consensus.app/papers/details/w:9385ffd2-5603-4a2e-be66-d130c8cac4a6/?utm_source=claude_desktop)).
- Điểm tác động rõ nhất là self-efficacy (niềm tin mình làm được) và hứng thú ([Gladstone và cộng sự, 2025](https://consensus.app/papers/details/w:4ebbc05a-3f38-449e-9085-d5e47b608808/?utm_source=claude_desktop)). Điều này ủng hộ việc mascot khen quyết định của người dùng thay vì khen kết quả của AI.
- Nhân vật 2D hiệu quả hơn 3D (g 0,38 so với 0,11), và cử động hay giọng nói gần như không tạo khác biệt ([Castro-Alonso và cộng sự, 2021](https://consensus.app/papers/details/w:e303ccdd-4898-44a7-80e8-42f93b5467c9/?utm_source=claude_desktop)). Mascot ASCII hoặc 2D đơn giản là đủ, không cần đầu tư vào hoạt ảnh phức tạp.
- Chưa ai biết cách thiết kế nhân vật tối ưu cho một bối cảnh cụ thể ([Schroeder và cộng sự, 2024](https://consensus.app/papers/details/w:4f3af2a5-dfbd-45c1-9af3-163bac786d0b/?utm_source=claude_desktop)), nên playtest là cách duy nhất để biết.

**Đã chốt (20/11), mức "vừa phải":** mặc định tối đa một câu sau mỗi lượt của Claude. Mascot im khi người dùng đang gõ hoặc đang ở một điểm quyết định (A1 thắng A5). Người dùng đổi mức bằng một lệnh của mod, không tốn token (C14).

## 8. Onboarding: lần chạy đầu

*Đã chốt về nguyên tắc.* Lần chạy đầu là rủi ro lớn nhất của sản phẩm: người không kỹ thuật phải vượt qua cả harness lẫn một phương pháp mới, và không có ví dụ mẫu.

- **Chỉ có hướng dẫn tổng quan** trong `AGENTS.md`. Model của người dùng tự điều chỉnh theo từng người, không có kịch bản cứng (P4).
- **Bắt đầu từ việc thật** của người dùng, không dùng bài tập mẫu. Buổi đầu phải ra một kết quả thật.
- **Nhẹ ngay từ đầu:** lần đầu chỉ cần quyết định 2 và 4, trừ khi việc đủ lớn.
- **Giúp vượt harness:** agent giải thích ngắn những gì người dùng gặp lần đầu, như quyền hạn hay thư mục việc, khi nó xuất hiện chứ không giảng trước.
- **Với mod:** nếu chưa có tiêu chí, mod giữ lại một lần trước lần ghi file đầu tiên để hỏi người dùng "thế nào là xong".

## 9. Surfaces

*Đã chốt.* Cùng một core loop chạy trên nhiều bề mặt. Luật cốt lõi chỉ nằm trong `AGENTS.md`, nên bề mặt nào cũng có đủ bốn quyết định. Mod chỉ thêm feedback và juice.

| Bề mặt | Người dùng có gì | Giới hạn |
| --- | --- | --- |
| Codex | `AGENTS.md`, core loop, `decisions.md`, `me.md` | Không có mod |
| Claude Code (CLI, Desktop) không mod | Như trên, qua `CLAUDE.md` nhập `AGENTS.md` | Không có mascot hay hoạt ảnh |
| Claude Code Projects | Như trên; đọc `CLAUDE.md` và `.claude/rules/` | Không đọc skill trong repo; cloud session không vẽ giao diện mod |
| **Claude Desktop có mod** | Đầy đủ: mascot, hình nền động, hoạt ảnh, giữ lại trước lần ghi đầu | Bề mặt thiết kế trước tiên |
| Terminal, VS Code có mod | Chưa thiết kế | Để sau khi hướng đi đã được xác nhận |

## 10. Mechanics spec

*Nháp.* Mỗi cơ chế truy lên dynamic và aesthetic mà nó phục vụ. Thứ tự ưu tiên sẽ đổi khi phần Aesthetics được chốt.

| Mã | Cơ chế | Nằm ở | Truy vết |
| --- | --- | --- | --- |
| C1 | Bốn điểm dừng với luật "agent giúp bằng cách" | `AGENTS.md` | D1 → A1 |
| C2 | Co theo cỡ việc: việc nhỏ chỉ quyết định 2 và 4 | `AGENTS.md` | D1 → A4 |
| C3 | `decisions.md` cho mỗi việc: mục 1–3 mỗi mục có một dòng `Confirmed:`, tiêu chí, dòng `Decision:` chỉ lời người dùng mới đặt được, và bài học. Bản nháp của agent không tính là quyết định | Thư mục việc | D2 → A2, A4 |
| C4 | `me.md`: mức hỗ trợ cho từng quyết định; agent đề xuất, người dùng xác nhận | Gốc workspace | D3 → A2, A1 |
| C5 | Dẫn sang tính năng native: plan mode cho quyết định 1, `/goal` cho quyết định 2 | `AGENTS.md` | D1 → A4 |
| C6 | Agent tự tra năng lực và tài liệu hiện tại thay vì dùng mẹo viết cứng | `AGENTS.md` | D1 → A4 |
| C7 | Thói quen bảo trì: mỗi bản lớn, xoá chỉ dẫn agent đã tự làm tốt | Repo | P2 → A4 |
| C8 | Giữ lại một lần trước lần ghi file đầu nếu quyết định 2 chưa `Confirmed: yes` hay `skipped` (`tool.call` + `$.ui.ask`). Bắt cả Write, Edit và lệnh shell ghi bằng `>` hoặc `tee` | Mod | D1 → A1 |
| C9 | Context ẩn yêu cầu Claude viết kèm một dòng `<nb>` cuối câu trả lời, không gửi khi mascot ở mức `quiet`; mod ẩn dòng này khỏi `AssistantMessage` rồi hiện nó trong dải phía trên ô nhập | Mod | D4 → A3 |
| C10 | Câu viết sẵn theo trạng thái bằng tiếng Anh và tiếng Việt, nằm trong code của mod; ngôn ngữ khác dùng tiếng Anh. Ý dịch một lần rồi lưu trong `$.store` đã bỏ khỏi v0 | Mod | D4 → A3, A4 |
| C11 | Hình nền hồ ASCII theo tiến độ bốn quyết định: mặt trời lên dần, nhiễu thành trật tự (M11) lan ra từ mặt trời mỗi khi một quyết định được chốt; mọi hoạt ảnh đều dừng. Đồng hồ ngữ cảnh đọc `$.session.usage()` và `session.measure` | Mod | D5 → A5 |
| C12 | Không có trong v0: gợi ý câu tiếp theo bằng `$.prompt.suggest`. Dòng của The Colleague và bốn quyết định đã cho biết việc tiếp theo là của ai | Mod | D1 → A4 |
| C13 | Mod không tự duyệt tool call, không sửa chữ người dùng gõ, không sửa system prompt | Mod | P1 → A1 |
| C14 | Lệnh chỉnh mức nói của mascot (mặc định tối đa 1 câu mỗi lượt), chạy không cần lượt của Claude | Mod | D4 → A1, A5 |
| C15 | Hiển thị token và hạn mức đã dùng trong phiên, lấy từ $.session.usage(), không đặt trần | Mod | D5 → A4, A1 |
| C16 | Một giọng nhất quán cho agent, cùng cá tính với mascot, áp dụng trên mọi bề mặt | AGENTS.md | D4 → A5 |
| C17 | Chế độ người dùng chủ động gọi: grill me, challenge me, teach me | AGENTS.md | D1, D3 → A1, A2 |
| C18 | Skill thật `/grill-me`, `/challenge-me`, `/teach-me` trong mod: hỏi theo vòng bằng AskUserQuestion, mỗi câu có lựa chọn và đề xuất, ghi kết quả vào `decisions.md` | Mod | D1 → A1, A5 |
| C19 | The Colleague: khuôn mặt ASCII 6 trạng thái theo spec của website, ô chân dung có quầng ký tự theo trạng thái, đổi mặt bằng hiệu ứng scramble 0,35 s | Mod | D4 → A3, A5 |
| C20 | Lệnh không tốn token: /nb (việc đang ở đâu, mỗi skill để làm gì), /nb-lang, /nb-scene | Mod | P3 → A4 |
| C21 | Âm thanh tuỳ chọn, rất nhỏ: gió trên hồ, giọt nước hiếm, vài nốt ngũ cung ngắn khi trạng thái đổi | Mod | D5 → A5 |
| C22 | Dòng Confirmed: ở mục 1–3 của decisions.md là tín hiệu duy nhất: no, yes · by: user, yes · by: draft, skipped. Mod đọc nó để vẽ bốn quyết định; agent đếm by: user để đề xuất bớt hỗ trợ | Thư mục việc, mod | D2, D3 → A1, A2 |

Quyền của mod: được gọi mạng không giới hạn đích và chạy process. Tài liệu mods ghi rằng mod không có sandbox; người bảo trì xem bảo mật và đạo đức là trách nhiệm của harness và nhà phân phối.

## 11. Non-goals

*Đã chốt.*

- Không server, không dịch vụ nạp URL, không gửi dữ liệu cho người bảo trì. Riêng mod được gọi mạng.
- Không memory riêng ngoài các file trong workspace.
- Không chấm điểm người dùng, không thang năng lực.
- Không learning mode, không bài giảng, không trình cải thiện prompt. Chế độ teach me chỉ trỏ tới tài liệu gốc, và chỉ khi người dùng gọi (C17).
- Không nhúng cứng mẹo theo nền tảng.
- Không skill trong workspace. Skill chỉ có trong mod tuỳ chọn (C18), và mọi thứ chúng làm cũng gọi được bằng lời nói theo `AGENTS.md`.
- Không template hay ví dụ mẫu theo nghề.
- Không phải chatbot đa năng, không phải agent runtime, không điều phối đa agent.

## 12. Playtest

*Đã chốt về cách làm, nháp về ngưỡng.* Không có thí nghiệm hình thức. Playtest là dogfood, và mỗi tín hiệu gắn với một aesthetic.

1. người bảo trì tự dùng trên 2–3 việc thật, trên cả Claude Code và Codex.
2. Share cho 5 người đầu.
3. Mod được playtest riêng trên Desktop sau khi đã kiểm tra khả thi.

| Tín hiệu | Cho biết về |
| --- | --- |
| Người dùng tự quay lại làm việc thứ hai mà không cần nhắc | A4 đáng công |
| Qua các việc, họ tự quyết tốt hơn với ít gợi ý hơn (`me.md` lên mức) | A2 tiến bộ |
| Số quyết định ghi `Confirmed: yes · by: user` trong `decisions.md` tăng dần | A1, A4 |
| Người dùng nói "rườm rà" hoặc bỏ qua điểm dừng | Anti-aesthetic đang xảy ra |

**Ngưỡng thất bại (nháp):** nếu sau 3 tuần chưa ai trong 5 người đầu tự làm việc thứ hai, phương pháp đang có vấn đề. Viết ngưỡng trước vì cảm nhận hay sai lệch, như nghiên cứu METR cho thấy.

## 13. Câu hỏi mở và điểm cần kiểm tra khả thi

**Thiết kế, chờ grill:**

- Thứ tự ưu tiên của A1–A5 (mục 3).
- ~~Số lần chấp nhận ngay trước khi agent đề xuất bớt hỗ trợ (mục 5).~~ Đã chốt 21/11: ba việc gần nhất có `by: user`.
- Cách hiển thị token và hạn mức trong mod sao cho không gây lo lắng (C15, mục 6).
- Tên và các mức của lệnh chỉnh mascot (C14, mục 7).
- Ngưỡng thất bại 3 tuần và 5 người (mục 12).

**Khả thi kỹ thuật của mod, cần dựng thử trên Desktop:**

- Ẩn dòng `<nb>` khỏi `AssistantMessage` mà không làm hỏng câu trả lời đang stream (C9). Đã có test; chưa thử trên Desktop.
- Hình nền bằng `$.theme.set` và dải SVG phía trên ô nhập hiện rõ phía sau chữ chat thật (C11). Mọi hoạt ảnh đều dừng; chưa thử trên Desktop.
- Giữ tool call và hỏi bằng `$.ui.ask` mà không chồng lên hộp xin quyền (C8).
- Cài mod bằng `/plugin install nb --marketplace no-babysitting/problem2outcome` trong phiên đang mở, không cần phiên mới. Đã chạy được trong cấu hình sạch ở terminal; chưa thử trên Desktop.

**Dẫn chứng cần tra khi viết tới:** đã tra cho mục 3, 5 và 7. Còn thiếu tỉ lệ bỏ cuộc lần đầu của người không kỹ thuật (mục 8). Ngoài ra cần thử cùng một việc trên cả Codex và Claude Code, vì hai harness có thể hiểu `AGENTS.md` khác nhau.
