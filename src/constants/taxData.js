// Japanese Tax & Social Insurance Data (Reiwa 8 / 2026)

// 47 Prefectures with Kyokai Kenpo health insurance rates (total %)
// Source: 全国健康保険協会 (Kyokai Kenpo) Reiwa 8 rates
export const PREFECTURES = [
  { code: '01', name: '北海道', healthRate: 10.31 },
  { code: '02', name: '青森県', healthRate: 9.85 },
  { code: '03', name: '岩手県', healthRate: 9.62 },
  { code: '04', name: '宮城県', healthRate: 10.11 },
  { code: '05', name: '秋田県', healthRate: 10.01 },
  { code: '06', name: '山形県', healthRate: 9.75 },
  { code: '07', name: '福島県', healthRate: 9.62 },
  { code: '08', name: '茨城県', healthRate: 9.67 },
  { code: '09', name: '栃木県', healthRate: 9.82 },
  { code: '10', name: '群馬県', healthRate: 9.77 },
  { code: '11', name: '埼玉県', healthRate: 9.76 },
  { code: '12', name: '千葉県', healthRate: 9.79 },
  { code: '13', name: '東京都', healthRate: 9.91 },
  { code: '14', name: '神奈川県', healthRate: 9.92 },
  { code: '15', name: '新潟県', healthRate: 9.55 },
  { code: '16', name: '富山県', healthRate: 9.65 },
  { code: '17', name: '石川県', healthRate: 9.88 },
  { code: '18', name: '福井県', healthRate: 9.94 },
  { code: '19', name: '山梨県', healthRate: 9.89 },
  { code: '20', name: '長野県', healthRate: 9.69 },
  { code: '21', name: '岐阜県', healthRate: 9.93 },
  { code: '22', name: '静岡県', healthRate: 9.80 },
  { code: '23', name: '愛知県', healthRate: 10.03 },
  { code: '24', name: '三重県', healthRate: 9.99 },
  { code: '25', name: '滋賀県', healthRate: 9.97 },
  { code: '26', name: '京都府', healthRate: 10.03 },
  { code: '27', name: '大阪府', healthRate: 10.24 },
  { code: '28', name: '兵庫県', healthRate: 10.16 },
  { code: '29', name: '奈良県', healthRate: 10.02 },
  { code: '30', name: '和歌山県', healthRate: 10.19 },
  { code: '31', name: '鳥取県', healthRate: 9.93 },
  { code: '32', name: '島根県', healthRate: 9.94 },
  { code: '33', name: '岡山県', healthRate: 10.17 },
  { code: '34', name: '広島県', healthRate: 9.97 },
  { code: '35', name: '山口県', healthRate: 10.36 },
  { code: '36', name: '徳島県', healthRate: 10.47 },
  { code: '37', name: '香川県', healthRate: 10.21 },
  { code: '38', name: '愛媛県', healthRate: 10.18 },
  { code: '39', name: '高知県', healthRate: 10.13 },
  { code: '40', name: '福岡県', healthRate: 10.31 },
  { code: '41', name: '佐賀県', healthRate: 10.78 },
  { code: '42', name: '長崎県', healthRate: 10.41 },
  { code: '43', name: '熊本県', healthRate: 10.12 },
  { code: '44', name: '大分県', healthRate: 10.25 },
  { code: '45', name: '宮崎県', healthRate: 10.09 },
  { code: '46', name: '鹿児島県', healthRate: 10.31 },
  { code: '47', name: '沖縄県', healthRate: 9.44 },
]

