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
  const base = totalEarnings || salary
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
  } = settings

  if (isExempt) return 0

  // Taxable salary = monthly salary - social insurance
  const taxableBase = monthlySalary - socialInsuranceTotal

  // Dependent deduction: roughly ¥31,667/month per dependent (¥380,000/year / 12)
  const dependentDeduction = dependents * 31667
  const taxableSalary = Math.max(0, taxableBase - dependentDeduction)

  // Look up withholding bracket
  let tax = 0
  for (const bracket of WITHHOLDING_BRACKETS) {
    if (taxableSalary <= bracket.upper) {
      tax = Math.round(taxableSalary * (bracket.rate / 100)) + bracket.base
      break
    }
  }

  // Electronic filing deduction (電子申告控除) - minor monthly reduction
  if (isElectronic && tax > 0) {
    tax = Math.max(0, tax - Math.round(tax * 0.01))
  }

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

  // Total allowances
  const totalAllowances = allowances.reduce((sum, a) => sum + (a.amount || 0), 0)

  // Bonus (if current month is a bonus month)
  const isBonusMonth = bonusMonths.some((b) => b.month === month && b.enabled)
  const bonusEntry = bonusMonths.find((b) => b.month === month && b.enabled)
  const bonusAmount = isBonusMonth && bonusEntry ? (bonusEntry.amount || 0) : 0

  // Gross = base salary + allowances + bonus
  const grossSalary = salary + totalAllowances + bonusAmount

  // Social insurance calculations use base salary (not bonus for monthly)
  const siBaseSalary = salary + totalAllowances

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

  const socialInsuranceTotal = healthInsurance + pensionInsurance + nursingInsurance + employmentInsurance

  // Withholding tax
  const withholdingTax = calculateWithholdingTax({
    monthlySalary: grossSalary,
    socialInsuranceTotal,
    dependents,
    isElectronic,
    isExempt: isTaxExempt,
    isNonResident,
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
  }
}
