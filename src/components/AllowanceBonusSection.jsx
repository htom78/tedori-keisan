import { Plus, X } from 'lucide-react'
import { PRESET_ALLOWANCES, PRESET_DEDUCTIONS, MONTHS } from '../constants/taxData'
import { formatNumber, parseNumericInput } from '../utils/format'

const styles = {
  card: {
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    color: '#1a1a1a',
    marginBottom: 16,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  subSection: {
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#374151',
    marginBottom: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  itemName: {
    flex: 1,
    fontSize: 13,
    color: '#374151',
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  input: {
    width: 120,
    padding: '6px 8px',
    background: '#2a2a2a',
    border: '1px solid #3a3a3a',
    borderRadius: 6,
    color: '#e2e8f0',
    fontSize: 13,
    outline: 'none',
    textAlign: 'right',
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    color: '#9ca3af',
    cursor: 'pointer',
    padding: 4,
    display: 'flex',
    alignItems: 'center',
    borderRadius: 4,
    transition: 'color 0.2s',
  },
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    padding: '6px 12px',
    background: '#f3f4f6',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    color: '#6b7280',
    fontSize: 12,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  presetGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 10,
  },
  presetBtn: {
    padding: '4px 10px',
    background: '#f3f4f6',
    border: '1px solid #e5e7eb',
    borderRadius: 6,
    color: '#6b7280',
    fontSize: 11,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  bonusRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  bonusSelect: {
    padding: '6px 8px',
    background: '#2a2a2a',
    border: '1px solid #3a3a3a',
    borderRadius: 6,
    color: '#e2e8f0',
    fontSize: 13,
    outline: 'none',
    appearance: 'none',
    cursor: 'pointer',
    width: 80,
  },
  checkbox: {
    width: 16,
    height: 16,
    accentColor: '#10b981',
    cursor: 'pointer',
  },
  emptyNote: {
    fontSize: 12,
    color: '#9ca3af',
    fontStyle: 'italic',
    padding: '8px 0',
  },
  divider: {
    height: 1,
    background: '#e5e7eb',
    margin: '16px 0',
  },
}

function NumericInput({ value, onChange, placeholder, style: extraStyle }) {
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
      style={{ ...styles.input, ...extraStyle }}
      value={value === 0 ? '' : formatNumber(value)}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder={placeholder}
      inputMode="numeric"
    />
  )
}

function AllowanceList({ items, onUpdate, onRemove, onAdd, presets, usedNames }) {
  const availablePresets = presets.filter(
    (p) => !usedNames.includes(p.name)
  )

  return (
    <div>
      {items.length === 0 && (
        <div style={styles.emptyNote}>手当が追加されていません</div>
      )}

      {items.map((item) => (
        <div key={item.id} style={styles.itemRow}>
          <span style={styles.itemName}>
            {item.name}
            {item.taxExempt && (
              <span style={{ fontSize: 10, color: '#22c55e', marginLeft: 4 }}>非課税</span>
            )}
          </span>
          <NumericInput
            value={item.amount}
            onChange={(val) => onUpdate(item.id, 'amount', val)}
            placeholder="10,000"
          />
          <button
            style={styles.removeBtn}
            onClick={() => onRemove(item.id)}
          >
            <X size={14} />
          </button>
        </div>
      ))}

      {availablePresets.length > 0 && (
        <div style={styles.presetGrid}>
          {availablePresets.map((p) => (
            <button
              key={p.id}
              style={styles.presetBtn}
              onClick={() => onAdd({
                name: p.name,
                amount: p.defaultAmount,
                ...(p.taxExempt ? { taxExempt: true } : {}),
              })}
            >
              + {p.name}
              {p.taxExempt && ' (非課税)'}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function BonusList({ items, onUpdate, onRemove, onAdd }) {
  const usedMonths = items.map((b) => b.month)
  const hasDuplicates = usedMonths.length !== new Set(usedMonths).size

  return (
    <div>
      {items.length === 0 && (
        <div style={styles.emptyNote}>賞与月が設定されていません</div>
      )}

      {hasDuplicates && (
        <div style={{
          fontSize: 12,
          color: '#d97706',
          padding: '4px 8px',
          background: '#fffbeb',
          borderRadius: 6,
          marginBottom: 6,
        }}>
          同じ月が複数設定されています（最初のエントリのみ適用）
        </div>
      )}

      {items.map((item) => (
        <div key={item.id} style={styles.bonusRow}>
          <input
            type="checkbox"
            style={styles.checkbox}
            checked={item.enabled}
            onChange={() => onUpdate(item.id, 'enabled', !item.enabled)}
          />
          <select
            style={styles.bonusSelect}
            value={item.month}
            onChange={(e) => onUpdate(item.id, 'month', Number(e.target.value))}
          >
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
          <NumericInput
            value={item.amount}
            onChange={(val) => onUpdate(item.id, 'amount', val)}
            placeholder="300,000"
          />
          <button
            style={styles.removeBtn}
            onClick={() => onRemove(item.id)}
          >
            <X size={14} />
          </button>
        </div>
      ))}

      <button
        style={styles.addBtn}
        onClick={() => onAdd({ month: 6, amount: 0, enabled: true })}
      >
        <Plus size={14} /> 賞与月を追加
      </button>
    </div>
  )
}

function DeductionList({ items, onUpdate, onRemove, onAdd, presets, usedNames }) {
  const availablePresets = presets.filter(
    (p) => !usedNames.includes(p.name)
  )

  return (
    <div>
      {items.length === 0 && (
        <div style={styles.emptyNote}>控除が追加されていません</div>
      )}

      {items.map((item) => (
        <div key={item.id} style={styles.itemRow}>
          <span style={styles.itemName}>{item.name}</span>
          <NumericInput
            value={item.amount}
            onChange={(val) => onUpdate(item.id, 'amount', val)}
            placeholder="5,000"
          />
          <button
            style={styles.removeBtn}
            onClick={() => onRemove(item.id)}
          >
            <X size={14} />
          </button>
        </div>
      ))}

      {availablePresets.length > 0 && (
        <div style={styles.presetGrid}>
          {availablePresets.map((p) => (
            <button
              key={p.id}
              style={styles.presetBtn}
              onClick={() => onAdd({ name: p.name, amount: p.defaultAmount })}
            >
              + {p.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AllowanceBonusSection({
  allowances,
  onAllowanceAdd,
  onAllowanceUpdate,
  onAllowanceRemove,
  bonusMonths,
  onBonusAdd,
  onBonusUpdate,
  onBonusRemove,
  deductions,
  onDeductionAdd,
  onDeductionUpdate,
  onDeductionRemove,
}) {
  const allowanceNames = allowances.map((a) => a.name)
  const deductionNames = deductions.map((d) => d.name)

  return (
    <div style={styles.card}>
      <div style={styles.title}>
        <span style={{ color: '#06b6d4' }}>&#9679;</span>
        手当・賞与・控除
      </div>

      <div style={styles.subSection}>
        <div style={styles.subTitle}>
          <span>&#128176; 手当</span>
        </div>
        <AllowanceList
          items={allowances}
          onUpdate={onAllowanceUpdate}
          onRemove={onAllowanceRemove}
          onAdd={onAllowanceAdd}
          presets={PRESET_ALLOWANCES}
          usedNames={allowanceNames}
        />
      </div>

      <div style={styles.divider} />

      <div style={styles.subSection}>
        <div style={styles.subTitle}>
          <span>&#127873; 賞与</span>
        </div>
        <BonusList
          items={bonusMonths}
          onUpdate={onBonusUpdate}
          onRemove={onBonusRemove}
          onAdd={onBonusAdd}
        />
      </div>

      <div style={styles.divider} />

      <div style={styles.subSection}>
        <div style={styles.subTitle}>
          <span>&#128100; その他控除</span>
        </div>
        <DeductionList
          items={deductions}
          onUpdate={onDeductionUpdate}
          onRemove={onDeductionRemove}
          onAdd={onDeductionAdd}
          presets={PRESET_DEDUCTIONS}
          usedNames={deductionNames}
        />
      </div>
    </div>
  )
}