// Health Insurance Standard Remuneration Table (標準報酬月額)
// 50 grades: 58,000 ~ 1,390,000
// Each entry: [grade, standard, lower, upper]
// lower/upper define the salary range that maps to this standard amount
export const HEALTH_STANDARD_TABLE = [
  [1, 58000, 0, 63000],
  [2, 68000, 63000, 73000],
  [3, 78000, 73000, 83000],
  [4, 88000, 83000, 93000],
  [5, 98000, 93000, 101000],
  [6, 104000, 101000, 107000],
  [7, 110000, 107000, 114000],
  [8, 118000, 114000, 122000],
  [9, 126000, 122000, 130000],
  [10, 134000, 130000, 138000],
  [11, 142000, 138000, 146000],
  [12, 150000, 146000, 155000],
  [13, 160000, 155000, 165000],
  [14, 170000, 165000, 175000],
  [15, 180000, 175000, 185000],
  [16, 190000, 185000, 195000],
  [17, 200000, 195000, 210000],
  [18, 220000, 210000, 230000],
  [19, 240000, 230000, 250000],
  [20, 260000, 250000, 270000],
  [21, 280000, 270000, 290000],
  [22, 300000, 290000, 310000],
  [23, 320000, 310000, 330000],
  [24, 340000, 330000, 350000],
  [25, 360000, 350000, 370000],
  [26, 380000, 370000, 395000],
  [27, 410000, 395000, 425000],
  [28, 440000, 425000, 455000],
  [29, 470000, 455000, 485000],
  [30, 500000, 485000, 515000],
  [31, 530000, 515000, 545000],
  [32, 560000, 545000, 575000],
  [33, 590000, 575000, 605000],
  [34, 620000, 605000, 635000],
  [35, 650000, 635000, 665000],
  [36, 680000, 665000, 695000],
  [37, 710000, 695000, 730000],
  [38, 750000, 730000, 770000],
  [39, 790000, 770000, 810000],
  [40, 830000, 810000, 855000],
  [41, 880000, 855000, 905000],
  [42, 930000, 905000, 955000],
  [43, 980000, 955000, 1005000],
  [44, 1030000, 1005000, 1055000],
  [45, 1090000, 1055000, 1115000],
  [46, 1150000, 1115000, 1175000],
  [47, 1210000, 1175000, 1235000],
  [48, 1270000, 1235000, 1295000],
  [49, 1330000, 1295000, 1355000],
  [50, 1390000, 1355000, Infinity],
]

// Pension Standard Remuneration Table (厚生年金 標準報酬月額)
// 32 grades: 88,000 ~ 650,000
export const PENSION_STANDARD_TABLE = [
  [1, 88000, 0, 93000],
  [2, 98000, 93000, 101000],
  [3, 104000, 101000, 107000],
  [4, 110000, 107000, 114000],
  [5, 118000, 114000, 122000],
  [6, 126000, 122000, 130000],
  [7, 134000, 130000, 138000],
  [8, 142000, 138000, 146000],
  [9, 150000, 146000, 155000],
  [10, 160000, 155000, 165000],
  [11, 170000, 165000, 175000],
  [12, 180000, 175000, 185000],
  [13, 190000, 185000, 195000],
  [14, 200000, 195000, 210000],
  [15, 220000, 210000, 230000],
  [16, 240000, 230000, 250000],
  [17, 260000, 250000, 270000],
  [18, 280000, 270000, 290000],
  [19, 300000, 290000, 310000],
  [20, 320000, 310000, 330000],
  [21, 340000, 330000, 350000],
  [22, 360000, 350000, 370000],
  [23, 380000, 370000, 395000],
  [24, 410000, 395000, 425000],
  [25, 440000, 425000, 455000],
  [26, 470000, 455000, 485000],
  [27, 500000, 485000, 515000],
  [28, 530000, 515000, 545000],
  [29, 560000, 545000, 575000],
  [30, 590000, 575000, 605000],
  [31, 620000, 605000, 635000],
  [32, 650000, 635000, Infinity],
]

// Age groups
export const AGE_GROUPS = [
  { id: 'under40', label: '40歳未満', min: 0, max: 39, nursingApplies: false },
  { id: '40to64', label: '40〜64歳', min: 40, max: 64, nursingApplies: true },
  { id: '65to69', label: '65〜69歳', min: 65, max: 69, nursingApplies: true },
  { id: '70plus', label: '70歳以上', min: 70, max: 999, nursingApplies: false },
]

// Social insurance rates (%)
export const RATES = {
  pension: 18.3,          // Total rate (employee pays half = 9.15%)
  nursing: 1.59,          // Reiwa 8 nursing care rate (total, employee half = 0.795%)
  unionHealth: 9.50,      // Health union default total rate
}

