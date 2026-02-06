// Pure calculation functions for Japanese salary deductions
// All amounts are in integer yen (Math.round everywhere)

import {
  HEALTH_STANDARD_TABLE,
  PENSION_STANDARD_TABLE,
  PREFECTURES,
  RATES,
  WITHHOLDING_BRACKETS,
  RECONSTRUCTION_TAX_RATE,
  RESIDENT_TAX_RATE,
  SALARY_DEDUCTION_TABLE,
  SI_MODES,
  NON_RESIDENT_TAX_RATE,
  COMMUTE_TAX_FREE_LIMIT,
  PENSION_BONUS_CAP,
  EMPLOYMENT_INSURANCE_CAP,
} from '../constants/taxData'

// Look up standard remuneration from a table given a salary
function lookupStandard(table, salary) {
  for (const [, standard, lower, upper] of table) {
    if (salary >= lower && salary < upper) {
      return standard
    }
  }
  const last = table[table.length - 1]
  return last[1]
}

// Calculate health insurance (employee share)
export function calculateHealthInsurance(settings) {
  const { mode, salary, prefectureIndex, isKyokai, customAmount, standardGrade } = settings

  if (mode === SI_MODES.CUSTOM) {
    return Math.round(customAmount || 0)
  }

  let standardRemuneration
  if (mode === SI_MODES.STANDARD && standardGrade != null) {
    const entry = HEALTH_STANDARD_TABLE[standardGrade]
    standardRemuneration = entry ? entry[1] : lookupStandard(HEALTH_STANDARD_TABLE, salary)
  } else {
    standardRemuneration = lookupStandard(HEALTH_STANDARD_TABLE, salary)
  }

  let totalRate
  if (isKyokai) {
    const prefecture = PREFECTURES[prefectureIndex] || PREFECTURES[12]
    totalRate = prefecture.healthRate
  } else {
    totalRate = RATES.unionHealth
  }

  const employeeShare = standardRemuneration * (totalRate / 100) / 2
  return Math.round(employeeShare)
}

// Calculate pension insurance (employee share)
export function calculatePension(settings) {
  const { mode, salary, customAmount, standardGrade } = settings

  if (mode === SI_MODES.CUSTOM) {
    return Math.round(customAmount || 0)
  }

  let standardRemuneration
  if (mode === SI_MODES.STANDARD && standardGrade != null) {
    const entry = PENSION_STANDARD_TABLE[standardGrade]
    standardRemuneration = entry ? entry[1] : lookupStandard(PENSION_STANDARD_TABLE, salary)
  } else {
    standardRemuneration = lookupStandard(PENSION_STANDARD_TABLE, salary)
  }

  const employeeShare = standardRemuneration * (RATES.pension / 100) / 2
  return Math.round(employeeShare)
}

// Calculate nursing care insurance (employee share)
export function calculateNursing(settings) {
  const { isCollected, customAmount, useCustom, salary, prefectureIndex, isKyokai, healthMode, healthStandardGrade } = settings

  if (!isCollected) return 0

  if (useCustom) {
    return Math.round(customAmount || 0)
  }

  // Calculate from standard remuneration (same base as health)
  let standardRemuneration
  if (healthMode === SI_MODES.STANDARD && healthStandardGrade != null) {
    const entry = HEALTH_STANDARD_TABLE[healthStandardGrade]
    standardRemuneration = entry ? entry[1] : lookupStandard(HEALTH_STANDARD_TABLE, salary)
  } else {
    standardRemuneration = lookupStandard(HEALTH_STANDARD_TABLE, salary)
  }

  const employeeShare = standardRemuneration * (RATES.nursing / 100) / 2
  return Math.round(employeeShare)
}

// Calculate employment insurance (employee share)
export function calculateEmployment(settings) {
  const { salary, rate, totalEarnings } = settings
  const base = Math.min(totalEarnings || salary, EMPLOYMENT_INSURANCE_CAP)
  return Math.round(base * (rate / 100))
}

// Calculate salary income deduction (給与所得控除)
function calculateSalaryDeduction(annualSalary) {
  for (const bracket of SALARY_DEDUCTION_TABLE) {
    if (annualSalary <= bracket.upper) {
      return bracket.calc(annualSalary)
    }
  }
  return 1950000
}

