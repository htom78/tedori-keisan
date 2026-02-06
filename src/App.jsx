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
import WithholdingTaxSection from './components/WithholdingTaxSection'
import ResidentTaxSection from './components/ResidentTaxSection'
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
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 800,
    background: 'linear-gradient(135deg, #2dd4bf, #3b82f6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: 4,
  },
  headerSub: {
    fontSize: 14,
    color: '#64748b',
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

  // Health insurance
  const [healthMode, setHealthMode] = useState(SI_MODES.AUTO)
  const [healthIsKyokai, setHealthIsKyokai] = useState(true)
  const [healthStandardGrade, setHealthStandardGrade] = useState(null)
  const [healthCustomAmount, setHealthCustomAmount] = useState(0)

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
  const [isElectronic, setIsElectronic] = useState(false)
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
      pensionMode,
      pensionCustomAmount,
      pensionStandardGrade,
      nursingIsCollected,
      nursingUseCustom,
      nursingCustomAmount,
      employmentRate,
      employmentJoined,
      dependents,
      isElectronic,
      isTaxExempt,
      isNonResident,
      residentTaxMode,
      residentTaxCustomAnnual,
      residentTaxHidden,
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
    pensionMode,
    pensionCustomAmount,
    pensionStandardGrade,
    nursingIsCollected,
    nursingUseCustom,
    nursingCustomAmount,
    employmentRate,
    employmentJoined,
    dependents,
    isElectronic,
    isTaxExempt,
    isNonResident,
    residentTaxMode,
    residentTaxCustomAnnual,
    residentTaxHidden,
    allowanceManager.items,
    bonusManager.items,
    deductionManager.items,
  ])

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>手取り計算ツール</h1>
        <p style={styles.headerSub}>Japanese Take-Home Pay Calculator</p>
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

          <WithholdingTaxSection
            dependents={dependents}
            onDependentsChange={setDependents}
            isElectronic={isElectronic}
            onElectronicChange={setIsElectronic}
            isTaxExempt={isTaxExempt}
            onTaxExemptChange={setIsTaxExempt}
            isNonResident={isNonResident}
            onNonResidentChange={setIsNonResident}
          />

          <ResidentTaxSection
            mode={residentTaxMode}
            onModeChange={setResidentTaxMode}
            customAnnual={residentTaxCustomAnnual}
            onCustomAnnualChange={setResidentTaxCustomAnnual}
            hidden={residentTaxHidden}
            onHiddenChange={setResidentTaxHidden}
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
          <ResultPanel result={result} isDesktop={isDesktop} />
        </div>
      </div>
    </div>
  )
}
