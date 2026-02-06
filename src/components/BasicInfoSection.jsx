import { PREFECTURES, AGE_GROUPS, MONTHS } from '../constants/taxData'
import { formatNumber, parseNumericInput } from '../utils/format'

const styles = {
  card: {
    background: '#1e1e1e',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    color: '#e2e8f0',
    marginBottom: 16,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 13,
    color: '#9ca3af',
    marginBottom: 6,
    display: 'block',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    background: '#2a2a2a',
    border: '1px solid #3a3a3a',
    borderRadius: 8,
    color: '#e2e8f0',
    fontSize: 16,
    outline: 'none',
    textAlign: 'right',
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    background: '#2a2a2a',
    border: '1px solid #3a3a3a',
    borderRadius: 8,
    color: '#e2e8f0',
    fontSize: 14,
    outline: 'none',
    appearance: 'none',
    cursor: 'pointer',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
    marginBottom: 12,
  },
  ageGroup: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
    gap: 6,
  },
  ageBtn: (active) => ({
    padding: '8px 4px',
    background: active ? '#f87171' : '#2a2a2a',
    border: active ? '1px solid #f87171' : '1px solid #3a3a3a',
    borderRadius: 8,
    color: active ? '#ffffff' : '#9ca3af',
    fontSize: 12,
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'center',
    fontWeight: active ? 600 : 400,
  }),
  salaryPrefix: {
    position: 'absolute',
    left: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af',
    fontSize: 14,
    pointerEvents: 'none',
  },
  inputWrap: {
    position: 'relative',
  },
}

export default function BasicInfoSection({
  salary,
  onSalaryChange,
  month,
  onMonthChange,
  prefectureIndex,
  onPrefectureChange,
  ageGroup,
  onAgeGroupChange,
}) {
  const handleSalaryChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '')
    onSalaryChange(raw === '' ? 0 : parseInt(raw, 10))
  }

  const handleSalaryFocus = (e) => {
    e.target.value = salary === 0 ? '' : String(salary)
    e.target.type = 'text'
  }

  const handleSalaryBlur = (e) => {
    const val = parseNumericInput(e.target.value)
    onSalaryChange(val)
  }

  return (
    <div style={styles.card}>
      <div style={styles.title}>
        <span style={{ color: '#f87171' }}>&#9679;</span>
        基本情報
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={styles.label}>基本給（月額）</label>
        <div style={styles.inputWrap}>
          <span style={styles.salaryPrefix}>¥</span>
          <input
            style={{ ...styles.input, paddingLeft: 28 }}
            value={salary === 0 ? '' : formatNumber(salary)}
            onChange={handleSalaryChange}
            onFocus={handleSalaryFocus}
            onBlur={handleSalaryBlur}
            placeholder="300,000"
            inputMode="numeric"
          />
        </div>
      </div>

      <div style={styles.row}>
        <div>
          <label style={styles.label}>計算月</label>
          <select
            style={styles.select}
            value={month}
            onChange={(e) => onMonthChange(Number(e.target.value))}
          >
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={styles.label}>都道府県</label>
          <select
            style={styles.select}
            value={prefectureIndex}
            onChange={(e) => onPrefectureChange(Number(e.target.value))}
          >
            {PREFECTURES.map((p, i) => (
              <option key={p.code} value={i}>
                {p.name} ({p.healthRate}%)
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label style={styles.label}>年齢区分</label>
        <div style={styles.ageGroup}>
          {AGE_GROUPS.map((ag) => (
            <button
              key={ag.id}
              style={styles.ageBtn(ageGroup === ag.id)}
              onClick={() => onAgeGroupChange(ag.id)}
            >
              {ag.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
