đọc tài liệu thiết kế chi tiết phần module "thẻ tag" này và phân tích cho tôi
Tôi đang đọc tài liệu “Thẻ tag” và sẽ bóc tách theo hướng dev/BA dễ dùng: phạm vi, luồng nghiệp vụ, điểm mạnh, điểm thiếu, rủi ro thiết kế và khuyến nghị hoàn thiện.
Đã suy nghĩ trong 21s
Tôi đã đọc tài liệu module “Quy tắc tự động gắn thẻ”. Đánh giá nhanh: đây là một tài liệu khá tốt ở mức nghiệp vụ + UI flow, tư duy thiết kế rõ, có định hướng đúng cho một rule engine bản v1, nhưng chưa đủ để dev backend/frontend triển khai trọn vẹn mà không cần làm rõ thêm, vì phần CSDL, API, schema kỹ thuật và một số rule runtime quan trọng đang cố ý để trống.
1) Tài liệu này đang mô tả cái gì
Bản chất module này không chỉ là “gắn thẻ”, mà là một bộ máy tự động hóa nghiệp vụ kiểu rule engine theo mô hình:
Sự kiện → Điều kiện → Hành động
Tài liệu xác định rõ phân hệ cho phép admin cấu hình quy tắc để hệ thống tự:
gắn/gỡ thẻ khách hàng,
đổi trạng thái lịch hẹn,
cập nhật trường dữ liệu,
đổi mức ưu tiên chăm sóc,
thay vì hard-code trong code như hiện tại. Đồng thời nó gom cả quy tắc theo sự kiện lẫn quy tắc chạy theo lịch định kỳ vào cùng một framework.
Điểm rất tốt là tài liệu đã nhìn module này như trung tâm tự động hóa dùng chung cho nhiều phân hệ: Lịch hẹn, Liệu trình, Khách hàng, Sản phẩm, Thanh toán, Chăm sóc khách hàng. Đây là hướng thiết kế đúng, vì giúp nghiệp vụ gốc chỉ cần phát sinh event, còn engine lo evaluate + execute.
2) Những điểm mạnh của tài liệu
a) Tư duy kiến trúc đúng và có khả năng mở rộng
Tài liệu chia phân hệ thành 3 lớp:
lớp tiếp nhận sự kiện,
lớp đánh giá điều kiện,
lớp thực thi hành động.
Cách tách này giúp giảm coupling giữa nghiệp vụ gốc và logic automation, sau này mở rộng thêm event/action sẽ dễ hơn.
b) Đã kiểm soát trước các rủi ro hay gặp của rule engine
Đây là phần mạnh nhất của tài liệu. Nó đã nghĩ trước các vấn đề vận hành thực tế:
giới hạn 3 cấp lan truyền rule,
có cơ chế chống chạy trùng,
có phát hiện vòng lặp A → B → A,
có nhật ký thực thi cho cả thành công, bỏ qua, lỗi.
Đây là các thứ nhiều tài liệu nghiệp vụ thường bỏ sót, nhưng tài liệu này đã đưa vào khá sớm, chứng tỏ người viết hiểu bản chất automation không chỉ là “config UI”.
c) UI flow gọn, dễ dùng
Tài liệu mô tả hợp lý:
1 màn danh sách rule,
1 popup dùng chung cho tạo/sửa,
1 màn log execution.
Danh sách có kéo-thả ưu tiên, bật/tắt nhanh, badge rule hệ thống, và khối log gần nhất ngay bên dưới. Popup tạo/sửa chia đúng 4 khối logic: thông tin chung, khi nào dùng, điều kiện, hành động. Với admin thì cách đọc rule thành câu tự nhiên là rất ổn.
d) Phạm vi v1 được khống chế hợp lý
Tài liệu không cho biểu thức điều kiện lồng nhau phức tạp, chỉ cho:
“tất cả điều kiện đúng”
hoặc “chỉ cần một điều kiện đúng”
Đây là quyết định đúng cho phiên bản đầu, tránh biến module thành mini programming language quá sớm.
e) Có phụ lục đủ tốt để BA/QA bám
Tài liệu đã liệt kê sẵn:
danh mục event,
trường dữ liệu theo event,
toán tử theo kiểu dữ liệu,
loại action,
message đề xuất.
Phần này rất hữu ích cho QA viết testcase và cho dev map UI/BE.
3) Những điểm còn thiếu hoặc chưa chốt kỹ
Đây là phần quan trọng nhất nếu anh/chị muốn dùng tài liệu này để triển khai thật.
a) Thiếu thiết kế dữ liệu và API
Tài liệu nói rõ là không trình bày CSDL, schema bảng, API, request/response, mapping kỹ thuật. Điều đó làm tài liệu hiện tại mới dừng ở mức TKCT nghiệp vụ + UI, chưa phải TKCT đủ để code.
Các bảng tối thiểu đáng ra phải có nhưng chưa thấy chốt:
automation_rule
automation_rule_condition
automation_rule_action
automation_execution_log
có thể thêm automation_rule_version hoặc audit history
có thể thêm event_outbox / job_schedule / execution_queue
b) Chưa mô tả rõ thứ tự xử lý khi nhiều rule cùng trúng
Tài liệu có nói ưu tiên số nhỏ chạy trước, nhưng chưa chốt đủ các câu hỏi runtime như:
nếu rule A đổi trạng thái làm rule B cũng match thì B chạy ngay trong cùng transaction hay async?
nếu 2 rule cùng sửa một field, rule nào thắng?
nếu rule 1 set status A, rule 2 set status B trên cùng object thì kết quả cuối là gì?
nếu action trước thành công, action sau lỗi thì rollback toàn bộ hay partial success?
Tức là có nói về “priority”, nhưng chưa nói đủ về transaction semantics.
c) “Chống chạy trùng” mới nêu nguyên tắc, chưa nêu cơ chế kỹ thuật
Ví dụ tài liệu nói:
gắn tag nếu khách chưa có tag đó thì mới chạy,
nếu đã có thì skip.
Nhưng với các action khác, logic idempotent chưa được đặc tả rõ:
set_field: so sánh old/new thế nào?
set_appointment_status: nếu đổi sang cùng trạng thái thì skip hay vẫn log success?
remove_tag: nếu không có tag thì skip hay warning?
set_care_priority: nếu priority đang đúng sẵn thì sao?
Nếu không chốt, dev mỗi người hiểu một kiểu.
d) Quy tắc theo lịch còn đơn giản quá
Tài liệu chỉ cho:
hàng ngày / hàng tuần / hàng tháng
giờ / phút chạy.
Thiếu các câu hỏi nghiệp vụ quan trọng:
hàng tuần thì chọn thứ mấy?
hàng tháng là ngày mấy?
nếu ngày 31 mà tháng không có 31 thì sao?
timezone dùng gì?
nếu job miss do hệ thống downtime thì có catch-up không?
nếu job đang chạy mà tới lượt chạy mới thì skip hay xếp hàng?
e) Thiếu đặc tả quyền chi tiết
Hiện tài liệu mới chốt chỉ admin được vào module.
Nhưng thực tế thường cần chi tiết hơn:
ai được xem log,
ai được tạo/sửa/xóa,
ai được bật/tắt,
ai được sửa rule hệ thống,
có cần phân quyền theo chi nhánh/brand/spa không.
f) Chưa thấy versioning của rule
Tài liệu có nói sửa rule bật sẽ chỉ áp dụng cho event tiếp theo, không hồi tố.
Nhưng nếu cần tra cứu:
“tại thời điểm log này chạy thì rule đang có condition gì?”
thì phải có snapshot/version.
Hiện log mô tả là có dữ liệu sự kiện, kết quả evaluate, action, lỗi. Tốt, nhưng chưa chắc đã đủ để forensic dài hạn nếu rule đã bị sửa nhiều lần.
g) Thiếu rule validate nâng cao cho popup tạo rule
Hiện mới có:
tên duy nhất,
bắt buộc có trigger + action,
tối đa 10 điều kiện,
tối đa 50 rule bật.
Nhưng nên có thêm:
không cho chọn event không tương thích với action,
không cho self-trigger nguy hiểm ở mức cấu hình,
cảnh báo khi action có thể sinh event gây cascade,
validate schedule hợp lệ,
validate action value còn tồn tại trước khi bật rule.
4) Đánh giá riêng từng phần
Màn danh sách rule
Thiết kế tốt, đủ cho admin vận hành:
add/edit/delete
drag ưu tiên
toggle active
badge rule hệ thống
panel log gần nhất.
Điểm nên bổ sung:
filter/search theo tên rule, loại rule, trạng thái
filter theo event
bulk enable/disable
cột “lần chạy gần nhất”
cột “số lỗi 7 ngày gần nhất”
Popup tạo/sửa rule
Thiết kế gọn, dễ hiểu. Phần động theo event → field → operator → value là đúng hướng.
Nhưng nên bổ sung:
preview câu nghiệp vụ sinh ra từ rule
test rule trên sample data
warning impact khi sửa rule đang bật
mô tả rõ action target object nếu set_field
Màn log
Đây là điểm cộng lớn. Tài liệu còn chốt:
log cho cả success / skipped / error
popup chi tiết có event data, điều kiện đã evaluate, action và error
retention 90 ngày.
Điểm nên bổ sung:
trace id / execution chain id
parent execution id để truy chuỗi lan truyền
tên object + object id chuẩn hóa
export log CSV
retry thủ công với trường hợp lỗi an toàn
5) Những rủi ro triển khai thực tế
Tôi thấy có 5 rủi ro lớn nếu dev bắt tay làm ngay từ tài liệu này:
1. Xung đột rule
Nhiều rule cùng bắn vào một object nhưng chưa có policy giải quyết conflict rõ ràng.
2. Khó debug chuỗi lan truyền
Có giới hạn 3 cấp, có phát hiện loop, nhưng nếu không có chain id/log tree thì khó trace.
3. Hiệu năng khi số event tăng
Tài liệu mới nói cache rule và log 100–500 dòng/ngày, nhưng chưa mô tả chiến lược index/filter rule theo event đủ chi tiết.
4. Thiếu khả năng audit sâu
Nếu rule bị sửa sau này, log cũ có thể khó đối chiếu nếu không lưu snapshot/version.
5. UI dễ dùng nhưng nghiệp vụ vẫn có thể cấu hình sai
Do chưa có validation semantic mạnh, admin có thể tạo rule hợp lệ về mặt form nhưng nguy hiểm về mặt vận hành.
6) Kết luận tổng thể
Nếu chấm theo góc nhìn BA/PO:
Mức đầy đủ nghiệp vụ/UI: 8/10
Mức sẵn sàng cho dev code ngay: 6/10
Mức sẵn sàng cho QA viết testcase: 7.5/10
Mức phù hợp để làm bản v1: khá tốt
Tóm lại, đây là một tài liệu định hướng rất ổn, đặc biệt mạnh ở:
mô hình hóa rule engine,
kiểm soát loop/cascade/idempotency,
tổ chức giao diện,
log vận hành.
Nhưng để đưa sang dev “đọc cái là code luôn”, tài liệu còn thiếu một lớp rất quan trọng là:
thiết kế dữ liệu
đặc tả API
quy tắc transaction/conflict
execution model đồng bộ/bất đồng bộ
versioning/audit kỹ thuật.
Tài liệu gốc tôi đang phân tích là: “Thẻ tag.docx”.
Nếu anh/chị muốn, ở bước tiếp theo tôi có thể làm luôn cho anh/chị một bản “review chi tiết theo cấu trúc: Điểm tốt / Điểm thiếu / Danh sách câu hỏi cần chốt với PO-Dev / Đề xuất DB + API + luồng xử lý runtime” để dùng trực tiếp trong buổi refine.
tôi sẽ trả lời những chỗ mà bạn còn thắc mắc đê bạn có thể phân tích rõ hơn: - Thiếu thiết kế dữ liệu và API => ở tài liệu này chúng tôi sẽ không làm phần này - Chưa mô tả rõ thứ tự xử lý khi nhiều rule cùng trúng => ở phần này tôi cần bạn phân tích sâu hơn về "transaction semantics" - “Chống chạy trùng” mới nêu nguyên tắc, chưa nêu cơ chế kỹ thuật => ở phần này tôi chưa phân tích gì nên cần bạn phân tích sâu hơn - Quy tắc theo lịch còn đơn giản quá => ở phần này tôi chưa phân tích gì nên cần bạn phân tích sâu hơn - Thiếu đặc tả quyền chi tiết => chúng tôi có 1 phần phân quyền theo tài khoản riêng, vậy nên những ai được phân quyền thao tác cho phần này thì sẽ có quyền - Chưa thấy versioning của rule => ở phần này tôi chưa phân tích gì nên cần bạn phân tích sâu hơn - Thiếu rule validate nâng cao cho popup tạo rule => ở phần này tôi chưa phân tích gì nên cần bạn phân tích sâu hơn
Tôi sẽ đào sâu 5 nhóm anh/chị vừa chốt: transaction semantics, chống chạy trùng, rule theo lịch, versioning và validate nâng cao để chuyển thành bộ phân tích có thể đưa thẳng vào tài liệu.
Đã suy nghĩ trong 16s
Rõ rồi. Với các chỗ anh/chị đã chốt, tôi sẽ không bàn thêm về DB/API và phân quyền nữa. Tôi tập trung đào sâu 5 phần còn thiếu để anh/chị có thể đưa thẳng vào tài liệu nghiệp vụ/TKCT:
transaction semantics khi nhiều rule cùng trúng,
cơ chế chống chạy trùng,
quy tắc theo lịch,
versioning của rule,
validate nâng cao cho popup tạo rule.
Các phân tích dưới đây bám trên tinh thần tài liệu hiện có: module đang theo mô hình Sự kiện - Điều kiện - Hành động, có mức ưu tiên, có giới hạn lan truyền 3 cấp, có chống chạy trùng, có phát hiện vòng lặp, có quy tắc theo lịch hàng ngày/hàng tuần/hàng tháng, và khi sửa rule đang bật thì thay đổi chỉ áp dụng cho sự kiện kế tiếp, không hồi tố.

