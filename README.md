# problem2outcome

**Do real work with an AI agent, and stay the one who decides.**

The agent does the work. You make the four calls it should not make for you:

1. **What is the real problem?**
2. **What counts as done?**
3. **What do I hand over, and what do I keep?**
4. **Do I accept the result, or ask for a redo?**

At first the agent helps you with each one. As you get good at a decision, that help fades. Nothing is scored.

[Tiếng Việt ở bên dưới](#tiếng-việt)

## Start in four steps

This folder works with an **agent**: an AI assistant that can read and write the files in a folder on your computer, not only chat.

1. **Get the Claude desktop app.** Download it for Mac, Windows or Linux (beta) from [claude.com/download](https://claude.com/download), install it and sign in. The part of the app that works with your files is its **Code** tab, called Claude Code. It needs a paid plan: **Pro is enough to start**, and the free plan does not include it ([prices](https://claude.com/pricing), [plans that include Claude Code](https://code.claude.com/docs/en/setup)). If the **Code** tab asks you to upgrade, your plan does not include it yet. You never need a terminal.
2. **Get this folder.** On this GitHub page, click the green **Code** button (a GitHub button, not the app's tab), then **Download ZIP**, and unzip it somewhere you keep work. You get a folder called `problem2outcome-main`: this is where your work will live.
3. **Open the folder in the app.** Click the **Code** tab. In the row under the message box, the first button chooses where Claude works: pick **Local** (your computer). The button next to it chooses the folder: click it, choose **Open folder…**, and pick the folder you unzipped (usually in Downloads). Your computer may ask whether the app can use that folder: say yes. ([Step-by-step with pictures](https://code.claude.com/docs/en/desktop-quickstart), in English.)
4. **Say what you want done**, in your own words and language. For example: *"Write an email inviting past clients back, 15% off if they book before 20/12."*

The first time, the agent explains the idea in two sentences. Before each task, it asks what "done" means to you. When it finishes, it checks the result against your answer, one line per point, and lets you accept or ask for a redo. The result shows in the chat and is saved as a file in `tasks/`, so you can copy it into an email or a message. The app may ask before it changes a file: that is normal, and the agent explains it the first time.

**Using Codex from OpenAI instead?** It reads the same `AGENTS.md`: see [Codex](https://developers.openai.com/codex). So far this has been tried on Claude Code only; Codex has not been tested yet.

## What you will see in the folder

| Path | What it is |
|---|---|
| `tasks/` | One folder per task: the outputs, plus a short `decisions.md` holding your criteria and whether you accepted |
| `me.md` | Created after your first task. It holds how much help you want with each decision. Edit it any time |
| `AGENTS.md` | The working agreement the agent follows. Codex reads it directly, and Claude Code reads it through `CLAUDE.md` |
| `CLAUDE.md` | Claude Code specifics |
| `templates/` | The starting points for `decisions.md` and `me.md` |
| `mod/nb/` | An optional add-on for the Claude desktop app (see below) |
| `research/` | The research behind this project |

**What is remembered, and where.** This method keeps its notes only in `me.md` and `tasks/`, and you can read, change or delete any of it. Your agent app keeps its own records outside this folder: Claude Code saves session history on your computer ([what it stores and for how long](https://code.claude.com/docs/en/data-usage)) and can keep an automatic memory ([how to see or turn it off](https://code.claude.com/docs/en/memory)); Codex has its own [memories](https://developers.openai.com/codex/memories). This folder cannot control those.

## Things you can say

Say them in any words and any language.

- **"grill me"**: the agent sharpens your problem or your criteria in a few rounds of short questions. Each question comes with options and its recommendation.
- **"challenge me"**: the agent argues against what you just decided, then you choose.
- **"teach me ..."**: a few lines from the official documentation, with the link.
- **"skip that step"**: the agent skips it and notes that in `decisions.md`. Skipping a step is never the same as accepting a result.

## Optional: the NB add-on

`AGENTS.md` works without it. In the Claude desktop app, the add-on puts a small face above the message box that shows what Claude is doing, your task's four decisions, and a calm ASCII lake behind the chat whose sun rises as you decide. How to add it, and what to know first: [mod/nb/README.md](mod/nb/README.md).

## For maintainers

Keep `AGENTS.md` thin. With every major model or harness release, delete the instructions the agent now follows well on its own. Never hardcode platform tips, because the agent looks them up. The add-on stays optional: nothing in `AGENTS.md` may depend on it. The product design is in [DESIGN.md](DESIGN.md).

---

## Tiếng Việt

**Làm việc thật với AI, và bạn vẫn là người quyết định.**

AI làm phần việc. Bạn giữ bốn quyết định mà AI không nên quyết thay bạn:

1. **Vấn đề thật là gì?**
2. **Thế nào là xong?**
3. **Phần nào giao cho AI, phần nào mình giữ?**
4. **Nhận kết quả, hay yêu cầu làm lại?**

Lúc đầu AI giúp bạn từng quyết định. Khi bạn đã quen, phần giúp đó nhạt dần. Không có điểm số.

### Bắt đầu trong bốn bước

Thư mục này dùng với một **agent**: trợ lý AI đọc và ghi được file trong một thư mục trên máy bạn, không chỉ để trò chuyện.

1. **Cài app Claude trên máy tính.** Tải cho Mac, Windows hoặc Linux (bản thử) ở [claude.com/download](https://claude.com/download), cài rồi đăng nhập. Phần làm việc với file của bạn là tab **Code** trong app, gọi là Claude Code. Phần này cần gói trả phí: **gói Pro là đủ để bắt đầu**, gói miễn phí không có ([bảng giá](https://claude.com/pricing), [gói nào có Claude Code](https://code.claude.com/docs/en/setup), tiếng Anh). Nếu tab **Code** mời bạn nâng cấp, nghĩa là gói của bạn chưa có phần này. Bạn không cần dùng terminal.
2. **Lấy thư mục về máy.** Trên trang GitHub này, bấm nút xanh **Code** (nút của GitHub, không phải tab trong app), chọn **Download ZIP**, rồi giải nén vào chỗ bạn hay để tài liệu. Bạn sẽ có thư mục tên `problem2outcome-main`: đây là nơi chứa công việc của bạn.
3. **Mở thư mục trong app.** Bấm tab **Code**. Ở hàng nút ngay dưới ô nhập, nút đầu tiên chọn nơi Claude làm việc: chọn **Local** (máy của bạn). Nút bên cạnh chọn thư mục: bấm vào, chọn **Open folder…** rồi chọn thư mục vừa giải nén (thường nằm trong Downloads). Máy có thể hỏi app có được dùng thư mục đó không: bạn đồng ý. ([Hướng dẫn có ảnh](https://code.claude.com/docs/en/desktop-quickstart), tiếng Anh.)
4. **Nói việc bạn cần**, bằng lời và ngôn ngữ của bạn. Ví dụ: *"Viết giúp mình email mời khách cũ chụp ảnh Tết, giảm 15% nếu đặt trước 20/12."*

Lần đầu, AI giới thiệu ngắn trong hai câu. Trước mỗi việc, nó hỏi bạn thế nào là xong. Làm xong, nó đối chiếu kết quả với câu trả lời đó, mỗi tiêu chí một dòng, rồi để bạn nhận hoặc yêu cầu làm lại. Kết quả hiện trong khung chat và được lưu thành file trong `tasks/`, nên bạn copy sang email hay Zalo được. App có thể hỏi bạn trước khi sửa một file: chuyện đó bình thường, và lần đầu AI sẽ giải thích.

**Dùng Codex của OpenAI?** Codex đọc cùng file `AGENTS.md`: xem [Codex](https://developers.openai.com/codex). Tới giờ mới thử trên Claude Code; Codex chưa được thử.

### Trong thư mục có gì

| Đường dẫn | Là gì |
|---|---|
| `tasks/` | Mỗi việc một thư mục: kết quả, và một `decisions.md` ngắn ghi tiêu chí của bạn và việc bạn có nhận hay không |
| `me.md` | Được tạo sau việc đầu tiên. Ghi bạn muốn được giúp bao nhiêu ở mỗi quyết định. Sửa lúc nào cũng được |
| `AGENTS.md` | Thỏa thuận làm việc mà agent tuân theo |
| `CLAUDE.md` | Phần riêng cho Claude Code |
| `templates/` | Mẫu ban đầu cho `decisions.md` và `me.md` |
| `mod/nb/` | Tiện ích tùy chọn cho app Claude trên máy tính (xem bên dưới) |
| `research/` | Nghiên cứu đứng sau dự án |

**Điều gì được ghi nhớ, và ở đâu.** Phương pháp này chỉ ghi vào `me.md` và `tasks/`, bạn đọc, sửa hay xóa đều được. App agent của bạn có bản ghi riêng nằm ngoài thư mục này: Claude Code lưu lịch sử phiên trên máy bạn ([lưu gì, trong bao lâu](https://code.claude.com/docs/en/data-usage)) và có thể có bộ nhớ tự động ([cách xem hoặc tắt](https://code.claude.com/docs/en/memory)); Codex có [memories](https://developers.openai.com/codex/memories) riêng. Thư mục này không điều khiển được những phần đó.

### Những câu bạn có thể nói

Nói bằng lời nào, tiếng nào cũng được, ví dụ "hỏi kỹ mình đi" thay cho "grill me".

- **"grill me"**: agent làm rõ vấn đề hoặc tiêu chí của bạn qua vài vòng câu hỏi ngắn, mỗi câu có sẵn lựa chọn và đề xuất.
- **"challenge me"**: agent phản biện điều bạn vừa quyết, rồi bạn chọn.
- **"teach me ..."**: vài dòng tóm tắt từ tài liệu chính thức, kèm link.
- **"bỏ qua bước này"**: agent bỏ qua và ghi lại trong `decisions.md`. Bỏ qua một bước không bao giờ có nghĩa là đã nhận kết quả.

### Tùy chọn: tiện ích NB

Không có nó, `AGENTS.md` vẫn đủ dùng. Trong app Claude trên máy tính, tiện ích đặt một gương mặt nhỏ phía trên ô nhập cho biết Claude đang làm gì, bốn quyết định của việc đang làm, và một mặt hồ ASCII dịu mắt phía sau khung chat, mặt trời lên dần khi bạn quyết. Cách thêm, và điều cần biết trước: [mod/nb/README.md](mod/nb/README.md).
