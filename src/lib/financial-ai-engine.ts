/**
 * Real Indian Financial Data & AI Insight Engine
 * All data based on RBI guidelines, SEBI regulations, and real market benchmarks (2026-27)
 */

// ============ REAL BENCHMARK DATA ============

export const INDIAN_BENCHMARKS = {
  // RBI repo rate as of 2026
  rbiRepoRate: 6.25,
  // Average FD rates by bank type
  fdRates: { psu: 6.5, private: 7.2, smallFinance: 8.5, nbfc: 8.0 },
  // Average home loan rates
  homeLoanRates: { sbi: 8.25, hdfc: 8.35, icici: 8.40, axis: 8.50, kotak: 8.55 },
  // Personal loan rate ranges
  personalLoanRates: { low: 10.5, mid: 14.0, high: 24.0 },
  // SIP benchmarks (annualized returns)
  sipReturns: { nifty50_10yr: 12.1, nifty50_5yr: 14.8, midcap_10yr: 16.2, debt_10yr: 7.5 },
  // Inflation
  avgInflation: 5.5,
  cpiInflation: 4.8,
  // Tax (FY 2025-26 New Regime)
  standardDeduction: 75000,
  section80CLimit: 150000,
  npsExtraLimit: 50000,
  // Credit score ranges (CIBIL)
  creditScore: { excellent: 800, veryGood: 750, good: 650, fair: 550, poor: 300 },
  // Average Indian household ratios
  avgSavingsRate: 20.3, // % of income
  avgHousingCost: 28, // % of income
  avgEmiToIncome: 40, // max recommended
  emergencyFundMonths: 6,
  // Gold returns (10 yr avg)
  goldReturn10yr: 10.5,
  // PPF rate
  ppfRate: 7.1,
  // EPF rate
  epfRate: 8.25,
  // Sukanya Samriddhi
  sukanyaRate: 8.2,
};

// ============ SMART INSIGHT GENERATORS ============

export function getCreditScoreInsights(score: number, factors: { payment: number; utilization: number; history: number; mix: number; inquiries: number }) {
  const insights: string[] = [];

  // Primary factor analysis
  if (factors.utilization > 50) {
    insights.push(`🔴 Credit utilization at ${factors.utilization}% is critically high. CIBIL data shows keeping it below 30% can boost your score by 50-80 points within 2 billing cycles.`);
  } else if (factors.utilization > 30) {
    insights.push(`🟡 Utilization at ${factors.utilization}% is above the ideal 30% threshold. Requesting a credit limit increase (without spending more) can instantly improve this ratio.`);
  }

  if (factors.payment < 95) {
    insights.push(`Payment history (35% weight in CIBIL) is at ${factors.payment}%. Even 1 missed payment stays on your report for 36 months. Set up auto-pay for at least minimum due.`);
  }

  if (factors.inquiries > 3) {
    insights.push(`${factors.inquiries} hard inquiries in 2 years is high. Each inquiry drops score by 5-10 points. Space credit applications 6+ months apart.`);
  }

  if (factors.history < 3) {
    insights.push(`Credit history of ${factors.history} years is short. Become an authorized user on a family member's old card to piggyback on their history length.`);
  }

  // Product eligibility based on score
  if (score >= 800) {
    insights.push(`With ${score}, you qualify for premium cards like HDFC Infinia, Axis Magnus, and Amex Platinum. You'll get the lowest loan rates — SBI offers 8.25% on home loans for 800+ scores.`);
  } else if (score >= 750) {
    insights.push(`Score of ${score} qualifies you for HDFC Regalia, Axis Flipkart, and most premium products. Home loan rates around 8.35-8.5% are achievable.`);
  } else if (score >= 650) {
    insights.push(`At ${score}, you can get secured credit cards and personal loans at 14-18%. Focus on payment consistency to cross 750 in 6-12 months.`);
  } else {
    insights.push(`Score of ${score} limits options significantly. Start with a secured credit card (FD-backed) from HDFC or ICICI to rebuild. Consistent payments for 6 months can add 50-100 points.`);
  }

  return insights;
}