1) Transaction semantics khi nhiều rule cùng trúng
Đây là chỗ quan trọng nhất vì nó quyết định hệ thống “chạy dễ hiểu” hay “chạy khó đoán”.
1.1. Cách hiểu nên chốt trong tài liệu
Khi một sự kiện xảy ra, hệ thống sẽ:
lấy tập rule đang bật và phù hợp với event,
sắp theo mức ưu tiên tăng dần,
evaluate từng rule theo thứ tự đó,
rule nào thỏa thì thực hiện action,
action có thể phát sinh event mới và đi sang cấp lan truyền tiếp theo, tối đa 3 cấp.
1.2. Transaction semantics nên chọn cho bản v1
Khuyến nghị mạnh là dùng mô hình:
Một rule = một đơn vị thực thi độc lập
Một chuỗi event = một execution chain có thứ tự rõ ràng
Không rollback toàn chuỗi chỉ vì một rule lỗi
Nói dễ hiểu:
Event gốc vào.
Rule 1 chạy xong thì log.
Rule 2 chạy xong thì log.
Nếu Rule 3 lỗi thì Rule 1, 2 không bị rollback ngược lại.
Event phát sinh từ Rule 1 chỉ được đưa sang hàng xử lý tiếp theo sau khi Rule 1 hoàn tất.
Lý do:
Đây là module automation nghiệp vụ, không nên biến thành transaction lớn bao trùm cả chuỗi rule.
Nếu rollback dây chuyền, hành vi sẽ khó giải thích cho người dùng và khó debug.
Tài liệu hiện tại cũng đang thiên về mô hình có log “thành công / bỏ qua / lỗi” cho từng lần thực thi, tức là hợp với tư duy per-rule execution hơn là “all-or-nothing”.
1.3. Quy tắc xử lý nên ghi rõ
Nên bổ sung vào tài liệu các nguyên tắc sau:
Nguyên tắc 1: evaluate theo snapshot của thời điểm bắt đầu từng rule
Mỗi rule đọc trạng thái mới nhất của đối tượng ngay trước khi chính nó chạy, không dùng snapshot cũ của đầu chuỗi.
=> tránh trường hợp Rule 2 quyết định dựa trên dữ liệu đã bị Rule 1 thay đổi nhưng engine lại không thấy.
Nguyên tắc 2: thứ tự ưu tiên quyết định kết quả cuối cùng khi nhiều rule cùng sửa một trường
Nếu nhiều rule cùng tác động một field/đối tượng trong cùng một chain thì:
rule ưu tiên cao hơn chạy trước,
rule chạy sau đọc trạng thái mới nhất,
nếu vẫn thỏa điều kiện thì được quyền ghi đè,
kết quả cuối là kết quả của rule chạy cuối cùng trong thứ tự ưu tiên thực tế.
Điểm này rất quan trọng vì tài liệu hiện chỉ nói “số nhỏ hơn chạy trước” nhưng chưa nói rõ rule sau có được override rule trước hay không.
Nguyên tắc 3: lỗi của một rule không làm dừng toàn bộ chain, trừ lỗi hạ tầng nghiêm trọng
Ví dụ:
lỗi validate nội bộ rule,
tag không còn tồn tại,
trạng thái không hợp lệ,
thì log lỗi cho rule đó, nhưng engine vẫn tiếp tục xử lý rule kế tiếp cùng cấp nếu không có phụ thuộc cứng. Điều này phù hợp với bộ message “quy tắc gặp lỗi khi chạy” và tư duy log vận hành hiện có.
Nguyên tắc 4: event phát sinh do action chỉ được enqueue sau khi action hiện tại commit xong
Nếu action “đổi trạng thái lịch hẹn” phát sinh event mới thì event đó phải được đưa sang bước kế tiếp sau khi cập nhật trạng thái đã hoàn tất.
=> tránh rule sau đọc trạng thái nửa vời.
1.4. Trường hợp xung đột nên chốt trước
Nên đưa hẳn bảng quy tắc xung đột như sau:
Gắn thẻ + gắn cùng thẻ → rule sau bị skip vì đã có.
Gắn thẻ + gỡ cùng thẻ → phụ thuộc thứ tự ưu tiên; kết quả cuối theo rule chạy sau.
Đổi trạng thái A + đổi trạng thái B → kết quả cuối theo rule chạy sau.
set_field cùng field khác giá trị → kết quả cuối theo rule chạy sau.
set_care_priority nhiều mức → kết quả cuối theo rule chạy sau.
Nếu anh/chị không chốt đoạn này, dev sẽ tự chọn một cách hiểu riêng.
1.5. Câu chữ có thể đưa thẳng vào tài liệu
Khi một sự kiện kích hoạt nhiều quy tắc cùng lúc, hệ thống đánh giá và thực thi tuần tự theo mức ưu tiên từ nhỏ đến lớn. Mỗi quy tắc được thực thi như một đơn vị độc lập; kết quả thành công, bỏ qua hoặc lỗi của một quy tắc được ghi nhận riêng trong nhật ký thực thi. Lỗi của một quy tắc không làm rollback các quy tắc đã chạy thành công trước đó. Nếu nhiều quy tắc cùng cập nhật một đối tượng hoặc cùng một trường dữ liệu, quy tắc chạy sau sẽ nhìn thấy trạng thái mới nhất và có thể ghi đè kết quả trước đó nếu vẫn thỏa điều kiện.

