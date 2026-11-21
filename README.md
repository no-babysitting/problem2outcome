# problem2outcome

**Do real work with an AI agent, and stay the one who decides.**

The agent does the work. You make the four calls it should not make for you:

1. **What is the real problem?**
2. **What counts as done?**
3. **What do I hand over, and what do I keep?**
4. **Do I accept the result, or ask for a redo?**

At first the agent helps you with each one. As you get good at a decision, that help fades. Nothing is scored.

[Tiếng Việt ở bên dưới](#tiếng-việt)

## Start in three steps

1. **Get the folder.** On this page, click the green **Code** button, then **Download ZIP**, and unzip it somewhere you keep work. This folder is where your work will live.
2. **Open it with your agent.** In the Claude desktop app, choose **Code**, then open the folder.
3. **Say what you want done**, in your own words and language. For example: *"Write an email inviting past clients back, 15% off if they book before 20/12."*

The first time, the agent explains the idea in two sentences. Before each task, it asks what "done" means to you. When it finishes, it checks the result against your answer, one line per point, and lets you accept or ask for a redo.

**No agent yet?** This folder needs an AI agent that can read and write files on your computer:

- **Claude Code**, inside the Claude desktop app (the **Code** tab). How to get it and which plans include it: [Claude Code on desktop](https://code.claude.com/docs/en/desktop).
- **Codex** from OpenAI: [Codex](https://developers.openai.com/codex).

So far this has been tried on Claude Code only. Codex reads the same `AGENTS.md`, but it has not been tested yet.

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

### Bắt đầu trong ba bước

1. **Lấy thư mục về máy.** Trên trang này, bấm nút xanh **Code**, chọn **Download ZIP**, rồi giải nén vào chỗ bạn hay để tài liệu. Thư mục này là nơi chứa công việc của bạn.
2. **Mở nó bằng agent.** Trong app Claude trên máy tính, chọn **Code** rồi mở thư mục.
3. **Nói việc bạn cần**, bằng lời và ngôn ngữ của bạn. Ví dụ: *"Viết giúp mình email mời khách cũ chụp ảnh Tết, giảm 15% nếu đặt trước 20/12."*

Lần đầu, AI giới thiệu ngắn trong hai câu. Trước mỗi việc, nó hỏi bạn thế nào là xong. Làm xong, nó đối chiếu kết quả với câu trả lời đó, mỗi tiêu chí một dòng, rồi để bạn nhận hoặc yêu cầu làm lại.

**Chưa có agent?** Thư mục này cần một AI agent đọc và ghi được file trên máy bạn:

- **Claude Code**, nằm trong app Claude trên máy tính (tab **Code**). Cách lấy và gói nào có: [Claude Code on desktop](https://code.claude.com/docs/en/desktop).
- **Codex** của OpenAI: [Codex](https://developers.openai.com/codex).

Tới giờ mới thử trên Claude Code. Codex đọc cùng file `AGENTS.md` nhưng chưa được thử.

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

- **"grill me"**: agent làm rõ vấn đề hoặc tiêu chí của bạn qua vài vòng câu hỏi ngắn, mỗi câu có sẵn lựa chọn và đề xuất.
- **"challenge me"**: agent phản biện điều bạn vừa quyết, rồi bạn chọn.
- **"teach me ..."**: vài dòng tóm tắt từ tài liệu chính thức, kèm link.
- **"bỏ qua bước này"**: agent bỏ qua và ghi lại trong `decisions.md`. Bỏ qua một bước không bao giờ có nghĩa là đã nhận kết quả.

### Tùy chọn: tiện ích NB

Không có nó, `AGENTS.md` vẫn đủ dùng. Trong app Claude trên máy tính, tiện ích đặt một gương mặt nhỏ phía trên ô nhập cho biết Claude đang làm gì, bốn quyết định của việc đang làm, và một mặt hồ ASCII dịu mắt phía sau khung chat, mặt trời lên dần khi bạn quyết. Cách thêm, và điều cần biết trước: [mod/nb/README.md](mod/nb/README.md).
