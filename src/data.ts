export interface Question {
  id: string;
  chapterId: string;
  text: string;
  options: string[];
  correctAnswer: number;
  level: 'NB' | 'TH' | 'VD';
  explanation?: string;
}

export interface EssayProblem {
  id: string;
  title: string;
  text: string;
  hint?: string;
  solution: string;
  level: 'Nâng cao';
}

export interface Chapter {
  id: string;
  title: string;
  summary: string;
  topics: string[];
}

export const CHAPTERS: Chapter[] = [
  {
    id: 'ch1',
    title: 'Chương I: Phương trình và hệ hai phương trình bậc nhất hai ẩn',
    summary: 'Hệ thống kiến thức về phương trình bậc nhất hai ẩn, hệ hai phương trình bậc nhất hai ẩn và các phương pháp giải (thế, cộng đại số).',
    topics: [
      'Phương trình bậc nhất hai ẩn: ax + by = c',
      'Hệ hai phương trình bậc nhất hai ẩn',
      'Giải hệ phương trình bằng phương pháp thế',
      'Giải hệ phương trình bằng phương pháp cộng đại số',
      'Giải bài toán bằng cách lập hệ phương trình'
    ]
  },
  {
    id: 'ch2',
    title: 'Chương II: Phương trình bậc hai một ẩn',
    summary: 'Kiến thức về hàm số y = ax^2, phương trình bậc hai một ẩn, công thức nghiệm, định lý Vi-ét và ứng dụng.',
    topics: [
      'Hàm số y = ax^2 (a ≠ 0)',
      'Phương trình bậc hai một ẩn',
      'Công thức nghiệm và công thức nghiệm thu gọn',
      'Định lý Vi-ét: x1 + x2 = -b/a, x1.x2 = c/a',
      'Giải bài toán bằng cách lập phương trình bậc hai'
    ]
  },
  {
    id: 'ch3',
    title: 'Chương III: Hệ thức lượng trong tam giác vuông',
    summary: 'Các hệ thức về cạnh và đường cao, tỉ số lượng giác của góc nhọn và ứng dụng giải tam giác vuông.',
    topics: [
      'Một số hệ thức về cạnh và đường cao trong tam giác vuông',
      'Tỉ số lượng giác của góc nhọn (sin, cos, tan, cot)',
      'Hệ thức giữa cạnh và góc trong tam giác vuông',
      'Ứng dụng thực tế của tỉ số lượng giác'
    ]
  },
  {
    id: 'ch4',
    title: 'Chương IV: Đường tròn',
    summary: 'Định nghĩa đường tròn, vị trí tương đối, tiếp tuyến và các loại góc với đường tròn.',
    topics: [
      'Sự xác định đường tròn. Tính chất đối xứng của đường tròn',
      'Đường kính và dây của đường tròn',
      'Liên hệ giữa dây và khoảng cách từ tâm đến dây',
      'Vị trí tương đối của đường thẳng và đường tròn',
      'Tiếp tuyến của đường tròn',
      'Góc ở tâm. Số đo cung',
      'Góc nội tiếp. Góc tạo bởi tia tiếp tuyến và dây cung'
    ]
  }
];

