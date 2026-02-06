import { Eye, EyeOff } from 'lucide-react'
import { formatNumber, parseNumericInput } from '../utils/format'

const color = '#f97316'

const styles = {
  card: {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  tabs: {
    display: 'flex',
    gap: 4,
    marginBottom: 12,
    background: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    padding: 3,
  },
  tab: (active) => ({
    flex: 1,
    padding: '8px 12px',
    background: active ? `rgba(249,115,22,0.2)` : 'transparent',
    border: 'none',
    borderRadius: 6,
    color: active ? color : '#64748b',
    fontSize: 13,
    cursor: 'pointer',
    fontWeight: active ? 600 : 400,
    transition: 'all 0.2s',
  }),
  label: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 6,
    display: 'block',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 8,
    color: '#e2e8f0',
    fontSize: 14,
    outline: 'none',
    textAlign: 'right',
  },
  visibilityBtn: {
    background: 'none',
    border: 'none',
    color: '#64748b',
    cursor: 'pointer',
    padding: 4,
    display: 'flex',
    alignItems: 'center',
  },
  info: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 8,
    lineHeight: 1.5,
  },
  hiddenNote: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    padding: '16px 0',
    fontStyle: 'italic',
  },
}

export default function ResidentTaxSection({
  mode,
  onModeChange,
  customAnnual,
  onCustomAnnualChange,
  hidden,
  onHiddenChange,
}) {
  const handleAmountChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '')
    onCustomAnnualChange(raw === '' ? 0 : parseInt(raw, 10))
  }

  const handleFocus = (e) => {
    e.target.value = customAnnual === 0 ? '' : String(customAnnual)
  }

  const handleBlur = (e) => {
    onCustomAnnualChange(parseNumericInput(e.target.value))
  }

  return (
    <div style={styles.card}>
      <div style={styles.title}>
        <div style={styles.titleLeft}>
          <span style={{ color }}>&#9679;</span>
          住民税
        </div>
        <button
          style={styles.visibilityBtn}
          onClick={() => onHiddenChange(!hidden)}
          title={hidden ? '住民税を表示' : '住民税を非表示'}
        >
          {hidden ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {hidden ? (
        <div style={styles.hiddenNote}>
          住民税は計算から除外されています
        </div>
      ) : (
        <>
          <div style={styles.tabs}>
            <button
              style={styles.tab(mode === 'auto')}
              onClick={() => onModeChange('auto')}
            >
              自動概算
            </button>
            <button
              style={styles.tab(mode === 'manual')}
              onClick={() => onModeChange('manual')}
            >
              手動入力
            </button>
          </div>

          {mode === 'auto' ? (
            <div style={styles.info}>
              年収と社会保険料から住民税を概算します。
              <br />
              所得割（課税所得×10%）＋均等割（¥5,000）÷12ヶ月
            </div>
          ) : (
            <div>
              <label style={styles.label}>年間住民税額</label>
              <input
                style={styles.input}
                value={customAnnual === 0 ? '' : formatNumber(customAnnual)}
                onChange={handleAmountChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="120,000"
                inputMode="numeric"
              />
              <div style={styles.info}>
                年額を入力すると12で割った月額が控除されます
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