// Calculate monthly withholding tax (源泉徴収税)
export function calculateWithholdingTax(settings) {
  const {
    monthlySalary,
    socialInsuranceTotal,
    dependents = 0,
    isElectronic = false,
    isExempt = false,
    isNonResident = false,
    taxExemptAllowances = 0,
  } = settings

  if (isExempt) return 0

  // Taxable salary = monthly salary - social insurance - tax-exempt allowances
  const taxableBase = monthlySalary - socialInsuranceTotal - taxExemptAllowances

  // Non-resident: flat 20.42% (乙欄)
  if (isNonResident) {
    return Math.round(Math.max(0, taxableBase) * (NON_RESIDENT_TAX_RATE / 100))
  }

  // Dependent deduction: roughly ¥31,667/month per dependent (¥380,000/year / 12)
  const dependentDeduction = dependents * 31667
  const taxableSalary = Math.max(0, taxableBase - dependentDeduction)

  // Look up withholding bracket (甲欄)
  let tax = 0
  for (const bracket of WITHHOLDING_BRACKETS) {
    if (taxableSalary <= bracket.upper) {
      tax = Math.round(taxableSalary * (bracket.rate / 100)) + bracket.base
      break
    }
  }

  // Electronic filing deduction (電子申告控除)
  if (isElectronic && tax > 0) {
    tax = Math.max(0, tax - Math.round(tax * 0.01))
  }

  // Apply reconstruction special income tax (復興特別所得税 2.1%)
  tax = Math.round(tax * (1 + RECONSTRUCTION_TAX_RATE / 100))

  return Math.round(tax)
}

// Calculate monthly resident tax (住民税)
export function calculateResidentTax(settings) {
  const { mode, annualSalary, customAnnualAmount, socialInsuranceMonthly } = settings

  if (mode === 'manual') {
    return Math.round((customAnnualAmount || 0) / 12)
  }

  // Auto: approximate annual income tax base, then 10%
  const annualSI = socialInsuranceMonthly * 12
  const salaryDeduction = calculateSalaryDeduction(annualSalary)
  const basicDeduction = 480000
  const taxableIncome = Math.max(0, annualSalary - salaryDeduction - annualSI - basicDeduction)
  const annualResidentTax = Math.round(taxableIncome * (RESIDENT_TAX_RATE / 100)) + 5000 // 均等割
  return Math.round(annualResidentTax / 12)
}