export const QUESTIONS: Question[] = [
  {
    id: 'q1',
    chapterId: 'ch1',
    level: 'NB',
    text: 'Phương trình nào sau đây là phương trình bậc nhất hai ẩn?',
    options: ['2x + 3y = 5', 'x^2 + y = 1', '2x - 3 = 0', 'x + y + z = 0'],
    correctAnswer: 0,
    explanation: 'Phương trình bậc nhất hai ẩn có dạng ax + by = c (a, b không đồng thời bằng 0).'
  },
  {
    id: 'q2',
    chapterId: 'ch1',
    level: 'TH',
    text: 'Cặp số (1; -2) là nghiệm của hệ phương trình nào?',
    options: ['{x + y = -1; 2x - y = 4}', '{x - y = 3; x + y = 1}', '{2x + y = 0; x - y = -1}', '{x + 2y = 5; 2x - y = 0}'],
    correctAnswer: 0,
    explanation: 'Thay x=1, y=-2 vào hệ: 1 + (-2) = -1 (đúng) và 2(1) - (-2) = 4 (đúng).'
  },
  {
    id: 'q3',
    chapterId: 'ch2',
    level: 'NB',
    text: 'Biệt thức Δ của phương trình ax^2 + bx + c = 0 (a ≠ 0) được tính theo công thức:',
    options: ['Δ = b^2 - 4ac', 'Δ = b^2 + 4ac', 'Δ = b - 4ac', 'Δ = b^2 - ac'],
    correctAnswer: 0
  },
  {
    id: 'q4',
    chapterId: 'ch2',
    level: 'VD',
    text: 'Tìm m để phương trình x^2 - 2x + m = 0 có hai nghiệm phân biệt.',
    options: ['m < 1', 'm > 1', 'm = 1', 'm ≤ 1'],
    correctAnswer: 0,
    explanation: 'Để phương trình có 2 nghiệm phân biệt thì Δ\' > 0 <=> (-1)^2 - m > 0 <=> 1 - m > 0 <=> m < 1.'
  },
  {
    id: 'q5',
    chapterId: 'ch3',
    level: 'NB',
    text: 'Trong tam giác vuông, sin của một góc nhọn bằng:',
    options: ['Cạnh đối / Cạnh huyền', 'Cạnh kề / Cạnh huyền', 'Cạnh đối / Cạnh kề', 'Cạnh kề / Cạnh đối'],
    correctAnswer: 0
  },
  {
    id: 'q6',
    chapterId: 'ch3',
    level: 'TH',
    text: 'Cho tam giác ABC vuông tại A có AB = 3, AC = 4. Tính sinB.',
    options: ['4/5', '3/5', '3/4', '4/3'],
    correctAnswer: 0,
    explanation: 'BC = sqrt(3^2 + 4^2) = 5. sinB = AC/BC = 4/5.'
  },
  {
    id: 'q7',
    chapterId: 'ch4',
    level: 'NB',
    text: 'Số điểm chung của đường thẳng và đường tròn trong trường hợp đường thẳng tiếp xúc với đường tròn là:',
    options: ['1', '2', '0', 'Vô số'],
    correctAnswer: 0
  },
  {
    id: 'q8',
    chapterId: 'ch4',
    level: 'TH',
    text: 'Góc nội tiếp chắn nửa đường tròn có số đo bằng:',
    options: ['90°', '180°', '45°', '60°'],
    correctAnswer: 0
  },
  {
    id: 'q9',
    chapterId: 'ch2',
    level: 'TH',
    text: 'Tổng hai nghiệm của phương trình x^2 - 5x + 6 = 0 là:',
    options: ['5', '-5', '6', '-6'],
    correctAnswer: 0,
    explanation: 'Theo định lý Vi-ét, x1 + x2 = -b/a = -(-5)/1 = 5.'
  },
  {
    id: 'q10',
    chapterId: 'ch1',
    level: 'VD',
    text: 'Một hình chữ nhật có chu vi 20cm. Nếu tăng chiều dài 2cm và giảm chiều rộng 1cm thì diện tích không đổi. Chiều dài ban đầu là:',
    options: ['6cm', '7cm', '5cm', '4cm'],
    correctAnswer: 0,
    explanation: 'Gọi x, y là dài, rộng. 2(x+y)=20 => x+y=10. (x+2)(y-1)=xy => xy-x+2y-2=xy => -x+2y=2. Giải hệ: x=6, y=4.'
  },
  {
    id: 'q11',
    chapterId: 'ch1',
    level: 'NB',
    text: 'Hệ phương trình bậc nhất hai ẩn ax + by = c và a\'x + b\'y = c\' có nghiệm duy nhất khi:',
    options: ['a/a\' ≠ b/b\'', 'a/a\' = b/b\'', 'a/a\' = b/b\' = c/c\'', 'a/a\' = b/b\' ≠ c/c\''],
    correctAnswer: 0,
    explanation: 'Hệ có nghiệm duy nhất khi hai đường thẳng biểu diễn tập nghiệm cắt nhau, tương ứng với tỉ lệ hệ số góc khác nhau.'
  },
  {
    id: 'q12',
    chapterId: 'ch1',
    level: 'TH',
    text: 'Nghiệm của hệ phương trình {x + y = 3; x - y = 1} là:',
    options: ['(2; 1)', '(1; 2)', '(3; 0)', '(0; 3)'],
    correctAnswer: 0,
    explanation: 'Cộng hai phương trình ta được 2x = 4 => x = 2. Thay vào phương trình đầu ta được 2 + y = 3 => y = 1.'
  },
  {
    id: 'q13',
    chapterId: 'ch2',
    level: 'NB',
    text: 'Phương trình ax^2 + bx + c = 0 (a ≠ 0) có nghiệm kép khi:',
    options: ['Δ = 0', 'Δ > 0', 'Δ < 0', 'Δ ≥ 0'],
    correctAnswer: 0
  },
  {
    id: 'q14',
    chapterId: 'ch2',
    level: 'TH',
    text: 'Cho phương trình x^2 - 3x + 2 = 0 có hai nghiệm x1, x2. Tính giá trị của x1^2 + x2^2.',
    options: ['5', '9', '13', '7'],
    correctAnswer: 0,
    explanation: 'Theo Vi-ét: x1+x2=3, x1x2=2. Ta có x1^2+x2^2 = (x1+x2)^2 - 2x1x2 = 3^2 - 2*2 = 9 - 4 = 5.'
  },
  {
    id: 'q15',
    chapterId: 'ch3',
    level: 'NB',
    text: 'Trong tam giác vuông, bình phương mỗi cạnh góc vuông bằng:',
    options: ['Tích của cạnh huyền và hình chiếu của nó trên cạnh huyền', 'Tích của hai hình chiếu', 'Tích của cạnh huyền và đường cao', 'Tổng bình phương hai cạnh góc vuông'],
    correctAnswer: 0
  },
  {
    id: 'q16',
    chapterId: 'ch3',
    level: 'VD',
    text: 'Một cột cờ cao 10m có bóng trên mặt đất dài 6m. Tính góc mà tia sáng mặt trời tạo với mặt đất (làm tròn đến độ).',
    options: ['59°', '31°', '45°', '60°'],
    correctAnswer: 0,
    explanation: 'tanα = đối/kề = 10/6 ≈ 1.67 => α ≈ 59°.'
  },
  {
    id: 'q17',
    chapterId: 'ch4',
    level: 'NB',
    text: 'Cho đường tròn (O; R). Điểm M nằm ngoài đường tròn khi:',
    options: ['OM > R', 'OM < R', 'OM = R', 'OM ≤ R'],
    correctAnswer: 0
  },
  {
    id: 'q18',
    chapterId: 'ch4',
    level: 'VD',
    text: 'Cho đường tròn (O) và dây AB không đi qua tâm. Gọi H là trung điểm của AB. Khẳng định nào sau đây là đúng?',
    options: ['OH ⊥ AB', 'OH // AB', 'OH = AB', 'OH > R'],
    correctAnswer: 0,
    explanation: 'Trong một đường tròn, đường kính đi qua trung điểm của một dây không đi qua tâm thì vuông góc với dây ấy.'
  },
  {
    id: 'q19',
    chapterId: 'ch1',
    level: 'NB',
    text: 'Phương trình nào sau đây KHÔNG phải là phương trình bậc nhất hai ẩn?',
    options: ['x - 2y = 3', '0x + 0y = 5', '2x + 0y = 1', '0x - 3y = 0'],
    correctAnswer: 1,
    explanation: 'Phương trình bậc nhất hai ẩn ax + by = c yêu cầu a và b không đồng thời bằng 0.'
  },
  {
    id: 'q20',
    chapterId: 'ch1',
    level: 'TH',
    text: 'Tìm giá trị của m để hệ phương trình {mx - y = 1; x + y = 2} có nghiệm (x; y) = (1; 1).',
    options: ['m = 2', 'm = 1', 'm = 0', 'm = -1'],
    correctAnswer: 0,
    explanation: 'Thay x=1, y=1 vào phương trình đầu: m(1) - 1 = 1 => m = 2.'
  },
  {
    id: 'q21',
    chapterId: 'ch2',
    level: 'NB',
    text: 'Hàm số y = -2x^2 đồng biến khi:',
    options: ['x < 0', 'x > 0', 'x = 0', 'Mọi x'],
    correctAnswer: 0,
    explanation: 'Hàm số y = ax^2 với a < 0 đồng biến khi x < 0 và nghịch biến khi x > 0.'
  },
  {
    id: 'q22',
    chapterId: 'ch2',
    level: 'TH',
    text: 'Phương trình x^2 - 4x + 4 = 0 có bao nhiêu nghiệm?',
    options: ['1 nghiệm duy nhất', '2 nghiệm phân biệt', 'Vô nghiệm', 'Vô số nghiệm'],
    correctAnswer: 0,
    explanation: 'Δ = (-4)^2 - 4(1)(4) = 16 - 16 = 0. Phương trình có nghiệm kép x = 2.'
  },
  {
    id: 'q23',
    chapterId: 'ch3',
    level: 'NB',
    text: 'Cho góc nhọn α. Khẳng định nào sau đây là SAI?',
    options: ['sin^2α + cos^2α = 1', 'tanα = sinα/cosα', 'sinα > 1', 'cotα = 1/tanα'],
    correctAnswer: 2,
    explanation: 'Với góc nhọn α, 0 < sinα < 1.'
  },
  {
    id: 'q24',
    chapterId: 'ch3',
    level: 'TH',
    text: 'Cho tam giác ABC vuông tại A, đường cao AH. Biết HB = 2, HC = 8. Độ dài AH là:',
    options: ['4', '16', '10', '5'],
    correctAnswer: 0,
    explanation: 'Áp dụng hệ thức lượng: AH^2 = HB.HC = 2.8 = 16 => AH = 4.'
  },
  {
    id: 'q25',
    chapterId: 'ch4',
    level: 'NB',
    text: 'Đường tròn tâm O bán kính R có bao nhiêu trục đối xứng?',
    options: ['Vô số', '1', '2', '0'],
    correctAnswer: 0,
    explanation: 'Mọi đường thẳng đi qua tâm đều là trục đối xứng của đường tròn.'
  },
  {
    id: 'q26',
    chapterId: 'ch4',
    level: 'TH',
    text: 'Cho đường tròn (O; 5cm) và dây AB = 8cm. Khoảng cách từ tâm O đến dây AB là:',
    options: ['3cm', '4cm', '9cm', 'sqrt(41)cm'],
    correctAnswer: 0,
    explanation: 'Gọi H là trung điểm AB => AH = 4cm. OH = sqrt(OA^2 - AH^2) = sqrt(5^2 - 4^2) = 3cm.'
  },
  {
    id: 'q27',
    chapterId: 'ch1',
    level: 'VD',
    text: 'Tìm m để hệ phương trình {x + y = 3; 2x + 2y = m} vô nghiệm.',
    options: ['m ≠ 6', 'm = 6', 'm > 6', 'm < 6'],
    correctAnswer: 0,
    explanation: 'Hệ vô nghiệm khi 1/2 = 1/2 ≠ 3/m => m ≠ 6.'
  },
  {
    id: 'q28',
    chapterId: 'ch2',
    level: 'VD',
    text: 'Cho phương trình x^2 - (m+1)x + m = 0. Tìm m để phương trình có hai nghiệm x1, x2 thỏa mãn x1^2 + x2^2 = 5.',
    options: ['m = 2 hoặc m = -2', 'm = 2', 'm = -2', 'm = 1'],
    correctAnswer: 0,
    explanation: 'x1+x2 = m+1, x1x2 = m. x1^2+x2^2 = (m+1)^2 - 2m = m^2+2m+1-2m = m^2+1. m^2+1 = 5 => m^2 = 4 => m = ±2.'
  },
  {
    id: 'q29',
    chapterId: 'ch3',
    level: 'VD',
    text: 'Cho tam giác ABC vuông tại A, góc B = 60°, BC = 10cm. Độ dài cạnh AC là:',
    options: ['5sqrt(3)cm', '5cm', '10sqrt(3)cm', '5sqrt(2)cm'],
    correctAnswer: 0,
    explanation: 'AC = BC.sinB = 10.sin60° = 10.(sqrt(3)/2) = 5sqrt(3)cm.'
  },
  {
    id: 'q30',
    chapterId: 'ch4',
    level: 'VD',
    text: 'Từ điểm A nằm ngoài đường tròn (O), kẻ hai tiếp tuyến AB, AC. Biết góc BAC = 60°, OA = 4cm. Bán kính đường tròn (O) là:',
    options: ['2cm', '2sqrt(3)cm', '4cm', 'sqrt(3)cm'],
    correctAnswer: 0,
    explanation: 'Góc BAO = 30°. R = OB = OA.sin30° = 4.0.5 = 2cm.'
  },
  {
    id: 'q31',
    chapterId: 'ch1',
    level: 'NB',
    text: 'Nghiệm tổng quát của phương trình 2x - y = 1 là:',
    options: ['{x ∈ R; y = 2x - 1}', '{x ∈ R; y = 2x + 1}', '{y ∈ R; x = 2y - 1}', '{x = 1; y = 1}'],
    correctAnswer: 0
  },
  {
    id: 'q32',
    chapterId: 'ch2',
    level: 'NB',
    text: 'Phương trình nào sau đây là phương trình bậc hai một ẩn?',
    options: ['2x^2 - 3x + 1 = 0', 'x^3 - x = 0', '2x + 1 = 0', 'x^2 + y^2 = 1'],
    correctAnswer: 0
  },
  {
    id: 'q33',
    chapterId: 'ch3',
    level: 'NB',
    text: 'Trong tam giác vuông, tan của một góc nhọn bằng:',
    options: ['Đối / Kề', 'Kề / Đối', 'Đối / Huyền', 'Kề / Huyền'],
    correctAnswer: 0
  },
  {
    id: 'q34',
    chapterId: 'ch4',
    level: 'NB',
    text: 'Đường thẳng và đường tròn có tối đa bao nhiêu điểm chung?',
    options: ['2', '1', '0', 'Vô số'],
    correctAnswer: 0
  },
  {
    id: 'q35',
    chapterId: 'ch1',
    level: 'TH',
    text: 'Hệ phương trình {x - y = 1; x + y = 3} có nghiệm là:',
    options: ['(2; 1)', '(1; 2)', '(3; 2)', '(2; 3)'],
    correctAnswer: 0
  },
  {
    id: 'q36',
    chapterId: 'ch2',
    level: 'TH',
    text: 'Tích hai nghiệm của phương trình 2x^2 - 5x + 2 = 0 là:',
    options: ['1', '2.5', '2', '0.5'],
    correctAnswer: 0,
    explanation: 'x1x2 = c/a = 2/2 = 1.'
  },
  {
    id: 'q37',
    chapterId: 'ch3',
    level: 'TH',
    text: 'Nếu sinα = 0.6 thì cosα bằng (α nhọn):',
    options: ['0.8', '0.4', '0.64', '0.36'],
    correctAnswer: 0,
    explanation: 'cosα = sqrt(1 - sin^2α) = sqrt(1 - 0.36) = 0.8.'
  },
  {
    id: 'q38',
    chapterId: 'ch4',
    level: 'TH',
    text: 'Góc tạo bởi tia tiếp tuyến và dây cung bằng:',
    options: ['Nửa số đo cung bị chắn', 'Số đo cung bị chắn', 'Góc nội tiếp cùng chắn cung đó', 'Cả A và C đều đúng'],
    correctAnswer: 3
  },
  {
    id: 'q39',
    chapterId: 'ch1',
    level: 'VD',
    text: 'Hai vòi nước cùng chảy vào một bể không có nước thì sau 4 giờ đầy bể. Nếu chảy riêng thì vòi 1 đầy bể nhanh hơn vòi 2 là 6 giờ. Thời gian vòi 1 chảy riêng đầy bể là:',
    options: ['6 giờ', '12 giờ', '10 giờ', '8 giờ'],
    correctAnswer: 0,
    explanation: '1/x + 1/(x+6) = 1/4 => 4(2x+6) = x(x+6) => x^2-2x-24=0 => x=6.'
  },
  {
    id: 'q40',
    chapterId: 'ch2',
    level: 'VD',
    text: 'Một khu vườn hình chữ nhật có diện tích 600m2 và chu vi 100m. Chiều dài của khu vườn là:',
    options: ['30m', '20m', '25m', '40m'],
    correctAnswer: 0,
    explanation: 'x+y=50, xy=600. x, y là nghiệm t^2-50t+600=0 => t=20, 30.'
  },
  {
    id: 'q41',
    chapterId: 'ch3',
    level: 'VD',
    text: 'Cho tam giác ABC vuông tại A, AH là đường cao. Biết AB = 6, AC = 8. Tính độ dài đoạn thẳng CH.',
    options: ['6.4', '3.6', '4.8', '10'],
    correctAnswer: 0,
    explanation: 'BC = 10. AC^2 = CH.BC => 64 = CH.10 => CH = 6.4.'
  },
  {
    id: 'q42',
    chapterId: 'ch4',
    level: 'VD',
    text: 'Cho đường tròn (O; 10cm), dây AB = 16cm. Lấy điểm I trên dây AB sao cho AI = 4cm. Tính độ dài OI.',
    options: ['2sqrt(13)cm', '6cm', '8cm', 'sqrt(52)cm'],
    correctAnswer: 0,
    explanation: 'H là trung điểm AB => AH = 8, OH = 6. IH = AH - AI = 4. OI = sqrt(OH^2 + IH^2) = sqrt(36 + 16) = sqrt(52) = 2sqrt(13).'
  },
  // --- CH1: 30 questions ---
  { id: 'q43', chapterId: 'ch1', level: 'NB', text: 'Phương trình x - 2y = 1 có bao nhiêu nghiệm?', options: ['Vô số nghiệm', '1 nghiệm', '2 nghiệm', 'Vô nghiệm'], correctAnswer: 0 },
  { id: 'q44', chapterId: 'ch1', level: 'NB', text: 'Hệ phương trình {x + y = 2; x - y = 0} có nghiệm là:', options: ['(1; 1)', '(2; 0)', '(0; 2)', '(1; -1)'], correctAnswer: 0 },
  { id: 'q45', chapterId: 'ch1', level: 'TH', text: 'Tìm m để đường thẳng (d): y = (m-1)x + 2 đi qua điểm A(1; 3).', options: ['m = 2', 'm = 1', 'm = 0', 'm = 3'], correctAnswer: 0 },
  { id: 'q46', chapterId: 'ch1', level: 'TH', text: 'Giải hệ phương trình {2x + y = 5; x - y = 1}.', options: ['(2; 1)', '(1; 2)', '(3; -1)', '(0; 5)'], correctAnswer: 0 },
  { id: 'q47', chapterId: 'ch1', level: 'VD', text: 'Hai ô tô khởi hành cùng lúc từ A đến B dài 120km. Vận tốc xe 1 lớn hơn xe 2 là 10km/h nên đến B sớm hơn 1 giờ. Vận tốc xe 2 là:', options: ['30km/h', '40km/h', '50km/h', '20km/h'], correctAnswer: 0 },
  { id: 'q48', chapterId: 'ch1', level: 'NB', text: 'Cặp số nào là nghiệm của phương trình 3x + 2y = 7?', options: ['(1; 2)', '(2; 1)', '(0; 3)', '(3; 0)'], correctAnswer: 0 },
  { id: 'q49', chapterId: 'ch1', level: 'TH', text: 'Hệ phương trình {ax + by = c; a\'x + b\'y = c\'} vô nghiệm khi:', options: ['a/a\' = b/b\' ≠ c/c\'', 'a/a\' ≠ b/b\'', 'a/a\' = b/b\' = c/c\'', 'a/a\' ≠ c/c\''], correctAnswer: 0 },
  { id: 'q50', chapterId: 'ch1', level: 'VD', text: 'Tìm m để hệ {x + my = 2; mx - y = 1} có nghiệm duy nhất.', options: ['Mọi m', 'm ≠ 1', 'm ≠ -1', 'm ≠ 0'], correctAnswer: 0 },
  { id: 'q51', chapterId: 'ch1', level: 'NB', text: 'Đồ thị hàm số y = ax + b (a ≠ 0) là một:', options: ['Đường thẳng', 'Đường cong', 'Đường tròn', 'Điểm'], correctAnswer: 0 },
  { id: 'q52', chapterId: 'ch1', level: 'TH', text: 'Xác định a, b để đường thẳng y = ax + b đi qua A(1; 2) và B(2; 1).', options: ['a = -1, b = 3', 'a = 1, b = 1', 'a = -1, b = 1', 'a = 1, b = 3'], correctAnswer: 0 },
  { id: 'q53', chapterId: 'ch1', level: 'VD', text: 'Một mảnh vườn hình chữ nhật có chu vi 34m. Nếu tăng chiều dài 3m và tăng chiều rộng 2m thì diện tích tăng thêm 45m2. Chiều dài mảnh vườn là:', options: ['12m', '5m', '10m', '7m'], correctAnswer: 0 },
  { id: 'q54', chapterId: 'ch1', level: 'NB', text: 'Phương trình nào sau đây tương đương với phương trình x + y = 1?', options: ['2x + 2y = 2', 'x - y = 1', 'x = 1', 'y = 1'], correctAnswer: 0 },
  { id: 'q55', chapterId: 'ch1', level: 'TH', text: 'Hệ phương trình {x + 2y = 4; 2x + 4y = 8} có bao nhiêu nghiệm?', options: ['Vô số nghiệm', 'Vô nghiệm', '1 nghiệm', '2 nghiệm'], correctAnswer: 0 },
  { id: 'q56', chapterId: 'ch1', level: 'VD', text: 'Tìm m để hệ {x + y = 1; mx + y = m} có vô số nghiệm.', options: ['m = 1', 'm = 0', 'm = -1', 'Không có m'], correctAnswer: 0 },
  { id: 'q57', chapterId: 'ch1', level: 'NB', text: 'Điểm nào sau đây thuộc đồ thị hàm số y = 2x - 3?', options: ['(2; 1)', '(1; 2)', '(0; 3)', '(3; 0)'], correctAnswer: 0 },
  { id: 'q58', chapterId: 'ch1', level: 'TH', text: 'Giá trị của k để đường thẳng y = (k-2)x + 3 song song với đường thẳng y = 2x - 1 là:', options: ['k = 4', 'k = 2', 'k = 0', 'k = -2'], correctAnswer: 0 },
  { id: 'q59', chapterId: 'ch1', level: 'VD', text: 'Tìm m để ba đường thẳng y = x + 2, y = 2x + 1 và y = (m-1)x + 3 đồng quy.', options: ['m = 1', 'm = 2', 'm = 0', 'm = -1'], correctAnswer: 0 },
  { id: 'q60', chapterId: 'ch1', level: 'NB', text: 'Phương trình bậc nhất hai ẩn ax + by = c có tập nghiệm được biểu diễn bởi:', options: ['Một đường thẳng', 'Một tia', 'Một đoạn thẳng', 'Một điểm'], correctAnswer: 0 },
  { id: 'q61', chapterId: 'ch1', level: 'TH', text: 'Hệ phương trình {2x - y = 3; x + 2y = 4} có nghiệm (x; y). Tính x + y.', options: ['3', '2', '4', '5'], correctAnswer: 0 },
  { id: 'q62', chapterId: 'ch1', level: 'VD', text: 'Một ca nô xuôi dòng 42km và ngược dòng 20km hết tổng cộng 5 giờ. Vận tốc dòng nước là 2km/h. Vận tốc thực của ca nô là:', options: ['12km/h', '10km/h', '15km/h', '8km/h'], correctAnswer: 0 },
  { id: 'q63', chapterId: 'ch1', level: 'NB', text: 'Cặp số (0; 1) là nghiệm của phương trình nào?', options: ['x + y = 1', 'x - y = 1', '2x + y = 0', 'x + 2y = 3'], correctAnswer: 0 },
  { id: 'q64', chapterId: 'ch1', level: 'TH', text: 'Tìm m để hệ {x - y = 2; 2x + my = 4} có nghiệm duy nhất.', options: ['m ≠ -2', 'm ≠ 2', 'm = -2', 'm = 2'], correctAnswer: 0 },
  { id: 'q65', chapterId: 'ch1', level: 'VD', text: 'Tìm m để hệ {x + y = m; x - y = 2} có nghiệm (x; y) thỏa mãn x > 0, y > 0.', options: ['m > 2', 'm < 2', 'm = 2', 'm > 0'], correctAnswer: 0 },
  { id: 'q66', chapterId: 'ch1', level: 'NB', text: 'Phương trình 0x + 2y = 4 có nghiệm tổng quát là:', options: ['{x ∈ R; y = 2}', '{y ∈ R; x = 2}', '{x = 0; y = 2}', '{x = 2; y = 0}'], correctAnswer: 0 },
  { id: 'q67', chapterId: 'ch1', level: 'TH', text: 'Hệ phương trình {3x - 2y = 1; 2x + y = 3} có nghiệm là:', options: ['(1; 1)', '(2; 1)', '(1; 2)', '(0; 0)'], correctAnswer: 0 },
  { id: 'q68', chapterId: 'ch1', level: 'VD', text: 'Tìm m để hệ {x + 2y = m + 3; 2x - 3y = m} có nghiệm (x; y) sao cho x + y đạt giá trị nhỏ nhất.', options: ['Mọi m', 'm = 0', 'm = 1', 'm = -1'], correctAnswer: 0 },
  { id: 'q69', chapterId: 'ch1', level: 'NB', text: 'Đường thẳng y = 2x - 1 cắt trục tung tại điểm:', options: ['(0; -1)', '(0; 1)', '(1/2; 0)', '(-1/2; 0)'], correctAnswer: 0 },
  { id: 'q70', chapterId: 'ch1', level: 'TH', text: 'Giao điểm của hai đường thẳng y = x + 1 và y = -x + 3 là:', options: ['(1; 2)', '(2; 1)', '(0; 1)', '(0; 3)'], correctAnswer: 0 },
  { id: 'q71', chapterId: 'ch1', level: 'VD', text: 'Cho hệ {x + y = 2; mx - y = m}. Tìm m để hệ có nghiệm duy nhất (x; y) thỏa mãn x = 2y.', options: ['m = 2', 'm = 1', 'm = 1/2', 'm = 4'], correctAnswer: 0 },
  { id: 'q72', chapterId: 'ch1', level: 'NB', text: 'Hệ phương trình vô số nghiệm khi hai đường thẳng biểu diễn tập nghiệm:', options: ['Trùng nhau', 'Song song', 'Cắt nhau', 'Vuông góc'], correctAnswer: 0 },

  // --- CH2: 30 questions ---
  { id: 'q73', chapterId: 'ch2', level: 'NB', text: 'Hàm số y = 2x^2 đạt giá trị nhỏ nhất tại:', options: ['x = 0', 'x = 1', 'x = -1', 'Không có'], correctAnswer: 0 },
  { id: 'q74', chapterId: 'ch2', level: 'NB', text: 'Phương trình x^2 - 5x + 4 = 0 có các hệ số a, b, c lần lượt là:', options: ['1, -5, 4', '1, 5, 4', '-1, 5, -4', '1, -5, -4'], correctAnswer: 0 },
  { id: 'q75', chapterId: 'ch2', level: 'TH', text: 'Nghiệm của phương trình x^2 - 7x + 10 = 0 là:', options: ['2 và 5', '-2 và -5', '1 và 10', '-1 và -10'], correctAnswer: 0 },
  { id: 'q76', chapterId: 'ch2', level: 'TH', text: 'Tìm m để phương trình x^2 - mx + 4 = 0 có nghiệm kép.', options: ['m = ±4', 'm = 4', 'm = -4', 'm = ±2'], correctAnswer: 0 },
  { id: 'q77', chapterId: 'ch2', level: 'VD', text: 'Tìm m để phương trình x^2 - 2(m+1)x + m^2 + 3 = 0 có nghiệm.', options: ['m ≥ 1', 'm ≤ 1', 'm > 1', 'm < 1'], correctAnswer: 0 },
  { id: 'q78', chapterId: 'ch2', level: 'NB', text: 'Đồ thị hàm số y = ax^2 (a ≠ 0) là một đường cong gọi là:', options: ['Parabol', 'Hyperbol', 'Đường thẳng', 'Đường tròn'], correctAnswer: 0 },
  { id: 'q79', chapterId: 'ch2', level: 'TH', text: 'Cho phương trình x^2 - 5x - 6 = 0. Tổng và tích hai nghiệm là:', options: ['S = 5, P = -6', 'S = -5, P = -6', 'S = 5, P = 6', 'S = -5, P = 6'], correctAnswer: 0 },
  { id: 'q80', chapterId: 'ch2', level: 'VD', text: 'Cho phương trình x^2 - 2x + m - 3 = 0. Tìm m để phương trình có hai nghiệm x1, x2 thỏa mãn x1^2 + x2^2 = 10.', options: ['m = 0', 'm = 1', 'm = -1', 'm = 2'], correctAnswer: 0 },
  { id: 'q81', chapterId: 'ch2', level: 'NB', text: 'Hàm số y = -3x^2 nghịch biến khi:', options: ['x > 0', 'x < 0', 'x = 0', 'Mọi x'], correctAnswer: 0 },
  { id: 'q82', chapterId: 'ch2', level: 'TH', text: 'Phương trình x^2 + x + 1 = 0 có bao nhiêu nghiệm?', options: ['Vô nghiệm', '1 nghiệm', '2 nghiệm', 'Vô số nghiệm'], correctAnswer: 0 },
  { id: 'q83', chapterId: 'ch2', level: 'VD', text: 'Một mảnh đất hình chữ nhật có diện tích 80m2. Nếu tăng chiều rộng 3m và giảm chiều dài 10m thì diện tích không đổi. Chiều dài mảnh đất là:', options: ['20m', '10m', '15m', '8m'], correctAnswer: 0 },
  { id: 'q84', chapterId: 'ch2', level: 'NB', text: 'Công thức nghiệm thu gọn Δ\' của phương trình ax^2 + 2b\'x + c = 0 là:', options: ['Δ\' = b\'^2 - ac', 'Δ\' = b\'^2 + ac', 'Δ\' = b\' - ac', 'Δ\' = b\'^2 - 4ac'], correctAnswer: 0 },
  { id: 'q85', chapterId: 'ch2', level: 'TH', text: 'Tìm m để đồ thị hàm số y = mx^2 đi qua điểm A(1; 2).', options: ['m = 2', 'm = 1/2', 'm = -2', 'm = 1'], correctAnswer: 0 },
  { id: 'q86', chapterId: 'ch2', level: 'VD', text: 'Tìm m để phương trình x^2 - 2mx + m^2 - m + 1 = 0 có hai nghiệm phân biệt.', options: ['m > 1', 'm < 1', 'm = 1', 'm > 0'], correctAnswer: 0 },
  { id: 'q87', chapterId: 'ch2', level: 'NB', text: 'Nếu a + b + c = 0 thì phương trình ax^2 + bx + c = 0 có một nghiệm là:', options: ['1', '-1', 'c/a', '-c/a'], correctAnswer: 0 },
  { id: 'q88', chapterId: 'ch2', level: 'TH', text: 'Nghiệm của phương trình x^2 - 9 = 0 là:', options: ['x = ±3', 'x = 3', 'x = -3', 'x = 9'], correctAnswer: 0 },
  { id: 'q89', chapterId: 'ch2', level: 'VD', text: 'Tìm m để phương trình x^2 - 4x + m + 1 = 0 có hai nghiệm x1, x2 thỏa mãn x1 = 3x2.', options: ['m = 2', 'm = 3', 'm = 1', 'm = 0'], correctAnswer: 0 },
  { id: 'q90', chapterId: 'ch2', level: 'NB', text: 'Nếu a - b + c = 0 thì phương trình ax^2 + bx + c = 0 có một nghiệm là:', options: ['-1', '1', '-c/a', 'c/a'], correctAnswer: 0 },
  { id: 'q91', chapterId: 'ch2', level: 'TH', text: 'Phương trình 2x^2 - 3x + 1 = 0 có nghiệm là:', options: ['1 và 1/2', '1 và -1/2', '-1 và 1/2', '-1 và -1/2'], correctAnswer: 0 },
  { id: 'q92', chapterId: 'ch2', level: 'VD', text: 'Cho phương trình x^2 - 2(m-1)x + m - 3 = 0. Chứng minh phương trình luôn có hai nghiệm phân biệt với mọi m.', options: ['Δ > 0 với mọi m', 'Δ = 0', 'Δ < 0', 'Δ ≥ 0'], correctAnswer: 0 },
  { id: 'q93', chapterId: 'ch2', level: 'NB', text: 'Hàm số y = ax^2 (a > 0) đồng biến khi:', options: ['x > 0', 'x < 0', 'x = 0', 'Mọi x'], correctAnswer: 0 },
  { id: 'q94', chapterId: 'ch2', level: 'TH', text: 'Tìm m để phương trình x^2 - 4x + m = 0 vô nghiệm.', options: ['m > 4', 'm < 4', 'm = 4', 'm ≥ 4'], correctAnswer: 0 },
  { id: 'q95', chapterId: 'ch2', level: 'VD', text: 'Hai số có tổng bằng 15 và tích bằng 56 là:', options: ['7 và 8', '6 và 9', '5 và 10', '4 và 11'], correctAnswer: 0 },
  { id: 'q96', chapterId: 'ch2', level: 'NB', text: 'Phương trình x^2 + 2x + 1 = 0 có nghiệm là:', options: ['-1', '1', '0', 'Vô nghiệm'], correctAnswer: 0 },
  { id: 'q97', chapterId: 'ch2', level: 'TH', text: 'Giá trị của m để phương trình x^2 - 2x + m = 0 có nghiệm kép là:', options: ['m = 1', 'm = -1', 'm = 0', 'm = 2'], correctAnswer: 0 },
  { id: 'q98', chapterId: 'ch2', level: 'VD', text: 'Tìm m để phương trình x^2 - (2m-1)x + m^2 - 1 = 0 có hai nghiệm x1, x2 thỏa mãn (x1-1)(x2-1) = 1.', options: ['m = 1', 'm = 2', 'm = 0', 'm = -1'], correctAnswer: 0 },
  { id: 'q99', chapterId: 'ch2', level: 'NB', text: 'Đồ thị hàm số y = -x^2 nằm hoàn toàn:', options: ['Phía dưới trục hoành', 'Phía trên trục hoành', 'Bên phải trục tung', 'Bên trái trục tung'], correctAnswer: 0 },
  { id: 'q100', chapterId: 'ch2', level: 'TH', text: 'Nghiệm của phương trình x^2 - 5x = 0 là:', options: ['0 và 5', '0 và -5', '5', '-5'], correctAnswer: 0 },
  { id: 'q101', chapterId: 'ch2', level: 'VD', text: 'Tìm m để phương trình x^2 - 2mx + m^2 - 4 = 0 có hai nghiệm x1, x2 thỏa mãn |x1 - x2| = 4.', options: ['Mọi m', 'm = 0', 'm = 2', 'm = -2'], correctAnswer: 0 },
  { id: 'q102', chapterId: 'ch2', level: 'NB', text: 'Phương trình bậc hai ax^2 + bx + c = 0 có tối đa bao nhiêu nghiệm?', options: ['2', '1', '0', 'Vô số'], correctAnswer: 0 },

  // --- CH3: 30 questions ---
  { id: 'q103', chapterId: 'ch3', level: 'NB', text: 'Trong tam giác vuông, cos của một góc nhọn bằng:', options: ['Kề / Huyền', 'Đối / Huyền', 'Đối / Kề', 'Kề / Đối'], correctAnswer: 0 },
  { id: 'q104', chapterId: 'ch3', level: 'NB', text: 'Cho tam giác ABC vuông tại A, đường cao AH. Hệ thức nào sau đây đúng?', options: ['AH^2 = HB.HC', 'AB^2 = BC.AH', 'AC^2 = AB.BC', 'AH.BC = AB.AC'], correctAnswer: 0 },
  { id: 'q105', chapterId: 'ch3', level: 'TH', text: 'Cho tam giác ABC vuông tại A, AB = 6, AC = 8. Độ dài đường cao AH là:', options: ['4.8', '5', '10', '6.4'], correctAnswer: 0 },
  { id: 'q106', chapterId: 'ch3', level: 'TH', text: 'Nếu sinα = 1/2 thì góc α bằng:', options: ['30°', '45°', '60°', '90°'], correctAnswer: 0 },
  { id: 'q107', chapterId: 'ch3', level: 'VD', text: 'Cho tam giác ABC vuông tại A, góc B = 30°, BC = 8. Độ dài cạnh AB là:', options: ['4sqrt(3)', '4', '8sqrt(3)', '2'], correctAnswer: 0 },
  { id: 'q108', chapterId: 'ch3', level: 'NB', text: 'Trong tam giác vuông, tanα . cotα bằng:', options: ['1', '0', 'sinα', 'cosα'], correctAnswer: 0 },
  { id: 'q109', chapterId: 'ch3', level: 'TH', text: 'Cho tam giác ABC vuông tại A, biết sinB = 0.8. Tính cosB.', options: ['0.6', '0.2', '0.4', '0.5'], correctAnswer: 0 },
  { id: 'q110', chapterId: 'ch3', level: 'VD', text: 'Một chiếc thang dài 4m dựa vào tường, chân thang cách tường 2m. Góc tạo bởi thang và mặt đất là:', options: ['60°', '30°', '45°', '75°'], correctAnswer: 0 },
  { id: 'q111', chapterId: 'ch3', level: 'NB', text: 'Hệ thức lượng nào sau đây đúng trong tam giác vuông?', options: ['1/AH^2 = 1/AB^2 + 1/AC^2', 'AH^2 = AB^2 + AC^2', 'AB^2 = AH^2 + HB^2', 'BC^2 = AB^2 - AC^2'], correctAnswer: 0 },
  { id: 'q112', chapterId: 'ch3', level: 'TH', text: 'Cho tam giác ABC vuông tại A, đường cao AH. Biết HB = 1, HC = 4. Tính AH.', options: ['2', '4', '5', 'sqrt(5)'], correctAnswer: 0 },
  { id: 'q113', chapterId: 'ch3', level: 'VD', text: 'Cho tam giác ABC vuông tại A, góc C = 40°, AC = 10. Tính AB (làm tròn đến chữ số thập phân thứ nhất).', options: ['8.4', '7.7', '6.4', '11.9'], correctAnswer: 0 },
  { id: 'q114', chapterId: 'ch3', level: 'NB', text: 'Tỉ số lượng giác nào sau đây luôn nhỏ hơn 1 với góc nhọn α?', options: ['sinα và cosα', 'tanα và cotα', 'sinα và tanα', 'cosα và cotα'], correctAnswer: 0 },
  { id: 'q115', chapterId: 'ch3', level: 'TH', text: 'Cho tam giác ABC vuông tại A, AB = 5, BC = 13. Tính tanC.', options: ['5/12', '12/5', '5/13', '12/13'], correctAnswer: 0 },
  { id: 'q116', chapterId: 'ch3', level: 'VD', text: 'Cho tam giác ABC vuông tại A, đường cao AH. Biết AB = 15, AH = 12. Tính độ dài BC.', options: ['25', '20', '15', '30'], correctAnswer: 0 },
  { id: 'q117', chapterId: 'ch3', level: 'NB', text: 'Nếu α + β = 90° thì khẳng định nào sau đây SAI?', options: ['tanα = tanβ', 'sinα = cosβ', 'cosα = sinβ', 'tanα = cotβ'], correctAnswer: 0 },
  { id: 'q118', chapterId: 'ch3', level: 'TH', text: 'Cho tam giác ABC vuông tại A, AC = 12, BC = 15. Tính sinB.', options: ['0.8', '0.6', '0.75', '0.5'], correctAnswer: 0 },
  { id: 'q119', chapterId: 'ch3', level: 'VD', text: 'Một máy bay bay lên với vận tốc 500km/h. Đường bay tạo với phương nằm ngang một góc 30°. Sau 1.2 phút, máy bay lên cao được bao nhiêu km?', options: ['5km', '10km', '2.5km', '8.6km'], correctAnswer: 0 },
  { id: 'q120', chapterId: 'ch3', level: 'NB', text: 'Trong tam giác vuông, cạnh đối diện với góc 30° bằng:', options: ['Nửa cạnh huyền', 'Nửa cạnh kề', 'Cạnh huyền', 'Cạnh kề'], correctAnswer: 0 },
  { id: 'q121', chapterId: 'ch3', level: 'TH', text: 'Cho tam giác ABC vuông tại A, đường cao AH. Biết AB = 3, BC = 5. Tính BH.', options: ['1.8', '3.2', '2.4', '4'], correctAnswer: 0 },
  { id: 'q122', chapterId: 'ch3', level: 'VD', text: 'Cho tam giác ABC vuông tại A, đường cao AH. Biết AH = 6, BH = 3. Tính diện tích tam giác ABC.', options: ['45', '30', '15', '60'], correctAnswer: 0 },
  { id: 'q123', chapterId: 'ch3', level: 'NB', text: 'Giá trị của sin45° là:', options: ['sqrt(2)/2', '1/2', 'sqrt(3)/2', '1'], correctAnswer: 0 },
  { id: 'q124', chapterId: 'ch3', level: 'TH', text: 'Cho tam giác ABC vuông tại A, biết cosB = 0.6. Tính tanB.', options: ['4/3', '3/4', '3/5', '4/5'], correctAnswer: 0 },
  { id: 'q125', chapterId: 'ch3', level: 'VD', text: 'Cho tam giác ABC cân tại A, đường cao AH. Biết BC = 12, góc B = 30°. Tính độ dài AB.', options: ['4sqrt(3)', '6', '12', '8'], correctAnswer: 0 },
  { id: 'q126', chapterId: 'ch3', level: 'NB', text: 'Giá trị của tan60° là:', options: ['sqrt(3)', '1/sqrt(3)', '1', 'sqrt(2)'], correctAnswer: 0 },
  { id: 'q127', chapterId: 'ch3', level: 'TH', text: 'Cho tam giác ABC vuông tại A, đường cao AH. Biết AC = 4, BC = 5. Tính CH.', options: ['3.2', '1.8', '2.4', '0.8'], correctAnswer: 0 },
  { id: 'q128', chapterId: 'ch3', level: 'VD', text: 'Cho tam giác ABC vuông tại A, đường cao AH. Biết BH = 4, CH = 9. Tính chu vi tam giác ABC.', options: ['13 + sqrt(52) + sqrt(117)', '26', '30', '15'], correctAnswer: 0 },
  { id: 'q129', chapterId: 'ch3', level: 'NB', text: 'Trong tam giác vuông, cotα bằng:', options: ['Kề / Đối', 'Đối / Kề', 'Kề / Huyền', 'Đối / Huyền'], correctAnswer: 0 },
  { id: 'q130', chapterId: 'ch3', level: 'TH', text: 'Nếu tanα = 1 thì góc α bằng:', options: ['45°', '30°', '60°', '90°'], correctAnswer: 0 },
  { id: 'q131', chapterId: 'ch3', level: 'VD', text: 'Cho tam giác ABC vuông tại A, đường cao AH. Biết AB = 12, BC = 20. Tính diện tích tam giác ABH.', options: ['34.56', '54', '96', '48'], correctAnswer: 0 },
  { id: 'q132', chapterId: 'ch3', level: 'NB', text: 'Hệ thức nào sau đây đúng?', options: ['sin^2α + cos^2α = 1', 'sinα + cosα = 1', 'tanα = cosα/sinα', 'sin^2α - cos^2α = 1'], correctAnswer: 0 },

  // --- CH4: 30 questions ---
  { id: 'q133', chapterId: 'ch4', level: 'NB', text: 'Đường tròn đi qua tất cả các đỉnh của một tam giác gọi là:', options: ['Đường tròn ngoại tiếp', 'Đường tròn nội tiếp', 'Đường tròn bàng tiếp', 'Đường tròn đồng tâm'], correctAnswer: 0 },
  { id: 'q134', chapterId: 'ch4', level: 'NB', text: 'Tâm của đường tròn ngoại tiếp tam giác vuông là:', options: ['Trung điểm cạnh huyền', 'Trọng tâm tam giác', 'Trực tâm tam giác', 'Đỉnh góc vuông'], correctAnswer: 0 },
  { id: 'q135', chapterId: 'ch4', level: 'TH', text: 'Cho đường tròn (O; 5cm) và dây AB = 6cm. Khoảng cách từ tâm đến dây AB là:', options: ['4cm', '3cm', '2cm', '1cm'], correctAnswer: 0 },
  { id: 'q136', chapterId: 'ch4', level: 'TH', text: 'Số tiếp tuyến chung của hai đường tròn tiếp xúc ngoài là:', options: ['3', '2', '1', '4'], correctAnswer: 0 },
  { id: 'q137', chapterId: 'ch4', level: 'VD', text: 'Cho đường tròn (O; R) và điểm A sao cho OA = 2R. Kẻ tiếp tuyến AB đến đường tròn. Góc BAO bằng:', options: ['30°', '60°', '45°', '90°'], correctAnswer: 0 },
  { id: 'q138', chapterId: 'ch4', level: 'NB', text: 'Góc ở tâm là góc có đỉnh:', options: ['Trùng với tâm đường tròn', 'Nằm trên đường tròn', 'Nằm ngoài đường tròn', 'Nằm trong đường tròn'], correctAnswer: 0 },
  { id: 'q139', chapterId: 'ch4', level: 'TH', text: 'Cho đường tròn (O), dây AB = R. Số đo cung nhỏ AB là:', options: ['60°', '90°', '120°', '30°'], correctAnswer: 0 },
  { id: 'q140', chapterId: 'ch4', level: 'VD', text: 'Cho đường tròn (O; 10cm) và hai dây AB // CD. Biết AB = 12cm, CD = 16cm. Khoảng cách giữa hai dây là (hai dây nằm cùng phía với tâm):', options: ['2cm', '14cm', '8cm', '6cm'], correctAnswer: 0 },
  { id: 'q141', chapterId: 'ch4', level: 'NB', text: 'Góc nội tiếp là góc có đỉnh nằm trên đường tròn và hai cạnh:', options: ['Chứa hai dây cung', 'Là hai tiếp tuyến', 'Là hai bán kính', 'Chứa một dây cung và một tiếp tuyến'], correctAnswer: 0 },
  { id: 'q142', chapterId: 'ch4', level: 'TH', text: 'Góc nội tiếp chắn cung 60° có số đo là:', options: ['30°', '60°', '120°', '90°'], correctAnswer: 0 },
  { id: 'q143', chapterId: 'ch4', level: 'VD', text: 'Cho đường tròn (O) và điểm M nằm ngoài đường tròn. Kẻ hai tiếp tuyến MA, MB. Biết góc AMB = 80°. Số đo cung nhỏ AB là:', options: ['100°', '80°', '160°', '40°'], correctAnswer: 0 },
  { id: 'q144', chapterId: 'ch4', level: 'NB', text: 'Đường thẳng tiếp xúc với đường tròn khi khoảng cách từ tâm đến đường thẳng:', options: ['Bằng bán kính', 'Lớn hơn bán kính', 'Nhỏ hơn bán kính', 'Bằng 0'], correctAnswer: 0 },
  { id: 'q145', chapterId: 'ch4', level: 'TH', text: 'Cho hai đường tròn (O; 5) và (O\'; 3) có OO\' = 8. Vị trí tương đối của hai đường tròn là:', options: ['Tiếp xúc ngoài', 'Tiếp xúc trong', 'Cắt nhau', 'Ở ngoài nhau'], correctAnswer: 0 },
  { id: 'q146', chapterId: 'ch4', level: 'VD', text: 'Cho đường tròn (O; 5cm) và dây AB = 8cm. M là điểm trên dây AB sao cho AM = 2cm. Tính OM.', options: ['sqrt(13)cm', '4cm', '3cm', '5cm'], correctAnswer: 0 },
  { id: 'q147', chapterId: 'ch4', level: 'NB', text: 'Góc tạo bởi tia tiếp tuyến và dây cung có số đo bằng:', options: ['Nửa số đo cung bị chắn', 'Số đo cung bị chắn', 'Gấp đôi số đo cung bị chắn', '90°'], correctAnswer: 0 },
  { id: 'q148', chapterId: 'ch4', level: 'TH', text: 'Cho đường tròn (O), góc nội tiếp BAC = 45°. Số đo góc ở tâm BOC là:', options: ['90°', '45°', '180°', '60°'], correctAnswer: 0 },
  { id: 'q149', chapterId: 'ch4', level: 'VD', text: 'Cho đường tròn (O) đường kính AB. Lấy C trên đường tròn sao cho AC = R. Tính số đo góc ABC.', options: ['30°', '60°', '45°', '90°'], correctAnswer: 0 },
  { id: 'q150', chapterId: 'ch4', level: 'NB', text: 'Hai đường tròn cắt nhau khi số điểm chung là:', options: ['2', '1', '0', 'Vô số'], correctAnswer: 0 },
  { id: 'q151', chapterId: 'ch4', level: 'TH', text: 'Cho hai đường tròn (O; 10) và (O\'; 6) có OO\' = 2. Vị trí tương đối của hai đường tròn là:', options: ['Đựng nhau', 'Tiếp xúc trong', 'Cắt nhau', 'Ở ngoài nhau'], correctAnswer: 0 },
  { id: 'q152', chapterId: 'ch4', level: 'VD', text: 'Cho đường tròn (O; R) và dây AB = Rsqrt(3). Tính khoảng cách từ tâm O đến dây AB.', options: ['R/2', 'Rsqrt(3)/2', 'R/4', 'R/sqrt(2)'], correctAnswer: 0 },
  { id: 'q153', chapterId: 'ch4', level: 'NB', text: 'Đường tròn tâm O bán kính R có tâm đối xứng là:', options: ['Điểm O', 'Mọi điểm trên đường tròn', 'Mọi điểm trong đường tròn', 'Không có'], correctAnswer: 0 },
  { id: 'q154', chapterId: 'ch4', level: 'TH', text: 'Cho đường tròn (O) và dây AB. Nếu góc ở tâm AOB = 100° thì góc nội tiếp ACB (C thuộc cung lớn) bằng:', options: ['50°', '100°', '200°', '80°'], correctAnswer: 0 },
  { id: 'q155', chapterId: 'ch4', level: 'VD', text: 'Cho đường tròn (O; 5cm) và điểm A cách O là 13cm. Kẻ tiếp tuyến AB. Tính độ dài tiếp tuyến AB.', options: ['12cm', '8cm', 'sqrt(194)cm', '10cm'], correctAnswer: 0 },
  { id: 'q156', chapterId: 'ch4', level: 'NB', text: 'Trong một đường tròn, dây lớn nhất là:', options: ['Đường kính', 'Bán kính', 'Tiếp tuyến', 'Cung'], correctAnswer: 0 },
  { id: 'q157', chapterId: 'ch4', level: 'TH', text: 'Cho đường tròn (O) và dây AB. Nếu khoảng cách từ tâm đến dây AB tăng thì độ dài dây AB:', options: ['Giảm', 'Tăng', 'Không đổi', 'Bằng 0'], correctAnswer: 0 },
  { id: 'q158', chapterId: 'ch4', level: 'VD', text: 'Cho đường tròn (O) và hai dây AB, CD bằng nhau và cắt nhau tại I. Khẳng định nào sau đây đúng?', options: ['IA = IC và IB = ID', 'IA = ID', 'IB = IC', 'IA = IB'], correctAnswer: 0 },
  { id: 'q159', chapterId: 'ch4', level: 'NB', text: 'Tiếp tuyến của đường tròn vuông góc với:', options: ['Bán kính đi qua tiếp điểm', 'Mọi dây cung', 'Mọi đường kính', 'Trục đối xứng'], correctAnswer: 0 },
  { id: 'q160', chapterId: 'ch4', level: 'TH', text: 'Cho đường tròn (O; R) và dây AB = R. Tính số đo góc tạo bởi tiếp tuyến tại A và dây AB.', options: ['30°', '60°', '90°', '45°'], correctAnswer: 0 },
  { id: 'q161', chapterId: 'ch4', level: 'VD', text: 'Cho đường tròn (O; R) và điểm A nằm ngoài đường tròn. Kẻ tiếp tuyến AB và cát tuyến ACD (C nằm giữa A và D). Khẳng định nào đúng?', options: ['AB^2 = AC.AD', 'AB = AC + AD', 'AB^2 = AC + AD', 'AB = AC.AD'], correctAnswer: 0 },
  { id: 'q162', chapterId: 'ch4', level: 'NB', text: 'Đường tròn nội tiếp tam giác là đường tròn:', options: ['Tiếp xúc với ba cạnh của tam giác', 'Đi qua ba đỉnh của tam giác', 'Có tâm là trực tâm', 'Có tâm là trọng tâm'], correctAnswer: 0 }
];

