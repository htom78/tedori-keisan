import { useState, useEffect, useCallback } from 'react'
import { Locate } from 'lucide-react'
import { PREFECTURES, AGE_GROUPS, MONTHS } from '../constants/taxData'
import { formatNumber, parseNumericInput } from '../utils/format'
import { useGeolocation } from '../hooks/useGeolocation'
import { ERROR_CODES } from '../utils/geolocation'

const ERROR_MESSAGES = {
  [ERROR_CODES.PERMISSION_DENIED]: '位置情報の許可が拒否されました',
  [ERROR_CODES.POSITION_UNAVAILABLE]: '位置情報を取得できません',
  [ERROR_CODES.TIMEOUT]: '位置情報の取得がタイムアウトしました',
  [ERROR_CODES.GEOLOCATION_NOT_SUPPORTED]: 'この端末では位置情報が利用できません',
}

const SI_TIMING_OPTIONS = [
  { value: 'tougetsu', label: '当月徴収' },
  { value: 'yokugetsu', label: '翌月徴収' },
  { value: 'yokuyokugetsu', label: '翌々月徴収' },
]

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
    fontSize: 18,
    fontWeight: 600,
    outline: 'none',
    textAlign: 'right',
    transition: 'all 0.3s ease',
  },
  select: {
    width: '100%',
    padding: '16px 20px',
    background: 'rgba(0,0,0,0.3)',
    border: '2px solid rgba(255,255,255,0.1)',
    borderRadius: 16,
    color: '#fff',
    fontSize: 16,
    fontWeight: 600,
    outline: 'none',
    appearance: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='white' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 20px center',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
    marginBottom: 28,
  },
  row3: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: 12,
    marginBottom: 28,
  },
  ageGroup: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 10,
  },
  ageBtn: (active) => ({
    padding: '14px 16px',
    background: active
      ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)'
      : 'rgba(255,255,255,0.05)',
    border: active
      ? '2px solid rgba(255, 107, 107, 0.5)'
      : '2px solid rgba(255,255,255,0.1)',
    borderRadius: 12,
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
    textAlign: 'center',
    transform: active ? 'scale(1)' : 'scale(0.98)',
    boxShadow: active ? '0 8px 20px rgba(255, 107, 107, 0.3)' : 'none',
  }),
  salaryPrefix: {
    position: 'absolute',
    left: 16,
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'rgba(255,255,255,0.5)',
    fontSize: 16,
    fontWeight: 600,
    pointerEvents: 'none',
  },
  inputWrap: {
    position: 'relative',
  },
  prefectureRow: {
    display: 'flex',
    gap: 8,
    alignItems: 'stretch',
  },
  locateBtn: (isLoading) => ({
    width: 52,
    minWidth: 52,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.3)',
    border: '2px solid rgba(255,255,255,0.1)',
    borderRadius: 16,
    color: 'rgba(255,255,255,0.7)',
    cursor: isLoading ? 'wait' : 'pointer',
    transition: 'all 0.3s ease',
  }),
  locateError: {
    fontSize: 12,
    color: '#ff6b6b',
    marginTop: 8,
    animation: 'fadeIn 0.3s ease',
  },
  info: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
    marginTop: 6,
    lineHeight: 1.5,
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
  siCollectionTiming,
  onSiCollectionTimingChange,
}) {
  const { detectPrefecture, isLoading, errorCode, clearError } = useGeolocation()
  const [geoError, setGeoError] = useState(null)

  useEffect(() => {
    if (!errorCode) return
    setGeoError(errorCode)
    const timer = setTimeout(() => {
      setGeoError(null)
      clearError()
    }, 5000)
    return () => clearTimeout(timer)
  }, [errorCode, clearError])

  const handleLocate = useCallback(async () => {
    if (isLoading) return
    const index = await detectPrefecture()
    if (index !== null) {
      onPrefectureChange(index)
    }
  }, [isLoading, detectPrefecture, onPrefectureChange])

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
        <span style={{ color: '#ff6b6b' }}>&#9679;</span>
        基本情報
      </div>

      <div style={{ marginBottom: 28 }}>
        <label style={styles.label}>基本給（月額）</label>
        <div style={styles.inputWrap} className="input-glow">
          <span style={styles.salaryPrefix}>¥</span>
          <input
            style={{ ...styles.input, paddingLeft: 36 }}
            value={salary === 0 ? '' : formatNumber(salary)}
            onChange={handleSalaryChange}
            onFocus={handleSalaryFocus}
            onBlur={handleSalaryBlur}
            placeholder="300,000"
            inputMode="numeric"
          />
        </div>
      </div>

      <div style={styles.row3}>
        <div>
          <label style={styles.label}>計算月</label>
          <select
            style={styles.select}
            value={month}
            onChange={(e) => onMonthChange(Number(e.target.value))}
          >
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value} style={{ background: '#1a1a1a' }}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={styles.label}>都道府県</label>
          <div style={styles.prefectureRow}>
            <select
              style={{ ...styles.select, flex: 1 }}
              value={prefectureIndex}
              onChange={(e) => onPrefectureChange(Number(e.target.value))}
            >
              {PREFECTURES.map((p, i) => (
                <option key={p.code} value={i} style={{ background: '#1a1a1a' }}>
                  {p.name} ({p.healthRate}%)
                </option>
              ))}
            </select>
            <button
              style={styles.locateBtn(isLoading)}
              onClick={handleLocate}
              title="現在地から都道府県を検出"
              disabled={isLoading}
            >
              <Locate
                size={20}
                style={isLoading ? { animation: 'spin 1s linear infinite' } : undefined}
              />
            </button>
          </div>
          {geoError && (
            <div style={styles.locateError}>
              {ERROR_MESSAGES[geoError]}
            </div>
          )}
        </div>
        <div>
          <label style={styles.label}>社保徴収</label>
          <select
            style={styles.select}
            value={siCollectionTiming}
            onChange={(e) => onSiCollectionTimingChange(e.target.value)}
          >
            {SI_TIMING_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} style={{ background: '#1a1a1a' }}>
                {opt.label}
              </option>
            ))}
          </select>
          <div style={styles.info}>
            社保料の給与控除タイミング
          </div>
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