2) Cơ chế chống chạy trùng
Tài liệu hiện đã có nguyên tắc đúng: trước khi action chạy thì kiểm tra trạng thái hiện tại; nếu đã áp dụng rồi thì bỏ qua và log “đã áp dụng trước đó”. Ví dụ với gắn tag VIP, nếu khách đã có tag VIP thì skip.
Nhưng để đủ rõ cho dev/QA, cần phân tích sâu hơn theo từng loại action.
2.1. Bản chất chống chạy trùng
Ở đây nên hiểu theo hướng idempotent action, tức là:
cùng một action chạy lại nhiều lần
không làm hệ thống sai hoặc nhân bản kết quả.
2.2. Quy tắc idempotent cho từng action
Tài liệu hiện có 5 action chính.
1. set_customer_tag
Nếu khách đã có tag đó → skip.
Nếu chưa có → thêm tag.
Log skip reason: “Đã áp dụng trước đó”.
2. remove_customer_tag
Nếu khách không có tag đó → skip.
Nếu có → gỡ tag.
3. set_appointment_status
Nếu lịch hẹn đã ở đúng trạng thái đích → skip.
Nếu chưa → cập nhật trạng thái.
Nên có thêm kiểm tra transition hợp lệ theo workflow nếu hệ thống lịch hẹn có state machine.
4. set_field
Nếu giá trị hiện tại đã bằng giá trị đích → skip.
Nếu chưa bằng → update.
Nếu field là computed/read-only/system-managed → không cho lưu rule hoặc báo lỗi runtime.
5. set_care_priority
Nếu priority hiện tại đã đúng → skip.
Nếu chưa đúng → update.
2.3. Chống chạy trùng nên áp dụng ở 2 lớp
Khuyến nghị mô tả rõ:
Lớp 1: chống trùng theo trạng thái hiện tại của dữ liệu
đọc dữ liệu thật,
nếu trạng thái mong muốn đã tồn tại thì skip.
Đây là lớp tài liệu đang nói tới.
Lớp 2: chống trùng theo execution context
trong cùng một execution chain, nếu một rule cùng action, cùng target, cùng tham số đã chạy rồi thì không chạy lặp lại lần nữa.
Ví dụ:
Rule A gắn tag VIP,
Rule B do lan truyền lại cũng muốn gắn tag VIP cho cùng khách,
thì dù đọc DB chưa refresh kịp hoặc có race condition nhẹ, engine vẫn nên nhận ra “same action same target same payload in same chain” và skip.
2.4. Khi nào log là “bỏ qua”, khi nào log là “lỗi”
Nên chốt:
Bỏ qua khi action không cần làm vì dữ liệu đã ở trạng thái mong muốn hoặc điều kiện không thỏa.
Lỗi khi action không thể làm vì cấu hình sai, dữ liệu tham chiếu mất, hoặc vi phạm quy tắc hệ thống.
Điều này khớp với tài liệu đang phân biệt 3 kết quả: thành công / bỏ qua / lỗi.
2.5. Câu chữ có thể đưa vào tài liệu
Cơ chế chống chạy trùng được áp dụng theo nguyên tắc idempotent. Trước khi thực hiện hành động, hệ thống luôn kiểm tra trạng thái hiện tại của đối tượng đích. Nếu đối tượng đã ở trạng thái mong muốn thì hệ thống không thực hiện lại mà ghi nhận kết quả “Bỏ qua” cùng lý do “Đã áp dụng trước đó”. Ngoài ra, trong cùng một chuỗi xử lý, nếu phát hiện cùng một hành động với cùng tham số đã được áp dụng trên cùng đối tượng thì hệ thống tiếp tục bỏ qua để tránh tác động lặp.

