import {
  HEALTH_STANDARD_TABLE,
  PENSION_STANDARD_TABLE,
  EMPLOYMENT_CATEGORIES,
  SI_MODES,
  PREFECTURES,
  RATES,
} from '../constants/taxData'
import { formatNumber, parseNumericInput } from '../utils/format'

const colors = {
  health: '#22c55e',
  pension: '#3b82f6',
  nursing: '#a855f7',
  employment: '#f59e0b',
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}

const styles = {
  card: {
    background: 'rgba(255,255,255,0.03)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 24,
    padding: 40,
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    color: '#fff',
    marginBottom: 24,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  subCard: (color) => ({
    background: `rgba(${hexToRgb(color)},0.05)`,
    border: `1px solid rgba(${hexToRgb(color)},0.15)`,
    borderRadius: 24,
    padding: 32,
    marginBottom: 16,
  }),
  subTitle: (color) => ({
    fontSize: 16,
    fontWeight: 700,
    color,
    marginBottom: 16,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  }),
  tabs: {
    display: 'flex',
    gap: 8,
    marginBottom: 16,
  },
  tab: (active, color) => ({
    flex: 1,
    padding: '12px 10px',
    background: active
      ? `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`
      : 'rgba(255,255,255,0.05)',
    border: active
      ? `2px solid rgba(${hexToRgb(color)},0.5)`
      : '2px solid rgba(255,255,255,0.1)',
    borderRadius: 12,
    color: active ? '#fff' : 'rgba(255,255,255,0.6)',
    fontSize: 13,
    cursor: 'pointer',
    fontWeight: 600,
    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
    textAlign: 'center',
    transform: active ? 'scale(1)' : 'scale(0.98)',
    boxShadow: active ? `0 6px 16px rgba(${hexToRgb(color)},0.3)` : 'none',
  }),
  label: {
    fontSize: 14,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 12,
    display: 'block',
    letterSpacing: 0.3,
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(0,0,0,0.3)',
    border: '2px solid rgba(255,255,255,0.1)',
    borderRadius: 12,
    color: '#fff',
    fontSize: 16,
    fontWeight: 600,
    outline: 'none',
    textAlign: 'right',
    transition: 'all 0.3s ease',
  },
  select: {
    width: '100%',
    padding: '16px 20px',
    background: 'rgba(0,0,0,0.3)',
    border: '2px solid rgba(255,255,255,0.1)',
    borderRadius: 16,
    color: '#fff',
    fontSize: 16,
    fontWeight: 600,
    outline: 'none',
    appearance: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='white' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 20px center',
  },
  checkbox: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 14,
    fontWeight: 500,
    color: 'rgba(255,255,255,0.7)',
    cursor: 'pointer',
    marginBottom: 12,
  },
  checkboxInput: {
    width: 18,
    height: 18,
    accentColor: '#10b981',
    cursor: 'pointer',
  },
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
    gap: 8,
  },
  categoryBtn: (active, color) => ({
    padding: '14px 8px',
    background: active
      ? `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`
      : 'rgba(255,255,255,0.05)',
    border: active
      ? `2px solid rgba(${hexToRgb(color)},0.5)`
      : '2px solid rgba(255,255,255,0.1)',
    borderRadius: 12,
    color: active ? '#fff' : 'rgba(255,255,255,0.6)',
    fontSize: 13,
    cursor: 'pointer',
    fontWeight: 600,
    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
    textAlign: 'center',
    transform: active ? 'scale(1)' : 'scale(0.98)',
    boxShadow: active ? `0 6px 16px rgba(${hexToRgb(color)},0.3)` : 'none',
  }),
  rateInfo: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 10,
  },
}

function NumericInput({ value, onChange, placeholder }) {
  const handleChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '')
    onChange(raw === '' ? 0 : parseInt(raw, 10))
  }

  const handleFocus = (e) => {
    e.target.value = value === 0 ? '' : String(value)
  }

  const handleBlur = (e) => {
    onChange(parseNumericInput(e.target.value))
  }

  return (
    <input
      style={styles.input}
      value={value === 0 ? '' : formatNumber(value)}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder={placeholder}
      inputMode="numeric"
    />
  )
}

function ModeTabBar({ mode, onModeChange, color }) {
  return (
    <div style={styles.tabs}>
      <button
        style={styles.tab(mode === SI_MODES.AUTO, color)}
        onClick={() => onModeChange(SI_MODES.AUTO)}
      >
        自動計算
      </button>
      <button
        style={styles.tab(mode === SI_MODES.STANDARD, color)}
        onClick={() => onModeChange(SI_MODES.STANDARD)}
      >
        標準報酬月額
      </button>
      <button
        style={styles.tab(mode === SI_MODES.CUSTOM, color)}
        onClick={() => onModeChange(SI_MODES.CUSTOM)}
      >
        直接入力
      </button>
    </div>
  )
}

