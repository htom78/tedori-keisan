import { Plus, X } from 'lucide-react'
import { PRESET_ALLOWANCES, PRESET_DEDUCTIONS, MONTHS } from '../constants/taxData'
import { formatNumber, parseNumericInput } from '../utils/format'

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
  subSection: {
    marginBottom: 24,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.7)',
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  input: {
    width: 130,
    padding: '10px 14px',
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    outline: 'none',
    textAlign: 'right',
    transition: 'all 0.3s ease',
    fontFamily: '"Outfit", monospace',
  },
  removeBtn: {
    padding: 4,
    background: 'rgba(255, 107, 107, 0.2)',
    border: 'none',
    borderRadius: 6,
    color: '#ff6b6b',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.2s',
  },
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '10px 16px',
    background: 'rgba(78, 205, 196, 0.15)',
    border: '1px solid rgba(78, 205, 196, 0.3)',
    borderRadius: 10,
    color: '#4ecdc4',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  presetGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  presetBtn: {
    padding: '6px 12px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 8,
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  bonusRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  bonusSelect: {
    padding: '10px 12px',
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    outline: 'none',
    appearance: 'none',
    cursor: 'pointer',
    width: 90,
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='white' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px center',
  },
  checkbox: {
    width: 18,
    height: 18,
    accentColor: '#10b981',
    cursor: 'pointer',
  },
  emptyNote: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
    fontStyle: 'italic',
    padding: '10px 0',
    textAlign: 'center',
  },
  divider: {
    height: 1,
    background: 'rgba(255,255,255,0.08)',
    margin: '20px 0',
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
              <span style={{ fontSize: 11, color: '#22c55e', marginLeft: 6 }}>非課税</span>
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
          color: '#fbbf24',
          padding: '6px 12px',
          background: 'rgba(245,158,11,0.1)',
          borderRadius: 8,
          marginBottom: 10,
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
              <option key={m.value} value={m.value} style={{ background: '#1a1a1a' }}>
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
        <span style={{ color: '#4ecdc4' }}>&#9679;</span>
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
