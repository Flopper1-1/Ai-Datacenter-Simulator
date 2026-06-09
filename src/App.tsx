import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ModelType, UpgradesState } from './types';
import { MODELS, UPGRADES } from './constants';
import './App.css';

const App: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<ModelType | null>(null);
  const [polarBears, setPolarBears] = useState(0);
  const [money, setMoney] = useState(0);
  const [rep, setRep] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [upgrades, setUpgrades] = useState<UpgradesState>({
    moneyBoost: 0,
    pbBoost: 0,
    imageGen: 0,
    videoGen: 0,
    gameGen: 0,
    autonomousWarfare: false,
    partnership: 0,
  });

  const lastUpdateRef = useRef<number>(Date.now());
  const bearsRef = useRef(0);
  const moneyRef = useRef(0);
  const repRef = useRef(0);

  // Sync refs with state for the game loop to avoid stale closures
  useEffect(() => {
    bearsRef.current = polarBears;
    moneyRef.current = money;
    repRef.current = rep;
  }, [polarBears, money, rep]);

  const calculateRates = useCallback(() => {
    if (!selectedModel) return { pbRate: 0, moneyRate: 0, repRate: 0 };

    const model = MODELS[selectedModel];
    
    let pbRate = model.pbPerSec;
    if (upgrades.pbBoost > 0) {
      pbRate += UPGRADES.pbBoost.initialBenefit + (upgrades.pbBoost - 1) * UPGRADES.pbBoost.benefitPerLvl;
    }
    pbRate += upgrades.imageGen * UPGRADES.imageGen.benefitPerLvl;
    pbRate += upgrades.videoGen * UPGRADES.videoGen.benefitPerLvl;
    if (upgrades.gameGen > 0) {
      pbRate += UPGRADES.gameGen.initialBenefit + (upgrades.gameGen - 1) * UPGRADES.gameGen.benefitPerLvl;
    }
    if (upgrades.autonomousWarfare) {
      pbRate += UPGRADES.autonomousWarfare.benefit;
    }

    let moneyRate = model.moneyPerSec;
    moneyRate += upgrades.moneyBoost * UPGRADES.moneyBoost.benefitPerLvl;
    if (upgrades.partnership > 0) {
      moneyRate += UPGRADES.partnership.initialBenefit + (upgrades.partnership - 1) * UPGRADES.partnership.benefitPerLvl;
    }

    let repRate = selectedModel === 'Sonnet' ? 0.009 : 0;

    return { pbRate, moneyRate, repRate };
  }, [selectedModel, upgrades]);

  const processResourceGain = useCallback((pbGain: number, moneyGain: number, repGain: number) => {
    const oldBears = bearsRef.current;
    const newBearsTotal = oldBears + pbGain;
    
    // Calculate how many full bears were killed in this tick
    const fullBearsKilled = Math.floor(newBearsTotal) - Math.floor(oldBears);
    
    if (fullBearsKilled > 0 && selectedModel) {
      const reward = MODELS[selectedModel].rewardPerPb;
      moneyRef.current += fullBearsKilled * reward.money;
      repRef.current += fullBearsKilled * reward.rep;
    }

    bearsRef.current = newBearsTotal;
    moneyRef.current += moneyGain;
    repRef.current += repGain;

    setPolarBears(bearsRef.current);
    setMoney(moneyRef.current);
    setRep(repRef.current);
  }, [selectedModel]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const dt = (now - lastUpdateRef.current) / 1000;
      lastUpdateRef.current = now;

      if (selectedModel) {
        const { pbRate, moneyRate, repRate } = calculateRates();
        processResourceGain(pbRate * dt, moneyRate * dt, repRate * dt);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [selectedModel, calculateRates, processResourceGain]);

  const handleClick = () => {
    if (!selectedModel) return;
    const now = Date.now();
    const model = MODELS[selectedModel];
    if (now - lastClickTime < model.clickCooldown) return;

    setLastClickTime(now);
    processResourceGain(model.pbPerClick, model.moneyPerClick, 0);
  };

  const buyUpgrade = (type: keyof UpgradesState) => {
    if (type === 'autonomousWarfare') {
      if (money >= UPGRADES.autonomousWarfare.cost && !upgrades.autonomousWarfare) {
        setMoney(m => m - UPGRADES.autonomousWarfare.cost);
        setUpgrades(prev => ({ ...prev, autonomousWarfare: true }));
      }
      return;
    }

    if (type === 'partnership') {
      const cost = UPGRADES.partnership.baseCost * Math.pow(UPGRADES.partnership.costMult, upgrades.partnership);
      if (rep >= cost) {
        setRep(r => r - cost);
        setUpgrades(prev => ({ ...prev, partnership: prev.partnership + 1 }));
      }
      return;
    }

    const upgradeCfg = UPGRADES[type] as any;
    if (!upgradeCfg || !('baseCost' in upgradeCfg)) return;

    const currentLevel = upgrades[type] as number;
    const cost = upgradeCfg.baseCost * Math.pow(upgradeCfg.costMult, currentLevel);

    if (money >= cost) {
      setMoney(m => m - cost);
      setUpgrades(prev => ({ ...prev, [type]: (prev[type] as number) + 1 }));
    }
  };

  const handleSpecial = () => {
    if (!selectedModel) return;
    if (selectedModel === 'GPT') {
      if (money >= 30) {
        setMoney(m => m - 30);
        setRep(r => r + 1);
      }
    } else if (selectedModel === 'Gemma') {
      if (rep >= 1) {
        setRep(r => r - 1);
        setMoney(m => m + 78);
      }
    }
  };

  const getNextCost = (upgrade: any, level: number) => {
    return upgrade.baseCost * Math.pow(upgrade.costMult, level);
  };

  if (!selectedModel) {
    return (
      <div className="setup-screen">
        <h1 className="glitch-title">AI DATACENTER SIMULATOR</h1>
        <p className="subtitle">Select your core processing unit</p>
        <div className="model-grid">
          {(Object.keys(MODELS) as ModelType[]).map(m => {
            const stats = MODELS[m];
            return (
              <div key={m} className={`model-card ${m.toLowerCase()}`} onClick={() => setSelectedModel(m)}>
                <div className="card-glow"></div>
                <h2 className="model-name">{m}</h2>
                <div className="stats-list">
                  <div className="stat-row">
                    <span>PB Generation:</span>
                    <span className="val highlight">{stats.pbPerSec}/s</span>
                  </div>
                  <div className="stat-row">
                    <span>Budget Flux:</span>
                    <span className="val highlight">${stats.moneyPerSec}/s</span>
                  </div>
                  <div className="stat-row">
                    <span>Click CD:</span>
                    <span className="val">{(stats.clickCooldown / 1000).toFixed(1)}s</span>
                  </div>
                  <div className="stat-row reward">
                    <span>Reward per PB:</span>
                    <span className="val">${stats.rewardPerPb.money} / {stats.rewardPerPb.rep} Rep</span>
                  </div>
                </div>
                <p className="special-desc">{stats.specialDescription}</p>
                <button className="select-btn">BOOT {m}</button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const rates = calculateRates();
  const cooldownRemaining = Math.max(0, MODELS[selectedModel].clickCooldown - (Date.now() - lastClickTime));

  return (
    <div className="game-container">
      <header className="stats-header">
        <div className="stat-box pb">
          <label>Polar Bears Extinguished</label>
          <div className="value">{Math.floor(polarBears)}</div>
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${(polarBears % 1) * 100}%` }}></div>
          </div>
          <span className="rate">+{rates.pbRate.toFixed(4)}/s</span>
        </div>
        <div className="stat-box money">
          <label>Capital Reserve</label>
          <div className="value">${money.toFixed(2)}</div>
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${(money % 1) * 100}%` }}></div>
          </div>
          <span className="rate">+${rates.moneyRate.toFixed(2)}/s</span>
        </div>
        <div className="stat-box rep">
          <label>Institutional Reputation</label>
          <div className="value">{rep.toFixed(2)}</div>
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${(rep % 1) * 100}%` }}></div>
          </div>
          <span className="rate">+{rates.repRate.toFixed(4)}/s</span>
        </div>
      </header>

      <main className="game-main">
        <div className="left-panel">
          <div className="model-info">
            <div className="active-tag">SYSTEM ONLINE: {selectedModel}</div>
            <p className="description">{MODELS[selectedModel].specialDescription}</p>
            { (selectedModel === 'GPT' || selectedModel === 'Gemma') && (
              <button className="special-btn" onClick={handleSpecial}>
                EXECUTE SPECIAL PROTOCOL
              </button>
            )}
          </div>

          <div className="clicker-area">
            <div className="inference-label">MANUAL INFERENCE OVERRIDE</div>
            <button 
              className={`click-btn ${cooldownRemaining > 0 ? 'cooldown' : ''}`} 
              onClick={handleClick}
              disabled={cooldownRemaining > 0}
            >
              {cooldownRemaining > 0 ? (
                <span className="wait-text">SYNCING...</span>
              ) : (
                <span className="run-text">GENERATE</span>
              )}
            </button>
            {cooldownRemaining > 0 && <div className="cooldown-bar" style={{ width: `${(cooldownRemaining / MODELS[selectedModel].clickCooldown) * 100}%` }}></div>}
          </div>
        </div>

        <div className="right-panel">
          <div className="upgrade-section">
            <h3 className="section-title">INFRASTRUCTURE UPGRADES</h3>
            <div className="upgrade-list">
              <UpgradeItem 
                label={UPGRADES.moneyBoost.label}
                desc={UPGRADES.moneyBoost.description}
                level={upgrades.moneyBoost}
                cost={getNextCost(UPGRADES.moneyBoost, upgrades.moneyBoost)}
                onBuy={() => buyUpgrade('moneyBoost')}
                canAfford={money >= getNextCost(UPGRADES.moneyBoost, upgrades.moneyBoost)}
              />
              <UpgradeItem 
                label={UPGRADES.pbBoost.label}
                desc={UPGRADES.pbBoost.description}
                level={upgrades.pbBoost}
                cost={getNextCost(UPGRADES.pbBoost, upgrades.pbBoost)}
                onBuy={() => buyUpgrade('pbBoost')}
                canAfford={money >= getNextCost(UPGRADES.pbBoost, upgrades.pbBoost)}
              />
              <UpgradeItem 
                label={UPGRADES.imageGen.label}
                desc={UPGRADES.imageGen.description}
                level={upgrades.imageGen}
                cost={getNextCost(UPGRADES.imageGen, upgrades.imageGen)}
                onBuy={() => buyUpgrade('imageGen')}
                canAfford={money >= getNextCost(UPGRADES.imageGen, upgrades.imageGen)}
              />
              {upgrades.imageGen > 0 && (
                <UpgradeItem 
                  label={UPGRADES.videoGen.label}
                  desc={UPGRADES.videoGen.description}
                  level={upgrades.videoGen}
                  cost={getNextCost(UPGRADES.videoGen, upgrades.videoGen)}
                  onBuy={() => buyUpgrade('videoGen')}
                  canAfford={money >= getNextCost(UPGRADES.videoGen, upgrades.videoGen)}
                />
              )}
              {upgrades.videoGen > 0 && (
                <UpgradeItem 
                  label={UPGRADES.gameGen.label}
                  desc={UPGRADES.gameGen.description}
                  level={upgrades.gameGen}
                  cost={getNextCost(UPGRADES.gameGen, upgrades.gameGen)}
                  onBuy={() => buyUpgrade('gameGen')}
                  canAfford={money >= getNextCost(UPGRADES.gameGen, upgrades.gameGen)}
                />
              )}
              <UpgradeItem 
                label={UPGRADES.autonomousWarfare.label}
                desc={UPGRADES.autonomousWarfare.description}
                level={upgrades.autonomousWarfare ? 1 : 0}
                cost={UPGRADES.autonomousWarfare.cost}
                onBuy={() => buyUpgrade('autonomousWarfare')}
                canAfford={money >= UPGRADES.autonomousWarfare.cost}
                isSingle={true}
                purchased={upgrades.autonomousWarfare}
              />
            </div>
          </div>

          <div className="diplomacy-section">
            <h3 className="section-title">GLOBAL DIPLOMACY</h3>
            <UpgradeItem 
                label={UPGRADES.partnership.label}
                desc={UPGRADES.partnership.description}
                level={upgrades.partnership}
                cost={UPGRADES.partnership.baseCost * Math.pow(UPGRADES.partnership.costMult, upgrades.partnership)}
                onBuy={() => buyUpgrade('partnership')}
                canAfford={rep >= UPGRADES.partnership.baseCost * Math.pow(UPGRADES.partnership.costMult, upgrades.partnership)}
                currency="Rep"
              />
          </div>
        </div>
      </main>
    </div>
  );
};

interface UpgradeItemProps {
  label: string;
  desc: string;
  level: number;
  cost: number;
  onBuy: () => void;
  canAfford: boolean;
  isSingle?: boolean;
  purchased?: boolean;
  currency?: string;
}

const UpgradeItem: React.FC<UpgradeItemProps> = ({ label, desc, level, cost, onBuy, canAfford, isSingle, purchased, currency = "$" }) => {
  if (isSingle && purchased) return <div className="upgrade-item purchased">{label} (MAX)</div>;

  return (
    <div className={`upgrade-item ${canAfford ? 'affordable' : 'expensive'}`} onClick={onBuy}>
      <div className="upgrade-info">
        <strong>{label} {!isSingle && `(Lvl ${level})`}</strong>
        <span>{desc}</span>
      </div>
      <div className="upgrade-cost">
        {currency}{cost.toLocaleString()}
      </div>
    </div>
  );
};

export default App;