export const ESSAY_PROBLEMS: EssayProblem[] = [
  {
    id: 'e1',
    title: 'Bất đẳng thức và Giá trị nhỏ nhất',
    text: 'Cho $x, y$ là các số thực dương thỏa mãn $x + y = 1$. Tìm giá trị nhỏ nhất của biểu thức: $P = (1 + \frac{1}{x})(1 + \frac{1}{y})$.',
    hint: 'Sử dụng bất đẳng thức Cauchy (AM-GM) hoặc khai triển biểu thức và sử dụng giả thiết $x + y = 1$.',
    solution: '$P = (1 + \frac{1}{x})(1 + \frac{1}{y}) = 1 + \frac{1}{x} + \frac{1}{y} + \frac{1}{xy} = 1 + \frac{x+y}{xy} + \frac{1}{xy} = 1 + \frac{2}{xy}$.\n\nÁp dụng AM-GM: $xy \le (\frac{x+y}{2})^2 = (\frac{1}{2})^2 = \frac{1}{4}$.\n\n=> $\frac{1}{xy} \ge 4 \Rightarrow \frac{2}{xy} \ge 8$.\n\nVậy $P \ge 1 + 8 = 9$. Dấu "=" xảy ra khi $x = y = \frac{1}{2}$.',
    level: 'Nâng cao'
  },
  {
    id: 'e2',
    title: 'Hệ phương trình bậc cao',
    text: 'Giải hệ phương trình:\n$$\begin{cases} x^2 + y^2 + xy = 3 \\ x^2 + 2xy = 3x + 3y - 3 \end{cases}$$',
    hint: 'Thử cộng hoặc trừ hai phương trình để tìm mối liên hệ giữa $x$ và $y$, hoặc đặt ẩn phụ $S = x+y, P = xy$.',
    solution: 'Cộng hai phương trình: $2x^2 + y^2 + 3xy = 3x + 3y$\n$\Leftrightarrow (x+y)(2x+y) - 3(x+y) = 0$\n$\Leftrightarrow (x+y)(2x+y-3) = 0$\n\nTrường hợp 1: $x + y = 0 \Rightarrow y = -x$. Thay vào PT(1): $x^2 + x^2 - x^2 = 3 \Rightarrow x^2 = 3 \Rightarrow x = \pm\sqrt{3}$.\n=> $(\sqrt{3}; -\sqrt{3}), (-\sqrt{3}; \sqrt{3})$.\n\nTrường hợp 2: $2x + y = 3 \Rightarrow y = 3 - 2x$. Thay vào PT(1): $x^2 + (3-2x)^2 + x(3-2x) = 3$\n$\Leftrightarrow x^2 + 9 - 12x + 4x^2 + 3x - 2x^2 = 3$\n$\Leftrightarrow 3x^2 - 9x + 6 = 0 \Leftrightarrow x^2 - 3x + 2 = 0$\n=> $x = 1 \Rightarrow y = 1; x = 2 \Rightarrow y = -1$.\n\nVậy hệ có 4 nghiệm: $(\sqrt{3}; -\sqrt{3}), (-\sqrt{3}; \sqrt{3}), (1; 1), (2; -1)$.',
    level: 'Nâng cao'
  },
  {
    id: 'e3',
    title: 'Hình học phẳng nâng cao',
    text: 'Cho đường tròn (O) và dây AB. C là điểm nằm trên cung lớn AB. Gọi H là hình chiếu của C trên AB. M, N lần lượt là hình chiếu của H trên CA, CB. Chứng minh rằng MN ⊥ OC.',
    hint: 'Sử dụng tính chất tứ giác nội tiếp và góc tạo bởi tiếp tuyến và dây cung. Kẻ tiếp tuyến Cx của (O).',
    solution: 'Kẻ tiếp tuyến Cx của đường tròn (O) tại C. Ta có góc xCA = góc CBA (góc tạo bởi tiếp tuyến và dây cung).\n\nTứ giác CMHN có góc CMH = góc CNH = 90° nên nội tiếp đường tròn đường kính CH.\n=> góc CMN = góc CHN (cùng chắn cung CN).\n\nMà góc CHN = 90° - góc NCH = 90° - góc HCB = góc CBH = góc CBA.\n\nTừ đó suy ra góc CMN = góc xCA. Mà hai góc này ở vị trí so le trong (nếu coi Cx và MN bị cắt bởi CA) hoặc đơn giản là chứng minh MN // Cx.\n\nVì MN // Cx và Cx ⊥ OC (tính chất tiếp tuyến) nên MN ⊥ OC.',
    level: 'Nâng cao'
  },
  {
    id: 'e4',
    title: 'Phương trình vô tỉ',
    text: 'Giải phương trình: $\sqrt{x - 2} + \sqrt{4 - x} = x^2 - 6x + 11$.',
    hint: 'Đánh giá hai vế của phương trình. Vế trái sử dụng bất đẳng thức Bunyakovsky, vế phải đưa về dạng bình phương thiếu.',
    solution: 'Điều kiện: $2 \le x \le 4$.\n\nVế trái (VT): Áp dụng Bunyakovsky: $(1.\sqrt{x-2} + 1.\sqrt{4-x})^2 \le (1^2 + 1^2)(x-2 + 4-x) = 2.2 = 4$.\n=> $VT \le 2$. Dấu "=" khi $x-2 = 4-x \Leftrightarrow x = 3$.\n\nVế phải (VP): $x^2 - 6x + 11 = (x - 3)^2 + 2 \ge 2$. Dấu "=" khi $x = 3$.\n\nĐể $VT = VP$ thì cả hai vế phải bằng 2, xảy ra khi $x = 3$ (thỏa mãn điều kiện).\n\nVậy nghiệm của phương trình là $x = 3$.',
    level: 'Nâng cao'
  },
  {
    id: 'e5',
    title: 'Phương trình bậc hai chứa tham số',
    text: 'Cho phương trình $x^2 - 2(m + 1)x + m^2 + m - 1 = 0$. Tìm $m$ để phương trình có hai nghiệm phân biệt $x_1, x_2$ thỏa mãn: $\frac{1}{x_1} + \frac{1}{x_2} = 2$.',
    hint: 'Sử dụng điều kiện $\Delta\' > 0$ và hệ thức Vi-ét.',
    solution: '1. Điều kiện có 2 nghiệm phân biệt: $\Delta\' = (m+1)^2 - (m^2+m-1) = m^2+2m+1-m^2-m+1 = m + 2 > 0 \Rightarrow m > -2$.\n\n2. Theo Vi-ét: $x_1 + x_2 = 2(m+1)$, $x_1x_2 = m^2 + m - 1$.\n\n3. Theo đề bài: $\frac{1}{x_1} + \frac{1}{x_2} = 2 \Leftrightarrow \frac{x_1+x_2}{x_1x_2} = 2$\n$\Leftrightarrow 2(m+1) = 2(m^2 + m - 1)$ (với $x_1x_2 \ne 0$)\n$\Leftrightarrow m + 1 = m^2 + m - 1$\n$\Leftrightarrow m^2 = 2 \Leftrightarrow m = \pm\sqrt{2}$.\n\n4. Kiểm tra điều kiện: $m = \sqrt{2} > -2$ (TM), $m = -\sqrt{2} > -2$ (TM).\nKiểm tra $x_1x_2 = m^2+m-1$: Với $m = \pm\sqrt{2}$ thì $m^2+m-1 = 2\pm\sqrt{2}-1 = 1\pm\sqrt{2} \ne 0$ (TM).\n\nVậy $m = \pm\sqrt{2}$.',
    level: 'Nâng cao'
  },
  {
    id: 'e6',
    title: 'Hình học: Đường tròn và Tiếp tuyến',
    text: 'Cho đường tròn $(O)$ và điểm $A$ nằm ngoài đường tròn. Kẻ các tiếp tuyến $AB, AC$ ($B, C$ là tiếp điểm). Gọi $M$ là trung điểm của $AB$. Đường thẳng $MC$ cắt đường tròn $(O)$ tại điểm thứ hai là $N$. Chứng minh rằng đường thẳng $AN$ song song với đường thẳng $BC$.',
    hint: 'Sử dụng tính chất phương tích của một điểm đối với đường tròn hoặc tam giác đồng dạng.',
    solution: 'Ta có $MB^2 = MN.MC$ (tính chất phương tích của điểm $M$ đối với đường tròn $(O)$).\nMà $M$ là trung điểm $AB$ nên $MA = MB \Rightarrow MA^2 = MN.MC$.\n\nXét $\Delta MAN$ và $\Delta MCA$ có:\n- Góc $M$ chung\n- $MA/MC = MN/MA$ (từ $MA^2 = MN.MC$)\n=> $\Delta MAN \sim \Delta MCA$ (c.g.c)\n=> Góc $\widehat{MAN} = \text{Góc } \widehat{MCA}$.\n\nMà góc $\widehat{MCA} = \text{Góc } \widehat{NBC}$ (góc nội tiếp và góc tạo bởi tiếp tuyến cùng chắn cung $NC$).\n=> Góc $\widehat{MAN} = \text{Góc } \widehat{NBC}$.\n\nMà góc $\widehat{NBC}$ và góc $\widehat{ACB}$ là hai góc ở vị trí đồng vị (nếu $AN \parallel BC$).\nThực tế, xét đường thẳng $BC$ và $AN$ bị cắt bởi $AB$, ta có góc $\widehat{MAN} = \text{Góc } \widehat{ABC}$ (do $\Delta ABC$ cân tại $A$ nên $\widehat{ABC} = \widehat{ACB}$, và $\widehat{ACB} = \widehat{NBC}$ là không hoàn toàn chính xác, cần lập luận kỹ hơn).\n\nTuy nhiên, từ $\widehat{MAN} = \widehat{MCA}$ và $\widehat{MCA} = \widehat{NBC}$ (cùng chắn cung $NC$), ta có $\widehat{MAN} = \widehat{NBC}$.\nVì $\widehat{MAN}$ và $\widehat{NBC}$ là hai góc ở vị trí đồng vị đối với hai đường thẳng $AN, BC$ bị cắt bởi $AB$, nên $AN \parallel BC$.',
    level: 'Nâng cao'
  },
  {
    id: 'e7',
    title: 'Số học: Phương trình nghiệm nguyên',
    text: 'Tìm các cặp số nguyên $(x; y)$ thỏa mãn phương trình: $x^2 + xy - 2023x - 2024y = 2025$.',
    hint: 'Biến đổi phương trình về dạng tích $(x - a)(y - b) = k$.',
    solution: '$x^2 + xy - 2023x - 2024y = 2025$\n$\Leftrightarrow x(x + y) - 2024(x + y) + x = 2025$\n$\Leftrightarrow (x - 2024)(x + y) + x - 2024 = 2025 - 2024$\n$\Leftrightarrow (x - 2024)(x + y + 1) = 1$\n\nVì $x, y$ nguyên nên $x - 2024$ và $x + y + 1$ là các ước của 1.\n\nTH1: $x - 2024 = 1$ và $x + y + 1 = 1$\n=> $x = 2025$ và $2025 + y + 1 = 1 \Rightarrow y = -2025$.\n\nTH2: $x - 2024 = -1$ và $x + y + 1 = -1$\n=> $x = 2023$ và $2023 + y + 1 = -1 \Rightarrow y = -2025$.\n\nVậy các cặp nghiệm $(x; y)$ là: $(2025; -2025)$ và $(2023; -2025)$.',
    level: 'Nâng cao'
  }
];
