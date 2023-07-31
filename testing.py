import torch
from transformers import T5ForConditionalGeneration, T5Tokenizer
if torch.cuda.is_available():
    device = torch.device("cuda")

    print('There are %d GPU(s) available.' % torch.cuda.device_count())

    print('We will use the GPU:', torch.cuda.get_device_name(0))
else:
    print('No GPU available, using the CPU instead.')
    device = torch.device("cpu")

model = T5ForConditionalGeneration.from_pretrained(
    "NlpHUST/t5-small-vi-summarization")
tokenizer = T5Tokenizer.from_pretrained(
    "NlpHUST/t5-small-vi-summarization", legacy=False)
model.to(device)

src = """Sáng 31/7, khu vực sạt lở tại Trạm cảnh sát giao thông Madagui (thuộc CSGT Công an Lâm Đồng) trên đèo Bảo Lộc, lực lượng cứu hộ đưa các vật dụng, tài sản trong trạm ra ngoài, sau khi khối đất đá hàng trăm tấn được giải tỏa. Bảy xe múc, xe ủi cào đống đất đá trên quốc lộ. Ở nơi diễn ra sạt lở nặng nhất, hàng chục người cùng phương tiện cào các lớp đất dày hàng mét để tiến sâu vào bên trong trạm, tìm kiếm nạn nhân cuối cùng. Lực lượng cứu hộ đã tháo dỡ khu nhà chính của trụ sở bị nghiêng. Cảnh sát đưa nhiều chó nghiệp vụ vào hiện trường tìm kiếm ở khu vực thung lũng. Khoảng 12h, thi thể nạn nhân thứ tư được tìm thấy ở dưới đống đất đá tại trạm."""
tokenized_text = tokenizer.encode(src, return_tensors="pt").to(device)
model.eval()
summary_ids = model.generate(
    tokenized_text,
    max_length=256,
    num_beams=5,
    repetition_penalty=2.5,
    length_penalty=1.0,
    early_stopping=True,
    min_length=150
)
output = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
print(output)