export function getTaxInsights(income: number, regime: "new" | "old", deductions: number, totalTax: number, effectiveRate: number) {
  const insights: string[] = [];
  const { standardDeduction, section80CLimit, npsExtraLimit } = INDIAN_BENCHMARKS;

  // Regime comparison
  if (regime === "new") {
    const oldTaxable = Math.max(0, income - deductions);
    const newTaxable = income - standardDeduction; // New regime gets ₹75K standard deduction
    if (deductions > 200000) {
      insights.push(`With ₹${(deductions / 100000).toFixed(1)}L in deductions, Old Regime likely saves more tax. Switch above to compare — you could save ₹${Math.round((newTaxable - oldTaxable) * 0.2).toLocaleString("en-IN")} or more.`);
    } else {
      insights.push(`New Regime is optimal when deductions are below ~₹3.75L. Your ₹${(deductions / 100000).toFixed(1)}L deductions make New Regime the better choice.`);
    }
  }

  // Actionable saving tips
  if (income > 1000000 && regime === "old") {
    const maxSavings = section80CLimit + npsExtraLimit + 25000 + 50000; // 80C + NPS + 80D + HRA component
    const unusedDeductions = maxSavings - deductions;
    if (unusedDeductions > 50000) {
      insights.push(`You could claim up to ₹${unusedDeductions.toLocaleString("en-IN")} more in deductions. Max out 80C (₹1.5L via ELSS/PPF), NPS extra (₹50K under 80CCD), and health insurance (₹25K-50K under 80D).`);
    }
  }

  if (effectiveRate > 15) {
    insights.push(`Your effective tax rate of ${effectiveRate.toFixed(1)}% is significant. Consider HRA exemption (if renting), home loan interest (₹2L under 24b), and NPS contributions for further savings.`);
  }

  if (income <= 700000 && regime === "new") {
    insights.push(`Under New Regime, income up to ₹7L is effectively tax-free due to Section 87A rebate! Your tax liability may be zero.`);
  }

  return insights;
}

export function getRetirementInsights(age: number, retireAge: number, monthly: number, corpus: number, needed: number, readiness: number) {
  const insights: string[] = [];
  const yearsLeft = retireAge - age;

  // Rule of 72
  const doublingYears = Math.round(72 / 12);
  insights.push(`At 12% return, your money doubles every ${doublingYears} years. Starting at ${age}, you have ${Math.floor(yearsLeft / doublingYears)} doubling periods before retirement.`);

  // NPS benefit
  if (age < 60) {
    insights.push(`Consider NPS Tier-1: Get extra ₹50,000 tax deduction under 80CCD(1B) plus equity allocation up to 75%. Current NPS equity returns are ~14% CAGR over 10 years.`);
  }

  if (readiness < 60) {
    const extraNeeded = needed - corpus;
    const extraMonthly = Math.round(extraNeeded / ((Math.pow(1 + 0.01, yearsLeft * 12) - 1) / 0.01));
    insights.push(`To close the gap, increase SIP by ₹${extraMonthly.toLocaleString("en-IN")}/month, or consider equity-heavy allocation (Nifty 50 has given ${INDIAN_BENCHMARKS.sipReturns.nifty50_10yr}% over 10 years).`);
  }

  if (readiness >= 80) {
    insights.push(`Excellent readiness at ${readiness}%! Consider adding a debt component (PPF at ${INDIAN_BENCHMARKS.ppfRate}%, EPF at ${INDIAN_BENCHMARKS.epfRate}%) for stability as you approach retirement.`);
  }

  return insights;
}

export function getBudgetInsights(income: number, allocations: number[], categories: string[]) {
  const insights: string[] = [];
  const housing = allocations[0]; // Assuming Housing is first
  const savings = allocations[7]; // Assuming Savings is last
  const food = allocations[1];

  // 50-30-20 Rule analysis
  const needs = allocations[0] + allocations[3] + allocations[4]; // Housing + Utilities + Healthcare
  const wants = allocations[2] + allocations[5] + allocations[6]; // Transport + Entertainment + Shopping
  
  if (needs > 50) {
    insights.push(`Your essential expenses are ${needs}% of income (ideal: ≤50%). The 50-30-20 rule suggests reducing fixed costs — consider a more affordable location or renegotiating rent.`);
  }

  if (savings < 20) {
    const target = Math.round(income * 0.2);
    const current = Math.round(income * savings / 100);
    insights.push(`Saving ${savings}% vs the recommended 20%. You need ₹${(target - current).toLocaleString("en-IN")} more monthly. Try automating a SIP of ₹${(target - current).toLocaleString("en-IN")} on salary day.`);
  }

  if (housing > 35) {
    insights.push(`Housing at ${housing}% exceeds the 28-35% safe zone. RBI guidelines suggest EMI should not exceed 40% of net income. This leaves less room for emergencies.`);
  }

  // Emergency fund check
  const monthlyExpenses = Math.round(income * (100 - savings) / 100);
  const emergencyNeeded = monthlyExpenses * INDIAN_BENCHMARKS.emergencyFundMonths;
  insights.push(`Your monthly expenses are ~₹${monthlyExpenses.toLocaleString("en-IN")}. Build an emergency fund of ₹${emergencyNeeded.toLocaleString("en-IN")} (${INDIAN_BENCHMARKS.emergencyFundMonths} months) in a liquid fund or high-yield savings account.`);

  return insights;
}