function HealthCard({
  mode,
  onModeChange,
  isKyokai,
  onKyokaiChange,
  standardGrade,
  onStandardGradeChange,
  customAmount,
  onCustomAmountChange,
  prefectureIndex,
}) {
  const prefecture = PREFECTURES[prefectureIndex]
  const rate = isKyokai ? prefecture.healthRate : RATES.unionHealth

  return (
    <div style={styles.subCard(colors.health)}>
      <div style={styles.subTitle(colors.health)}>
        <span>&#9881;</span> 健康保険
      </div>

      <label style={styles.checkbox}>
        <input
          type="checkbox"
          style={styles.checkboxInput}
          checked={isKyokai}
          onChange={(e) => onKyokaiChange(e.target.checked)}
        />
        協会けんぽ（チェックなし＝健保組合）
      </label>

      <ModeTabBar mode={mode} onModeChange={onModeChange} color={colors.health} />

      {mode === SI_MODES.STANDARD && (
        <div style={{ marginBottom: 8 }}>
          <label style={styles.label}>標準報酬月額 等級</label>
          <select
            style={styles.select}
            value={standardGrade ?? ''}
            onChange={(e) => onStandardGradeChange(e.target.value === '' ? null : Number(e.target.value))}
          >
            <option value="" style={{ background: '#1a1a1a' }}>自動判定</option>
            {HEALTH_STANDARD_TABLE.map(([grade, amount], i) => (
              <option key={grade} value={i} style={{ background: '#1a1a1a' }}>
                {grade}等級 - ¥{formatNumber(amount)}
              </option>
            ))}
          </select>
        </div>
      )}

      {mode === SI_MODES.CUSTOM && (
        <div>
          <label style={styles.label}>健康保険料（本人負担額）</label>
          <NumericInput
            value={customAmount}
            onChange={onCustomAmountChange}
            placeholder="15,000"
          />
        </div>
      )}

      <div style={styles.rateInfo}>
        料率: {rate}%（本人負担 {(rate / 2).toFixed(2)}%）
        {isKyokai ? ` - ${prefecture.name}` : ' - 健保組合'}
      </div>
    </div>
  )
}

function PensionCard({
  mode,
  onModeChange,
  standardGrade,
  onStandardGradeChange,
  customAmount,
  onCustomAmountChange,
}) {
  return (
    <div style={styles.subCard(colors.pension)}>
      <div style={styles.subTitle(colors.pension)}>
        <span>&#128176;</span> 厚生年金
      </div>

      <ModeTabBar mode={mode} onModeChange={onModeChange} color={colors.pension} />

      {mode === SI_MODES.STANDARD && (
        <div style={{ marginBottom: 8 }}>
          <label style={styles.label}>標準報酬月額 等級</label>
          <select
            style={styles.select}
            value={standardGrade ?? ''}
            onChange={(e) => onStandardGradeChange(e.target.value === '' ? null : Number(e.target.value))}
          >
            <option value="" style={{ background: '#1a1a1a' }}>自動判定</option>
            {PENSION_STANDARD_TABLE.map(([grade, amount], i) => (
              <option key={grade} value={i} style={{ background: '#1a1a1a' }}>
                {grade}等級 - ¥{formatNumber(amount)}
              </option>
            ))}
          </select>
        </div>
      )}

      {mode === SI_MODES.CUSTOM && (
        <div>
          <label style={styles.label}>厚生年金保険料（本人負担額）</label>
          <NumericInput
            value={customAmount}
            onChange={onCustomAmountChange}
            placeholder="27,450"
          />
        </div>
      )}

      <div style={styles.rateInfo}>
        料率: {RATES.pension}%（本人負担 {(RATES.pension / 2).toFixed(2)}%）
      </div>
    </div>
  )
}

