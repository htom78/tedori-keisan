import { useState } from 'react'
import { ChevronDown, ChevronUp, Info } from 'lucide-react'
import { formatCurrency } from '../utils/format'

const teal = '#4ecdc4'
const mono = '"Outfit", monospace'

const styles = {
  panel: (isDesktop) => ({
    background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(78, 205, 196, 0.1) 100%)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 24,
    padding: 40,
    position: isDesktop ? 'sticky' : 'relative',
    top: isDesktop ? 24 : 'auto',
    boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
  }),
  title: {
    fontSize: 20,
    fontWeight: 700,
    color: '#fff',
    marginBottom: 24,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  heroSection: {
    textAlign: 'center',
    padding: 32,
    marginBottom: 24,
    background: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    border: '2px solid rgba(78, 205, 196, 0.3)',
  },
  heroLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  heroAmount: {
    fontSize: 'clamp(36px, 5vw, 52px)',
    fontWeight: 800,
    color: teal,
    letterSpacing: '-0.02em',
    fontFamily: mono,
  },
  badge: (rate) => ({
    display: 'inline-block',
    marginTop: 12,
    padding: '6px 16px',
    borderRadius: 100,
    fontSize: 13,
    fontWeight: 600,
    background: rate > 30
      ? 'rgba(255, 107, 107, 0.15)'
      : rate > 20
        ? 'rgba(245,158,11,0.15)'
        : 'rgba(34,197,94,0.15)',
    color: rate > 30 ? '#ff6b6b' : rate > 20 ? '#fbbf24' : '#34d399',
    border: `1px solid ${rate > 30 ? 'rgba(255, 107, 107, 0.3)' : rate > 20 ? 'rgba(245,158,11,0.3)' : 'rgba(34,197,94,0.3)'}`,
  }),
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    fontSize: 14,
  },
  summaryLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontWeight: 500,
  },
  summaryValue: {
    fontWeight: 600,
    color: '#fff',
    fontFamily: mono,
  },
  divider: {
    height: 1,
    background: 'rgba(255,255,255,0.1)',
    margin: '4px 0',
  },
  expandBtn: {
    width: '100%',
    padding: 14,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12,
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    transition: 'all 0.3s ease',
  },
  detailSection: {
    marginTop: 16,
    background: 'rgba(0,0,0,0.2)',
    borderRadius: 16,
    padding: 24,
    animation: 'slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  detailTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 12,
    marginTop: 16,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    fontSize: 14,
  },
  detailLabel: {
    color: 'rgba(255,255,255,0.6)',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  detailValue: {
    color: '#fff',
    fontFamily: mono,
    fontWeight: 600,
  },
  dot: (color) => ({
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: color,
    display: 'inline-block',
  }),
  negativeValue: {
    color: '#ff6b6b',
    fontFamily: mono,
    fontWeight: 600,
  },
  bonusBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: 100,
    fontSize: 12,
    fontWeight: 600,
    background: 'rgba(78, 205, 196, 0.15)',
    color: teal,
    border: '1px solid rgba(78, 205, 196, 0.3)',
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
          padding: '40px 0',
          color: 'rgba(255,255,255,0.4)',
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
        <span style={{ ...styles.summaryValue, color: '#ff6b6b' }}>
          -{formatCurrency(socialInsuranceTotal)}
        </span>
      </div>
      <div style={styles.summaryRow}>
        <span style={styles.summaryLabel}>所得税</span>
        <span style={{ ...styles.summaryValue, color: '#ff6b6b' }}>
          -{formatCurrency(withholdingTax)}
        </span>
      </div>
      {residentTax > 0 && (
        <div style={styles.summaryRow}>
          <span style={styles.summaryLabel}>住民税</span>
          <span style={{ ...styles.summaryValue, color: '#ff6b6b' }}>
            -{formatCurrency(residentTax)}
          </span>
        </div>
      )}
      {residentTaxHidden && (
        <div style={styles.summaryRow}>
          <span style={styles.summaryLabel}>住民税</span>
          <span style={{
            fontSize: 12,
            color: 'rgba(255,255,255,0.4)',
            fontStyle: 'italic',
            padding: '2px 10px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: 6,
          }}>
            除外中
          </span>
        </div>
      )}
      {totalOtherDeductions > 0 && (
        <div style={styles.summaryRow}>
          <span style={styles.summaryLabel}>その他控除</span>
          <span style={{ ...styles.summaryValue, color: '#ff6b6b' }}>
            -{formatCurrency(totalOtherDeductions)}
          </span>
        </div>
      )}
      <div style={styles.divider} />
      <div style={styles.summaryRow}>
        <span style={{ ...styles.summaryLabel, fontWeight: 700, color: teal }}>
          差引手取り額
        </span>
        <span style={{ ...styles.summaryValue, color: teal, fontSize: 20, fontWeight: 800 }}>
          {formatCurrency(takeHome)}
        </span>
      </div>

      <button
        style={styles.expandBtn}
        onClick={() => setExpanded((prev) => !prev)}
      >
        <Info size={16} />
        {expanded ? '詳細を非表示' : '内訳を表示'}
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {expanded && (
        <div style={styles.detailSection}>
          <div style={{ ...styles.detailTitle, marginTop: 0 }}>支給内訳</div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>基本給</span>
            <span style={styles.detailValue}>{formatCurrency(baseSalary)}</span>
          </div>
          {totalAllowances > 0 && (
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>手当合計</span>
              <span style={{ ...styles.detailValue, color: teal }}>{formatCurrency(totalAllowances)}</span>
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
              <span style={{ color: '#22c55e', fontFamily: mono, fontWeight: 600, fontSize: 14 }}>
                {formatCurrency(taxExemptAllowances)}
              </span>
            </div>
          )}

          <div style={{
            height: 1,
            background: 'rgba(255,255,255,0.1)',
            margin: '12px 0',
          }} />

          <div style={styles.detailTitle}>社会保険料</div>
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

          <div style={{
            height: 1,
            background: 'rgba(255,255,255,0.1)',
            margin: '12px 0',
          }} />

          <div style={styles.detailTitle}>税金</div>
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
              <div style={{
                height: 1,
                background: 'rgba(255,255,255,0.1)',
                margin: '12px 0',
              }} />
              <div style={styles.detailTitle}>その他控除</div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>控除合計</span>
                <span style={styles.negativeValue}>
                  -{formatCurrency(totalOtherDeductions)}
                </span>
              </div>
            </>
          )}

          <div style={{
            height: 1,
            background: 'rgba(255,255,255,0.1)',
            margin: '16px 0',
          }} />
          <div style={{ ...styles.detailRow, padding: '12px 0 0 0' }}>
            <span style={{
              fontSize: 16,
              color: 'rgba(255,255,255,0.9)',
              fontWeight: 700,
            }}>
              控除合計
            </span>
            <span style={{
              ...styles.negativeValue,
              fontWeight: 800,
              fontSize: 18,
            }}>
              -{formatCurrency(totalDeductions)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
