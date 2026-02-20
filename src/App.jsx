import { useState, useMemo, useEffect, useCallback } from 'react'
import {
  DEFAULT_PREFECTURE_INDEX,
  AGE_GROUPS,
  EMPLOYMENT_CATEGORIES,
  SI_MODES,
  DEFAULT_BONUS_MONTHS,
} from './constants/taxData'
import { calculateTakeHome } from './utils/calculator'
import { useListManager } from './hooks/useListManager'
import BasicInfoSection from './components/BasicInfoSection'
import SocialInsuranceSection from './components/SocialInsuranceSection'
import TaxSection from './components/TaxSection'
import AllowanceBonusSection from './components/AllowanceBonusSection'
import ResultPanel from './components/ResultPanel'

const BREAKPOINT = 1024

const styles = {
  container: {
    maxWidth: 1280,
    margin: '0 auto',
    padding: '24px 16px',
  },
  header: {
    textAlign: 'center',
    marginBottom: 48,
    paddingTop: 16,
  },
  headerBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 24px',
    borderRadius: 100,
    fontSize: 13,
    fontWeight: 600,
    background: 'rgba(255,255,255,0.06)',
    color: 'rgba(255,255,255,0.8)',
    border: '1px solid rgba(255,255,255,0.12)',
    marginBottom: 20,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: 'clamp(40px, 6vw, 64px)',
    fontWeight: 800,
    color: '#fff',
    marginBottom: 16,
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
  },
  headerSub: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.45)',
    lineHeight: 1.6,
  },
  footer: {
    textAlign: 'center',
    marginTop: 48,
    padding: '28px 24px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16,
    fontSize: 13,
    color: 'rgba(255,255,255,0.35)',
    lineHeight: 1.8,
  },
  layout: (isDesktop) => ({
    display: isDesktop ? 'grid' : 'block',
    gridTemplateColumns: isDesktop ? '1fr 380px' : undefined,
    gap: 24,
    alignItems: 'start',
  }),
  leftCol: {
    minWidth: 0,
  },
  rightCol: {
    minWidth: 0,
  },
}

