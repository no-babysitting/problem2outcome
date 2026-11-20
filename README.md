# problem2outcome

**Do real work with an AI agent, and stay the one who decides.**

The agent does the work. You make the four calls it should not make for you:

1. **What is the real problem?**
2. **What counts as done?**
3. **What do I hand over, and what do I keep?**
4. **Do I accept the result, or ask for a redo?**

At first the agent helps you with each one. As you get good at a decision, that help fades. Nothing is scored, and nothing leaves your folder.

[Tiếng Việt ở bên dưới](#tiếng-việt)

## Start in three steps

1. **Get the folder.** On this page, click **Code → Download ZIP** and unzip it, or clone it with git. This folder is where your work will live.
2. **Open it with your agent.** In the Claude desktop app, choose **Code** and open the folder. Claude Code in a terminal and Codex also work: start them inside the folder.
3. **Say what you want done**, in your own words and language. For example: *"Write an email inviting past clients back, 15% off if they book before 20/12."*

The first time, the agent explains the idea in two sentences. Before each task, it asks what "done" means to you. When it finishes, it checks the result against your answer, one line per point, and lets you accept or ask for a redo.

## What you will see in the folder

| Path | What it is |
|---|---|
| `tasks/` | One folder per task: the outputs, plus a short `decisions.md` holding your criteria and whether you accepted |
| `me.md` | Created after your first task. It holds how much help you want with each decision. Edit it any time |
| `AGENTS.md` | The working agreement the agent follows. Codex reads it directly, and Claude Code reads it through `CLAUDE.md` |
| `CLAUDE.md` | Claude Code specifics |
| `templates/` | The starting points for `decisions.md` and `me.md` |
| `mod/nb/` | The optional Claude desktop add-on (see below) |
| `research/` | The research behind this project |

Everything the agent remembers about you is in `me.md` and `tasks/`. You can read, change or delete any of it.

## Things you can say

- **"grill me"**: the agent sharpens your problem or your criteria in a few rounds of short questions. Each question comes with options and its recommendation.
- **"challenge me"**: the agent argues against what you just decided, then you choose.
- **"teach me ..."**: a few lines from the official documentation, with the link.
- **"skip that step"**: the agent skips it and notes that in `decisions.md`.

## Optional: the NB add-on for the Claude desktop app

`AGENTS.md` works without it. The add-on (a Claude Code "mod") makes the method visible:

- **The Colleague** `[•_•]`, a small face above the message box that shows what Claude is doing and says one short line after each turn.
- **Your task's four decisions** under the face: which ones are made, and which one is yours now.
- **A calm context meter**, so you know when a long session should start fresh.
- **A coloured ASCII lake behind the chat.** The sun rises as you make your decisions.
- **`/grill-me`, `/challenge-me` and `/teach-me`** as real skills, with questions shown as clickable choices.
- **One pause before the first file is written**, if you have not said what counts as done yet. It asks only once.

**Install (Claude desktop app or terminal):** in a Code session, type this into the message box and send it:

```
/plugin install nb --marketplace no-babysitting/problem2outcome
```

Answer `y` to add the marketplace, then choose a scope. Usually it turns on right away in the session you are in. If Claude says a reload is needed, type `/reload-plugins`. You do not need a new session. Needs Claude Code 2.1.286 or later in the desktop app (2.1.287 in a terminal); `/status` shows yours.

**Commands that cost no tokens:** `/nb` shows where your task stands. `/mascot quiet | normal | chatty` sets how often The Colleague speaks. `/nb-lang en | vi` and `/nb-scene on | off` set the language and the background.

**Please read before installing:** add-ons like this run with the same access as Claude Code itself, so only install ones whose code you have read or whose author you trust. This one reads only your workspace folder and stores its settings locally. It sends nothing anywhere. Try it on a test folder first.

## For maintainers

Keep `AGENTS.md` thin. With every major model or harness release, delete the instructions the agent now follows well on its own. Never hardcode platform tips, because the agent looks them up. The add-on stays optional: nothing in `AGENTS.md` may depend on it.

---

## Tiếng Việt

**Làm việc thật với AI, và bạn vẫn là người quyết định.**

AI làm phần việc. Bạn giữ bốn quyết định mà AI không nên quyết thay bạn:

1. **Vấn đề thật là gì?**
2. **Thế nào là xong?**
3. **Phần nào giao cho AI, phần nào mình giữ?**
4. **Nhận kết quả, hay yêu cầu làm lại?**

Lúc đầu AI giúp bạn từng quyết định. Khi bạn đã quen, phần giúp đó nhạt dần. Không có điểm số, và không có gì rời khỏi thư mục của bạn.

### Bắt đầu trong ba bước

1. **Lấy thư mục về máy.** Trên trang này, bấm **Code → Download ZIP** rồi giải nén, hoặc clone bằng git. Thư mục này là nơi chứa công việc của bạn.
2. **Mở nó bằng agent.** Trong app Claude trên máy tính, chọn **Code** rồi mở thư mục. Claude Code trong terminal và Codex cũng dùng được: mở chúng ngay trong thư mục này.
3. **Nói việc bạn cần**, bằng lời và ngôn ngữ của bạn. Ví dụ: *"Viết giúp mình email mời khách cũ chụp ảnh Tết, giảm 15% nếu đặt trước 20/12."*

Lần đầu, AI giới thiệu ngắn trong hai câu. Trước mỗi việc, nó hỏi bạn thế nào là xong. Làm xong, nó đối chiếu kết quả với câu trả lời đó, mỗi tiêu chí một dòng, rồi để bạn nhận hoặc yêu cầu làm lại.

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

Mọi điều agent nhớ về bạn nằm trong `me.md` và `tasks/`. Bạn đọc, sửa hay xóa đều được.

### Những câu bạn có thể nói

- **"grill me"**: agent làm rõ vấn đề hoặc tiêu chí của bạn qua vài vòng câu hỏi ngắn, mỗi câu có sẵn lựa chọn và đề xuất.
- **"challenge me"**: agent phản biện điều bạn vừa quyết, rồi bạn chọn.
- **"teach me ..."**: vài dòng tóm tắt từ tài liệu chính thức, kèm link.
- **"bỏ qua bước này"**: agent bỏ qua và ghi lại trong `decisions.md`.

### Tùy chọn: tiện ích NB cho app Claude trên máy tính

Không có nó, `AGENTS.md` vẫn đủ dùng. Tiện ích này (một "mod" của Claude Code) làm phương pháp hiện ra trước mắt:

- **The Colleague** `[•_•]`, một gương mặt nhỏ phía trên ô nhập, cho biết Claude đang làm gì và nói một câu ngắn sau mỗi lượt.
- **Bốn quyết định của việc đang làm** ngay dưới gương mặt: cái nào đã chốt, cái nào đến lượt bạn.
- **Đồng hồ ngữ cảnh (context) dịu mắt**, để bạn biết lúc nào nên mở phiên mới.
- **Mặt hồ ASCII nhiều màu phía sau khung chat.** Mặt trời lên dần theo số quyết định bạn đã chốt.
- **`/grill-me`, `/challenge-me` và `/teach-me`** là skill thật, câu hỏi hiện thành lựa chọn để bấm.
- **Dừng một lần trước khi ghi file đầu tiên**, nếu bạn chưa nói thế nào là xong. Chỉ hỏi một lần.

**Cài (app Claude trên máy tính hoặc terminal):** trong một phiên Code, gõ dòng này vào ô nhập rồi gửi:

```
/plugin install nb --marketplace no-babysitting/problem2outcome
```

Trả lời `y` để thêm marketplace, rồi chọn phạm vi cài. Thường nó bật ngay trong phiên đang mở. Nếu Claude báo cần tải lại, gõ `/reload-plugins`. Không cần mở phiên mới. Cần Claude Code bản 2.1.286 trở lên trong app (2.1.287 trong terminal); gõ `/status` để xem bản của bạn.

**Lệnh không tốn token:** `/nb` cho biết việc đang ở đâu. `/mascot quiet | normal | chatty` chỉnh mức The Colleague lên tiếng. `/nb-lang en | vi` và `/nb-scene on | off` đổi ngôn ngữ và bật tắt cảnh nền.

**Đọc trước khi cài:** các tiện ích kiểu này chạy với cùng quyền như Claude Code, nên chỉ cài khi bạn đã đọc mã hoặc tin người viết. Tiện ích này chỉ đọc thư mục làm việc của bạn và lưu cài đặt trên máy. Nó không gửi gì đi đâu. Hãy thử trên một thư mục thử nghiệm trước.