3) Quy tắc theo lịch
Tài liệu hiện mới dừng ở:
loại rule theo lịch không phụ thuộc event,
chạy hàng ngày / hàng tuần / hàng tháng,
cấu hình giờ và phút,
giao diện thân thiện, engine tự chuyển thành lịch chạy nội bộ.
Phần này còn thiếu nhiều quyết định nghiệp vụ. Tôi đề xuất chốt như sau.
3.1. Nên mở rộng UI cấu hình lịch
Hiện chỉ có:
frequency,
hour,
minute.
Nên bổ sung:
nếu hàng tuần: chọn thứ chạy
nếu hàng tháng: chọn ngày chạy trong tháng
timezone hệ thống cố định
tùy chọn “chạy ngay sau khi bật” hoặc không
Nếu không có các field này, “hàng tuần” và “hàng tháng” vẫn chưa đủ nghĩa.
3.2. Semantics nên chốt cho từng loại
Hàng ngày
chạy mỗi ngày tại hh:mm.
Hàng tuần
chạy vào một hoặc nhiều thứ trong tuần tại hh:mm.
Hàng tháng
chạy vào ngày N hằng tháng tại hh:mm.
nếu tháng không có ngày N:
khuyến nghị chạy vào ngày cuối cùng của tháng.
cách này dễ giải thích nhất.
3.3. Chính sách miss run / downtime
Đây là điểm rất hay bị bỏ sót. Nên chốt 1 trong 2 kiểu:
Cách đơn giản cho v1: không backfill
nếu hệ thống downtime lúc đến lịch chạy thì bỏ qua lượt đó,
chạy tiếp từ lượt kế tiếp.
Ưu điểm:
dễ làm,
ít gây bùng nổ job tồn đọng.
Với module tag automation v1, tôi nghiêng về cách này.
3.4. Chính sách chống chồng job
Nên quy định:
nếu một rule theo lịch vẫn đang chạy mà tới lượt mới,
hệ thống không chạy song song cùng rule đó,
lượt mới bị skip và log cảnh báo.
Điều này rất quan trọng để tránh một rule quét dữ liệu lớn bị chồng nhiều instance.
3.5. Phạm vi dữ liệu mà rule theo lịch quét
Cần chốt trong tài liệu:
rule theo lịch không có event cụ thể,
nên có một đối tượng quét mặc định theo loại rule, ví dụ:
khách hàng,
lịch hẹn,
liệu trình.
điều kiện sẽ lọc trên tập dữ liệu này.
Nếu không chốt, dev sẽ không biết rule theo lịch phải “quét bảng nào”.
3.6. Câu chữ có thể đưa vào tài liệu
Quy tắc theo lịch là loại quy tắc không phụ thuộc vào sự kiện phát sinh tức thời mà được hệ thống chủ động khởi chạy theo lịch định kỳ. Đối với phiên bản đầu tiên, hệ thống hỗ trợ lịch hàng ngày, hàng tuần và hàng tháng tại một thời điểm giờ:phút cấu hình sẵn. Với quy tắc hàng tuần, người dùng phải chọn ít nhất một ngày trong tuần; với quy tắc hàng tháng, người dùng phải chọn ngày chạy trong tháng. Trường hợp tháng không có ngày tương ứng, hệ thống tự động chuyển sang ngày cuối cùng của tháng. Nếu đến thời điểm chạy mà một phiên thực thi trước đó của cùng quy tắc vẫn chưa hoàn tất, hệ thống không tạo thêm phiên mới mà ghi nhận một lượt bỏ qua để tránh chồng lặp xử lý.