export default function App() {
  // Responsive
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : BREAKPOINT + 1
  )
  const isDesktop = windowWidth >= BREAKPOINT

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Basic info
  const [salary, setSalary] = useState(300000)
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [prefectureIndex, setPrefectureIndex] = useState(DEFAULT_PREFECTURE_INDEX)
  const [ageGroup, setAgeGroup] = useState('under40')

  // SI collection timing
  const [siCollectionTiming, setSiCollectionTiming] = useState('tougetsu')

  // Health insurance
  const [healthMode, setHealthMode] = useState(SI_MODES.AUTO)
  const [healthIsKyokai, setHealthIsKyokai] = useState(true)
  const [healthStandardGrade, setHealthStandardGrade] = useState(null)
  const [healthCustomAmount, setHealthCustomAmount] = useState(0)
  const [healthUnionRate, setHealthUnionRate] = useState(null)
  const [nursingUnionRate, setNursingUnionRate] = useState(null)

  // Pension
  const [pensionMode, setPensionMode] = useState(SI_MODES.AUTO)
  const [pensionStandardGrade, setPensionStandardGrade] = useState(null)
  const [pensionCustomAmount, setPensionCustomAmount] = useState(0)

  // Nursing
  const [nursingIsCollected, setNursingIsCollected] = useState(false)
  const [nursingUseCustom, setNursingUseCustom] = useState(false)
  const [nursingCustomAmount, setNursingCustomAmount] = useState(0)

  // Employment
  const [employmentJoined, setEmploymentJoined] = useState(true)
  const [employmentCategory, setEmploymentCategory] = useState('general')

  // Tax
  const [dependents, setDependents] = useState(0)
  const [taxColumn, setTaxColumn] = useState('kou')
  const [isTaxExempt, setIsTaxExempt] = useState(false)
  const [isNonResident, setIsNonResident] = useState(false)

  // Resident tax
  const [residentTaxMode, setResidentTaxMode] = useState('auto')
  const [residentTaxCustomAnnual, setResidentTaxCustomAnnual] = useState(0)
  const [residentTaxHidden, setResidentTaxHidden] = useState(false)

  // Lists
  const allowanceManager = useListManager([])
  const bonusManager = useListManager(
    DEFAULT_BONUS_MONTHS.map((m, i) => ({
      id: `bonus-${i}`,
      month: m,
      amount: 0,
      enabled: false,
    }))
  )
  const deductionManager = useListManager([])

  // Auto-detect nursing by age
  useEffect(() => {
    const group = AGE_GROUPS.find((g) => g.id === ageGroup)
    if (group) {
      setNursingIsCollected(group.nursingApplies)
    }
  }, [ageGroup])

  // Employment rate
  const employmentRate = useMemo(() => {
    const cat = EMPLOYMENT_CATEGORIES.find((c) => c.id === employmentCategory)
    return cat ? cat.rate : 0
  }, [employmentCategory])

  // Calculate results
  const result = useMemo(() => {
    if (salary <= 0) return null

    return calculateTakeHome({
      salary,
      month,
      prefectureIndex,
      ageGroup,
      healthMode,
      healthIsKyokai,
      healthCustomAmount,
      healthStandardGrade,
      healthUnionRate: healthUnionRate || undefined,
      pensionMode,
      pensionCustomAmount,
      pensionStandardGrade,
      nursingIsCollected,
      nursingUseCustom,
      nursingCustomAmount,
      nursingUnionRate: nursingUnionRate || undefined,
      employmentRate,
      employmentJoined,
      dependents,
      isTaxExempt,
      isNonResident,
      taxColumn,
      residentTaxMode,
      residentTaxCustomAnnual,
      residentTaxHidden,
      siCollectionTiming,
      allowances: allowanceManager.items,
      bonusMonths: bonusManager.items,
      deductions: deductionManager.items,
    })
  }, [
    salary,
    month,
    prefectureIndex,
    ageGroup,
    healthMode,
    healthIsKyokai,
    healthCustomAmount,
    healthStandardGrade,
    healthUnionRate,
    pensionMode,
    pensionCustomAmount,
    pensionStandardGrade,
    nursingIsCollected,
    nursingUseCustom,
    nursingCustomAmount,
    nursingUnionRate,
    employmentRate,
    employmentJoined,
    dependents,
    isTaxExempt,
    isNonResident,
    taxColumn,
    residentTaxMode,
    residentTaxCustomAnnual,
    residentTaxHidden,
    siCollectionTiming,
    allowanceManager.items,
    bonusManager.items,
    deductionManager.items,
  ])

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerBadge}>
          <span style={{ fontSize: 15 }}>&#128197;</span>
          MONTHLY SALARY CALCULATOR
        </div>
        <h1 style={styles.headerTitle}>手取り計算機</h1>
        <p style={styles.headerSub}>月給から税金・社会保険料を差し引いた実際の手取り額を瞬時に計算</p>
        <p style={{ ...styles.headerSub, fontSize: 13, marginTop: 8, color: 'rgba(255,255,255,0.3)' }}>
          令和8年(2026年)対応｜電算機特例準拠｜賞与計算機能付き
        </p>
      </header>

      <div style={styles.layout(isDesktop)}>
        <div style={styles.leftCol}>
          <BasicInfoSection
            salary={salary}
            onSalaryChange={setSalary}
            month={month}
            onMonthChange={setMonth}
            prefectureIndex={prefectureIndex}
            onPrefectureChange={setPrefectureIndex}
            ageGroup={ageGroup}
            onAgeGroupChange={setAgeGroup}
            siCollectionTiming={siCollectionTiming}
            onSiCollectionTimingChange={setSiCollectionTiming}
          />

          <SocialInsuranceSection
            healthMode={healthMode}
            onHealthModeChange={setHealthMode}
            healthIsKyokai={healthIsKyokai}
            onHealthKyokaiChange={setHealthIsKyokai}
            healthStandardGrade={healthStandardGrade}
            onHealthStandardGradeChange={setHealthStandardGrade}
            healthCustomAmount={healthCustomAmount}
            onHealthCustomAmountChange={setHealthCustomAmount}
            healthUnionRate={healthUnionRate}
            onHealthUnionRateChange={setHealthUnionRate}
            nursingUnionRate={nursingUnionRate}
            onNursingUnionRateChange={setNursingUnionRate}
            pensionMode={pensionMode}
            onPensionModeChange={setPensionMode}
            pensionStandardGrade={pensionStandardGrade}
            onPensionStandardGradeChange={setPensionStandardGrade}
            pensionCustomAmount={pensionCustomAmount}
            onPensionCustomAmountChange={setPensionCustomAmount}
            nursingIsCollected={nursingIsCollected}
            onNursingCollectedChange={setNursingIsCollected}
            nursingUseCustom={nursingUseCustom}
            onNursingUseCustomChange={setNursingUseCustom}
            nursingCustomAmount={nursingCustomAmount}
            onNursingCustomAmountChange={setNursingCustomAmount}
            employmentJoined={employmentJoined}
            onEmploymentJoinedChange={setEmploymentJoined}
            employmentCategory={employmentCategory}
            onEmploymentCategoryChange={setEmploymentCategory}
            prefectureIndex={prefectureIndex}
          />

          <TaxSection
            dependents={dependents}
            onDependentsChange={setDependents}
            taxColumn={taxColumn}
            onTaxColumnChange={setTaxColumn}
            isTaxExempt={isTaxExempt}
            onTaxExemptChange={setIsTaxExempt}
            isNonResident={isNonResident}
            onNonResidentChange={setIsNonResident}
            residentTaxMode={residentTaxMode}
            onResidentTaxModeChange={setResidentTaxMode}
            residentTaxCustomAnnual={residentTaxCustomAnnual}
            onResidentTaxCustomAnnualChange={setResidentTaxCustomAnnual}
            residentTaxHidden={residentTaxHidden}
            onResidentTaxHiddenChange={setResidentTaxHidden}
          />

          <AllowanceBonusSection
            allowances={allowanceManager.items}
            onAllowanceAdd={allowanceManager.addItem}
            onAllowanceUpdate={allowanceManager.updateItem}
            onAllowanceRemove={allowanceManager.removeItem}
            bonusMonths={bonusManager.items}
            onBonusAdd={bonusManager.addItem}
            onBonusUpdate={bonusManager.updateItem}
            onBonusRemove={bonusManager.removeItem}
            deductions={deductionManager.items}
            onDeductionAdd={deductionManager.addItem}
            onDeductionUpdate={deductionManager.updateItem}
            onDeductionRemove={deductionManager.removeItem}
          />
        </div>

        <div style={styles.rightCol}>
          <ResultPanel result={result} isDesktop={isDesktop} residentTaxHidden={residentTaxHidden} />
        </div>
      </div>

      <footer style={styles.footer}>
        <p>※ 令和8年(2026年)の協会けんぽ料率・電算機特例に基づく計算です。</p>
        <p>乙欄の計算は概算値です。実際の手取り額は個人の状況により異なります。</p>
      </footer>
    </div>
  )
}