function NursingCard({
  isCollected,
  onCollectedChange,
  useCustom,
  onUseCustomChange,
  customAmount,
  onCustomAmountChange,
}) {
  return (
    <div style={styles.subCard(colors.nursing)}>
      <div style={styles.subTitle(colors.nursing)}>
        <span>&#128156;</span> 介護保険
      </div>

      <label style={styles.checkbox}>
        <input
          type="checkbox"
          style={styles.checkboxInput}
          checked={isCollected}
          onChange={(e) => onCollectedChange(e.target.checked)}
        />
        介護保険料を徴収する（40〜69歳）
      </label>

      {isCollected && (
        <>
          <label style={styles.checkbox}>
            <input
              type="checkbox"
              style={styles.checkboxInput}
              checked={useCustom}
              onChange={(e) => onUseCustomChange(e.target.checked)}
            />
            金額を直接入力
          </label>

          {useCustom && (
            <div>
              <label style={styles.label}>介護保険料（本人負担額）</label>
              <NumericInput
                value={customAmount}
                onChange={onCustomAmountChange}
                placeholder="2,700"
              />
            </div>
          )}

          <div style={styles.rateInfo}>
            料率: {RATES.nursing}%（本人負担 {(RATES.nursing / 2).toFixed(2)}%）
          </div>
        </>
      )}
    </div>
  )
}

function EmploymentCard({
  joined,
  onJoinedChange,
  categoryId,
  onCategoryChange,
}) {
  const selected = EMPLOYMENT_CATEGORIES.find((c) => c.id === categoryId) || EMPLOYMENT_CATEGORIES[0]

  return (
    <div style={styles.subCard(colors.employment)}>
      <div style={styles.subTitle(colors.employment)}>
        <span>&#128188;</span> 雇用保険
      </div>

      <label style={styles.checkbox}>
        <input
          type="checkbox"
          style={styles.checkboxInput}
          checked={joined}
          onChange={(e) => onJoinedChange(e.target.checked)}
        />
        雇用保険に加入
      </label>

      {joined && (
        <>
          <div style={styles.categoryGrid}>
            {EMPLOYMENT_CATEGORIES.filter((c) => c.id !== 'none').map((cat) => (
              <button
                key={cat.id}
                style={styles.categoryBtn(categoryId === cat.id, colors.employment)}
                onClick={() => onCategoryChange(cat.id)}
              >
                {cat.label}
                <br />
                <span style={{ fontSize: 11, opacity: 0.8 }}>{cat.rate}%</span>
              </button>
            ))}
          </div>
          <div style={styles.rateInfo}>
            本人負担率: {selected.rate}%
          </div>
        </>
      )}
    </div>
  )
}

export default function SocialInsuranceSection({
  healthMode,
  onHealthModeChange,
  healthIsKyokai,
  onHealthKyokaiChange,
  healthStandardGrade,
  onHealthStandardGradeChange,
  healthCustomAmount,
  onHealthCustomAmountChange,
  pensionMode,
  onPensionModeChange,
  pensionStandardGrade,
  onPensionStandardGradeChange,
  pensionCustomAmount,
  onPensionCustomAmountChange,
  nursingIsCollected,
  onNursingCollectedChange,
  nursingUseCustom,
  onNursingUseCustomChange,
  nursingCustomAmount,
  onNursingCustomAmountChange,
  employmentJoined,
  onEmploymentJoinedChange,
  employmentCategory,
  onEmploymentCategoryChange,
  prefectureIndex,
}) {
  return (
    <div style={styles.card}>
      <div style={styles.title}>
        <span style={{ color: '#22c55e' }}>&#9679;</span>
        社会保険
      </div>

      <HealthCard
        mode={healthMode}
        onModeChange={onHealthModeChange}
        isKyokai={healthIsKyokai}
        onKyokaiChange={onHealthKyokaiChange}
        standardGrade={healthStandardGrade}
        onStandardGradeChange={onHealthStandardGradeChange}
        customAmount={healthCustomAmount}
        onCustomAmountChange={onHealthCustomAmountChange}
        prefectureIndex={prefectureIndex}
      />

      <PensionCard
        mode={pensionMode}
        onModeChange={onPensionModeChange}
        standardGrade={pensionStandardGrade}
        onStandardGradeChange={onPensionStandardGradeChange}
        customAmount={pensionCustomAmount}
        onCustomAmountChange={onPensionCustomAmountChange}
      />

      <NursingCard
        isCollected={nursingIsCollected}
        onCollectedChange={onNursingCollectedChange}
        useCustom={nursingUseCustom}
        onUseCustomChange={onNursingUseCustomChange}
        customAmount={nursingCustomAmount}
        onCustomAmountChange={onNursingCustomAmountChange}
      />

      <EmploymentCard
        joined={employmentJoined}
        onJoinedChange={onEmploymentJoinedChange}
        categoryId={employmentCategory}
        onCategoryChange={onEmploymentCategoryChange}
      />
    </div>
  )
}