4) Versioning của rule
Tài liệu hiện chưa gọi tên “versioning”, nhưng đã có 2 tín hiệu:
sửa rule đang bật chỉ áp dụng cho sự kiện kế tiếp, không hồi tố,
lịch sử biến động của rule về tên, điều kiện, hành động, trạng thái phải được ghi nhận đầy đủ để phục vụ truy vết.
Từ đó, tôi đề xuất phân tích sâu như sau.
4.1. Cần phân biệt 2 khái niệm
Audit history = ghi nhận ai sửa gì, lúc nào.
Rule version = mỗi lần thay đổi nội dung rule tạo ra một “phiên bản logic” mới.
Nếu chỉ có audit mà không có version, sau này xem log thực thi cũ sẽ khó biết lúc đó rule đang có condition/action nào.
4.2. Cách chốt đơn giản cho tài liệu
Không cần đi vào schema, chỉ cần quy định nghiệp vụ:
mỗi rule có mã định danh ổn định,
mỗi lần sửa nội dung vận hành của rule sẽ tăng số phiên bản,
log thực thi phải gắn với phiên bản rule đã chạy,
người dùng ở UI có thể chỉ thấy “rule hiện tại”, còn phần version chủ yếu phục vụ truy vết/log.
4.3. Khi nào tăng version
Nên tăng version khi thay đổi:
tên rule,
trigger type / trigger event / schedule,
điều kiện,
hành động,
trạng thái bật/tắt,
mức ưu tiên.
Có thể tranh luận tên rule đổi có cần tăng version không. Tôi nghiêng về có, vì nó ảnh hưởng trace log và audit nghiệp vụ.
4.4. Hành vi khi sửa rule đang bật
Tài liệu hiện nói sửa xong áp dụng cho sự kiện tiếp theo.
Nên diễn giải rõ hơn:
các execution chain đã bắt đầu trước thời điểm lưu sửa vẫn dùng phiên bản cũ,
các event/schedule kích hoạt sau thời điểm lưu sửa dùng phiên bản mới,
không có chuyện một chain đang chạy giữa chừng bị đổi sang version mới.
Đây là điểm rất đáng thêm vào.
4.5. Câu chữ có thể đưa vào tài liệu
Mỗi quy tắc phải có một mã định danh ổn định và một số phiên bản nội bộ phục vụ truy vết. Mỗi lần người dùng sửa bất kỳ thành phần vận hành nào của quy tắc như tên, điều kiện, hành động, lịch chạy, mức ưu tiên hoặc trạng thái bật/tắt, hệ thống ghi nhận một phiên bản mới. Các chuỗi xử lý đã bắt đầu trước thời điểm lưu thay đổi vẫn tiếp tục sử dụng phiên bản cũ; các sự kiện phát sinh sau thời điểm lưu thay đổi sẽ sử dụng phiên bản mới. Nhật ký thực thi phải lưu tham chiếu tới phiên bản quy tắc đã chạy để phục vụ điều tra sự cố và đối chiếu hành vi hệ thống tại từng thời điểm.

5) Validate nâng cao cho popup tạo rule
Popup hiện đã có các validate nền:
tên rule bắt buộc và duy nhất,
phải có trigger và action,
điều kiện là tùy chọn,
danh sách field phụ thuộc event,
operator phụ thuộc kiểu dữ liệu,
rule theo lịch tự chuyển sang lịch nội bộ.
Ngoài ra tài liệu cũng đã có message cho:
trùng tên,
vượt 50 rule bật,
tag/trạng thái đã bị xóa.
Nhưng để popup đủ “an toàn vận hành”, nên thêm validate nâng cao theo 5 nhóm.
5.1. Validate cấu hình trigger
Rule theo sự kiện
bắt buộc chọn event.
khi đổi event thì reset field/operator/value không còn tương thích.
Rule theo lịch
bắt buộc chọn frequency.
hour: 0–23.
minute: 0–59.
weekly: bắt buộc chọn ít nhất một thứ.
monthly: bắt buộc chọn ngày 1–31.
5.2. Validate điều kiện
không cho lưu dòng condition thiếu field hoặc operator.
nếu operator cần value thì value bắt buộc.
nếu operator là is_null, is_not_null thì disable ô value.
kiểu value phải khớp kiểu field.
với operator older_than, value phải đúng format kiểu 24h, 7d, 30d đúng như phụ lục.
không cho trùng hoàn toàn 2 điều kiện giống hệt nhau trong cùng rule.
giới hạn số điều kiện tối đa nếu anh/chị muốn giữ UI đơn giản.
5.3. Validate action
Dựa trên phụ lục action hiện có: set_customer_tag, remove_customer_tag, set_appointment_status, set_field, set_care_priority.
Nên thêm:
set_customer_tag / remove_customer_tag: tag phải còn hiệu lực.
set_appointment_status: trạng thái đích phải còn hiệu lực và hợp lệ với đối tượng lịch hẹn.
set_field: field phải nằm trong whitelist cho phép automation cập nhật.
set_care_priority: giá trị priority phải thuộc tập cho phép.
5.4. Validate semantic giữa trigger và action
Đây là nhóm rất quan trọng, nên có dù tài liệu hiện chưa nêu.
Ví dụ:
event chỉ liên quan khách hàng thì không cho action cập nhật field của thực thể không có liên kết xác định.
rule theo lịch quét khách hàng thì không cho action “đổi trạng thái lịch hẹn” nếu không xác định được lịch hẹn mục tiêu.
event lịch hẹn cho phép set status lịch hẹn; event khách hàng có thể chỉ cho set tag / set priority / set_field trên khách.
Tức là phải có ma trận tương thích trigger–action.
5.5. Validate chống cấu hình nguy hiểm
Nên có cảnh báo hoặc chặn cứng:
rule có action dễ sinh event cùng loại với trigger của chính nó,
rule A và B có khả năng tạo vòng lặp rõ ràng,
rule bật mới làm vượt giới hạn số rule bật,
sửa rule hệ thống theo hướng làm mất logic bắt buộc.
5.6. Câu chữ có thể đưa vào tài liệu
Popup tạo/sửa quy tắc phải kiểm tra không chỉ tính đầy đủ hình thức mà còn phải kiểm tra tính hợp lệ ngữ nghĩa của cấu hình. Hệ thống không cho phép lưu quy tắc nếu trigger không tương thích với hành động, nếu trường điều kiện không còn phù hợp với sự kiện đã chọn, nếu giá trị hành động tham chiếu tới thẻ/trạng thái/trường dữ liệu không còn tồn tại, hoặc nếu cấu hình có nguy cơ rõ ràng gây lặp hoặc tự kích hoạt bất tận. Đối với quy tắc theo lịch, hệ thống phải kiểm tra đầy đủ tần suất, giờ, phút, ngày trong tuần và ngày trong tháng tùy theo loại lịch đã chọn.

