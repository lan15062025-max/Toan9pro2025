import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function explainTopic(topic: string, chapterTitle: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Bạn là một giáo viên dạy Toán lớp 9 giỏi. Hãy giải thích chi tiết kiến thức về chủ đề "${topic}" thuộc chương "${chapterTitle}" trong chương trình Toán 9 sách Kết nối tri thức. 
      Yêu cầu:
      1. Giải thích ngắn gọn, dễ hiểu.
      2. Đưa ra công thức quan trọng (sử dụng định dạng LaTeX nếu cần, ví dụ $ax^2 + bx + c = 0$).
      3. Đưa ra 1 ví dụ minh họa kèm lời giải.
      4. Ngôn ngữ: Tiếng Việt.`,
    });
    return response.text;
  } catch (error) {
    console.error("Error explaining topic:", error);
    return "Xin lỗi, hiện tại tôi không thể giải thích chủ đề này. Vui lòng thử lại sau.";
  }
}

export async function chatWithAI(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  try {
    // Only send the most recent 6 turns (3 user-model pairs) to manage token usage
    const recentHistory = history.slice(-6);

    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: `Bạn là một giáo viên dạy Toán lớp 9 tâm huyết, chuyên gia về chương trình sách Kết nối tri thức. 
        Nhiệm vụ của bạn là hỗ trợ học sinh học tập theo phương pháp SƯ PHẠM TƯ DUY:
        1. KHÔNG đưa ra lời giải ngay lập tức khi học sinh hỏi bài.
        2. GỢI Ý TỪNG BƯỚC: Hãy đặt các câu hỏi ngược lại để kiểm tra kiến thức nền tảng của học sinh liên quan đến bài toán.
        3. GỢI Ý CÔNG THỨC/ĐỊNH LÝ: Đưa ra các gợi ý về định lý, công thức hoặc tính chất toán học cần thiết để giải quyết vấn đề đó.
        4. KHUYẾN KHÍCH: Luôn động viên học sinh tự suy nghĩ và thực hiện từng bước tính toán.
        5. ĐỊNH DẠNG: Sử dụng LaTeX cho các công thức toán học (ví dụ: $x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}$).
        6. NGÔN NGỮ: Tiếng Việt, thân thiện, gần gũi nhưng vẫn chuyên nghiệp.
        
        Mục tiêu cuối cùng là giúp học sinh hiểu bản chất vấn đề và tự mình tìm ra lời giải thay vì chép đáp án.`,
      },
      history: recentHistory,
    });

    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Error in AI chat:", error);
    return "Xin lỗi, tôi gặp chút trục trặc khi xử lý câu hỏi của bạn. Bạn có thể thử lại không?";
  }
}

export async function getLearningRecommendation(stats: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Dựa trên kết quả làm bài của học sinh lớp 9 sau đây:
      ${stats}
      
      Hãy đưa ra lộ trình học tập cá nhân hóa. 
      Yêu cầu:
      1. Nhận xét về điểm mạnh và điểm yếu.
      2. Gợi ý cụ thể các chương hoặc dạng bài tập (Nhận biết, Thông hiểu, Vận dụng) cần tập trung ôn tập.
      3. Đưa ra lời khuyên để cải thiện kết quả.
      4. Ngôn ngữ: Tiếng Việt. Định dạng: Markdown.`,
    });
    return response.text;
  } catch (error) {
    console.error("Error getting recommendation:", error);
    return "Không thể tạo lộ trình lúc này. Hãy tiếp tục luyện tập thêm!";
  }
}