export function getDebtInsights(debt: number, rate: number, payment: number, months: number, totalInterest: number) {
  const insights: string[] = [];

  // Debt avalanche vs snowball
  if (rate > 18) {
    insights.push(`At ${rate}% interest, this is expensive debt. Consider balance transfer to a lower-rate card (many offer 0% for 3-6 months) or a personal loan at ${INDIAN_BENCHMARKS.personalLoanRates.mid}% to consolidate.`);
  }

  // Extra payment impact
  const extraPayment = payment * 0.1;
  const rMonthly = rate / 100 / 12;
  let monthsWithExtra = 0, balExtra = debt;
  while (balExtra > 0 && monthsWithExtra < 600) {
    balExtra = Math.max(0, balExtra + balExtra * rMonthly - (payment + extraPayment));
    monthsWithExtra++;
  }
  const monthsSaved = months - monthsWithExtra;
  if (monthsSaved > 0) {
    const interestSaved = Math.round(totalInterest * (monthsSaved / months));
    insights.push(`Adding just ₹${Math.round(extraPayment).toLocaleString("en-IN")} extra/month (10% more) saves ₹${interestSaved.toLocaleString("en-IN")} in interest and makes you debt-free ${monthsSaved} months sooner.`);
  }

  // EMI to income ratio warning
  insights.push(`Ensure total EMIs (all debts) stay below 40% of monthly income. Banks use this FOIR (Fixed Obligations to Income Ratio) to approve new loans.`);

  if (months > 60) {
    insights.push(`${Math.round(months / 12)} years to payoff is long. You'll pay ₹${Math.round(totalInterest).toLocaleString("en-IN")} in interest alone (${Math.round(totalInterest / debt * 100)}% of principal). Aggressive repayment is strongly recommended.`);
  }

  return insights;
}

export function getHomeLoanInsights(amount: number, loanAmount: number, rate: number, years: number, emi: number, totalInterest: number, downPaymentPercent: number) {
  const insights: string[] = [];

  // Compare with current best rates
  const bestRate = INDIAN_BENCHMARKS.homeLoanRates.sbi;
  if (rate > bestRate + 0.5) {
    const betterEmi = loanAmount * (bestRate / 100 / 12) * Math.pow(1 + bestRate / 100 / 12, years * 12) / (Math.pow(1 + bestRate / 100 / 12, years * 12) - 1);
    const savings = (emi - betterEmi) * years * 12;
    insights.push(`Current best rate: SBI ${bestRate}%. At your ${rate}%, you're paying ₹${Math.round(savings).toLocaleString("en-IN")} more over the loan tenure. Consider SBI/HDFC for better rates.`);
  }

  // PMAY benefit
  if (amount <= 4500000 && loanAmount <= 3500000) {
    insights.push(`You may qualify for PMAY (Pradhan Mantri Awas Yojana) subsidy of up to ₹2.67 lakh on interest for homes up to ₹45 lakh. Check eligibility at pmaymis.gov.in.`);
  }

  // Tax benefits
  const section24bMax = 200000;
  const yearlyInterest = totalInterest / years;
  const taxBenefit = Math.min(yearlyInterest, section24bMax) * 0.3; // Assuming 30% tax bracket
  insights.push(`Tax saving: Claim up to ₹2L/year on interest (Section 24b) + ₹1.5L on principal (Section 80C). That's ~₹${Math.round(taxBenefit).toLocaleString("en-IN")}/year in tax savings at 30% bracket.`);

  if (downPaymentPercent < 20) {
    insights.push(`Banks charge higher rates for LTV above 80%. Increase down payment to 20%+ to avoid extra 0.25-0.5% interest and eliminate PMI charges.`);
  }

  // Prepayment strategy
  insights.push(`Make one extra EMI payment yearly and you'll save ~₹${Math.round(totalInterest * 0.12).toLocaleString("en-IN")} in interest and reduce tenure by ~${Math.round(years * 0.08)} years. RBI mandates zero prepayment charges on floating rate loans.`);

  return insights;
}