6) Kết luận chốt lại cho tài liệu của anh/chị
Với các ràng buộc anh/chị đã xác nhận, tôi nghĩ phần phân tích bổ sung nên được viết theo hướng:
không đi vào DB/API,
nhưng phải làm rõ hành vi runtime của engine.
Năm nội dung nên bổ sung mạnh nhất là:
1. Transaction semantics
Chốt rõ: chạy tuần tự theo ưu tiên, mỗi rule là execution độc lập, không rollback toàn chuỗi, rule sau đọc trạng thái mới nhất.
2. Chống chạy trùng
Chốt rõ idempotent cho từng action và chống trùng cả theo dữ liệu hiện tại lẫn theo execution chain.
3. Rule theo lịch
Chốt rõ weekly/monthly semantics, ngày chạy, miss run, overlap run, và phạm vi dữ liệu quét.
4. Versioning
Chốt rõ mỗi lần sửa tạo version mới; log phải gắn version; chain đang chạy không đổi version giữa chừng.
5. Validate nâng cao
Chốt rõ validate semantic giữa trigger–condition–action, không chỉ validate hình thức.
Nếu anh/chị muốn, ở lượt tiếp theo tôi sẽ viết luôn cho anh/chị một đoạn nội dung TKCT hoàn chỉnh theo văn phong tài liệu, chia thành các mục kiểu:
4.2.x Transaction semantics
4.2.x Cơ chế chống chạy trùng
4.2.x Quy tắc vận hành quy tắc theo lịch
5.1.x Quản trị phiên bản quy tắc
3.1.3.x Quy tắc validate nâng cao popup tạo/sửa rule
để anh/chị copy-paste thẳng vào doc.
ok vậy dựa vào tất cả những gì mà tôi đã thảo luận với bạn thì module này sẽ có khoảng bao nhiêu màn hình
Đã suy nghĩ trong vài giây
Dựa trên toàn bộ những gì mình đã trao đổi, module này nên tính khoảng 3 màn hình chính + 4 đến 6 popup/phần chi tiết hỗ trợ.
Nếu chỉ tính màn hình nghiệp vụ chính, tôi chốt là:
Màn hình danh sách quy tắc tự động
Màn hình/Poup tạo mới – chỉnh sửa quy tắc
Màn hình nhật ký thực thi quy tắc
Đây cũng là đúng với khung tài liệu hiện tại: danh sách rule, popup tạo/sửa rule, và màn hình log thực thi.
Nếu tính theo góc nhìn triển khai UI đầy đủ hơn thì thường sẽ ra khoảng 7 đến 9 UI unit, gồm:
1 màn hình danh sách quy tắc
1 popup tạo/sửa quy tắc
1 popup xác nhận xóa rule
1 popup cảnh báo rời trang khi có thay đổi chưa lưu
1 màn hình nhật ký thực thi
1 popup xem chi tiết log
1 popup/cảnh báo khi bật rule có nguy cơ xung đột hoặc vòng lặp
1 popup cấu hình lịch chạy nâng cao nếu anh/chị tách riêng phần schedule
1 popup preview/test rule nếu sau này muốn làm tốt hơn
Cách tôi khuyến nghị chốt để đưa vào thiết kế
Nếu làm bản v1 gọn, anh/chị nên chốt:
3 màn hình chính
4 popup bắt buộc
Tổng cộng khoảng 7 UI là hợp lý.
4 popup gần như nên có bắt buộc
Popup tạo/sửa rule
Popup xác nhận xóa
Popup chi tiết log thực thi
Popup xác nhận đóng/rời khi có dữ liệu chưa lưu
Nếu muốn nâng cấp trải nghiệm admin
thì thêm 1–2 popup nữa:
popup cảnh báo cấu hình nguy hiểm/xung đột
popup test rule / preview kết quả
Kết luận ngắn
Tối thiểu để đủ chạy nghiệp vụ: khoảng 3 màn hình + 4 popup = 7 UI
Nếu tính rộng, đầy đủ vận hành: khoảng 8–9 UI
Nếu chỉ hỏi số màn hình chính: 3 màn hình
1. Màn hình danh sách quy tắc
1.1. Mục tiêu màn hình

Đây là điểm vào chính của phân hệ. Người dùng dùng màn này để:

tra cứu danh sách quy tắc,
lọc theo nhiều tiêu chí,
xem nhanh trạng thái bật/tắt,
mở popup tạo mới/chỉnh sửa,
bật tắt rule,
xóa rule,
đi sang màn nhật ký thực thi.

Cách tổ chức này tương đồng với các màn danh sách trong bộ tài liệu hiện có: luôn là màn trung tâm để tìm kiếm, lọc, phân trang và mở thao tác chi tiết/popup mà không rời khỏi màn danh sách.

1.2. Bố cục đề xuất

Màn nên có 4 vùng chính:

Vùng 1 - Header

Tiêu đề: “Danh sách quy tắc tự động”
Nút: Thêm mới
Nút phụ: Làm mới
Có thể thêm link/tab sang Nhật ký thực thi

Vùng 2 - Bộ lọc

Từ khóa: tên quy tắc
Loại quy tắc: Theo sự kiện / Theo lịch
Trạng thái: Đang bật / Đang tắt
Event/Trigger
Có cảnh báo xung đột hay không
Link Xóa bộ lọc

Vùng 3 - Lưới danh sách
Mỗi dòng là 1 rule, nên có các cột:

Tên quy tắc
Loại kích hoạt
Sự kiện/Lịch chạy
Điều kiện tóm tắt
Hành động tóm tắt
Mức ưu tiên
Trạng thái bật/tắt
Cập nhật lần cuối
Thao tác

Vùng 4 - Phân trang

Tổng số bản ghi
Page size
Pager

Đây là pattern rất giống các màn danh sách chuẩn trong tài liệu mẫu: có vùng lọc, grid, thao tác icon và phân trang.

1.3. Hành động trên từng dòng

Mỗi dòng nên có:

Xem/Sửa
Nhân bản nếu muốn hỗ trợ nhanh
Bật/Tắt
Xóa
Xem log của riêng rule đó
1.4. Luồng xử lý
Người dùng vào menu “Quy tắc tự động gắn thẻ”.
Hệ thống kiểm tra quyền xem.
Hệ thống tải:
danh sách rule trang đầu,
bộ lọc,
tổng số rule,
số rule đang bật/tắt.
Danh sách mặc định sắp theo:
ưu tiên tăng dần,
nếu cùng ưu tiên thì theo cập nhật gần nhất.
Khi người dùng nhập/chọn bộ lọc:
gọi API tìm kiếm,
reset về trang 1.
Khi click Thêm mới:
mở popup tạo/sửa rule ở mode Add.
Khi click Sửa:
mở popup tạo/sửa rule ở mode Edit.
Khi click Bật:
nếu rule có nguy cơ xung đột/vòng lặp thì mở popup cảnh báo trước,
nếu an toàn thì bật ngay.
Khi click Tắt:
cập nhật trạng thái về tắt.
Khi click Xóa:
mở popup xác nhận xóa.
Khi click Xem log:
chuyển sang màn hình nhật ký thực thi, có filter sẵn theo rule đang chọn.
2. Popup tạo/sửa quy tắc
2.1. Mục tiêu

Popup này dùng chung cho 2 mode:

Add: tạo mới rule
Edit: chỉnh sửa rule hiện có

