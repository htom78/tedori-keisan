import { Minus, Plus } from 'lucide-react'

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
    gap: 8,
  },
  label: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 6,
    display: 'block',
  },
  stepper: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  stepperBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    color: '#e2e8f0',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  stepperValue: {
    fontSize: 24,
    fontWeight: 700,
    color: '#e2e8f0',
    minWidth: 40,
    textAlign: 'center',
  },
  stepperLabel: {
    fontSize: 13,
    color: '#94a3b8',
    marginLeft: 8,
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
    accentColor: '#ef4444',
    cursor: 'pointer',
  },
  description: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 4,
    paddingLeft: 24,
  },
}

export default function WithholdingTaxSection({
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
    <div style={styles.card}>
      <div style={styles.title}>
        <span style={{ color: '#ef4444' }}>&#9679;</span>
        所得税（源泉徴収）
      </div>

      <label style={styles.label}>扶養親族等の数</label>
      <div style={styles.stepper}>
        <button
          style={styles.stepperBtn}
          onClick={() => onDependentsChange(Math.max(0, dependents - 1))}
        >
          <Minus size={16} />
        </button>
        <span style={styles.stepperValue}>{dependents}</span>
        <button
          style={styles.stepperBtn}
          onClick={() => onDependentsChange(dependents + 1)}
        >
          <Plus size={16} />
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