// Pension bonus cap per occurrence (標準賞与額上限)
export const PENSION_BONUS_CAP = 1500000

// Non-resident flat withholding rate (20% + 復興2.1% = 20.42%)
export const NON_RESIDENT_TAX_RATE = 0.2042

// Commute allowance tax-free limit (通勤手当非課税限度額)
export const COMMUTE_TAX_FREE_LIMIT = 150000

// Employment insurance categories and employee rates (%)
export const EMPLOYMENT_CATEGORIES = [
  { id: 'general', label: '一般の事業', rate: 0.55 },
  { id: 'agriculture', label: '農林水産・清酒製造業', rate: 0.65 },
  { id: 'construction', label: '建設の事業', rate: 0.65 },
  { id: 'none', label: '加入なし', rate: 0 },
]

// 月額給与所得控除表 (電算機特例 - Monthly Salary Income Deduction)
// Input: 社会保険料等控除後の給与等の金額
export const MONTHLY_SALARY_DEDUCTION = [
  { upper: 135416, calc: () => 45834 },
  { upper: 149999, calc: (s) => Math.floor(s * 0.4) - 8333 },
  { upper: 299999, calc: (s) => Math.floor(s * 0.3) + 6667 },
  { upper: 549999, calc: (s) => Math.floor(s * 0.2) + 36667 },
  { upper: 708330, calc: (s) => Math.floor(s * 0.1) + 91667 },
  { upper: Infinity, calc: () => 162500 },
]

// 月額基礎控除 (電算機特例 - Monthly Basic Deduction)
// Input: 給与所得 (salary after MONTHLY_SALARY_DEDUCTION)
export const MONTHLY_BASIC_DEDUCTION = [
  { upper: 2162499, amount: 40000 },
  { upper: 2204166, amount: 26667 },
  { upper: 2245833, amount: 13334 },
  { upper: Infinity, amount: 0 },
]

// 月額税率表 (電算機特例 - Monthly Progressive Tax Rates)
// Rates already include 復興特別所得税 (2.1% reconstruction surtax)
// e.g., 5% base × 1.021 = 5.105%
export const MONTHLY_TAX_BRACKETS = [
  { upper: 162500, rate: 0.05105, deduction: 0 },
  { upper: 275000, rate: 0.10210, deduction: 8296 },
  { upper: 579166, rate: 0.20420, deduction: 36374 },
  { upper: 750000, rate: 0.23483, deduction: 54113 },
  { upper: 1500000, rate: 0.33693, deduction: 130688 },
  { upper: 3333333, rate: 0.40840, deduction: 237893 },
  { upper: Infinity, rate: 0.45945, deduction: 408061 },
]

// 乙欄 電算機計算 (令和8年分以降)
// Source: 国税庁 denshi_02.pdf

// 計算基準額の階差テーブル (Range 2: 105,000〜740,000)
export const OTSU_STEP_TABLE = [
  { upper: 220999, step: 2000, minimum: 105000 },
  { upper: 739999, step: 3000, minimum: 221000 },
]

// 第1表: 給与所得控除の額 (1円未満切上げ)
export const OTSU_SALARY_DEDUCTION = [
  { upper: 158333, calc: () => 54167 },
  { upper: 299999, calc: (a) => Math.ceil(a * 0.3 + 6667) },
  { upper: 549999, calc: (a) => Math.ceil(a * 0.2 + 36667) },
  { upper: 708330, calc: (a) => Math.ceil(a * 0.1 + 91667) },
  { upper: Infinity, calc: () => 162500 },
]

// 第2表: 基礎控除の額
export const OTSU_BASIC_DEDUCTION = 48334

// 第3表: 税率 (復興特別所得税を含まない基本税率)
export const OTSU_BASE_TAX_BRACKETS = [
  { upper: 162500, rate: 0.05, deduction: 0 },
  { upper: 275000, rate: 0.10, deduction: 8125 },
  { upper: 579166, rate: 0.20, deduction: 35625 },
  { upper: 750000, rate: 0.23, deduction: 53000 },
  { upper: 1500000, rate: 0.33, deduction: 128000 },
  { upper: 3333333, rate: 0.40, deduction: 233000 },
]

