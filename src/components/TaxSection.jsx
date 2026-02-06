import { Minus, Plus, Eye, EyeOff } from 'lucide-react'
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
    background: `rgba(${hexToRgb(color)},0.06)`,
    border: `1px solid rgba(${hexToRgb(color)},0.15)`,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  }),
  subTitle: (color) => ({
    fontSize: 14,
    fontWeight: 600,
    color,
    marginBottom: 10,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  }),
  subTitleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
    display: 'block',
  },
  input: {
    width: '100%',
    padding: '8px 10px',
    background: '#2a2a2a',
    border: '1px solid #3a3a3a',
    borderRadius: 6,
    color: '#e2e8f0',
    fontSize: 14,
    outline: 'none',
    textAlign: 'right',
  },
  stepper: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  stepperBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: '#2a2a2a',
    border: '1px solid #3a3a3a',
    color: '#e2e8f0',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  stepperValue: {
    fontSize: 22,
    fontWeight: 700,
    color: '#e2e8f0',
    minWidth: 36,
    textAlign: 'center',
  },
  stepperLabel: {
    fontSize: 13,
    color: '#9ca3af',
    marginLeft: 4,
  },
  checkbox: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 13,
    color: '#cbd5e1',
    cursor: 'pointer',
    marginBottom: 8,
  },
  checkboxInput: {
    width: 16,
    height: 16,
    accentColor: '#10b981',
    cursor: 'pointer',
  },
  description: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 4,
    paddingLeft: 24,
  },
  tabs: {
    display: 'flex',
    gap: 4,
    marginBottom: 10,
    background: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    padding: 3,
  },
  tab: (active, color) => ({
    flex: 1,
    padding: '6px 8px',
    background: active ? `rgba(${hexToRgb(color)},0.15)` : 'transparent',
    border: 'none',
    borderRadius: 6,
    color: active ? color : '#6b7280',
    fontSize: 12,
    cursor: 'pointer',
    fontWeight: active ? 600 : 400,
    transition: 'all 0.2s',
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
    padding: '12px 0',
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
  return (
    <div style={styles.subCard(colors.withholding)}>
      <div style={styles.subTitle(colors.withholding)}>
        <span>&#128203;</span> 所得税（源泉徴収）
      </div>

      <label style={styles.label}>扶養親族等の数</label>
      <div style={styles.stepper}>
        <button
          style={styles.stepperBtn}
          onClick={() => onDependentsChange(Math.max(0, dependents - 1))}
        >
          <Minus size={14} />
        </button>
        <span style={styles.stepperValue}>{dependents}</span>
        <button
          style={styles.stepperBtn}
          onClick={() => onDependentsChange(dependents + 1)}
        >
          <Plus size={14} />
        </button>
        <span style={styles.stepperLabel}>人</span>
      </div>

      <label style={styles.checkbox}>
        <input
          type="checkbox"
          style={styles.checkboxInput}
          checked={isElectronic}
          onChange={(e) => onElectronicChange(e.target.checked)}
        />
        電子申告利用
      </label>
      <div style={styles.description}>e-Taxによる確定申告を行う場合</div>

      <label style={{ ...styles.checkbox, marginTop: 8 }}>
        <input
          type="checkbox"
          style={styles.checkboxInput}
          checked={isTaxExempt}
          onChange={(e) => onTaxExemptChange(e.target.checked)}
        />
        所得税非課税
      </label>
      <div style={styles.description}>月額88,000円未満等で非課税の場合</div>

      <label style={{ ...styles.checkbox, marginTop: 8 }}>
        <input
          type="checkbox"
          style={styles.checkboxInput}
          checked={isNonResident}
          onChange={(e) => onNonResidentChange(e.target.checked)}
        />
        非居住者（乙欄適用）
      </label>
      <div style={styles.description}>甲欄ではなく乙欄の税率を適用</div>
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
