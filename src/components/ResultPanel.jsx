import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { formatCurrency } from '../utils/format'

const teal = '#2dd4bf'

const styles = {
  panel: (isDesktop) => ({
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 24,
    position: isDesktop ? 'sticky' : 'relative',
    top: isDesktop ? 24 : 'auto',
  }),
  title: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 20,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  heroSection: {
    textAlign: 'center',
    padding: '20px 0',
    marginBottom: 16,
    background: `rgba(45,212,191,0.06)`,
    borderRadius: 12,
    border: `1px solid rgba(45,212,191,0.15)`,
  },
  heroLabel: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 4,
  },
  heroAmount: {
    fontSize: 36,
    fontWeight: 800,
    color: teal,
    letterSpacing: -1,
  },
  badge: (rate) => ({
    display: 'inline-block',
    marginTop: 8,
    padding: '4px 12px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    background: rate > 30
      ? 'rgba(239,68,68,0.15)'
      : rate > 20
        ? 'rgba(245,158,11,0.15)'
        : 'rgba(34,197,94,0.15)',
    color: rate > 30 ? '#ef4444' : rate > 20 ? '#f59e0b' : '#22c55e',
    border: `1px solid ${rate > 30 ? 'rgba(239,68,68,0.3)' : rate > 20 ? 'rgba(245,158,11,0.3)' : 'rgba(34,197,94,0.3)'}`,
  }),
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    fontSize: 14,
  },
  summaryLabel: {
    color: '#94a3b8',
  },
  summaryValue: {
    fontWeight: 600,
    color: '#e2e8f0',
    fontVariantNumeric: 'tabular-nums',
  },
  divider: {
    height: 1,
    background: 'rgba(255,255,255,0.08)',
    margin: '8px 0',
  },
  expandBtn: {
    width: '100%',
    padding: '10px 0',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8,
    color: '#94a3b8',
    fontSize: 13,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    transition: 'all 0.2s',
  },
  detailSection: {
    marginTop: 12,
  },
  detailTitle: {
    fontSize: 12,
    fontWeight: 600,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 12,
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '4px 0',
    fontSize: 13,
  },
  detailLabel: {
    color: '#64748b',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  detailValue: {
    color: '#cbd5e1',
    fontVariantNumeric: 'tabular-nums',
  },
  dot: (color) => ({
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: color,
    display: 'inline-block',
  }),
  negativeValue: {
    color: '#f87171',
    fontVariantNumeric: 'tabular-nums',
  },
  bonusBadge: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: 10,
    fontSize: 11,
    fontWeight: 600,
    background: 'rgba(245,158,11,0.15)',
    color: '#fbbf24',
    border: '1px solid rgba(245,158,11,0.3)',
    marginLeft: 8,
  },
}

