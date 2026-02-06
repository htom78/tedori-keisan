import { Minus, Plus, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { formatNumber, parseNumericInput } from '../utils/format'

const colors = {
  withholding: '#ef4444',
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
  subCard: (color) => ({
    background: `rgba(${hexToRgb(color)},0.08)`,
    border: `1px solid rgba(${hexToRgb(color)},0.2)`,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  }),
  subTitle: (color) => ({
    fontSize: 15,
    fontWeight: 600,
    color,
    marginBottom: 14,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  }),
  subTitleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
    display: 'block',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    background: '#2a2a2a',
    border: '1px solid #3a3a3a',
    borderRadius: 10,
    color: '#e2e8f0',
    fontSize: 14,
    outline: 'none',
    textAlign: 'right',
  },
  displayBox: {
    width: '100%',
    padding: '14px 16px',
    background: '#2a2a2a',
    border: '1px solid #3a3a3a',
    borderRadius: 12,
    color: '#9ca3af',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  toggleRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: 8,
    marginBottom: 8,
  },
  toggleBtn: (active) => ({
    padding: '12px 8px',
    background: active ? 'rgba(239,68,68,0.15)' : '#2a2a2a',
    border: active ? '1px solid rgba(239,68,68,0.3)' : '1px solid #3a3a3a',
    borderRadius: 10,
    color: active ? '#f87171' : '#9ca3af',
    fontSize: 13,
    cursor: 'pointer',
    fontWeight: active ? 600 : 400,
    transition: 'all 0.2s',
    textAlign: 'center',
  }),
  tabs: {
    display: 'flex',
    gap: 6,
    marginBottom: 12,
  },
  tab: (active, color) => ({
    flex: 1,
    padding: '10px 8px',
    background: active ? `rgba(${hexToRgb(color)},0.15)` : '#2a2a2a',
    border: active ? `1px solid rgba(${hexToRgb(color)},0.3)` : '1px solid #3a3a3a',
    borderRadius: 10,
    color: active ? color : '#9ca3af',
    fontSize: 12,
    cursor: 'pointer',
    fontWeight: active ? 600 : 400,
    transition: 'all 0.2s',
    textAlign: 'center',
  }),
  visibilityBtn: {
    background: 'none',
    border: 'none',
    color: '#6b7280',
    cursor: 'pointer',
    padding: 4,
    display: 'flex',
    alignItems: 'center',
  },
  info: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
    lineHeight: 1.5,
  },
  hiddenNote: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    padding: '14px 0',
    fontStyle: 'italic',
  },
}

function WithholdingCard({
  dependents,
  onDependentsChange,
  isElectronic,
  onElectronicChange,
  isTaxExempt,
  onTaxExemptChange,
  isNonResident,
  onNonResidentChange,
}) {
  const dependentLabel = dependents === 0
    ? '扶養家族なし'
    : `扶養家族 ${dependents}人`

  return (
    <div style={styles.subCard(colors.withholding)}>
      <div style={styles.subTitle(colors.withholding)}>
        <ShieldCheck size={16} /> 源泉所得税設定
      </div>

      <div
        style={styles.displayBox}
        onClick={() => onDependentsChange(dependents === 0 ? 1 : 0)}
      >
        <Minus
          size={14}
          style={{ cursor: 'pointer', color: '#6b7280' }}
          onClick={(e) => {
            e.stopPropagation()
            onDependentsChange(Math.max(0, dependents - 1))
          }}
        />
        <span>{dependentLabel}</span>
        <Plus
          size={14}
          style={{ cursor: 'pointer', color: '#6b7280' }}
          onClick={(e) => {
            e.stopPropagation()
            onDependentsChange(dependents + 1)
          }}
        />
      </div>

      <div style={styles.toggleRow}>
        <button
          style={styles.toggleBtn(isElectronic)}
          onClick={() => onElectronicChange(!isElectronic)}
        >
          電算
        </button>
        <button
          style={styles.toggleBtn(isTaxExempt)}
          onClick={() => onTaxExemptChange(!isTaxExempt)}
        >
          免除
        </button>
        <button
          style={styles.toggleBtn(isNonResident)}
          onClick={() => onNonResidentChange(!isNonResident)}
        >
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
          {hidden ? <EyeOff size={16} /> : <Eye size={16} />}
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
  isElectronic,
  onElectronicChange,
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
        isElectronic={isElectronic}
        onElectronicChange={onElectronicChange}
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