// Master calculation: calculate all deductions and take-home pay
export function calculateTakeHome(settings) {
  const {
    salary,
    month,
    prefectureIndex,
    ageGroup,
    // Health
    healthMode,
    healthIsKyokai,
    healthCustomAmount,
    healthStandardGrade,
    // Pension
    pensionMode,
    pensionCustomAmount,
    pensionStandardGrade,
    // Nursing
    nursingIsCollected,
    nursingUseCustom,
    nursingCustomAmount,
    // Employment
    employmentRate,
    employmentJoined,
    // Tax
    dependents,
    isElectronic,
    isTaxExempt,
    isNonResident,
    // Resident tax
    residentTaxMode,
    residentTaxCustomAnnual,
    residentTaxHidden,
    // Allowances, bonuses, deductions
    allowances = [],
    bonusMonths = [],
    deductions = [],
  } = settings

  // Separate taxable and tax-exempt allowances (TASK-013: commute allowance)
  const taxExemptAllowances = allowances
    .filter((a) => a.taxExempt)
    .reduce((sum, a) => sum + Math.min(a.amount || 0, COMMUTE_TAX_FREE_LIMIT), 0)
  const totalAllowances = allowances.reduce((sum, a) => sum + (a.amount || 0), 0)

  // SI-exempt allowances (excluded from 標準報酬月額 calculation)
  const siExemptAllowances = allowances
    .filter((a) => a.siExempt)
    .reduce((sum, a) => sum + (a.amount || 0), 0)

  // Bonus (if current month is a bonus month)
  const isBonusMonth = bonusMonths.some((b) => b.month === month && b.enabled)
  const bonusEntry = bonusMonths.find((b) => b.month === month && b.enabled)
  const bonusAmount = isBonusMonth && bonusEntry ? (bonusEntry.amount || 0) : 0

  // Gross = base salary + allowances + bonus
  const grossSalary = salary + totalAllowances + bonusAmount

  // Social insurance calculations use base salary minus SI-exempt allowances
  const siBaseSalary = salary + totalAllowances - siExemptAllowances

  // Monthly social insurance
  const healthInsurance = calculateHealthInsurance({
    mode: healthMode,
    salary: siBaseSalary,
    prefectureIndex,
    isKyokai: healthIsKyokai,
    customAmount: healthCustomAmount,
    standardGrade: healthStandardGrade,
  })

  const pensionInsurance = calculatePension({
    mode: pensionMode,
    salary: siBaseSalary,
    customAmount: pensionCustomAmount,
    standardGrade: pensionStandardGrade,
  })

  const nursingInsurance = calculateNursing({
    isCollected: nursingIsCollected,
    customAmount: nursingCustomAmount,
    useCustom: nursingUseCustom,
    salary: siBaseSalary,
    prefectureIndex,
    isKyokai: healthIsKyokai,
    healthMode,
    healthStandardGrade,
  })

  const employmentInsurance = employmentJoined
    ? calculateEmployment({ salary: grossSalary, rate: employmentRate, totalEarnings: grossSalary })
    : 0

  // Bonus social insurance (TASK-014: bonus-specific SI)
  let bonusHealthSI = 0
  let bonusPensionSI = 0
  let bonusNursingSI = 0
  if (bonusAmount > 0 && healthMode !== SI_MODES.CUSTOM && pensionMode !== SI_MODES.CUSTOM) {
    // Health: bonus × rate/2 (no standard remuneration table for bonuses)
    const healthTotalRate = healthIsKyokai
      ? (PREFECTURES[prefectureIndex] || PREFECTURES[12]).healthRate
      : RATES.unionHealth
    bonusHealthSI = Math.round(bonusAmount * (healthTotalRate / 100) / 2)

    // Pension: bonus × rate/2, capped at ¥1.5M per occurrence
    const cappedBonus = Math.min(bonusAmount, PENSION_BONUS_CAP)
    bonusPensionSI = Math.round(cappedBonus * (RATES.pension / 100) / 2)

    // Nursing: if collected
    if (nursingIsCollected && !nursingUseCustom) {
      bonusNursingSI = Math.round(bonusAmount * (RATES.nursing / 100) / 2)
    }
  }

  const totalHealthInsurance = healthInsurance + bonusHealthSI
  const totalPensionInsurance = pensionInsurance + bonusPensionSI
  const totalNursingInsurance = nursingInsurance + bonusNursingSI
  const socialInsuranceTotal = totalHealthInsurance + totalPensionInsurance + totalNursingInsurance + employmentInsurance

  // Withholding tax (TASK-011: reconstruction tax, TASK-012: non-resident, TASK-013: tax-exempt)
  const withholdingTax = calculateWithholdingTax({
    monthlySalary: grossSalary,
    socialInsuranceTotal,
    dependents,
    isElectronic,
    isExempt: isTaxExempt,
    isNonResident,
    taxExemptAllowances,
  })

  // Resident tax
  const annualSalary = (salary + totalAllowances) * 12
  const residentTax = residentTaxHidden
    ? 0
    : calculateResidentTax({
        mode: residentTaxMode,
        annualSalary,
        customAnnualAmount: residentTaxCustomAnnual,
        socialInsuranceMonthly: healthInsurance + pensionInsurance + nursingInsurance,
      })

  // Total deductions (other deductions from paycheck)
  const totalOtherDeductions = deductions.reduce((sum, d) => sum + (d.amount || 0), 0)

  // Total deductions
  const totalDeductions = socialInsuranceTotal + withholdingTax + residentTax + totalOtherDeductions

  // Take-home pay
  const takeHome = grossSalary - totalDeductions

  // Deduction rate
  const deductionRate = grossSalary > 0 ? (totalDeductions / grossSalary) * 100 : 0

  return {
    grossSalary,
    baseSalary: salary,
    totalAllowances,
    bonusAmount,
    healthInsurance: totalHealthInsurance,
    pensionInsurance: totalPensionInsurance,
    nursingInsurance: totalNursingInsurance,
    employmentInsurance,
    socialInsuranceTotal,
    withholdingTax,
    residentTax,
    totalOtherDeductions,
    totalDeductions,
    takeHome,
    deductionRate,
    isBonusMonth,
    taxExemptAllowances,
    siExemptAllowances,
  }
}