export default function ResultPanel({ result, isDesktop, residentTaxHidden }) {
  const [expanded, setExpanded] = useState(false)

  if (!result) {
    return (
      <div style={styles.panel(isDesktop)}>
        <div style={styles.title}>
          <span style={{ color: teal }}>&#9679;</span>
          計算結果
        </div>
        <div style={{
          textAlign: 'center',
          padding: '32px 0',
          color: '#64748b',
          fontSize: 14,
        }}>
          基本給を入力すると計算結果が表示されます
        </div>
      </div>
    )
  }

  const {
    grossSalary,
    baseSalary,
    totalAllowances,
    bonusAmount,
    healthInsurance,
    pensionInsurance,
    nursingInsurance,
    employmentInsurance,
    socialInsuranceTotal,
    withholdingTax,
    residentTax,
    totalOtherDeductions,
    totalDeductions,
    takeHome,
    deductionRate,
    isBonusMonth,
    taxExemptAllowances = 0,
  } = result

  return (
    <div style={styles.panel(isDesktop)}>
      <div style={styles.title}>
        <span style={{ color: teal }}>&#9679;</span>
        計算結果
        {isBonusMonth && <span style={styles.bonusBadge}>賞与月</span>}
      </div>

      <div style={styles.heroSection}>
        <div style={styles.heroLabel}>手取り額</div>
        <div style={styles.heroAmount}>{formatCurrency(takeHome)}</div>
        <div style={styles.badge(deductionRate)}>
          控除率 {deductionRate.toFixed(1)}%
        </div>
      </div>

      <div style={styles.summaryRow}>
        <span style={styles.summaryLabel}>総支給額</span>
        <span style={styles.summaryValue}>{formatCurrency(grossSalary)}</span>
      </div>
      <div style={styles.divider} />
      <div style={styles.summaryRow}>
        <span style={styles.summaryLabel}>社会保険料</span>
        <span style={{ ...styles.summaryValue, color: '#f87171' }}>
          -{formatCurrency(socialInsuranceTotal)}
        </span>
      </div>
      <div style={styles.summaryRow}>
        <span style={styles.summaryLabel}>所得税</span>
        <span style={{ ...styles.summaryValue, color: '#f87171' }}>
          -{formatCurrency(withholdingTax)}
        </span>
      </div>
      {residentTax > 0 && (
        <div style={styles.summaryRow}>
          <span style={styles.summaryLabel}>住民税</span>
          <span style={{ ...styles.summaryValue, color: '#f87171' }}>
            -{formatCurrency(residentTax)}
          </span>
        </div>
      )}
      {residentTaxHidden && (
        <div style={styles.summaryRow}>
          <span style={styles.summaryLabel}>住民税</span>
          <span style={{
            fontSize: 11,
            color: '#64748b',
            fontStyle: 'italic',
            padding: '2px 8px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: 4,
          }}>
            除外中
          </span>
        </div>
      )}
      {totalOtherDeductions > 0 && (
        <div style={styles.summaryRow}>
          <span style={styles.summaryLabel}>その他控除</span>
          <span style={{ ...styles.summaryValue, color: '#f87171' }}>
            -{formatCurrency(totalOtherDeductions)}
          </span>
        </div>
      )}
      <div style={styles.divider} />
      <div style={styles.summaryRow}>
        <span style={{ ...styles.summaryLabel, fontWeight: 700, color: teal }}>
          差引手取り額
        </span>
        <span style={{ ...styles.summaryValue, color: teal, fontSize: 18 }}>
          {formatCurrency(takeHome)}
        </span>
      </div>

      <button
        style={styles.expandBtn}
        onClick={() => setExpanded((prev) => !prev)}
      >
        {expanded ? '詳細を閉じる' : '詳細を表示'}
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {expanded && (
        <div style={styles.detailSection}>
          <div style={styles.detailTitle}>支給内訳</div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>基本給</span>
            <span style={styles.detailValue}>{formatCurrency(baseSalary)}</span>
          </div>
          {totalAllowances > 0 && (
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>手当合計</span>
              <span style={styles.detailValue}>{formatCurrency(totalAllowances)}</span>
            </div>
          )}
          {bonusAmount > 0 && (
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>賞与</span>
              <span style={styles.detailValue}>{formatCurrency(bonusAmount)}</span>
            </div>
          )}
          {taxExemptAllowances > 0 && (
            <div style={styles.detailRow}>
              <span style={{ ...styles.detailLabel, color: '#22c55e' }}>
                うち非課税手当
              </span>
              <span style={{ color: '#22c55e', fontVariantNumeric: 'tabular-nums', fontSize: 13 }}>
                {formatCurrency(taxExemptAllowances)}
              </span>
            </div>
          )}

          <div style={styles.detailTitle}>社会保険料内訳</div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>
              <span style={styles.dot('#22c55e')} /> 健康保険
            </span>
            <span style={styles.negativeValue}>-{formatCurrency(healthInsurance)}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>
              <span style={styles.dot('#3b82f6')} /> 厚生年金
            </span>
            <span style={styles.negativeValue}>-{formatCurrency(pensionInsurance)}</span>
          </div>
          {nursingInsurance > 0 && (
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>
                <span style={styles.dot('#a855f7')} /> 介護保険
              </span>
              <span style={styles.negativeValue}>-{formatCurrency(nursingInsurance)}</span>
            </div>
          )}
          {employmentInsurance > 0 && (
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>
                <span style={styles.dot('#f59e0b')} /> 雇用保険
              </span>
              <span style={styles.negativeValue}>-{formatCurrency(employmentInsurance)}</span>
            </div>
          )}

          <div style={styles.detailTitle}>税金内訳</div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>
              <span style={styles.dot('#ef4444')} /> 所得税
            </span>
            <span style={styles.negativeValue}>-{formatCurrency(withholdingTax)}</span>
          </div>
          {residentTax > 0 && (
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>
                <span style={styles.dot('#f97316')} /> 住民税
              </span>
              <span style={styles.negativeValue}>-{formatCurrency(residentTax)}</span>
            </div>
          )}
          {totalOtherDeductions > 0 && (
            <>
              <div style={styles.detailTitle}>その他控除</div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>控除合計</span>
                <span style={styles.negativeValue}>
                  -{formatCurrency(totalOtherDeductions)}
                </span>
              </div>
            </>
          )}

          <div style={{ ...styles.divider, marginTop: 12 }} />
          <div style={{ ...styles.detailRow, marginTop: 8 }}>
            <span style={{ fontSize: 12, color: '#64748b' }}>控除合計</span>
            <span style={{ ...styles.negativeValue, fontWeight: 700 }}>
              -{formatCurrency(totalDeductions)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