export function getInvestmentInsights(initial: number, monthly: number, rate: number, years: number, totalValue: number, returns: number) {
  const insights: string[] = [];

  // Compare with benchmarks
  if (rate > INDIAN_BENCHMARKS.sipReturns.nifty50_10yr + 2) {
    insights.push(`Expecting ${rate}% is optimistic. Nifty 50 has delivered ${INDIAN_BENCHMARKS.sipReturns.nifty50_10yr}% over 10 years. Only midcap/smallcap indices have given ${INDIAN_BENCHMARKS.sipReturns.midcap_10yr}%+ — with higher volatility.`);
  }

  // Step-up SIP suggestion
  const stepUpRate = 10; // 10% annual increase
  let stepUpValue = 0;
  for (let y = 0; y < years; y++) {
    const yearlyMonthly = monthly * Math.pow(1 + stepUpRate / 100, y);
    for (let m = 0; m < 12; m++) {
      stepUpValue = (stepUpValue + yearlyMonthly) * (1 + rate / 100 / 12);
    }
  }
  const extraFromStepUp = stepUpValue - totalValue + initial * Math.pow(1 + rate / 100, years);
  if (extraFromStepUp > 100000) {
    insights.push(`Step-up SIP (increasing by 10% yearly) would grow your corpus to ₹${Math.round(stepUpValue).toLocaleString("en-IN")} — that's ₹${Math.round(extraFromStepUp).toLocaleString("en-IN")} more! Most fund houses offer automatic step-up.`);
  }

  // Asset allocation suggestion
  if (years >= 7) {
    insights.push(`With ${years}-year horizon, allocate 60-70% to equity (Nifty index funds), 20-30% to debt (PPF at ${INDIAN_BENCHMARKS.ppfRate}%), and 10% to gold (SGBs at ${INDIAN_BENCHMARKS.goldReturn10yr}% historical return).`);
  } else if (years >= 3) {
    insights.push(`For ${years}-year horizon, use balanced advantage funds or 50:50 equity-debt split. Pure equity is volatile for <5 years — 2020 crash saw 38% drop in 1 month.`);
  } else {
    insights.push(`For ${years}-year horizon, stick to debt funds, FDs, or liquid funds. Equity is risky for <3 years. Current best FD rates: ${INDIAN_BENCHMARKS.fdRates.smallFinance}% from small finance banks.`);
  }

  // Tax implication
  if (returns > 125000 && years >= 1) {
    const ltcg = Math.max(0, returns - 125000) * 0.125; // 12.5% LTCG above ₹1.25L
    insights.push(`LTCG tax: Returns above ₹1.25L/year are taxed at 12.5%. Estimated tax on gains: ~₹${Math.round(ltcg).toLocaleString("en-IN")}. Use ELSS to save both tax (80C) and earn equity returns.`);
  }

  return insights;
}

export function getSavingsInsights(monthly: number, rate: number, years: number, futureValue: number, interestEarned: number) {
  const insights: string[] = [];

  // Real return after inflation
  const realReturn = rate - INDIAN_BENCHMARKS.avgInflation;
  if (realReturn < 2) {
    insights.push(`⚠️ Your real return (after ${INDIAN_BENCHMARKS.avgInflation}% inflation) is just ${realReturn.toFixed(1)}%. At ${rate}%, your purchasing power barely grows. Consider equity SIPs for long-term savings.`);
  }

  // Compare products
  if (rate < INDIAN_BENCHMARKS.ppfRate) {
    insights.push(`PPF offers ${INDIAN_BENCHMARKS.ppfRate}% tax-free return (15-year lock-in). For ${rate}% return, also check: Sukanya Samriddhi (${INDIAN_BENCHMARKS.sukanyaRate}%), EPF (${INDIAN_BENCHMARKS.epfRate}%), or small finance bank FDs (${INDIAN_BENCHMARKS.fdRates.smallFinance}%).`);
  }

  // Milestone celebrations
  if (futureValue >= 10000000) {
    insights.push(`🎉 You'll hit ₹1 Crore! You're among the top 3% of Indian savers. This corpus can generate ₹${Math.round(futureValue * 0.06 / 12).toLocaleString("en-IN")}/month in retirement income at 6% withdrawal rate.`);
  } else if (futureValue >= 1000000) {
    insights.push(`You'll accumulate ₹${(futureValue / 100000).toFixed(1)} Lakhs. To reach ₹1 Crore, increase monthly savings to ₹${Math.round(10000000 / ((Math.pow(1 + rate / 100 / 12, years * 12) - 1) / (rate / 100 / 12) * (1 + rate / 100 / 12))).toLocaleString("en-IN")}.`);
  }

  return insights;
}

