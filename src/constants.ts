import { ModelType, ModelStats } from './types';

export const MODELS: Record<ModelType, ModelStats> = {
  GPT: {
    pbPerSec: 0.0009,
    pbPerClick: 0.001,
    moneyPerSec: 0.10, // 0.01 + 0.09
    moneyPerClick: 0,
    rewardPerPb: { money: 10, rep: 1 },
    clickCooldown: 300,
    specialDescription: "Special: Convert $30 to 1 rep."
  },
  Sonnet: {
    pbPerSec: 0.001,
    pbPerClick: 0.1,
    moneyPerSec: 0.1,
    moneyPerClick: 1,
    rewardPerPb: { money: 5, rep: 3 },
    clickCooldown: 5000,
    specialDescription: "Special: +0.009 rep per second"
  },
  Gemma: {
    pbPerSec: 0.05,
    pbPerClick: 0.1,
    moneyPerSec: 0,
    moneyPerClick: 0.5,
    rewardPerPb: { money: 5, rep: 1 },
    clickCooldown: 1000,
    specialDescription: "Special: Convert 1 rep into $78"
  }
};

export const UPGRADES = {
  moneyBoost: {
    baseCost: 5,
    costMult: 10,
    benefitPerLvl: 1,
    label: "Efficiency Boost",
    description: "+$1/s"
  },
  pbBoost: {
    baseCost: 500,
    costMult: 5,
    initialBenefit: 0.009,
    benefitPerLvl: 0.005,
    label: "Cooling Hack",
    description: "+0.009 PB/s"
  },
  imageGen: {
    baseCost: 5000,
    costMult: 5,
    benefitPerLvl: 0.1,
    label: "AI Image Generation",
    description: "+0.1 PB/s"
  },
  videoGen: {
    baseCost: 20000,
    costMult: 5,
    benefitPerLvl: 1,
    label: "AI Video Generation",
    description: "+1 PB/s (Requires Image Gen)"
  },
  gameGen: {
    baseCost: 300000,
    costMult: 5,
    initialBenefit: 5,
    benefitPerLvl: 15,
    label: "AI Video Game Generation",
    description: "+PB/s (Requires Video Gen)"
  },
  autonomousWarfare: {
    cost: 1000000,
    benefit: 100,
    label: "Autonomous Warfare",
    description: "+100 PB/s"
  },
  partnership: {
    baseCost: 1, // Rep
    costMult: 5,
    initialBenefit: 10,
    benefitPerLvl: 50,
    label: "Partnership",
    description: "+$/s"
  },
  autoClicker: {
    baseCost: 1000,
    costMult: 2,
    benefitPerLvl: 1,
    label: "Autoclicker",
    description: "Auto-clicks every second"
  },
  clickCooldown: {
    baseCost: 100,
    costMult: 2,
    benefitPerLvl: 50, // 0.05s = 50ms
    label: "Fast Response",
    description: "-0.05s click cooldown"
  }
};