Đây cũng đúng với pattern “dùng chung form cho Add/Edit/View” trong các tài liệu mẫu trước đó.

2.2. Bố cục popup

Popup nên chia thành 4 khối lớn:

Khối A - Thông tin chung
Tên quy tắc
Mô tả ngắn
Trạng thái mặc định: bật/tắt
Mức ưu tiên
Loại rule: Theo sự kiện / Theo lịch
Khối B - Khi nào chạy

Nếu chọn Theo sự kiện:

Chọn event nguồn
Có mô tả ngắn event

Nếu chọn Theo lịch:

Chọn tần suất
Chọn giờ/phút
Nút Cấu hình nâng cao nếu tách popup schedule riêng
Khối C - Điều kiện áp dụng
Chọn kiểu kết hợp: Tất cả điều kiện đúng / Chỉ cần một điều kiện đúng
Danh sách condition dạng dòng:
Trường dữ liệu
Toán tử
Giá trị
Xóa dòng
Nút Thêm điều kiện
Khối D - Hành động thực hiện

Cho chọn 1 hoặc nhiều action:

Gắn thẻ
Gỡ thẻ
Đổi trạng thái lịch hẹn
Cập nhật trường dữ liệu
Đổi mức ưu tiên chăm sóc
Footer popup
Hủy
Lưu nháp
Lưu và bật hoặc Lưu
2.3. Trạng thái hiển thị
Add: tất cả rỗng hoặc theo mặc định
Edit: load dữ liệu hiện tại
Nếu đổi trigger/event thì reset các condition không còn phù hợp
Nếu rule là system rule thì khóa một số field
2.4. Luồng xử lý
Popup mở lên.
Hệ thống load:
danh sách event,
danh sách field theo event,
toán tử theo kiểu dữ liệu,
danh sách tag,
danh sách trạng thái lịch hẹn,
danh sách field được phép update.
Người dùng nhập thông tin chung.
Người dùng chọn trigger:
nếu là event thì hiển thị vùng chọn event,
nếu là schedule thì hiển thị vùng lịch chạy.
Người dùng thêm/sửa/xóa điều kiện.
Người dùng chọn action.
Khi bấm Lưu:
validate bắt buộc,
validate ngữ nghĩa,
nếu có cảnh báo nguy hiểm thì gọi popup cảnh báo xung đột/vòng lặp,
nếu hợp lệ thì lưu.
Nếu đang Edit rule đang bật:
thay đổi chỉ áp dụng cho các lần kích hoạt sau,
không hồi tố chain đang chạy.
3. Popup xác nhận xóa rule
3.1. Mục tiêu

Dùng để xác nhận trước khi xóa 1 rule. Pattern này giống popup xóa trong các tài liệu mẫu CRUD: hiển thị tên bản ghi, nút hủy và nút xóa.

3.2. Nội dung popup
Tiêu đề: Xác nhận xóa
Nội dung:
“Quy tắc [Tên quy tắc] sẽ bị xóa. Bạn có chắc chắn muốn xóa không?”
Có thể bổ sung dòng chú thích:
“Nhật ký thực thi cũ vẫn được giữ lại để tra soát.”
3.3. Nút thao tác
Hủy bỏ
Xóa
3.4. Luồng xử lý
Người dùng bấm icon xóa.
Popup mở ra.
Nếu người dùng bấm Hủy bỏ:
đóng popup,
giữ nguyên danh sách.
Nếu người dùng bấm Xóa:
hệ thống kiểm tra điều kiện xóa,
nếu hợp lệ thì xóa,
refresh danh sách,
hiển thị toast thành công.
Nếu không hợp lệ:
báo lỗi phù hợp, ví dụ:
rule hệ thống không cho xóa,
rule đang bị khóa nghiệp vụ.
4. Popup cảnh báo rời trang khi có thay đổi chưa lưu
4.1. Mục tiêu

Ngăn mất dữ liệu khi người dùng:

bấm nút Hủy,
bấm X,
click ra ngoài popup,
đổi màn hình/menu,
back browser khi form đã chỉnh sửa mà chưa lưu.

Pattern này cũng đã được dùng ở các màn form trong tài liệu trước: nếu có thay đổi chưa lưu thì phải hỏi xác nhận.

4.2. Nội dung popup
Tiêu đề: Dữ liệu chưa được lưu
Nội dung:
“Bạn có thay đổi chưa lưu. Bạn có chắc chắn muốn rời khỏi màn hình này không?”
4.3. Nút thao tác
Ở lại
Rời đi
4.4. Luồng xử lý
Người dùng thay đổi ít nhất 1 field.
Hệ thống đánh dấu form là dirty.
Khi người dùng thực hiện thao tác rời form:
mở popup cảnh báo.
Nếu chọn Ở lại:
đóng popup,
quay lại form.
Nếu chọn Rời đi:
đóng popup,
bỏ thay đổi chưa lưu,
quay về màn trước hoặc đóng popup cha.
5. Màn hình nhật ký thực thi
5.1. Mục tiêu

Màn này là nơi theo dõi toàn bộ lịch sử chạy rule:

rule nào đã chạy,
chạy lúc nào,
chạy thành công/bỏ qua/lỗi,
áp dụng cho đối tượng nào,
mất bao lâu,
lỗi gì.

Cấu trúc này nên theo pattern các màn thẩm định/list log trước: có bộ lọc, summary card/trạng thái và 1 grid chính duy nhất.

5.2. Bố cục màn
Vùng 1 - Header
Tiêu đề: Nhật ký thực thi
Nút Làm mới
Có thể có Xuất Excel
Vùng 2 - Bộ lọc
Từ ngày
Đến ngày
Quy tắc
Kết quả: Thành công / Bỏ qua / Lỗi
Loại kích hoạt: Event / Schedule
Ô tìm kiếm theo tên rule hoặc đối tượng áp dụng
Link Xóa bộ lọc
Vùng 3 - Thống kê nhanh
Tất cả
Thành công
Bỏ qua
Lỗi
Vùng 4 - Một bảng danh sách duy nhất

Các cột nên có:

Thời gian thực thi
Tên quy tắc
Loại kích hoạt / Sự kiện
Đối tượng áp dụng
Kết quả
Thời gian xử lý
Ghi chú/Lý do lỗi ngắn
Thao tác Xem chi tiết
Vùng 5 - Phân trang
page size
tổng bản ghi
pager
5.3. Luồng xử lý
Người dùng vào menu Nhật ký thực thi hoặc từ danh sách rule click Xem log.
Hệ thống kiểm tra quyền xem log.
Hệ thống tải dữ liệu khởi tạo:
thống kê tổng số log,
danh sách log trang đầu,
bộ lọc.
Nếu vào từ 1 rule cụ thể:
tự động gắn filter theo rule đó.
Khi thay đổi bộ lọc:
gọi API,
reset trang 1.
Khi click 1 tab thống kê:
áp filter tương ứng.
Khi click Xem chi tiết:
mở popup chi tiết log.
Khi click Xuất Excel:
xuất dữ liệu theo filter hiện tại.
6. Popup xem chi tiết log
6.1. Mục tiêu