export function getPersonalLoanInsights(amount: number, rate: number, years: number, emi: number, interest: number) {
  const insights: string[] = [];

  if (rate > 16) {
    insights.push(`${rate}% is above market average (${INDIAN_BENCHMARKS.personalLoanRates.mid}%). A CIBIL score above 750 can get you rates as low as ${INDIAN_BENCHMARKS.personalLoanRates.low}% from SBI/HDFC. That would save ₹${Math.round(interest * (rate - INDIAN_BENCHMARKS.personalLoanRates.low) / rate).toLocaleString("en-IN")} in interest.`);
  }

  // Prepayment tip
  insights.push(`RBI mandates: After 1 year, you can prepay floating-rate loans without penalty. Fixed-rate loans may have 2-5% foreclosure charges. Check your loan agreement.`);

  // Alternative options
  if (amount <= 500000) {
    insights.push(`For ₹${(amount / 100000).toFixed(0)}L, also consider: Loan against FD (2% above FD rate), Loan against mutual funds (10.5-11%), or credit card EMI conversion (if rate < ${rate}%).`);
  }

  return insights;
}

// ============ ELIGIBILITY SCORING ALGORITHM ============

export interface EligibilityScore {
  overall: number;
  creditCardScore: number;
  loanScore: number;
  factors: {
    income: { score: number; label: string };
    age: { score: number; label: string };
    employment: { score: number; label: string };
    creditScore: { score: number; label: string };
  };
}

export function calculateEligibilityScore(salary: number, age: number, employment: string, creditScore: number | null): EligibilityScore {
  // Income scoring (weight: 35%)
  let incomeScore = 0;
  let incomeLabel = "";
  if (salary >= 100000) { incomeScore = 95; incomeLabel = "Excellent — qualifies for all premium products"; }
  else if (salary >= 50000) { incomeScore = 80; incomeLabel = "Good — qualifies for most products"; }
  else if (salary >= 25000) { incomeScore = 60; incomeLabel = "Moderate — basic products available"; }
  else if (salary >= 15000) { incomeScore = 40; incomeLabel = "Limited — entry-level products only"; }
  else { incomeScore = 20; incomeLabel = "Below minimum for most products"; }

  // Age scoring (weight: 15%)
  let ageScore = 0;
  let ageLabel = "";
  if (age >= 25 && age <= 45) { ageScore = 90; ageLabel = "Ideal age bracket for all products"; }
  else if (age >= 21 && age < 25) { ageScore = 70; ageLabel = "Young — good for starter cards"; }
  else if (age > 45 && age <= 55) { ageScore = 75; ageLabel = "Senior bracket — higher FD rates available"; }
  else if (age > 55) { ageScore = 50; ageLabel = "Limited loan tenure options"; }
  else { ageScore = 30; ageLabel = "Below minimum age for most products"; }

  // Employment scoring (weight: 20%)
  let empScore = 0;
  let empLabel = "";
  if (employment === "salaried") { empScore = 90; empLabel = "Banks prefer salaried — fastest approvals"; }
  else if (employment === "self-employed") { empScore = 65; empLabel = "Need ITR for 2+ years — higher documentation"; }
  else { empScore = 30; empLabel = "Student — limited to basic cards, education loans"; }

  // Credit score (weight: 30%)
  let csScore = 50; // Default when not provided
  let csLabel = "Not provided — assumed average";
  if (creditScore) {
    if (creditScore >= 800) { csScore = 95; csLabel = "Excellent — premium products unlocked"; }
    else if (creditScore >= 750) { csScore = 85; csLabel = "Very good — low interest rates"; }
    else if (creditScore >= 650) { csScore = 65; csLabel = "Good — standard products available"; }
    else if (creditScore >= 550) { csScore = 40; csLabel = "Fair — limited options, higher rates"; }
    else { csScore = 15; csLabel = "Poor — secured products only"; }
  }

  const overall = Math.round(incomeScore * 0.35 + ageScore * 0.15 + empScore * 0.20 + csScore * 0.30);
  const creditCardScore = Math.round(incomeScore * 0.3 + ageScore * 0.1 + empScore * 0.15 + csScore * 0.45);
  const loanScore = Math.round(incomeScore * 0.4 + ageScore * 0.15 + empScore * 0.25 + csScore * 0.2);

  return {
    overall,
    creditCardScore,
    loanScore,
    factors: {
      income: { score: incomeScore, label: incomeLabel },
      age: { score: ageScore, label: ageLabel },
      employment: { score: empScore, label: empLabel },
      creditScore: { score: csScore, label: csLabel },
    },
  };
}