// 扶養控除等の額（従たる給与）— 将来用
export const OTSU_DEPENDENT_DEDUCTION = 1610

// Tax column types
export const TAX_COLUMNS = {
  KOU: 'kou',     // 甲欄 (主たる給与 - primary employment)
  OTSU: 'otsu',   // 乙欄 (従たる給与 - secondary employment)
}

// Social insurance collection timing
export const SI_COLLECTION_TIMING = {
  TOUGETSU: 'tougetsu',           // 当月 (same month)
  YOKUGETSU: 'yokugetsu',         // 翌月 (next month, most common)
  YOKUYOKUGETSU: 'yokuyokugetsu', // 翌々月 (month after next)
}

// Income tax brackets (annual - for resident tax auto calc)
export const INCOME_TAX_TABLE = [
  { upper: 1625000, rate: 5, deduction: 0 },
  { upper: 1800000, rate: 5, deduction: 0 },
  { upper: 3600000, rate: 10, deduction: 97500 },
  { upper: 6600000, rate: 20, deduction: 427500 },
  { upper: 9000000, rate: 23, deduction: 636000 },
  { upper: 18000000, rate: 33, deduction: 1536000 },
  { upper: 40000000, rate: 40, deduction: 2796000 },
  { upper: Infinity, rate: 45, deduction: 4796000 },
]

// Months
export const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1}月`,
}))

// Preset allowances
export const PRESET_ALLOWANCES = [
  { id: 'commute', name: '通勤手当', defaultAmount: 15000, taxExempt: true, siExempt: true },
  { id: 'housing', name: '住宅手当', defaultAmount: 20000 },
  { id: 'family', name: '家族手当', defaultAmount: 15000 },
  { id: 'overtime', name: '残業手当', defaultAmount: 30000 },
  { id: 'position', name: '役職手当', defaultAmount: 30000 },
  { id: 'skill', name: '資格手当', defaultAmount: 10000 },
  { id: 'region', name: '地域手当', defaultAmount: 10000 },
  { id: 'night', name: '深夜手当', defaultAmount: 5000 },
]

// Preset deductions (from take-home)
export const PRESET_DEDUCTIONS = [
  { id: 'union', name: '組合費', defaultAmount: 3000 },
  { id: 'savings', name: '財形貯蓄', defaultAmount: 10000 },
  { id: 'groupInsurance', name: '団体保険', defaultAmount: 5000 },
  { id: 'dormitory', name: '社宅・寮費', defaultAmount: 30000 },
  { id: 'meal', name: '食事代', defaultAmount: 5000 },
  { id: 'loan', name: '貸付金返済', defaultAmount: 10000 },
  { id: 'parking', name: '駐車場代', defaultAmount: 5000 },
  { id: 'stockPurchase', name: '持株会', defaultAmount: 10000 },
  { id: 'childcare', name: '育児費用', defaultAmount: 5000 },
  { id: 'ideco', name: 'iDeCo拠出', defaultAmount: 23000 },
  { id: 'other', name: 'その他控除', defaultAmount: 5000 },
]

// Default bonus months
export const DEFAULT_BONUS_MONTHS = [6, 12]

// Social insurance calculation modes
export const SI_MODES = {
  AUTO: 'auto',
  STANDARD: 'standard',
  CUSTOM: 'custom',
}

// Default prefecture index (Tokyo = index 12)
export const DEFAULT_PREFECTURE_INDEX = 12

// Resident tax default rate
export const RESIDENT_TAX_RATE = 10 // %

// Salary employment income deduction table (annual - for resident tax)
export const SALARY_DEDUCTION_TABLE = [
  { upper: 1625000, calc: () => 550000 },
  { upper: 1800000, calc: (s) => Math.floor(s * 0.4) - 100000 },
  { upper: 3600000, calc: (s) => Math.floor(s * 0.3) + 80000 },
  { upper: 6600000, calc: (s) => Math.floor(s * 0.2) + 440000 },
  { upper: 8500000, calc: (s) => Math.floor(s * 0.1) + 1100000 },
  { upper: Infinity, calc: () => 1950000 },
]