Cho phép người dùng xem sâu 1 lần thực thi cụ thể.

6.2. Bố cục popup
Khối A - Thông tin chung
Mã log / mã chain
Tên quy tắc
Version rule
Thời gian bắt đầu
Thời gian kết thúc
Kết quả
Thời gian xử lý
Khối B - Thông tin kích hoạt
Loại kích hoạt: Event / Schedule
Sự kiện nguồn hoặc lịch chạy
Cấp lan truyền
Parent execution nếu có
Khối C - Đối tượng áp dụng
Loại đối tượng: Khách hàng / Lịch hẹn / Liệu trình...
ID đối tượng
Tên hiển thị ngắn
Khối D - Điều kiện đã đánh giá
Danh sách từng condition
Kết quả từng condition: đúng/sai
Giá trị thực tế tại thời điểm chạy
Khối E - Hành động đã thực hiện
Action nào được chạy
Action nào bị skip
Lý do skip
Dữ liệu trước/sau nếu cần
Khối F - Lỗi
Mã lỗi
Thông điệp lỗi
Stack/message kỹ thuật rút gọn nếu có
6.3. Luồng xử lý
Người dùng bấm Xem chi tiết.
Popup mở.
Hệ thống load đầy đủ chi tiết log.
Người dùng chỉ đọc, không chỉnh sửa.
Có thể có nút:
Đóng
Xem rule
Copy JSON hoặc Copy thông tin lỗi nếu cần cho dev/QA.
7. Popup/cảnh báo khi bật rule có nguy cơ xung đột hoặc vòng lặp
7.1. Mục tiêu

Không chặn người dùng một cách mù mờ, nhưng phải cảnh báo trước khi bật rule có khả năng:

tự kích hoạt lại chính nó,
đụng với rule khác,
gây thay đổi vòng lặp A → B → A,
gây ghi đè cùng dữ liệu.
7.2. Nội dung popup
Tiêu đề: Cảnh báo cấu hình có rủi ro
Mô tả ngắn:
“Quy tắc này có thể gây xung đột hoặc tạo vòng lặp với các quy tắc đang bật.”
Danh sách cảnh báo:
Tự kích hoạt lại cùng event
Xung đột với rule X
Có thể cập nhật cùng trường với rule Y
Có nguy cơ phát sinh chuỗi lan truyền nhiều cấp
7.3. Nút thao tác
Quay lại chỉnh sửa
Vẫn bật quy tắc
7.4. Luồng xử lý
Người dùng bấm Lưu và bật hoặc bật toggle từ danh sách.
Hệ thống chạy kiểm tra semantic.
Nếu không có rủi ro:
bật luôn.
Nếu có rủi ro:
mở popup cảnh báo.
Nếu chọn Quay lại chỉnh sửa:
đóng popup,
quay lại form.
Nếu chọn Vẫn bật quy tắc:
ghi nhận người dùng đã xác nhận,
bật rule,
log audit.
8. Popup cấu hình lịch chạy nâng cao
8.1. Khi nào cần tách riêng

Nếu phần schedule trong popup tạo/sửa bị dài hoặc phức tạp, nên tách thành popup con riêng để UI gọn hơn.

8.2. Nội dung popup
Thông tin cơ bản
Tần suất:
Hàng ngày
Hàng tuần
Hàng tháng
Nếu hàng ngày
Giờ
Phút
Nếu hàng tuần
Chọn thứ trong tuần
Giờ
Phút
Nếu hàng tháng
Chọn ngày chạy trong tháng
Giờ
Phút
Tuỳ chọn bổ sung
Múi giờ
Không chạy chồng nếu lượt trước chưa xong
Có chạy ngay khi bật hay không
8.3. Luồng xử lý
Người dùng trong popup rule bấm Cấu hình nâng cao.
Popup lịch chạy mở lên.
Người dùng chọn tần suất.
Form động thay đổi theo tần suất.
Hệ thống validate:
giờ 0–23,
phút 0–59,
weekly phải có ít nhất 1 thứ,
monthly phải có ngày hợp lệ.
Khi bấm Áp dụng:
trả dữ liệu về popup rule cha,
hiển thị tóm tắt lịch chạy dạng text.
Khi bấm Hủy:
đóng popup,
không lưu thay đổi.
9. Popup preview/test rule
9.1. Mục tiêu

Đây là popup nâng cao, chưa bắt buộc cho v1, nhưng rất đáng làm nếu muốn trải nghiệm admin tốt hơn.

Nó cho phép:

kiểm tra rule trước khi bật,
test với dữ liệu mẫu,
xem condition nào match,
action nào sẽ chạy.
9.2. Nội dung popup
Khối A - Chọn dữ liệu test
Chọn đối tượng test:
Khách hàng
Lịch hẹn
Liệu trình
Chọn bản ghi cụ thể
Khối B - Snapshot dữ liệu đầu vào
Hiển thị vài field chính của bản ghi test
Khối C - Kết quả đánh giá
Condition 1: đúng/sai
Condition 2: đúng/sai
Tổng kết: rule match / không match
Khối D - Hành động dự kiến
Action nào sẽ chạy
Action nào bị skip
Cảnh báo nếu có xung đột
9.3. Nút thao tác
Đóng
Chạy thử lại
9.4. Luồng xử lý
Người dùng bấm Test rule.
Popup mở.
Hệ thống yêu cầu chọn đối tượng test.
Sau khi chọn:
tải dữ liệu thật của bản ghi test,
mô phỏng evaluate rule,
không ghi dữ liệu thật.
Hệ thống hiển thị kết quả.
Người dùng có thể quay lại chỉnh rule.
10. Cách giao cho trợ lý/UI để họ dễ làm

Anh/chị có thể giao theo cấu trúc này cho trợ lý:

Với mỗi màn/popup cần làm rõ 6 ý:

Mục tiêu màn
Bố cục khối giao diện
Danh sách field/control
Trạng thái hiển thị
Hành động người dùng
Luồng xử lý click-by-click

Đây cũng là cách rất gần với format mô tả “thành phần + luồng xử lý” đang dùng trong các tài liệu thiết kế chi tiết mẫu của anh/chị.

Nếu anh/chị muốn, lượt tiếp theo tôi sẽ viết tiếp cho anh/chị theo đúng format tài liệu BM.04, chia thành từng mục kiểu:

3.1.2 Danh sách quy tắc
3.1.3 Popup tạo/sửa quy tắc
3.1.4 Popup xác nhận xóa
3.1.5 Popup cảnh báo rời trang
3.1.6 Nhật ký thực thi
