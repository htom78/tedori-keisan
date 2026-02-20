import { Minus, Plus, Eye, EyeOff, ShieldCheck, Check } from 'lucide-react'
import { formatNumber, parseNumericInput } from '../utils/format'

const colors = {
  withholding: '#ffc107',
  resident: '#f97316',
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
  subTitleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
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
    padding: '16px 20px',
    background: 'rgba(0,0,0,0.3)',
    border: '2px solid rgba(255,255,255,0.1)',
    borderRadius: 16,
    color: '#fff',
    fontSize: 16,
    fontWeight: 600,
    outline: 'none',
    textAlign: 'right',
    transition: 'all 0.3s ease',
  },
  displayBox: {
    width: '100%',
    padding: '16px 20px',
    background: 'rgba(0,0,0,0.3)',
    border: '2px solid rgba(255,255,255,0.1)',
    borderRadius: 16,
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
    fontWeight: 600,
    textAlign: 'center',
    marginBottom: 16,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    transition: 'all 0.3s ease',
  },
  columnRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 10,
    marginBottom: 12,
  },
  columnBtn: (active, color) => ({
    padding: '14px 10px',
    background: active
      ? `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`
      : 'rgba(255,255,255,0.05)',
    border: active
      ? `2px solid rgba(${hexToRgb(color)},0.5)`
      : '2px solid rgba(255,255,255,0.1)',
    borderRadius: 12,
    color: active ? '#000' : '#fff',
    fontSize: 13,
    cursor: 'pointer',
    fontWeight: 600,
    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
    textAlign: 'center',
    transform: active ? 'scale(1)' : 'scale(0.98)',
    boxShadow: active ? `0 6px 16px rgba(${hexToRgb(color)},0.3)` : 'none',
  }),
  toggleRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
    marginBottom: 8,
  },
  toggleBtn: (active, color) => ({
    padding: 14,
    background: active
      ? `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`
      : 'rgba(255,255,255,0.05)',
    border: active
      ? `2px solid rgba(${hexToRgb(color)},0.5)`
      : '2px solid rgba(255,255,255,0.1)',
    borderRadius: 12,
    color: active ? '#000' : '#fff',
    fontSize: 14,
    cursor: 'pointer',
    fontWeight: 600,
    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
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
  visibilityBtn: {
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.4)',
    cursor: 'pointer',
    padding: 4,
    display: 'flex',
    alignItems: 'center',
  },
  info: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 10,
    lineHeight: 1.6,
  },
  hiddenNote: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    padding: '16px 0',
    fontStyle: 'italic',
  },
}

function WithholdingCard({
  dependents,
  onDependentsChange,
  taxColumn,
  onTaxColumnChange,
  isTaxExempt,
  onTaxExemptChange,
  isNonResident,
  onNonResidentChange,
}) {
  const isOtsu = taxColumn === 'otsu'
  const dependentLabel = dependents === 0
    ? '扶養家族なし'
    : `扶養家族 ${dependents}人`

  return (
    <div style={styles.subCard(colors.withholding)}>
      <div style={styles.subTitle(colors.withholding)}>
        <ShieldCheck size={18} /> 源泉所得税設定
      </div>

      <div style={styles.columnRow}>
        <button
          style={styles.columnBtn(taxColumn === 'kou', colors.withholding)}
          onClick={() => onTaxColumnChange('kou')}
        >
          甲欄（主たる給与）
        </button>
        <button
          style={styles.columnBtn(taxColumn === 'otsu', colors.withholding)}
          onClick={() => onTaxColumnChange('otsu')}
        >
          乙欄（従たる給与）
        </button>
      </div>

      {!isOtsu && (
        <div
          style={styles.displayBox}
          onClick={() => onDependentsChange(dependents === 0 ? 1 : 0)}
        >
          <Minus
            size={16}
            style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.4)' }}
            onClick={(e) => {
              e.stopPropagation()
              onDependentsChange(Math.max(0, dependents - 1))
            }}
          />
          <span>{dependentLabel}</span>
          <Plus
            size={16}
            style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.4)' }}
            onClick={(e) => {
              e.stopPropagation()
              onDependentsChange(dependents + 1)
            }}
          />
        </div>
      )}

      {isOtsu && (
        <div style={styles.info}>
          乙欄は扶養控除なし。副業等の従たる給与に適用されます。
          <br />
          ※ 乙欄の税額は概算です。
        </div>
      )}

      <div style={styles.toggleRow}>
        <button
          style={styles.toggleBtn(isTaxExempt, colors.withholding)}
          onClick={() => onTaxExemptChange(!isTaxExempt)}
        >
          {isTaxExempt && <Check size={16} />}
          免除
        </button>
        <button
          style={styles.toggleBtn(isNonResident, colors.withholding)}
          onClick={() => onNonResidentChange(!isNonResident)}
        >
          {isNonResident && <Check size={16} />}
          非居住
        </button>
      </div>
    </div>
  )
}

function ResidentCard({
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
    <div style={styles.subCard(colors.resident)}>
      <div style={styles.subTitleRow}>
        <div style={styles.subTitle(colors.resident)}>
          <span>&#127969;</span> 住民税
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
              style={styles.tab(mode === 'auto', colors.resident)}
              onClick={() => onModeChange('auto')}
            >
              自動概算
            </button>
            <button
              style={styles.tab(mode === 'manual', colors.resident)}
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

export default function TaxSection({
  dependents,
  onDependentsChange,
  taxColumn,
  onTaxColumnChange,
  isTaxExempt,
  onTaxExemptChange,
  isNonResident,
  onNonResidentChange,
  residentTaxMode,
  onResidentTaxModeChange,
  residentTaxCustomAnnual,
  onResidentTaxCustomAnnualChange,
  residentTaxHidden,
  onResidentTaxHiddenChange,
}) {
  return (
    <div style={styles.card}>
      <div style={styles.title}>
        <span style={{ color: '#ef4444' }}>&#9679;</span>
        税金
      </div>

      <WithholdingCard
        dependents={dependents}
        onDependentsChange={onDependentsChange}
        taxColumn={taxColumn}
        onTaxColumnChange={onTaxColumnChange}
        isTaxExempt={isTaxExempt}
        onTaxExemptChange={onTaxExemptChange}
        isNonResident={isNonResident}
        onNonResidentChange={onNonResidentChange}
      />

      <ResidentCard
        mode={residentTaxMode}
        onModeChange={onResidentTaxModeChange}
        customAnnual={residentTaxCustomAnnual}
        onCustomAnnualChange={onResidentTaxCustomAnnualChange}
        hidden={residentTaxHidden}
        onHiddenChange={onResidentTaxHiddenChange}
      />
    </div>
  )
}
